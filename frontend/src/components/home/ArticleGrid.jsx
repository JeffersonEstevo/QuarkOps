// frontend/src/components/home/ArticleGrid.jsx
import ArticleCard from './ArticleCard';
import CategoryFilter from './CategoryFilter';

/**
 * Seção "INDEX DE ARTIGOS RECENTES" — cabeçalho + filtros + grid.
 *
 * Props:
 *  - articles            → lista já filtrada
 *  - activeCategory      → string
 *  - onSelectCategory    → (cat) => void
 *  - onOpen              → (id) => void
 */
export default function ArticleGrid({
  articles,
  activeCategory,
  onSelectCategory,
  onOpen,
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-python-lightborder dark:border-slate-800 pb-4">
        <h2 className="text-xl retro-title font-bold flex items-center space-x-2">
          <i className="fa-solid fa-terminal text-python-blue" aria-hidden="true" />
          <span>INDEX DE ARTIGOS RECENTES</span>
        </h2>
        <CategoryFilter activeCategory={activeCategory} onSelect={onSelectCategory} />
      </div>

      {articles.length === 0 ? (
        <p className="text-xs font-mono opacity-60 italic py-8 text-center">
          // Nenhum artigo encontrado com os filtros atuais.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  );
}