// frontend/src/components/ui/Button.jsx
import { forwardRef } from 'react';

/**
 * Button reutilizável do QuarkOps.
 *
 * Variantes:
 *  - "primary"   → fundo azul Python + texto amarelo (CTA principal, ex: PUBLICAR)
 *  - "secondary" → fundo cinza claro (ações neutras, ex: CANCELAR)
 *  - "outline"   → borda + fundo branco (ex: "voltar ao index", botões da toolbar)
 *  - "ghost"     → sem fundo, só hover (ex: ícones de toolbar)
 *  - "danger"    → fundo vermelho (ex: excluir)
 *
 * Tamanhos:
 *  - "sm" → px-3 py-1.5 text-xs (toolbar, cards)
 *  - "md" → px-4 py-2   text-xs (padrão, forms)
 *  - "lg" → px-5 py-2.5 text-sm (CTAs grandes)
 *
 * Props extras:
 *  - icon       → string de classe FontAwesome (ex: "fa-solid fa-paper-plane")
 *  - iconRight  → renderiza o ícone após o texto
 *  - pixel      → aplica `pixel-border-sm` (default: true)
 *  - fullWidth  → w-full
 *
 * Exemplo:
 *   <Button variant="primary" icon="fa-solid fa-paper-plane">ENVIAR</Button>
 *   <Button variant="outline" size="sm" onClick={...}>voltar</Button>
 */
const VARIANT_CLASSES = {
  primary:
    'bg-python-blue text-python-yellow hover:bg-python-blue/90',
  secondary:
    'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700',
  outline:
    'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-700 hover:bg-python-blue hover:text-white',
  ghost:
    'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700',
  danger:
    'bg-red-600 text-white hover:bg-red-700',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-xs',
  lg: 'px-5 py-2.5 text-sm',
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    icon,
    iconRight = false,
    pixel = true,
    fullWidth = false,
    className = '',
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const classes = [
    'inline-flex items-center justify-center gap-2 font-mono font-bold transition-all',
    'hover:translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none',
    VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] || SIZE_CLASSES.md,
    pixel ? 'pixel-border-sm' : '',
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconEl = icon ? <i className={icon} aria-hidden="true" /> : null;

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {!iconRight && iconEl}
      {children}
      {iconRight && iconEl}
    </button>
  );
});

export default Button;