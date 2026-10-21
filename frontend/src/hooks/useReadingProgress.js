// frontend/src/hooks/useReadingProgress.js
import { useEffect, useState } from 'react';
import { VIEWS } from '../utils/constants';

/**
 * Calcula o progresso de leitura (0–100) enquanto o usuário rola a página.
 * Só é ativo quando `currentView === VIEWS.ARTICLE`.
 *
 * Uso:
 *   const progress = useReadingProgress(currentView);
 *   <div style={{ width: `${progress}%` }} />
 */
export function useReadingProgress(currentView) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (currentView !== VIEWS.ARTICLE) return;

    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    };

    handleScroll(); // cálculo inicial
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Derivado (não sincronizado via effect):
  // fora da view de artigo, o progresso é sempre 0.
  return currentView === VIEWS.ARTICLE ? scrollProgress : 0;
}