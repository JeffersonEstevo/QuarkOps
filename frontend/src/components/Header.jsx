export default function Header({ searchTerm, setSearchTerm, onNavigateHome, onOpenCrm, darkMode, setDarkMode, onFilterCategory }) {
  return (
    <header className="border-b border-python-lightborder dark:border-slate-800 bg-python-lightbg/90 dark:bg-python-deep/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center justify-between w-full md:w-auto">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="flex items-center space-x-3 group">
            <div className="bg-python-blue text-python-yellow px-2.5 py-1 text-2xl retro-title font-bold pixel-border border-slate-900 dark:border-slate-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              &gt; root@retro-dev:~$
            </div>
          </a>
          
          {/* Mobile toggles */}
          <div className="flex items-center space-x-2 md:hidden">
            <button 
              onClick={setDarkMode} 
              style={{ cursor: 'pointer' }}
              className="p-2 rounded border border-python-lightborder dark:border-slate-700 bg-white dark:bg-slate-900 text-python-yellow w-9 h-9 flex items-center justify-center cursor-pointer"
            >
              <i id="theme-icon-mob" className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
            </button>
            <button 
              onClick={onOpenCrm} 
              style={{ cursor: 'pointer' }}
              className="bg-python-yellow text-slate-900 font-mono text-xs font-bold px-2 py-1 pixel-border-sm cursor-pointer"
            >
              + Nova Post
            </button>
          </div>
        </div>

        {/* Navigation Links (Categories) idênticos ao HTML original */}
        <nav className="hidden md:flex items-center space-x-4 text-xs font-mono font-bold">
          <a href="#" onClick={(e) => { e.preventDefault(); onFilterCategory('ALL'); onNavigateHome(); }} className="hover:text-python-blue transition-colors">[ #Home ]</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onFilterCategory('Programação'); onNavigateHome(); }} className="hover:text-python-blue transition-colors">[ #Python ]</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onFilterCategory('IA'); onNavigateHome(); }} className="hover:text-python-blue transition-colors">[ #IA ]</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onFilterCategory('DevOps'); onNavigateHome(); }} className="hover:text-python-blue transition-colors">[ #DevOps ]</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onFilterCategory('Linux'); onNavigateHome(); }} className="hover:text-python-blue transition-colors">[ #Linux ]</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onFilterCategory('Infraestrutura'); onNavigateHome(); }} className="hover:text-python-blue transition-colors">[ #Infra ]</a>
        </nav>

        {/* Actions Right */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 font-mono text-[10px]">cmd:</span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="buscar..." 
              className="bg-white dark:bg-slate-900 border border-python-lightborder dark:border-slate-700 text-xs rounded pl-10 pr-3 py-1.5 focus:outline-none focus:border-python-blue font-mono w-36 transition-all"
            />
          </div>

          <button onClick={onOpenCrm} className="bg-python-yellow text-slate-900 font-mono text-xs font-bold px-3 py-1.5 pixel-border-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform flex items-center space-x-1.5" title="Área Administrativa para publicação de artigos">
            <i className="fa-solid fa-plus"></i>
            <span>[ + CRM_POST ]</span>
          </button>

          <button onClick={setDarkMode} className="p-2 rounded border border-python-lightborder dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-python-yellow pixel-border-sm transition-transform flex items-center justify-center w-9 h-9" title="Alternar Tema Claro/Escuro">
            <i id="theme-icon" className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
          </button>
        </div>

      </div>
    </header>
  );
}