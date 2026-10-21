// frontend/src/components/ui/ConfirmDialog.jsx
import Button from './Button';

/**
 * Modal de confirmação genérico (substitui window.confirm).
 *
 * Props:
 *  - title          → string
 *  - message        → string
 *  - confirmLabel   → string (default: 'CONFIRMAR')
 *  - cancelLabel    → string (default: 'CANCELAR')
 *  - variant        → 'danger' | 'primary' (default: 'danger')
 *  - onConfirm      → () => void
 *  - onCancel       → () => void
 */
export default function ConfirmDialog({
  title = '[CONFIRMAR]',
  message,
  confirmLabel = 'CONFIRMAR',
  cancelLabel = 'CANCELAR',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 w-full max-w-md p-6 pixel-border space-y-4 font-mono text-xs">
        <div className="border-b border-slate-700 pb-3">
          <h3 className="text-lg retro-title font-bold">{title}</h3>
        </div>

        <p className="font-sans text-sm opacity-90 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-700">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}