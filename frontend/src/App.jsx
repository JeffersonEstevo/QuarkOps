// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ReadingProgressBar from './components/layout/ReadingProgressBar';
import CrmModal from './components/crm/CrmModal';
import LoginGate from './components/crm/LoginGate';
import ConfirmDialog from './components/ui/ConfirmDialog';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import { useArticles } from './hooks/useArticles';
import { useReadingProgress } from './hooks/useReadingProgress';
import { useToc } from './hooks/useToc';
import { useToast } from './contexts/ToastContext';
import { useAuth } from './contexts/AuthContext';
import { STORAGE_KEYS, STORAGE_VERSION, VIEWS } from './utils/constants';

export default function App() {
  // ── Navegação / UI ────────────────────────────────────────────
  const [currentView, setCurrentView] = useState(VIEWS.HOME);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // ── CRM / Auth ────────────────────────────────────────────────
  const { isCrmAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [crmMode, setCrmMode] = useState(null); // 'create' | 'edit' | null
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [crmOpenCount, setCrmOpenCount] = useState(0);

  // ── Confirmação genérica (substitui window.confirm) ───────────
  const [confirmState, setConfirmState] = useState(null);
  // { title, message, confirmLabel, variant, onConfirm }

  const { triggerToast } = useToast();

  // ── Migração de storage ───────────────────────────────────────
  useEffect(() => {
    const versaoSalva = localStorage.getItem(STORAGE_KEYS.STORAGE_VERSION);
    if (versaoSalva === STORAGE_VERSION) return;

    const chavesParaRemover = [
      STORAGE_KEYS.ARTICLES,
      STORAGE_KEYS.ARTICLES_VERSION,
      STORAGE_KEYS.LEGACY_THEME,
      STORAGE_KEYS.LEGACY_BYTE_LORE_THEME,
    ];
    chavesParaRemover.forEach((chave) => localStorage.removeItem(chave));
    localStorage.setItem(STORAGE_KEYS.STORAGE_VERSION, STORAGE_VERSION);
    // eslint-disable-next-line no-console
    console.log('🔄 Storage do QuarkOps limpo por atualização de versão.');
  }, []);

  // ── Dados ─────────────────────────────────────────────────────
  const {
    articles, featured, filteredArticles,
    openArticle, createArticle, updateArticle, deleteArticle,
    postComment, deleteComment, likeArticle,
  } = useArticles({
    activeCategory,
    searchTerm,
    onOpen: (id) => {
      setSelectedArticleId(id);
      setCurrentView(VIEWS.ARTICLE);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onCreated: (art) => {
      setCrmMode(null);
      triggerToast('Artigo publicado com sucesso pelo CRM!');
      setSelectedArticleId(art.id);
      setCurrentView(VIEWS.ARTICLE);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onUpdated: () => {
      setCrmMode(null);
      setEditingArticleId(null);
      triggerToast('Artigo atualizado com sucesso!');
    },
    onDeleted: (id) => {
      triggerToast('Artigo excluído.');
      if (selectedArticleId === id) {
        setSelectedArticleId(null);
        setCurrentView(VIEWS.HOME);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    onComment: () => triggerToast('Comentário postado com sucesso!'),
    onCommentDeleted: () => triggerToast('Comentário removido pela moderação.'),
  });

  const readingProgress = useReadingProgress(currentView);
  useToc({ currentView, selectedArticleId });

  // ── Navegação ────────────────────────────────────────────────
  const navigateHome = () => {
    setSelectedArticleId(null);
    setCurrentView(VIEWS.HOME);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Handlers de interação do leitor ──────────────────────────
  const handleLike = () => {
    if (!selectedArticleId) return;
    likeArticle(selectedArticleId);
    triggerToast('Artigo curtido!');
  };

  const handleSubmitComment = (comment) => {
    if (!selectedArticleId) return;
    postComment(selectedArticleId, comment);
  };

  // ── Confirmação genérica ─────────────────────────────────────
  const askConfirm = ({ title, message, confirmLabel = 'CONFIRMAR', variant = 'danger', onConfirm }) => {
    setConfirmState({ title, message, confirmLabel, variant, onConfirm });
  };

  const handleConfirm = () => {
    confirmState?.onConfirm?.();
    setConfirmState(null);
  };

  // ── Moderação de comentário ──────────────────────────────────
  const handleDeleteComment = (commentId) => {
    if (!selectedArticleId) return;
    askConfirm({
      title: '[MODERATION // CONFIRMAR]',
      message: 'Excluir este comentário permanentemente?',
      confirmLabel: 'EXCLUIR',
      variant: 'danger',
      onConfirm: () => deleteComment(selectedArticleId, commentId),
    });
  };

  // ── Abertura do CRM ──────────────────────────────────────────
  const handleOpenCreate = () => {
    if (isCrmAuthenticated) {
      setCrmMode('create');
      setEditingArticleId(null);
      setCrmOpenCount((n) => n + 1);
    } else {
      setShowLogin(true);
    }
  };

  const handleOpenEdit = (id) => {
    if (!isCrmAuthenticated) {
      triggerToast('Faça login no CRM para editar.');
      setShowLogin(true);
      return;
    }
    setCrmMode('edit');
    setEditingArticleId(id);
    setCrmOpenCount((n) => n + 1);
  };

  const handleAfterLogin = () => {
    setShowLogin(false);
    setCrmMode('create');
    setCrmOpenCount((n) => n + 1);
  };

  // ── Submit unificado ─────────────────────────────────────────
  const handleCrmSubmit = (payload) => {
    if (crmMode === 'edit' && editingArticleId) {
      updateArticle(editingArticleId, payload);
    } else {
      createArticle(payload);
    }
  };

  // ── Exclusão de artigo ───────────────────────────────────────
  const handleDeleteArticle = (id) => {
    askConfirm({
      title: '[CRM_ADMIN // CONFIRMAR EXCLUSÃO]',
      message: 'Excluir este artigo permanentemente? Esta ação não pode ser desfeita.',
      confirmLabel: 'EXCLUIR ARTIGO',
      variant: 'danger',
      onConfirm: () => deleteArticle(id),
    });
  };

  // ── Derivados ────────────────────────────────────────────────
  const selectedArticle = articles.find((a) => a.id === selectedArticleId);
  const editingArticle = editingArticleId
    ? articles.find((a) => a.id === editingArticleId) || null
    : null;

  return (
    <div className="bg-python-lightbg text-slate-800 dark:bg-python-deep dark:text-slate-100 min-h-screen flex flex-col font-sans selection:bg-python-yellow selection:text-slate-900">
      {currentView === VIEWS.ARTICLE && <ReadingProgressBar progress={readingProgress} />}

      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onNavigateHome={navigateHome}
        onOpenCrm={handleOpenCreate}
        onFilterCategory={setActiveCategory}
      />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6">
        {currentView === VIEWS.HOME && (
          <HomePage
            featured={featured}
            filteredArticles={filteredArticles}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onOpenArticle={openArticle}
          />
        )}

        {currentView === VIEWS.ARTICLE && selectedArticle && (
          <ArticlePage
            article={selectedArticle}
            onBack={navigateHome}
            onLike={handleLike}
            onSubmitComment={handleSubmitComment}
            canManage={isCrmAuthenticated}
            onEdit={() => handleOpenEdit(selectedArticle.id)}
            onDelete={() => handleDeleteArticle(selectedArticle.id)}
            onDeleteComment={handleDeleteComment}
          />
        )}
      </main>

      <Footer onNavigateHome={navigateHome} onOpenCrm={handleOpenCreate} />

      {showLogin && (
        <LoginGate onCancel={() => setShowLogin(false)} onSuccess={handleAfterLogin} />
      )}

      <CrmModal
        key={`${crmMode}-${editingArticleId ?? 'new'}-${crmOpenCount}`}
        isOpen={crmMode !== null}
        initialArticle={editingArticle}
        onClose={() => {
          setCrmMode(null);
          setEditingArticleId(null);
        }}
        onSubmit={handleCrmSubmit}
      />

      {confirmState && (
        <ConfirmDialog
          title={confirmState.title}
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          variant={confirmState.variant}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}

      {isCrmAuthenticated && (
        <button
          type="button"
          onClick={() => {
            logout();
            triggerToast('Sessão do CRM encerrada.');
          }}
          className="fixed bottom-6 left-6 z-40 bg-slate-900 text-python-yellow border-2 border-python-yellow px-3 py-1.5 pixel-border-sm font-mono text-xs hover:opacity-80"
          title="Sair do CRM"
        >
          <i className="fa-solid fa-right-from-bracket mr-1.5" aria-hidden="true" />
          Sair do CRM
        </button>
      )}
    </div>
  );
}