// frontend/src/components/providers/AuthProvider.jsx
import { useCallback, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { CRM_PASSWORD, STORAGE_KEYS } from '../../utils/constants';

function readInitialAuth() {
  try {
    return localStorage.getItem(STORAGE_KEYS.CRM_AUTH) === '1';
  } catch {
    return false;
  }
}

export default function AuthProvider({ children }) {
  const [isCrmAuthenticated, setIsCrmAuthenticated] = useState(readInitialAuth);

  const login = useCallback((password) => {
    const ok = password === CRM_PASSWORD;
    if (ok) {
      setIsCrmAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.CRM_AUTH, '1');
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setIsCrmAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.CRM_AUTH);
  }, []);

  return (
    <AuthContext.Provider value={{ isCrmAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}