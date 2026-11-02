// frontend/src/components/article/ArticleHeader.jsx
/**
 * Cabeçalho do artigo: categoria, metadados, título, autor e botão de like.
 *
 * Props:
 *  - article  → objeto do artigo
 *  - onLike   → () => void
 */

export default function ArticleHeader({ article, onLike, canManage = false, onEdit, onDelete }) {
  return (
    <div className="space-y-3 border-b border-python-lightborder dark:border-slate-700 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="bg-python-yellow text-slate-900 text-xs font-mono font-bold px-2.5 py-1 pixel-border-sm">
          {article.category}
        </span>

        <div className="flex items-center flex-wrap gap-3 text-xs font-mono opacity-75">
          <span><i className="fa-regular fa-calendar mr-1" aria-hidden="true" /> {article.date}</span>
          <span><i className="fa-regular fa-clock mr-1" aria-hidden="true" /> {article.readTime}</span>
          <span><i className="fa-solid fa-eye mr-1" aria-hidden="true" /> {article.views} views</span>
          <button type="button" onClick={onLike} className="hover:text-red-500 transition-colors" aria-label="Curtir artigo">
            ❤️ {article.likes || 0}
          </button>

          {canManage && (
            <span className="flex items-center gap-2 pl-3 border-l border-slate-700">
              <button
                type="button"
                onClick={onEdit}
                className="hover:text-python-blue transition-colors"
                aria-label="Editar artigo"
                title="Editar artigo"
              >
                <i className="fa-solid fa-pen-to-square" aria-hidden="true" /> Editar
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="hover:text-red-500 transition-colors"
                aria-label="Excluir artigo"
                title="Excluir artigo"
              >
                <i className="fa-solid fa-trash" aria-hidden="true" /> Excluir
              </button>
            </span>
          )}
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight leading-snug">
        {article.title}
      </h1>

      <div className="flex items-center space-x-3 pt-2">
        <div className="w-8 h-8 rounded bg-python-blue text-python-yellow flex items-center justify-center font-mono font-bold pixel-border-sm text-sm">
          {article.avatar}
        </div>
        <div>
          <p className="text-xs font-mono font-bold">{article.author}</p>
          <p className="text-[10px] font-mono opacity-60">
            {article.authorBio || 'Engenheiro de Software & Maintainer'}
          </p>
        </div>
      </div>
    </div>
  );
}