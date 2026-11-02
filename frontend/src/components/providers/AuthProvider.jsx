// src/components/providers/AuthProvider.jsx
import { useCallback, useMemo, useState } from 'react';

import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { authStorage } from '../../services/authStorage';

export default function AuthProvider({ children }) {
  // Lazy initializer: lê do localStorage UMA VEZ na montagem.
  // Se não houver user ou token, começa null.
  const [user, setUser] = useState(() => {
    const stored = authStorage.getUser();
    const hasToken = Boolean(authStorage.getAccess());
    return stored && hasToken ? stored : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setError(null);
    setIsLoading(true);
    try {
      const { user: loggedUser } = await api.login({ username, password });

      if (!loggedUser.is_staff && !loggedUser.is_superuser) {
        authStorage.clear();
        throw new Error('Acesso restrito. Apenas administradores.');
      }

      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Ignora erro de logout (já limpa storage de qualquer forma)
    }
    authStorage.clear();
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isCrmAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      logout,
    }),
    [user, isLoading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}