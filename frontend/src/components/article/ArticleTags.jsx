// frontend/src/components/article/ArticleTags.jsx
/**
 * Tags do artigo no rodapé.
 *
 * Props:
 *  - tags → array de strings
 */
export default function ArticleTags({ tags = [] }) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 text-xs font-mono">
      {tags.map((t) => (
        <span
          key={t}
          className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2.5 py-1"
        >
          #{t}
        </span>
      ))}
    </div>
  );
}