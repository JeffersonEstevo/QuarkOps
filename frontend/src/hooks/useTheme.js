// frontend/src/hooks/useTheme.js
import { useContext } from 'react';
import { ThemeContext } from '../components/providers/ThemeProvider';

/**
 * Acesso ao tema global.
 * Uso: const { darkMode, toggleTheme, setDarkMode } = useTheme();
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme deve ser usado dentro de <ThemeProvider>');
  }
  return ctx;
}