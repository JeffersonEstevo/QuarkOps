// frontend/src/pages/HomePage.jsx
import WelcomeBanner from '../components/home/WelcomeBanner';
import FeaturedArticle from '../components/home/FeaturedArticle';
import ArticleGrid from '../components/home/ArticleGrid';

/**
 * Página inicial — orquestra as seções da home.
 *
 * Props:
 *  - featured            → artigo em destaque
 *  - filteredArticles    → lista já filtrada
 *  - activeCategory      → string
 *  - setActiveCategory   → (cat) => void
 *  - onOpenArticle       → (id) => void
 */
export default function HomePage({
  featured,
  filteredArticles,
  activeCategory,
  setActiveCategory,
  onOpenArticle,
}) {
  return (
    <div className="space-y-8">
      <WelcomeBanner />
      <FeaturedArticle article={featured} onOpen={onOpenArticle} />
      <ArticleGrid
        articles={filteredArticles}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpen={onOpenArticle}
      />
    </div>
  );
}