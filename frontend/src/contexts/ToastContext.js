// frontend/src/contexts/ToastContext.js
import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

/**
 * Acesso ao toast global.
 * Uso: const { triggerToast } = useToast();
 * Deve ser usado dentro de <ToastProvider>.
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  }
  return ctx;
}