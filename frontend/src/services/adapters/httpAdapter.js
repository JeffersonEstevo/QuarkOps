// src/services/adapters/httpAdapter.js
// Adapter HTTP: consome o backend Django/DRF real.
// Traduz o shape do backend (snake_case, author objeto, created_at ISO)
// para o shape esperado pelos componentes (camelCase, author string, date formatada).
//
// Ativação: VITE_API_ADAPTER=http + VITE_API_URL=http://localhost:8000/api
// Autenticação JWT: fica para o Passo 6 (AuthProvider mantido local até lá).

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ────────────────────────────────────────────────────────────
// Helpers de formatação
// ────────────────────────────────────────────────────────────

const MONTHS_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

/**
 * Converte ISO date do backend em string formatada para o frontend.
 * Ex: "2026-10-27T15:00:00-03:00" → "27 Out 2026" (ou "Hoje" se for hoje).
 */
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

/**
 * Converte ISO date em string "Há X horas" / "Há X dias" / "Ontem".
 * Usado nos comentários.
 */
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

/**
 * Deriva iniciais do display_name ("Guido Dev" → "GD").
 * Fallback para "??" se vazio.
 */
function getInitials(displayName) {
  if (!displayName) return '??';
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ────────────────────────────────────────────────────────────
// Mapeadores backend → frontend
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
    // Shape "achatado" (compatível com ArticleHeader atual)
    author: backendPost.author?.display_name || 'Desconhecido',
    avatar: backendPost.author?.avatar_url || getInitials(backendPost.author?.display_name),
    // Campos extras do backend (resolvem Bug 2 — usados com fallback no ArticleHeader)
    authorBio: backendPost.author?.bio || '',
    authorRole: backendPost.author?.role || '',
    // Métricas
    views: backendPost.views || 0,
    likes: backendPost.likes || 0,
    // Datas
    date: formatDate(backendPost.created_at),
    // Comentários (mapeados)
    comments: (backendPost.comments || []).map(mapComment),
  };
}

// ────────────────────────────────────────────────────────────
// Wrapper de fetch
// ────────────────────────────────────────────────────────────

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

// ────────────────────────────────────────────────────────────
// Adapter
// ────────────────────────────────────────────────────────────

export const httpAdapter = {
  // ---------- Articles ----------
  async listArticles() {
    const data = await request('/posts/');
    // DRF pagina por padrão (PageNumberPagination com PAGE_SIZE=20).
    // Se retornar { results: [...] }, extrai. Senão, assume array direto.
    const posts = Array.isArray(data) ? data : data.results || [];
    return posts.map(mapPost);
  },

  async getArticle(id) {
    const data = await request(`/posts/${id}/`);
    return mapPost(data);
  },

  async createArticle(payload) {
    // TODO Passo 6: enviar Authorization: Bearer <token>
    const data = await request('/posts/', { method: 'POST', body: payload });
    return mapPost(data);
  },

  async updateArticle(id, payload) {
    // TODO Passo 6: enviar Authorization: Bearer <token>
    const data = await request(`/posts/${id}/`, { method: 'PUT', body: payload });
    return mapPost(data);
  },

  async deleteArticle(id) {
    // TODO Passo 6: enviar Authorization: Bearer <token>
    await request(`/posts/${id}/`, { method: 'DELETE' });
    return { ok: true };
  },

  async incrementLikes(id) {
    const data = await request(`/posts/${id}/like/`, { method: 'POST' });
    // Backend devolve { likes: N }. Completa com o resto do post se necessário.
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
    // Backend espera { author_name, text, role }
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
    // TODO Passo 6: enviar Authorization: Bearer <token>
    await request(`/comments/${commentId}/`, { method: 'DELETE' });
    return { ok: true };
  },

  // ---------- Auth (Passo 6) ----------
  async login(credentials) {
    void credentials; // reservado para o Passo 6
    throw new Error('Login JWT será implementado no Passo 6. Use VITE_API_ADAPTER=local por enquanto.');
  }
};