// frontend/src/pages/HomePage.jsx
import WelcomeBanner from '../components/home/WelcomeBanner';
import FeaturedArticle from '../components/home/FeaturedArticle';
import ArticleGrid from '../components/home/ArticleGrid';

export default function HomePage({
  featured,
  filteredArticles,
  activeCategory,
  setActiveCategory,
  activeSubcategory,       // 🆕
  setActiveSubcategory,    // 🆕
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
        activeSubcategory={activeSubcategory}       // 🆕
        onSelectSubcategory={setActiveSubcategory}  // 🆕
        onOpen={onOpenArticle}
      />
    </div>
  );
}