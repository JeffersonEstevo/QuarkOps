// frontend/src/hooks/useArticles.js
import { useCallback, useMemo, useState } from 'react';
import { getStoredArticles, saveArticles } from '../utils/storage';

export function useArticles({ activeCategory = 'ALL', searchTerm = '', onOpen, onCreated, onComment, onUpdated, onDeleted, onCommentDeleted } = {}) {
  const [articles, setArticles] = useState(() => getStoredArticles());

  const commit = useCallback((updater) => {
    setArticles((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveArticles(next);
      return next;
    });
  }, []);

  const openArticle = useCallback(
    (id) => {
      commit((prev) =>
        prev.map((art) => (art.id === id ? { ...art, views: art.views + 1 } : art))
      );
      onOpen?.(id);
    },
    [commit, onOpen]
  );

  const createArticle = useCallback(
    (payload) => {
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
      commit((prev) => [newArt, ...prev]);
      onCreated?.(newArt);
      return newArt;
    },
    [commit, onCreated]
  );

  // ── NOVO: atualizar artigo existente ─────────────────────────
  const updateArticle = useCallback(
    (id, payload) => {
      let updated = null;
      commit((prev) =>
        prev.map((art) => {
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
        })
      );
      onUpdated?.(id);
      return updated;
    },
    [commit, onUpdated]
  );

  // ── NOVO: excluir artigo (e limpar seleção via onDeleted) ────
  const deleteArticle = useCallback(
    (id) => {
      commit((prev) => prev.filter((art) => art.id !== id));
      onDeleted?.(id);
    },
    [commit, onDeleted]
  );

  // ── NOVO: excluir comentário (moderação) ─────────────────────
  const deleteComment = useCallback(
    (articleId, commentId) => {
      commit((prev) =>
        prev.map((art) =>
          art.id === articleId
            ? { ...art, comments: (art.comments || []).filter((c) => c.id !== commentId) }
            : art
        )
      );
      onCommentDeleted?.(articleId, commentId);
    },
    [commit, onCommentDeleted]
  );

  const postComment = useCallback(
    (articleId, comment) => {
      if (!articleId) return;
      const newComment = {
        id: Date.now(),
        author: comment.author,
        role: comment.role || 'Leitor',
        text: comment.text,
        date: 'Agora mesmo',
      };
      commit((prev) =>
        prev.map((art) =>
          art.id === articleId
            ? { ...art, comments: [newComment, ...(art.comments || [])] }
            : art
        )
      );
      onComment?.(articleId);
      return newComment;
    },
    [commit, onComment]
  );

  const likeArticle = useCallback(
    (articleId) => {
      commit((prev) =>
        prev.map((art) =>
          art.id === articleId ? { ...art, likes: (art.likes || 0) + 1 } : art
        )
      );
    },
    [commit]
  );

  const sortedByViews = useMemo(
    () => [...articles].sort((a, b) => b.views - a.views),
    [articles]
  );

  const featured = sortedByViews[0];

  const filteredArticles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return articles.filter((art) => {
      const matchesCat = activeCategory === 'ALL' || art.category === activeCategory;
      const matchesSearch =
        !term ||
        art.title.toLowerCase().includes(term) ||
        art.summary.toLowerCase().includes(term) ||
        (art.tags || []).some((t) => t.toLowerCase().includes(term));
      return matchesCat && matchesSearch;
    });
  }, [articles, activeCategory, searchTerm]);

  return {
    articles,
    featured,
    sortedByViews,
    filteredArticles,
    openArticle,
    createArticle,
    updateArticle,     // 🆕
    deleteArticle,     // 🆕
    postComment,
    deleteComment,     // 🆕
    likeArticle,
  };
}