// frontend/src/components/providers/ThemeProvider.jsx
import { useEffect, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { STORAGE_KEYS } from '../../utils/constants';

function readInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light') return false;
    // Default da aplicação original era escuro
    return true;
  } catch {
    return true;
  }
}

export default function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(readInitialTheme);

  // Sincroniza a classe `dark` no <html> e persiste no localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}