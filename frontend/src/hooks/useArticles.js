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
  onError, // 🆕
} = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------- Helper centralizado de erros --------
  const handleErr = useCallback(
    (err, defaultMsg = 'Erro inesperado') => {
      const msg = err?.message || defaultMsg;
      setError(msg);
      onError?.(msg);
    },
    [onError]
  );

  // -------- Fetch inicial --------
  // ⚠️ Dependência vazia INTENCIONAL.
  // handleErr depende de onError (callback instável do App). Incluí-lo aqui
  // causava loop infinito de fetch. O fetch inicial roda UMA VEZ na montagem.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.listArticles();
        if (!cancelled) setArticles(data);
      } catch (err) {
        if (!cancelled) handleErr(err, 'Erro ao carregar artigos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []); // ⚠️ Deliberadamente vazio — ver comentário acima

  // -------- Ações (mesmo contrato público de antes) --------

  const openArticle = useCallback(
    async (id) => {
      try {
        const updated = await api.incrementViews(id);
        setArticles((prev) => prev.map((art) => (art.id === id ? updated : art)));
      } catch (err) {
        handleErr(err);
      }
      onOpen?.(id);
    },
    [onOpen, handleErr]
  );

  const createArticle = useCallback(
    async (payload) => {
      try {
        const newArt = await api.createArticle(payload);
        setArticles((prev) => [newArt, ...prev]);
        onCreated?.(newArt);
        return newArt;
      } catch (err) {
        handleErr(err);
        return null;
      }
    },
    [onCreated, handleErr]
  );

  const updateArticle = useCallback(
    async (id, payload) => {
      try {
        const updated = await api.updateArticle(id, payload);
        setArticles((prev) => prev.map((art) => (art.id === id ? updated : art)));
        onUpdated?.(id);
        return updated;
      } catch (err) {
        handleErr(err);
        return null;
      }
    },
    [onUpdated, handleErr]
  );

  const deleteArticle = useCallback(
    async (id) => {
      try {
        await api.deleteArticle(id);
        setArticles((prev) => prev.filter((art) => art.id !== id));
        onDeleted?.(id);
      } catch (err) {
        handleErr(err);
      }
    },
    [onDeleted, handleErr]
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
        handleErr(err);
        return null;
      }
    },
    [onComment, handleErr]
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
        handleErr(err);
      }
    },
    [onCommentDeleted, handleErr]
  );

  const likeArticle = useCallback(
    async (articleId) => {
      try {
        const updated = await api.incrementLikes(articleId);
        setArticles((prev) => prev.map((art) => (art.id === articleId ? updated : art)));
      } catch (err) {
        handleErr(err);
      }
    },
    [handleErr]
  );

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