// frontend/src/components/home/CategoryFilter.jsx
import { useMemo } from 'react';
import { useCategories } from '../../hooks/useCategories';

export default function CategoryFilter({ 
  activeCategory, 
  onSelect,
  activeSubcategory,       // 🆕
  onSelectSubcategory      // 🆕
}) {
  const { categories, loading } = useCategories();

  const currentCategory = useMemo(
    () => categories.find((c) => c.slug === activeCategory),
    [categories, activeCategory]
  );

  const handleSelectCategory = (slug) => {
    onSelect(slug);
    if (onSelectSubcategory) onSelectSubcategory(null); // reseta subcategoria
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Linha 1: Categorias */}
      <div className="flex flex-wrap gap-1.5 justify-end">
        <button
          onClick={() => handleSelectCategory('ALL')}
          className={`px-3 py-1 text-[10px] uppercase font-mono font-bold border transition-colors ${
            activeCategory === 'ALL'
              ? 'bg-python-yellow text-slate-900 border-python-yellow'
              : 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-400 dark:border-slate-600 hover:border-python-blue'
          }`}
        >
          TODOS
        </button>
        
        {loading && <span className="text-[10px] font-mono opacity-50 px-1 py-1">...</span>}
        
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelectCategory(cat.slug)}
            className={`px-3 py-1 text-[10px] uppercase font-mono font-bold border transition-colors ${
              activeCategory === cat.slug
                ? 'bg-python-yellow text-slate-900 border-python-yellow'
                : 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-400 dark:border-slate-600 hover:border-python-blue'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Linha 2: Subcategorias (só aparece se a categoria tiver) */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-end">
          <button
            onClick={() => onSelectSubcategory(null)}
            className={`px-2 py-0.5 text-[9px] font-mono border transition-colors ${
              !activeSubcategory
                ? 'bg-python-blue text-white border-python-blue'
                : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-python-blue'
            }`}
          >
            Tudo em {currentCategory.name}
          </button>
          {currentCategory.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSelectSubcategory(sub.slug)}
              className={`px-2 py-0.5 text-[9px] font-mono border transition-colors ${
                activeSubcategory === sub.slug
                  ? 'bg-python-blue text-white border-python-blue'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-python-blue'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}