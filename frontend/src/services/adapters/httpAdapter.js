// src/services/adapters/httpAdapter.js
// Adapter futuro: Django + DRF. Stub pronto para o Passo 5 do PROGRESS.md.
// Trocar localStorageAdapter → httpAdapter via VITE_API_ADAPTER=http

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

/*const notImplemented = () => {
  throw new Error('httpAdapter: endpoint ainda não implementado. Use VITE_API_ADAPTER=local.');
};*/

export const httpAdapter = {
  // Articles
  listArticles: () => request('/posts/'),
  getArticle: (id) => request(`/posts/${id}/`),
  createArticle: (data) => request('/posts/', { method: 'POST', body: data }),
  updateArticle: (id, data) => request(`/posts/${id}/`, { method: 'PUT', body: data }),
  deleteArticle: (id) => request(`/posts/${id}/`, { method: 'DELETE' }),
  incrementLikes: (id) => request(`/posts/${id}/like/`, { method: 'POST' }),
  incrementViews: (id) => request(`/posts/${id}/view/`, { method: 'POST' }),

  // Comments
  listComments: (postId) => request(`/posts/${postId}/comments/`),
  createComment: (postId, data) => request(`/posts/${postId}/comments/`, { method: 'POST', body: data }),
  deleteComment: (commentId) => request(`/comments/${commentId}/`, { method: 'DELETE' }),

  // Auth
  login: (credentials) => request('/token/', { method: 'POST', body: credentials }),
};