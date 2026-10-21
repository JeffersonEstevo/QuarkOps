// frontend/src/components/article/CommentsSection.jsx
import CommentForm from './CommentForm';
import CommentList from './CommentList';

/**
 * Seção completa de comentários: cabeçalho + form + lista.
 * Componente "burro" — o ArticlePage passa o `onSubmitComment` já pronto.
 *
 * Props:
 *  - article          → objeto do artigo (usa `comments`)
 *  - onSubmitComment  → ({ author, role, text }) => void
 */

export default function CommentsSection({ article, onSubmitComment, canManage = false, onDeleteComment }) {
  const comments = article.comments || [];

  return (
    <section className="pt-10 border-t-2 border-dashed border-python-lightborder dark:border-slate-700 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl retro-title font-bold flex items-center space-x-2">
          <i className="fa-solid fa-comments text-python-yellow" aria-hidden="true" />
          <span>[COMMENTS_LOG // DIÁLOGO DA COMUNIDADE]</span>
        </h3>
        <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
          {comments.length} posts
        </span>
      </div>

      <CommentForm onSubmit={onSubmitComment} />
      <CommentList comments={comments} canManage={canManage} onDeleteComment={onDeleteComment} />
    </section>
  );
}