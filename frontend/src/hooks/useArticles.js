// src/hooks/useArticles.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

export function useArticles({
  activeCategory = 'ALL',
  activeSubcategory = null,
  searchTerm = '',
  onOpen,
  onCreated,
  onComment,
  onUpdated,
  onDeleted,
  onCommentDeleted,
  onError,
} = {}) {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState(null); // 🆕 Destaque Global
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  const handleErr = useCallback(
    (err, defaultMsg = 'Erro inesperado') => {
      const msg = err?.message || defaultMsg;
      setError(msg);
      onError?.(msg);
    },
    [onError]
  );

  // -------- Fetch inicial (Lista + Destaque em paralelo) --------
  useEffect(() => {
    let cancelled = false;

    const fetchInitial = async () => {
      try {
        // 1. Carrega a lista de posts (isso NUNCA pode falhar)
        const postsData = await api.listArticles(1);
        
        // 2. Tenta carregar o destaque, mas se der erro (404), não quebra a lista
        let featuredData = null;
        try {
          featuredData = await api.getFeaturedArticle();
        } catch (e) {
          // ✅ Agora o 'e' está sendo usado no log
          console.warn('Rota de destaque não encontrada. Usando fallback da lista.', e.message);
          featuredData = postsData.posts.sort((a, b) => b.views - a.views)[0];
        }

        if (!cancelled) {
          setArticles(postsData.posts);
          setHasMore(postsData.hasNext);
          setPage(1);
          setFeatured(featuredData || null);
        }
      } catch (err) {
        if (!cancelled) handleErr(err, 'Erro ao carregar artigos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInitial();

    return () => {
      cancelled = true;
    };
  }, [handleErr]);

  // -------- Carregar mais (Paginação) --------
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { posts, hasNext } = await api.listArticles(nextPage);
      
      setArticles((prev) => [...prev, ...posts]);
      setHasMore(hasNext);
      setPage(nextPage);
    } catch (err) {
      handleErr(err, 'Erro ao carregar mais artigos');
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore, handleErr]);

  // -------- Ações (mesmo contrato) --------
  const openArticle = useCallback(
    async (id) => {
      try {
        const updated = await api.incrementViews(id);
        setArticles((prev) => prev.map((art) => (art.id === id ? updated : art)));
        
        // Se o post aberto for o destaque, atualiza as views dele
        if (featured?.id === id) {
          setFeatured(updated);
        }
      } catch (err) {
        handleErr(err);
      }
      onOpen?.(id);
    },
    [onOpen, handleErr, featured]
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
        
        if (featured?.id === id) setFeatured(updated);
        
        onUpdated?.(id);
        return updated;
      } catch (err) {
        handleErr(err);
        return null;
      }
    },
    [onUpdated, handleErr, featured]
  );

  const deleteArticle = useCallback(
    async (id) => {
      try {
        await api.deleteArticle(id);
        setArticles((prev) => prev.filter((art) => art.id !== id));
        
        // Se o destaque foi apagado, limpa o estado
        if (featured?.id === id) setFeatured(null);
        
        onDeleted?.(id);
      } catch (err) {
        handleErr(err);
      }
    },
    [onDeleted, handleErr, featured]
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
        
        if (featured?.id === articleId) setFeatured(updated);
      } catch (err) {
        handleErr(err);
      }
    },
    [handleErr, featured]
  );

  // -------- Derivados --------
  const sortedByViews = useMemo(
    () => [...articles].sort((a, b) => b.views - a.views),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return articles
      .filter((art) => {
        const matchesCat = activeCategory === 'ALL' || art.categorySlug === activeCategory;
        const matchesSub = !activeSubcategory || art.subcategorySlug === activeSubcategory;
        const matchesSearch =
          !term ||
          art.title.toLowerCase().includes(term) ||
          art.summary.toLowerCase().includes(term) ||
          (art.tags || []).some((t) => t.toLowerCase().includes(term));
        return matchesCat && matchesSub && matchesSearch;
      })
      .sort((a, b) => {
        // Ordena pela data de criação (mais recente primeiro).
        // O 'a.date' no frontend é uma string como "11 Nov 2026". 
        // Para ordenar, precisamos converter para Date.
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
  }, [articles, activeCategory, activeSubcategory, searchTerm]);

  return {
    articles,
    featured, // 🆕 Agora vem do backend
    sortedByViews,
    filteredArticles,
    loading,
    loadingMore,
    hasMore,
    loadMore,
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