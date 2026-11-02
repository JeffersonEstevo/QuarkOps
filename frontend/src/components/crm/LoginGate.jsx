// src/components/crm/LoginGate.jsx
import { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';

export default function LoginGate({ onCancel, onSuccess }) {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(username, password);
      onSuccess?.();
    } catch (err) {
      setLocalError(err.message || 'Falha no login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-8 pixel-border w-full max-w-sm space-y-4"
      >
        <h2 className="text-lg font-mono font-bold">
          <i className="fa-solid fa-lock mr-2" aria-hidden="true" />
          [CRM // AUTENTICAÇÃO]
        </h2>

        <p className="text-xs font-mono opacity-70">
          Acesso restrito a administradores.
        </p>

        <div className="space-y-2">
          <label className="block text-xs font-mono" htmlFor="crm-username">
            USUÁRIO
          </label>
          <input
            id="crm-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-slate-600 font-mono text-sm focus:outline-none focus:border-python-blue"
            autoFocus
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-mono" htmlFor="crm-password">
            SENHA
          </label>
          <input
            id="crm-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-slate-600 font-mono text-sm focus:outline-none focus:border-python-blue"
            disabled={isLoading}
            required
          />
        </div>

        {(localError || error) && (
          <p className="text-xs font-mono text-red-500">
            <i className="fa-solid fa-triangle-exclamation mr-1" aria-hidden="true" />
            {localError || error}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-python-yellow text-slate-900 font-mono font-bold px-4 py-2 pixel-border-sm hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? 'Autenticando...' : 'ENTRAR'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border-2 border-slate-800 dark:border-slate-600 font-mono text-xs hover:opacity-80 disabled:opacity-50"
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}