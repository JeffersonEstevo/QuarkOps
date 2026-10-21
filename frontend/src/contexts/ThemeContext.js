// frontend/src/contexts/ThemeContext.js
import { createContext, useContext } from 'react';

export const ThemeContext = createContext(null);

/**
 * Acesso ao tema global.
 * Uso: const { darkMode, setDarkMode, toggleTheme } = useTheme();
 * Deve ser usado dentro de <ThemeProvider>.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme deve ser usado dentro de <ThemeProvider>');
  }
  return ctx;
}