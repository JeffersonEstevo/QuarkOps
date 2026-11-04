// frontend/src/pages/ArticlePage.jsx
import BackButton from '../components/article/BackButton';
import ArticleHeader from '../components/article/ArticleHeader';
import ArticleBody from '../components/article/ArticleBody';
import ArticleTags from '../components/article/ArticleTags';
import ShareButton from '../components/article/ShareButton';
import CommentsSection from '../components/article/CommentsSection';
import TocSidebar from '../components/article/TocSidebar';
import SystemTelemetry from '../components/article/SystemTelemetry';

export default function ArticlePage({
  article,
  onBack,
  onLike,
  onSubmitComment,
  canManage = false,
  onEdit,
  onDelete,
  onDeleteComment,
  onCategoryClick,        // 🆕
  onSubcategoryClick,     // 🆕
}) {
  if (!article) return null;

  return (
    <div className="space-y-6">
      <div><BackButton onClick={onBack} /></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <article className="lg:col-span-3 bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-6 md:p-10 pixel-border space-y-6">
          <ArticleHeader
            article={article}
            onLike={onLike}
            canManage={canManage}
            onEdit={onEdit}
            onDelete={onDelete}
            onCategoryClick={onCategoryClick}           // 🆕
            onSubcategoryClick={onSubcategoryClick}     // 🆕
          />
          <ArticleBody content={article.content} />

          <div className="pt-6 border-t border-python-lightborder dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <ArticleTags tags={article.tags} />
            <ShareButton />
          </div>

          <CommentsSection
            article={article}
            onSubmitComment={onSubmitComment}
            canManage={canManage}
            onDeleteComment={onDeleteComment}
          />
        </article>

        <aside className="lg:col-span-1 space-y-6 sticky top-20">
          <TocSidebar />
          <SystemTelemetry />
        </aside>
      </div>
    </div>
  );
}