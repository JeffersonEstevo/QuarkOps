// src/pages/HomePage.jsx
import { useMemo } from 'react';

import { useCategories } from '../hooks/useCategories';

export default function HomePage({
  featured,
  filteredArticles,
  activeCategory,
  setActiveCategory,
  activeSubcategory,         // 🆕
  setActiveSubcategory,      // 🆕
  onOpenArticle,
}) {
  const { categories, loading } = useCategories();

  // Categorias + "Todos"
  const currentCategory = useMemo(
    () => categories.find((c) => c.slug === activeCategory),
    [categories, activeCategory]
  );

  const handleSelectCategory = (slug) => {
    setActiveCategory(slug);
    setActiveSubcategory(null); // reseta subcategoria ao trocar categoria
  };

  //console.log('DEBUG categories:', categories.map(c => ({ name: c.name, slug: c.slug })));

  return (
    <div className="space-y-6">
      {/* Featured */}
      {featured && (
        <section className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-6 pixel-border">
          <span className="text-xs font-mono bg-python-yellow text-slate-900 px-2 py-1">
            EM DESTAQUE
          </span>
          <h2 className="text-2xl font-bold mt-3 cursor-pointer hover:text-python-blue" onClick={() => onOpenArticle(featured.id)}>
            {featured.title}
          </h2>
          <p className="text-sm opacity-75 mt-2">{featured.summary}</p>
        </section>
      )}

      {/* Filtros hierárquicos */}
      <section className="space-y-3">
        {/* Linha 1: categorias */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSelectCategory('ALL')}
            className={`px-3 py-1.5 text-xs font-mono border-2 ${
              activeCategory === 'ALL'
                ? 'bg-python-yellow text-slate-900 border-python-yellow'
                : 'border-slate-700 hover:border-python-blue'
            }`}
          >
            TODOS
          </button>
          {loading && <span className="text-xs opacity-60 px-2 py-1.5">Carregando categorias...</span>}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.slug)}
              className={`px-3 py-1.5 text-xs font-mono border-2 ${
                activeCategory === cat.slug
                  ? 'bg-python-yellow text-slate-900 border-python-yellow'
                  : 'border-slate-700 hover:border-python-blue'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Linha 2: subcategorias (só da categoria ativa) */}
        {currentCategory && currentCategory.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-python-blue/30">
            <button
              onClick={() => setActiveSubcategory(null)}
              className={`px-2.5 py-1 text-[11px] font-mono border ${
                !activeSubcategory
                  ? 'bg-python-blue text-white border-python-blue'
                  : 'border-slate-700 hover:border-python-blue'
              }`}
            >
              Tudo em {currentCategory.name}
            </button>
            {currentCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.slug)}
                className={`px-2.5 py-1 text-[11px] font-mono border ${
                  activeSubcategory === sub.slug
                    ? 'bg-python-blue text-white border-python-blue'
                    : 'border-slate-700 hover:border-python-blue'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lista de artigos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.length === 0 && (
          <p className="opacity-60 col-span-full text-center py-8">
            Nenhum artigo encontrado {activeSubcategory && 'nesta subcategoria'}.
          </p>
        )}
        {filteredArticles.map((art) => (
          <article
            key={art.id}
            onClick={() => onOpenArticle(art.id)}
            className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-4 pixel-border cursor-pointer hover:border-python-blue transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-mono mb-2">
              <span className="bg-python-yellow text-slate-900 px-1.5 py-0.5">{art.category}</span>
              {art.subcategory && <span className="opacity-60">› {art.subcategory}</span>}
            </div>
            <h3 className="font-bold mb-1">{art.title}</h3>
            <p className="text-xs opacity-70 line-clamp-2">{art.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}