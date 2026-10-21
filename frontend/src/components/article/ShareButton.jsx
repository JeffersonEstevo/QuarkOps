// frontend/src/components/article/ShareButton.jsx
import { useToast } from '../../contexts/ToastContext';

/**
 * Copia o link atual para o clipboard e dispara um toast.
 * Consome `useToast()` direto (evita prop drilling).
 */
export default function ShareButton() {
  const { triggerToast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      triggerToast('Link do artigo copiado para compartilhamento!');
    } catch {
      triggerToast('Não foi possível copiar o link. Copie manualmente da barra de endereços.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="bg-slate-200 dark:bg-slate-800 hover:bg-python-blue hover:text-white px-3 py-1.5 text-xs font-mono pixel-border-sm transition-all flex items-center space-x-1.5"
    >
      <i className="fa-solid fa-share-nodes" aria-hidden="true" />
      <span>Compartilhar</span>
    </button>
  );
}