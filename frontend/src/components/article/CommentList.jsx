// frontend/src/components/article/CommentList.jsx
import CommentItem from './CommentItem';

/**
 * Lista de comentários com empty-state.
 *
 * Props:
 *  - comments → array
 */

export default function CommentList({ comments = [], canManage = false, onDeleteComment }) {
  if (comments.length === 0) {
    return (
      <p className="text-xs font-mono opacity-60 italic">
        // Nenhum comentário ainda. Seja o primeiro a registrar sua contribuição!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((c, index) => {
        // Fallback para comentários antigos que não tinham ID (storage.js)
        const commentId = c.id ?? `legacy-${index}`;
        
        return (
          <CommentItem
            key={commentId}
            comment={c}
            canManage={canManage}
            onDelete={() => onDeleteComment?.(commentId)}
          />
        );
      })}
    </div>
  );
}