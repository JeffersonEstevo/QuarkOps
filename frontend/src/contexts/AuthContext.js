// frontend/src/contexts/AuthContext.js
import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

/**
 * Acesso ao estado de autenticação do CRM.
 * Uso: const { isCrmAuthenticated, login, logout } = useAuth();
 * Deve ser usado dentro de <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return ctx;
}