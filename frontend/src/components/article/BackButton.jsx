// frontend/src/components/article/BackButton.jsx
/**
 * Botão "cd .. (voltar ao index)".
 *
 * Props:
 *  - onClick → ação de voltar para home
 */
export default function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-mono pixel-border-sm hover:bg-python-blue hover:text-white transition-all"
    >
      <i className="fa-solid fa-arrow-left" aria-hidden="true" />
      <span>cd .. (voltar ao index)</span>
    </button>
  );
}