// src/hooks/useArticles.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

export function useArticles({
  activeCategory = 'ALL',
  searchTerm = '',
  onOpen,
  onCreated,
  onComment,
  onUpdated,
  onDeleted,
  onCommentDeleted,
} = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------- Fetch inicial --------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.listArticles();
        if (!cancelled) setArticles(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Erro ao carregar artigos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // -------- Ações (mesmo contrato público de antes) --------

  const openArticle = useCallback(
    async (id) => {
      try {
        const updated = await api.incrementViews(id);
        setArticles((prev) => prev.map((art) => (art.id === id ? updated : art)));
      } catch (err) {
        setError(err.message);
      }
      onOpen?.(id);
    },
    [onOpen]
  );

  const createArticle = useCallback(
    async (payload) => {
      try {
        const newArt = await api.createArticle(payload);
        setArticles((prev) => [newArt, ...prev]);
        onCreated?.(newArt);
        return newArt;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [onCreated]
  );

  const updateArticle = useCallback(
    async (id, payload) => {
      try {
        const updated = await api.updateArticle(id, payload);
        setArticles((prev) => prev.map((art) => (art.id === id ? updated : art)));
        onUpdated?.(id);
        return updated;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [onUpdated]
  );

  const deleteArticle = useCallback(
    async (id) => {
      try {
        await api.deleteArticle(id);
        setArticles((prev) => prev.filter((art) => art.id !== id));
        onDeleted?.(id);
      } catch (err) {
        setError(err.message);
      }
    },
    [onDeleted]
  );

  const postComment = useCallback(
    async (articleId, comment) => {
      if (!articleId) return null;
      try {
        const newComment = await api.postComment(articleId, comment);
        setArticles((prev) =>
          prev.map((art) =>
            art.id === articleId
              ? { ...art, comments: [newComment, ...(art.comments || [])] }
              : art
          )
        );
        onComment?.(articleId);
        return newComment;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [onComment]
  );

  const deleteComment = useCallback(
    async (articleId, commentId) => {
      try {
        await api.deleteComment(articleId, commentId);
        setArticles((prev) =>
          prev.map((art) =>
            art.id === articleId
              ? {
                  ...art,
                  comments: (art.comments || []).filter((c) => c.id !== commentId),
                }
              : art
          )
        );
        onCommentDeleted?.(articleId, commentId);
      } catch (err) {
        setError(err.message);
      }
    },
    [onCommentDeleted]
  );

  const likeArticle = useCallback(async (articleId) => {
    try {
      const updated = await api.incrementLikes(articleId);
      setArticles((prev) => prev.map((art) => (art.id === articleId ? updated : art)));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // -------- Derivados (mesma lógica de antes) --------
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
    loading,
    error,
    openArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    postComment,
    deleteComment,
    likeArticle,
  };
}