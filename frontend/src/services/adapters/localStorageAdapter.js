// src/services/adapters/localStorageAdapter.js
// Adapter MVP: implementa o contrato da API usando localStorage.
// Reutiliza storage.js (legado) como camada de persistência bruta.
// Será substituído por httpAdapter na integração com Django (Passo 5).
//
// Observação de modelagem: comentários vivem DENTRO de cada artigo
// (article.comments[]), refletindo o shape atual do MVP. Não há storage
// separado de comentários — preservado intencionalmente para não quebrar
// ArticleHeader / ArticlePage que leem `article.comments`.

import { getStoredArticles, saveArticles } from '../../utils/storage';

const delay = (ms = 80) => new Promise((r) => setTimeout(r, ms));

const readAll = () => getStoredArticles();
const writeAll = (articles) => saveArticles(articles);

export const localStorageAdapter = {
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
    // Hidratação equivalente à que o hook fazia antes (e que o Django fará no POST).
    const newArt = {
      id: `art-${Date.now()}`,
      title: payload.title,
      category: payload.category,
      date: 'Hoje',
      readTime: payload.readTime,
      views: 1,
      author: payload.author,
      avatar: payload.author.substring(0, 2).toUpperCase(),
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
    let updated = null;
    const next = readAll().map((art) => {
      if (art.id !== id) return art;
      updated = {
        ...art,
        title: payload.title,
        category: payload.category,
        readTime: payload.readTime,
        author: payload.author,
        avatar: payload.author.substring(0, 2).toUpperCase(),
        summary: payload.summary,
        tags: payload.tags,
        content: payload.content,
      };
      return updated;
    });
    if (!updated) throw new Error(`Article ${id} not found`);
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
    if (!updated) throw new Error(`Article ${id} not found`);
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
    if (!updated) throw new Error(`Article ${id} not found`);
    writeAll(next);
    return updated;
  },

  // ---------- Comments (aninhados no artigo) ----------
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

  // ---------- Auth (placeholder MVP, ADR-007) ----------
  async login({ password }) {
    await delay(200);
    if (password !== 'admin123') throw new Error('Invalid credentials');
    return { token: 'local-fake-token', user: { role: 'admin' } };
  },
};