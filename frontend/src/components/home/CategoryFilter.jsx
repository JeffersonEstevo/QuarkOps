// frontend/src/components/home/CategoryFilter.jsx
import { CATEGORIES } from '../../utils/constants';

/**
 * Botões de filtro por categoria. Controlado por `activeCategory`.
 *
 * Props:
 *  - activeCategory → string atual
 *  - onSelect       → (category) => void
 */
export default function CategoryFilter({ activeCategory, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-mono">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={`px-3 py-1 pixel-border-sm font-bold transition-all ${
            activeCategory === cat
              ? 'bg-python-blue text-white'
              : 'bg-slate-200 dark:bg-slate-800 hover:bg-python-blue hover:text-white'
          }`}
        >
          {cat === 'ALL' ? 'TODOS' : cat}
        </button>
      ))}
    </div>
  );
}