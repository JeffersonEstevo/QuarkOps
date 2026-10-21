// frontend/src/components/home/ArticleCard.jsx
/**
 * Card pequeno de artigo para o grid da home.
 *
 * Props:
 *  - article → objeto do artigo
 *  - onOpen  → (id) => void
 */
export default function ArticleCard({ article, onOpen }) {
  return (
    <div
      onClick={() => onOpen(article.id)}
      className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-5 pixel-border hover:-translate-y-1 transition-transform cursor-pointer flex flex-col justify-between space-y-4 group"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="bg-slate-200 dark:bg-slate-800 text-python-blue dark:text-python-yellow font-bold px-2 py-0.5 pixel-border-sm">
            {article.category}
          </span>
          <span className="opacity-60">
            <i className="fa-solid fa-eye mr-1" aria-hidden="true" />
            {article.views}
          </span>
        </div>

        <h4 className="text-lg font-bold font-sans group-hover:text-python-blue transition-colors line-clamp-2">
          {article.title}
        </h4>

        <p className="text-xs opacity-80 font-sans line-clamp-3 leading-relaxed">
          {article.summary}
        </p>
      </div>

      <div className="pt-4 border-t border-python-lightborder dark:border-slate-700 flex items-center justify-between text-xs font-mono opacity-80">
        <span>
          <i className="fa-regular fa-calendar mr-1" aria-hidden="true" />
          {article.date}
        </span>
        <span className="text-python-blue dark:text-python-yellow font-bold group-hover:underline">
          Ler artigo &gt;
        </span>
      </div>
    </div>
  );
}