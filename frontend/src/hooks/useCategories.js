// src/hooks/useCategories.js
// Carrega categorias (com subcategorias aninhadas) do adapter ativo.
// Cache em memória — não refaz a chamada a cada render.

import { useEffect, useState } from 'react';

import { api } from '../services/api';

let cachedCategories = null;
let cachedPromise = null;

export function useCategories() {
  const [categories, setCategories] = useState(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedCategories);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedCategories) return;

    if (!cachedPromise) {
      cachedPromise = api.listCategories();
    }

    let cancelled = false;
    cachedPromise
      .then((data) => {
        cachedCategories = data;
        if (!cancelled) setCategories(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Erro ao carregar categorias');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, error };
}