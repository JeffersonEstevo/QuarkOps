// src/services/adapters/httpAdapter.js
// Adapter HTTP: consome o backend Django/DRF real.
// Autenticação JWT via SimpleJWT (ADR-015).
// Mapeamento backend → frontend (ADR-014) mantido.

import { authStorage } from '../authStorage';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ────────────────────────────────────────────────────────────
// Helpers de formatação (mantidos do Passo 5)
// ────────────────────────────────────────────────────────────

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isToday) return 'Hoje';
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS_PT[date.getMonth()]} ${date.getFullYear()}`;
}

function formatRelativeDate(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffMin < 1) return 'Agora mesmo';
  if (diffMin < 60) return `Há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
  if (diffHour < 24) return `Há ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
  if (diffDay === 1) return 'Ontem';
  if (diffDay < 7) return `Há ${diffDay} dias`;
  return formatDate(isoString);
}

function getInitials(displayName) {
  if (!displayName) return '??';
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ────────────────────────────────────────────────────────────
// Mapeadores backend → frontend (Passo 5, ADR-014)
// ────────────────────────────────────────────────────────────

function mapComment(backendComment) {
  return {
    id: backendComment.id,
    author: backendComment.author_name,
    role: backendComment.role || 'Leitor',
    text: backendComment.text,
    date: formatRelativeDate(backendComment.created_at),
    isAuthenticated: backendComment.is_authenticated || false,
  };
}

function mapPost(backendPost) {
  return {
    id: backendPost.id,
    title: backendPost.title,
    category: backendPost.category,
    summary: backendPost.summary,
    content: backendPost.content,
    tags: backendPost.tags || [],
    readTime: backendPost.read_time,
    author: backendPost.author?.display_name || 'Desconhecido',
    avatar: backendPost.author?.avatar_url || getInitials(backendPost.author?.display_name),
    authorBio: backendPost.author?.bio || '',
    authorRole: backendPost.author?.role || '',
    views: backendPost.views || 0,
    likes: backendPost.likes || 0,
    date: formatDate(backendPost.created_at),
    comments: (backendPost.comments || []).map(mapComment),
  };
}

// ────────────────────────────────────────────────────────────
// Fetch base (sem auth)
// ────────────────────────────────────────────────────────────

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

// ────────────────────────────────────────────────────────────
// Fetch com autenticação (injeção de token + refresh automático)
// ────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newAccess) {
  refreshSubscribers.forEach((cb) => cb(newAccess));
  refreshSubscribers = [];
}

/**
 * Executa uma requisição autenticada.
 * Se retornar 401 (token expirado), tenta refresh e refaz a requisição uma vez.
 * Se o refresh falhar, limpa os tokens e propaga o erro (AuthProvider deve deslogar).
 */
async function fetchWithAuth(path, options = {}) {
  const access = authStorage.getAccess();
  const headers = {
    'Content-Type': 'application/json',
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status !== 401) {
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail || `HTTP ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
  }

  // 401 — tenta refresh
  if (isRefreshing) {
    // Já tem um refresh em andamento: aguarda
    return new Promise((resolve, reject) => {
      refreshSubscribers.push(async (newAccess) => {
        try {
          const retryRes = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers: { ...headers, Authorization: `Bearer ${newAccess}` },
          });
          if (!retryRes.ok) {
            const error = await retryRes.json().catch(() => ({ detail: retryRes.statusText }));
            return reject(new Error(error.detail || `HTTP ${retryRes.status}`));
          }
          resolve(retryRes.status === 204 ? null : retryRes.json());
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  isRefreshing = true;
  try {
    const refresh = authStorage.getRefresh();
    if (!refresh) throw new Error('Sem refresh token');

    const refreshRes = await fetch(`${BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!refreshRes.ok) {
      authStorage.clear();
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    const { access: newAccess } = await refreshRes.json();
    authStorage.setTokens({ access: newAccess });

    onRefreshed(newAccess);

    // Refaz a requisição original
    const retryRes = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...headers, Authorization: `Bearer ${newAccess}` },
    });
    if (!retryRes.ok) {
      const error = await retryRes.json().catch(() => ({ detail: retryRes.statusText }));
      throw new Error(error.detail || `HTTP ${retryRes.status}`);
    }
    return retryRes.status === 204 ? null : retryRes.json();
  } finally {
    isRefreshing = false;
  }
}

// ────────────────────────────────────────────────────────────
// Adapter
// ────────────────────────────────────────────────────────────

export const httpAdapter = {
  // ---------- Articles ----------
  async listArticles() {
    const data = await request('/posts/');
    const posts = Array.isArray(data) ? data : data.results || [];
    return posts.map(mapPost);
  },

  async getArticle(id) {
    return mapPost(await request(`/posts/${id}/`));
  },

  async createArticle(payload) {
    const data = await fetchWithAuth('/posts/', { method: 'POST', body: JSON.stringify(payload) });
    return mapPost(data);
  },

  async updateArticle(id, payload) {
    const data = await fetchWithAuth(`/posts/${id}/`, { method: 'PUT', body: JSON.stringify(payload) });
    return mapPost(data);
  },

  async deleteArticle(id) {
    await fetchWithAuth(`/posts/${id}/`, { method: 'DELETE' });
    return { ok: true };
  },

  async incrementLikes(id) {
    const data = await request(`/posts/${id}/like/`, { method: 'POST' });
    const post = await request(`/posts/${id}/`);
    return mapPost({ ...post, likes: data.likes });
  },

  async incrementViews(id) {
    const data = await request(`/posts/${id}/view/`, { method: 'POST' });
    const post = await request(`/posts/${id}/`);
    return mapPost({ ...post, views: data.views });
  },

  // ---------- Comments ----------
  async postComment(articleId, comment) {
    const body = {
      author_name: comment.author,
      text: comment.text,
      role: comment.role || 'Leitor',
    };
    const data = await request(`/posts/${articleId}/comments/`, {
      method: 'POST',
      body,
    });
    return mapComment(data);
  },

  async deleteComment(articleId, commentId) {
    await fetchWithAuth(`/comments/${commentId}/`, { method: 'DELETE' });
    return { ok: true };
  },

  // ---------- Auth (JWT) ----------
  async login({ username, password }) {
    const tokens = await request('/token/', {
      method: 'POST',
      body: { username, password },
    });
    authStorage.setTokens(tokens);

    const user = await this.getCurrentUser();
    authStorage.setUser(user);
    return { tokens, user };
  },

  async getCurrentUser() {
    return fetchWithAuth('/users/me/');
  },

  async logout() {
    authStorage.clear();
  },
};