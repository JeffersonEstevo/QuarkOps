// frontend/src/components/article/CommentItem.jsx
/**
 * Um único comentário.
 *
 * Props:
 *  - comment → { id, author, role, text, date }
 */

export default function CommentItem({ comment, canManage = false, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-700 p-4 space-y-2 pixel-border-sm font-mono text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-python-blue">
          {comment.author}{' '}
          {comment.role && <span className="text-[10px] opacity-60">({comment.role})</span>}
        </span>
        <span className="flex items-center gap-3 text-[10px] opacity-60">
          {comment.date}
          {canManage && (
            <button
              type="button"
              onClick={onDelete}
              className="hover:text-red-500 transition-colors"
              aria-label="Excluir comentário"
              title="Excluir comentário"
            >
              <i className="fa-solid fa-trash" aria-hidden="true" />
            </button>
          )}
        </span>
      </div>
      <p className="font-sans opacity-90">{comment.text}</p>
    </div>
  );
}