import { useState, useEffect } from 'react';
import Header from './components/Header';
import { getStoredArticles, saveArticles } from './utils/storage';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  // Efeito para sincronizar a classe 'dark' no HTML e salvar no localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    triggerToast(nextMode ? 'Tema alterado para: Modo Escuro' : 'Tema alterado para: Modo Claro');
  };
  const [articles, setArticles] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'article'
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const [showToastFlag, setShowToastFlag] = useState(false);

  // DECLARE A FUNÇÃO AQUI EM CIMA (Logo após os states)
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToastFlag(true);
    setTimeout(() => {
      setShowToastFlag(false);
    }, 3000);
  };

  // AGORA PODE USAR O useEffect QUE CHAMA triggerToast SEM PROBLEMAS
  useEffect(() => {
    window.triggerToast = triggerToast;
  }, [toastMessage]);

  // Form states CRM
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Programação');
  const [newAuthor, setNewAuthor] = useState('Guido Dev');
  const [newReadTime, setNewReadTime] = useState('5 min de leitura');
  const [newTags, setNewTags] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  // Comment states
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentRole, setCommentRole] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setArticles(getStoredArticles());
  }, []);

  // Disponibiliza a função do Toast para os elementos HTML injetados (dangerouslySetInnerHTML)
  useEffect(() => {
    window.triggerToast = triggerToast;
  }, [toastMessage])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('byte_lore_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('byte_lore_theme', 'light');
    }
  }, [darkMode]);

  // Barra de progresso de leitura ao rolar a página
  useEffect(() => {
    const handleScroll = () => {
      if (currentView !== 'article') return;
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setReadingProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Gera o Índice (TOC) dinamicamente igual ao script original
  useEffect(() => {
    if (currentView !== 'article') return;
    
    const timer = setTimeout(() => {
      const body = document.getElementById('art-detail-body');
      const tocContainer = document.getElementById('toc-container');
      if (!body || !tocContainer) return;

      const h2Elements = body.querySelectorAll('h2');
      if (h2Elements.length === 0) {
        tocContainer.innerHTML = '<p class="opacity-60 italic">// Nenhum índice disponível.</p>';
        return;
      }

      let tocHtml = '';
      h2Elements.forEach((h2, index) => {
        if (!h2.id) {
          h2.id = `heading-${index}`;
        }
        tocHtml += `
          <a href="#${h2.id}" class="block py-1.5 px-2 rounded hover:bg-python-blue hover:text-white transition-colors truncate cursor-pointer">
            &gt; ${h2.innerText}
          </a>
        `;
      });
      tocContainer.innerHTML = tocHtml;
    }, 50);

    return () => clearTimeout(timer);
  }, [currentView, selectedArticleId]);

  const handleCreateArticle = (e) => {
    e.preventDefault();
    const newArt = {
      id: `art-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: 'Hoje',
      readTime: newReadTime,
      views: 1,
      author: newAuthor,
      avatar: newAuthor.substring(0, 2).toUpperCase(),
      summary: newSummary,
      tags: newTags.split(',').map(t => t.trim().replace('#', '')),
      content: newContent,
      comments: [],
      likes: 0
    };

    const updated = [newArt, ...articles];
    setArticles(updated);
    saveArticles(updated);
    setIsCrmOpen(false);
    triggerToast('Artigo publicado com sucesso pelo CRM!');

    // Reset form
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewTags('');

    // Abrir o artigo recém criado
    setSelectedArticleId(newArt.id);
    setCurrentView('article');
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!selectedArticleId) return;

    const updated = articles.map(art => {
      if (art.id === selectedArticleId) {
        const newComment = {
          id: Date.now(),
          author: commentAuthor,
          role: commentRole || 'Leitor',
          text: commentText,
          date: 'Agora mesmo'
        };
        return { ...art, comments: [newComment, ...(art.comments || [])] };
      }
      return art;
    });

    setArticles(updated);
    saveArticles(updated);
    setCommentAuthor('');
    setCommentRole('');
    setCommentText('');
    triggerToast('Comentário postado com sucesso!');
  };

  const handleLike = (artId) => {
    const updated = articles.map(art => {
      if (art.id === artId) {
        return { ...art, likes: (art.likes || 0) + 1 };
      }
      return art;
    });
    setArticles(updated);
    saveArticles(updated);
    triggerToast('Artigo curtido!');
  };

  const openArticle = (id) => {
    const updated = articles.map(art => {
      if (art.id === id) {
        return { ...art, views: art.views + 1 };
      }
      return art;
    });
    setArticles(updated);
    saveArticles(updated);
    setSelectedArticleId(id);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHome = () => {
    setSelectedArticleId(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = articles.filter(art => {
    const matchesCat = activeCategory === 'ALL' || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const sortedByViews = [...articles].sort((a, b) => b.views - a.views);
  const featured = sortedByViews[0];
  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  return (
    <div className="bg-[#fbfaf5] text-slate-800 dark:bg-[#0f1724] dark:text-slate-100 min-h-screen flex flex-col font-sans selection:bg-[#ffd43b] selection:text-slate-900">
      
      {/* Reading Progress Bar */}
      {currentView === 'article' && (
        <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent">
          <div className="h-full bg-[#ffd43b] transition-all duration-100" style={{ width: `${readingProgress}%` }}></div>
        </div>
      )}


      
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onNavigateHome={() => setCurrentView('home')}
        onOpenCrm={() => setIsCrmOpen(true)}
        darkMode={darkMode}
        setDarkMode={toggleTheme}
        onFilterCategory={setActiveCategory}
      />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6">
        
        {currentView === 'home' && (
          <div className="space-y-8">
            
            {/* Welcome Terminal Banner */}
            <div className="bg-white dark:bg-[#1e3048] border-2 border-slate-800 dark:border-slate-700 p-6 pixel-border relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10 dark:opacity-5 text-9xl font-mono select-none">
                🐍
              </div>
              <div className="max-w-2xl relative z-10">
                <div className="inline-block bg-[#ffd43b] text-slate-900 text-xs font-mono font-bold px-2 py-0.5 mb-3 pixel-border-sm">
                  [ROOT_ACCESS_GRANTED]
                </div>
                <h1 className="text-3xl md:text-5xl retro-title font-bold mb-3 tracking-wide">
                  CONHECIMENTO PROFUNDO EM TECNOLOGIA
                </h1>
                <p className="text-sm md:text-base opacity-90 font-mono mb-4 leading-relaxed">
                  Artigos técnicos selecionados sobre Programação Avançada, Arquitetura de Sistemas, Inteligência Artificial, Infraestrutura Moderna, DevOps e Linux. Foco total em leitura limpa, código e engenharia de software.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-2 py-1">#python</span>
                  <span className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-2 py-1">#linux_kernel</span>
                  <span className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-2 py-1">#devops_cicd</span>
                  <span className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-2 py-1">#ai_llms</span>
                </div>
              </div>
            </div>

            {/* Destaque */}
            {featured && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl retro-title font-bold flex items-center space-x-2">
                    <i className="fa-solid fa-fire text-[#ffd43b]"></i>
                    <span>DESTAQUE // MAIS VISITADO</span>
                  </h2>
                  <span className="text-xs font-mono opacity-60">metrics_v1.2</span>
                </div>
                <div 
                  onClick={() => openArticle(featured.id)}
                  className="bg-white dark:bg-[#1e3048] border-2 border-slate-800 dark:border-slate-700 p-6 pixel-border hover:translate-x-1 transition-transform cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="bg-[#ffd43b] text-slate-900 font-mono text-xs font-bold px-2.5 py-1 pixel-border-sm">
                          {featured.category}
                        </span>
                        <span className="text-xs font-mono opacity-75"><i className="fa-solid fa-chart-line text-[#ffd43b]"></i> {featured.views} acessos</span>
                        <span className="text-xs font-mono opacity-75"><i className="fa-regular fa-clock"></i> {featured.readTime}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold font-sans group-hover:text-[#387eb8] transition-colors">
                        {featured.title}
                      </h3>
                      <p className="text-sm opacity-95 font-sans leading-relaxed">
                        {featured.summary}
                      </p>
                      <div className="flex items-center space-x-3 pt-2">
                        <div className="w-7 h-7 bg-[#387eb8] text-[#ffd43b] font-mono font-bold text-xs flex items-center justify-center pixel-border-sm">
                          {featured.avatar}
                        </div>
                        <span className="text-xs font-mono">Por {featured.author} &bull; {featured.date}</span>
                      </div>
                    </div>
                    <div className="hidden lg:flex flex-col items-center justify-center bg-slate-900 text-[#ffd43b] p-6 border border-slate-700 pixel-border-sm min-w-[180px] text-center font-mono">
                      <i className="fa-solid fa-award text-3xl mb-2"></i>
                      <span className="text-xs font-bold">TOP POST #1</span>
                      <span className="text-[10px] opacity-70 mt-1">Leitura Recomendada</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Grid de Artigos */}
            <section className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dcd5c4] dark:border-slate-800 pb-4">
                <h2 className="text-xl retro-title font-bold flex items-center space-x-2">
                  <i className="fa-solid fa-terminal text-[#387eb8]"></i>
                  <span>INDEX DE ARTIGOS RECENTES</span>
                </h2>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {['ALL', 'Programação', 'IA', 'DevOps', 'Linux', 'Infraestrutura'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 pixel-border-sm font-bold transition-all ${activeCategory === cat ? 'bg-[#387eb8] text-white' : 'bg-slate-200 dark:bg-slate-800 hover:bg-[#387eb8] hover:text-white'}`}
                    >
                      {cat === 'ALL' ? 'TODOS' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredArticles.map(art => (
                  <div 
                    key={art.id}
                    onClick={() => openArticle(art.id)}
                    className="bg-white dark:bg-[#1e3048] border-2 border-slate-800 dark:border-slate-700 p-5 pixel-border hover:-translate-y-1 transition-transform cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="bg-slate-200 dark:bg-slate-800 text-[#387eb8] dark:text-[#ffd43b] font-bold px-2 py-0.5 pixel-border-sm">
                          {art.category}
                        </span>
                        <span className="opacity-60"><i className="fa-solid fa-eye mr-1"></i>{art.views}</span>
                      </div>
                      <h4 className="text-lg font-bold font-sans group-hover:text-[#387eb8] transition-colors line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-xs opacity-80 font-sans line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#dcd5c4] dark:border-slate-700 flex items-center justify-between text-xs font-mono opacity-80">
                      <span><i className="fa-regular fa-calendar mr-1"></i>{art.date}</span>
                      <span className="text-[#387eb8] dark:text-[#ffd43b] font-bold group-hover:underline">Ler artigo &gt;</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentView === 'article' && selectedArticle && (
          <div className="space-y-6">
            <div>
              <button 
                onClick={navigateHome}
                className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-mono pixel-border-sm hover:bg-[#387eb8] hover:text-white transition-all"
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>cd .. (voltar ao index)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              <article className="lg:col-span-3 bg-white dark:bg-[#1e3048] border-2 border-slate-800 dark:border-slate-700 p-6 md:p-10 pixel-border space-y-6">
                
                <div className="space-y-3 border-b border-[#dcd5c4] dark:border-slate-700 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="bg-[#ffd43b] text-slate-900 text-xs font-mono font-bold px-2.5 py-1 pixel-border-sm">{selectedArticle.category}</span>
                    <div className="flex items-center space-x-4 text-xs font-mono opacity-75">
                      <span><i className="fa-regular fa-calendar mr-1"></i> {selectedArticle.date}</span>
                      <span><i className="fa-regular fa-clock mr-1"></i> {selectedArticle.readTime}</span>
                      <span><i className="fa-solid fa-eye mr-1"></i> {selectedArticle.views} views</span>
                      <button onClick={() => handleLike(selectedArticle.id)} className="hover:text-red-500 transition-colors">
                        ❤️ {selectedArticle.likes || 0}
                      </button>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight leading-snug">{selectedArticle.title}</h1>

                  <div className="flex items-center space-x-3 pt-2">
                    <div className="w-8 h-8 rounded bg-[#387eb8] text-[#ffd43b] flex items-center justify-center font-mono font-bold pixel-border-sm text-sm">
                      {selectedArticle.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold">{selectedArticle.author}</p>
                      <p className="text-[10px] font-mono opacity-60">Engenheiro de Software & Maintainer</p>
                    </div>
                  </div>
                </div>

                {/* Conteúdo HTML do Artigo */}
                <div 
                  id="art-detail-body"
                  className="prose dark:prose-invert max-w-none font-sans text-slate-700 dark:text-slate-300 leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />

                {/* Tags e Compartilhamento */}
                <div className="pt-6 border-t border-[#dcd5c4] dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {selectedArticle.tags?.map(t => (
                      <span key={t} className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2.5 py-1">#{t}</span>
                    ))}
                  </div>
                  <div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        triggerToast('Link do artigo copiado para compartilhamento!');
                      }}
                      className="bg-slate-200 dark:bg-slate-800 hover:bg-[#387eb8] hover:text-white px-3 py-1.5 text-xs font-mono pixel-border-sm transition-all flex items-center space-x-1.5"
                    >
                      <i className="fa-solid fa-share-nodes"></i>
                      <span>Compartilhar</span>
                    </button>
                  </div>
                </div>

                {/* Seção de Comentários */}
                <section className="pt-10 border-t-2 border-dashed border-[#dcd5c4] dark:border-slate-700 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl retro-title font-bold flex items-center space-x-2">
                      <i className="fa-solid fa-comments text-[#ffd43b]"></i>
                      <span>[COMMENTS_LOG // DIÁLOGO DA COMUNIDADE]</span>
                    </h3>
                    <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">{selectedArticle.comments?.length || 0} posts</span>
                  </div>

                  <form onSubmit={handlePostComment} className="bg-[#fbfaf5] dark:bg-slate-900 border border-[#dcd5c4] dark:border-slate-700 p-4 space-y-4 pixel-border-sm">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-[#387eb8]">// Adicionar Novo Comentário</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono mb-1">Seu Nome / Handle:</label>
                        <input type="text" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} required placeholder="ex: dev_ninja_99" className="w-full bg-white dark:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-[#387eb8]" />
                      </div>
                      <div>
                        <label className="block text-xs font-mono mb-1">Cargo / Tag (Opcional):</label>
                        <input type="text" value={commentRole} onChange={(e) => setCommentRole(e.target.value)} placeholder="ex: Python Dev @ Startup" className="w-full bg-white dark:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-[#387eb8]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1">Seu Comentário Técnico:</label>
                      <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} required rows="3" placeholder="Compartilhe sua visão..." className="w-full bg-white dark:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-[#387eb8] resize-none"></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="bg-[#387eb8] text-[#ffd43b] font-mono text-xs font-bold px-4 py-2 pixel-border-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform flex items-center space-x-2">
                        <i className="fa-solid fa-paper-plane"></i>
                        <span>ENVIAR COMENTÁRIO</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4">
                    {selectedArticle.comments?.length === 0 ? (
                      <p className="text-xs font-mono opacity-60 italic">// Nenhum comentário ainda. Seja o primeiro a registrar sua contribuição!</p>
                    ) : (
                      selectedArticle.comments?.map(c => (
                        <div key={c.id || Math.random()} className="bg-white dark:bg-slate-900 border border-slate-700 p-4 space-y-2 pixel-border-sm font-mono text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#387eb8]">{c.author} {c.role && <span className="text-[10px] opacity-60">({c.role})</span>}</span>
                            <span className="text-[10px] opacity-60">{c.date}</span>
                          </div>
                          <p className="font-sans opacity-90">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

              </article>

              <aside className="lg:col-span-1 space-y-6 sticky top-20">
                <div className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-4 pixel-border space-y-3">
                  <div className="flex items-center space-x-2 border-b border-python-lightborder dark:border-slate-700 pb-2">
                    <i className="fa-solid fa-list-ul text-python-yellow"></i>
                    <h3 className="text-sm retro-title font-bold tracking-wide">ÍNDICE (TOC)</h3>
                  </div>
                  {/* IMPORTANTE: Deixe esta tag <nav> vazia para o JS preencher */}
                  <nav id="toc-container" className="space-y-1 font-mono text-xs">
                  </nav>
                </div>

                {/* Quick Terminal Info Box */}
                <div className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-4 pixel-border space-y-2 text-xs font-mono">
                  <div className="text-python-blue font-bold">// SYS_TELEMETRY</div>
                  <div className="flex justify-between opacity-80">
                    <span>Encoding:</span>
                    <span>UTF-8</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>Renderer:</span>
                    <span>React + Vite</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>Security:</span>
                    <span>Sandboxed</span>
                  </div>
                </div>
              </aside>

 

            </div>
          </div>
        )}

      </main>

      {/* CRM Modal */}
      {isCrmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1e3048] border-2 border-slate-800 dark:border-slate-700 w-full max-w-2xl p-6 pixel-border space-y-6 my-8 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-lg retro-title font-bold">[CRM_ADMIN // NOVO ARTIGO]</h3>
              <button onClick={() => setIsCrmOpen(false)} className="text-slate-400 hover:text-slate-100 font-mono text-base px-2 py-0.5 bg-slate-200 dark:bg-slate-800">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block mb-1 font-bold">Título do Artigo:</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required placeholder="ex: Otimizando Queries SQL" className="w-full bg-[#fbfaf5] dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-[#387eb8]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Categoria:</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-[#fbfaf5] dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-[#387eb8]">
                    <option value="Programação">Programação</option>
                    <option value="IA">IA</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Linux">Linux</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold">Tags (separadas por vírgula):</label>
                  <input type="text" value={newTags} onChange={(e) => setNewTags(e.target.value)} required placeholder="python, backend" className="w-full bg-[#fbfaf5] dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-[#387eb8]" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-bold">Resumo:</label>
                <textarea value={newSummary} onChange={(e) => setNewSummary(e.target.value)} required rows="2" className="w-full bg-[#fbfaf5] dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-[#387eb8] resize-none"></textarea>
              </div>
              <div>
                <label className="block mb-1 font-bold">Conteúdo HTML:</label>
                <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} required rows="6" placeholder='<h2 class="text-2xl font-bold pt-2">1. Introdução</h2><p>Texto...</p>' className="w-full bg-[#fbfaf5] dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-[#387eb8] font-mono text-xs"></textarea>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsCrmOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold">CANCELAR</button>
                <button type="submit" className="px-5 py-2 bg-[#387eb8] text-[#ffd43b] font-bold pixel-border-sm">PUBLICAR ARTIGO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer idêntico ao original */}
      <footer className="border-t border-python-lightborder dark:border-slate-800 bg-white/50 dark:bg-python-deep/50 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono opacity-80">
          <div>
            <p>&copy; 2026 BYTE_LORE. Todos os direitos reservados sob licença MIT.</p>
            <p className="mt-1 text-python-blue">Desenvolvido com estética Retro, Python Colors & Foco em Leitura.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateHome(); }} className="hover:underline cursor-pointer">Home</a>
            <a href="#featured-section" className="hover:underline cursor-pointer">Destaques</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsCrmOpen(true); }} className="hover:underline text-python-yellow cursor-pointer">[ CRM Admin ]</a>
          </div>
        </div>
      </footer>

      {/* Custom Toast / Message Box Modal */}
      <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${showToastFlag ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-python-yellow border-2 border-python-yellow p-4 pixel-border font-mono text-xs flex items-center space-x-3 shadow-xl max-w-sm">
          <i className="fa-solid fa-terminal text-base"></i>
          <span>{toastMessage}</span>
        </div>
      </div>

    </div>
  );
}