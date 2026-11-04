// src/services/adapters/localStorageAdapter.js
// Adapter MVP (localStorage). Fallback de desenvolvimento.
// Emula o shape novo do backend (categoria/subcategoria como objetos).

import { getStoredArticles, saveArticles } from '../../utils/storage';

const delay = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const readAll = () => getStoredArticles();
const writeAll = (articles) => saveArticles(articles);

// Espelho do seed do backend (Passo 8A)
const LOCAL_CATEGORIES = [
  {
    id: 'cat-programacao',
    name: 'Programação',
    slug: 'programacao',
    order: 1,
    subcategories: [
      { id: 'sub-python', name: 'Python', slug: 'python', order: 1, categoryId: 'cat-programacao' },
      { id: 'sub-javascript', name: 'JavaScript', slug: 'javascript', order: 2, categoryId: 'cat-programacao' },
      { id: 'sub-typescript', name: 'TypeScript', slug: 'typescript', order: 3, categoryId: 'cat-programacao' },
    ],
  },
  {
    id: 'cat-devops',
    name: 'DevOps',
    slug: 'devops',
    order: 2,
    subcategories: [
      { id: 'sub-docker', name: 'Docker', slug: 'docker', order: 1, categoryId: 'cat-devops' },
      { id: 'sub-kubernetes', name: 'Kubernetes', slug: 'kubernetes', order: 2, categoryId: 'cat-devops' },
    ],
  },
  {
    id: 'cat-ia',
    name: 'IA',
    slug: 'ia',
    order: 3,
    subcategories: [],
  },
  {
    id: 'cat-linux',
    name: 'Linux',
    slug: 'linux',
    order: 4,
    subcategories: [
      { id: 'sub-ubuntu', name: 'Ubuntu', slug: 'ubuntu', order: 1, categoryId: 'cat-linux' },
      { id: 'sub-debian', name: 'Debian', slug: 'debian', order: 2, categoryId: 'cat-linux' },
    ],
  },
  {
    id: 'cat-infraestrutura',
    name: 'Infraestrutura',
    slug: 'infraestrutura',
    order: 5,
    subcategories: [],
  },
];

const getInitials = (displayName) => {
  if (!displayName) return '??';
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const localStorageAdapter = {
  // ---------- Categories ----------
  async listCategories() {
    await delay();
    return LOCAL_CATEGORIES;
  },

  async listSubcategories(categorySlug = null) {
    await delay();
    if (!categorySlug) {
      return LOCAL_CATEGORIES.flatMap((c) => c.subcategories);
    }
    const cat = LOCAL_CATEGORIES.find((c) => c.slug === categorySlug);
    return cat ? cat.subcategories : [];
  },

  // ---------- Articles ----------
  async listArticles() {
    await delay();
    return readAll();
  },

  async getArticle(id) {
    await delay();
    const article = readAll().find((a) => a.id === id);
    if (!article) throw new Error(`Article ${id} not found`);
    return article;
  },

  async createArticle(payload) {
    await delay();
    // Aceita tanto payload antigo (category string) quanto novo (category_id UUID).
    const cat = payload.category_id
      ? LOCAL_CATEGORIES.find((c) => c.id === payload.category_id)
      : LOCAL_CATEGORIES.find((c) => c.name === payload.category);
    const sub = payload.subcategory_id
      ? cat?.subcategories.find((s) => s.id === payload.subcategory_id)
      : null;

    const newArt = {
      id: `art-${Date.now()}`,
      title: payload.title,
      category: cat?.name || payload.category || 'Sem categoria',
      categorySlug: cat?.slug || '',
      subcategory: sub?.name || null,
      subcategorySlug: sub?.slug || null,
      date: 'Hoje',
      readTime: payload.readTime || payload.read_time || '5 min de leitura',
      views: 1,
      author: payload.author || 'Desconhecido',
      avatar: getInitials(payload.author),
      summary: payload.summary,
      tags: payload.tags,
      content: payload.content,
      comments: [],
      likes: 0,
    };
    writeAll([newArt, ...readAll()]);
    return newArt;
  },

  async updateArticle(id, payload) {
    await delay();
    const cat = payload.category_id
      ? LOCAL_CATEGORIES.find((c) => c.id === payload.category_id)
      : LOCAL_CATEGORIES.find((c) => c.name === payload.category);
    const sub = payload.subcategory_id
      ? cat?.subcategories.find((s) => s.id === payload.subcategory_id)
      : null;

    let updated = null;
    const next = readAll().map((art) => {
      if (art.id !== id) return art;
      updated = {
        ...art,
        title: payload.title,
        category: cat?.name || payload.category || art.category,
        categorySlug: cat?.slug || art.categorySlug || '',
        subcategory: sub?.name || null,
        subcategorySlug: sub?.slug || null,
        readTime: payload.readTime || payload.read_time || art.readTime,
        author: payload.author || art.author,
        avatar: getInitials(payload.author || art.author),
        summary: payload.summary,
        tags: payload.tags,
        content: payload.content,
      };
      return updated;
    });
    writeAll(next);
    return updated;
  },

  async deleteArticle(id) {
    await delay();
    writeAll(readAll().filter((art) => art.id !== id));
    return { ok: true };
  },

  async incrementLikes(id) {
    await delay();
    let updated = null;
    const next = readAll().map((art) => {
      if (art.id !== id) return art;
      updated = { ...art, likes: (art.likes || 0) + 1 };
      return updated;
    });
    writeAll(next);
    return updated;
  },

  async incrementViews(id) {
    await delay();
    let updated = null;
    const next = readAll().map((art) => {
      if (art.id !== id) return art;
      updated = { ...art, views: (art.views || 0) + 1 };
      return updated;
    });
    writeAll(next);
    return updated;
  },

  // ---------- Comments ----------
  async postComment(articleId, comment) {
    await delay();
    const newComment = {
      id: Date.now(),
      author: comment.author,
      role: comment.role || 'Leitor',
      text: comment.text,
      date: 'Agora mesmo',
    };
    const next = readAll().map((art) =>
      art.id === articleId
        ? { ...art, comments: [newComment, ...(art.comments || [])] }
        : art
    );
    writeAll(next);
    return newComment;
  },

  async deleteComment(articleId, commentId) {
    await delay();
    const next = readAll().map((art) =>
      art.id === articleId
        ? {
            ...art,
            comments: (art.comments || []).filter((c) => c.id !== commentId),
          }
        : art
    );
    writeAll(next);
    return { ok: true };
  },

  // ---------- Auth (MVP local) ----------
  async login({ username, password }) {
    await delay(200);
    if (password !== 'admin123') throw new Error('Invalid credentials');
    return {
      tokens: { access: 'local-fake-token', refresh: 'local-fake-refresh' },
      user: { username: username || 'admin', display_name: 'Admin', is_staff: true },
    };
  },

  async getCurrentUser() {
    throw new Error('getCurrentUser não disponível no adapter local.');
  },

  async logout() {
    return;
  },
};