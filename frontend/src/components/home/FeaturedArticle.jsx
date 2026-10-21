// frontend/src/components/home/FeaturedArticle.jsx
/**
 * Card grande do artigo em destaque (mais visitado).
 *
 * Props:
 *  - article  → objeto do artigo (já ordenado por views no useArticles)
 *  - onOpen   → (id) => void
 */
export default function FeaturedArticle({ article, onOpen }) {
  if (!article) return null;

  return (
    <section id="featured-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl retro-title font-bold flex items-center space-x-2">
          <i className="fa-solid fa-fire text-python-yellow" aria-hidden="true" />
          <span>DESTAQUE // MAIS VISITADO</span>
        </h2>
        <span className="text-xs font-mono opacity-60">metrics_v1.2</span>
      </div>

      <div
        onClick={() => onOpen(article.id)}
        className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-6 pixel-border hover:translate-x-1 transition-transform cursor-pointer group"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center flex-wrap gap-3">
              <span className="bg-python-yellow text-slate-900 font-mono text-xs font-bold px-2.5 py-1 pixel-border-sm">
                {article.category}
              </span>
              <span className="text-xs font-mono opacity-75">
                <i className="fa-solid fa-chart-line text-python-yellow" aria-hidden="true" />{' '}
                {article.views} acessos
              </span>
              <span className="text-xs font-mono opacity-75">
                <i className="fa-regular fa-clock" aria-hidden="true" /> {article.readTime}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold font-sans group-hover:text-python-blue transition-colors">
              {article.title}
            </h3>

            <p className="text-sm opacity-95 font-sans leading-relaxed">
              {article.summary}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <div className="w-7 h-7 bg-python-blue text-python-yellow font-mono font-bold text-xs flex items-center justify-center pixel-border-sm">
                {article.avatar}
              </div>
              <span className="text-xs font-mono">
                Por {article.author} &bull; {article.date}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center bg-slate-900 text-python-yellow p-6 border border-slate-700 pixel-border-sm min-w-[180px] text-center font-mono">
            <i className="fa-solid fa-award text-3xl mb-2" aria-hidden="true" />
            <span className="text-xs font-bold">TOP POST #1</span>
            <span className="text-[10px] opacity-70 mt-1">Leitura Recomendada</span>
          </div>
        </div>
      </div>
    </section>
  );
}