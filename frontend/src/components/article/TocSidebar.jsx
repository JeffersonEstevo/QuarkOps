// frontend/src/components/article/TocSidebar.jsx
/**
 * Sidebar do índice (TOC). O conteúdo interno de `#toc-container`
 * é preenchido pelo hook `useToc` — este componente só renderiza a casca.
 */
export default function TocSidebar() {
  return (
    <div className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-4 pixel-border space-y-3">
      <div className="flex items-center space-x-2 border-b border-python-lightborder dark:border-slate-700 pb-2">
        <i className="fa-solid fa-list-ul text-python-yellow" aria-hidden="true" />
        <h3 className="text-sm retro-title font-bold tracking-wide">ÍNDICE (TOC)</h3>
      </div>
      {/* IMPORTANTE: vazio — preenchido por useToc via DOM */}
      <nav id="toc-container" className="space-y-1 font-mono text-xs" />
    </div>
  );
}