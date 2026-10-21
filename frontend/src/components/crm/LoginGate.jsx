// frontend/src/components/crm/LoginGate.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

/**
 * Tela de senha exibida antes do CRM.
 * Mostra input + botão; se errar, exibe mensagem.
 * Ao acertar, `useAuth().login` marca autenticado e o App re-renderiza
 * abrindo o CrmModal automaticamente.
 */
export default function LoginGate({ onCancel, onSuccess }) {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      onSuccess?.();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 w-full max-w-sm p-6 pixel-border space-y-4 font-mono text-xs"
      >
        <div className="border-b border-slate-700 pb-3">
          <h3 className="text-lg retro-title font-bold">[CRM_ADMIN // LOGIN]</h3>
        </div>

        <div>
          <label className="block mb-1 font-bold">Senha de Administrador:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            required
            autoFocus
            placeholder="••••••••"
            className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs font-bold">⚠ {error}</p>
        )}

        <p className="text-[10px] opacity-60">
          // Senha local simulada. Backend substituirá por JWT (ADR-010).
        </p>

        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-700">
          <Button type="button" variant="secondary" onClick={onCancel}>
            CANCELAR
          </Button>
          <Button type="submit" variant="primary" icon="fa-solid fa-lock-open">
            ENTRAR
          </Button>
        </div>
      </form>
    </div>
  );
}