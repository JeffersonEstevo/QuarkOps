// frontend/src/components/ui/Badge.jsx
/**
 * Badge reutilizável (tags, categorias, labels).
 *
 * Variantes:
 *  - "yellow" → fundo amarelo Python, texto escuro (ex: categoria em destaque)
 *  - "blue"   → fundo azul Python, texto branco/amarelo
 *  - "muted"  → fundo cinza claro (ex: tags neutras)
 *  - "outline"→ borda + fundo transparente (ex: tags do artigo)
 *
 * Exemplo:
 *   <Badge variant="yellow">{article.category}</Badge>
 *   <Badge variant="outline">#{tag}</Badge>
 */
const VARIANT_CLASSES = {
  yellow:
    'bg-python-yellow text-slate-900',
  blue:
    'bg-python-blue text-white dark:text-python-yellow',
  muted:
    'bg-slate-200 dark:bg-slate-800 text-python-blue dark:text-python-yellow',
  outline:
    'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300',
};

export default function Badge({
  variant = 'muted',
  pixel = true,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'inline-flex items-center text-xs font-mono font-bold px-2 py-0.5',
    VARIANT_CLASSES[variant] || VARIANT_CLASSES.muted,
    pixel ? 'pixel-border-sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}