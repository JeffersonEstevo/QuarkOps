// frontend/src/components/layout/Header.jsx
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext'; // 🆕 Importado o useAuth

/**
 * Cabeçalho fixo com:
 *  - logo (leva para home)
 *  - busca em tempo real
 *  - botão de tema (consome useTheme)
 *  - botão do CRM (com suporte a exibição do usuário logado)
 *
 * Props:
 *  - searchTerm, setSearchTerm     → input controlado de busca
 *  - onNavigateHome                → clique no logo
 *  - onOpenCrm                     → clique no botão [ CRM ]
 *  - onFilterCategory              → (não usado aqui, mantido para paridade de API)
 */
export default function Header({
  searchTerm,
  setSearchTerm,
  onNavigateHome,
  onOpenCrm,
}) {
  const { darkMode, toggleTheme } = useTheme();
  const { user, isCrmAuthenticated } = useAuth(); // 🆕 Consumindo o contexto de autenticação

  return (
    <header className="sticky top-0 z-40 bg-python-lightbg/95 dark:bg-python-deep/95 backdrop-blur border-b border-python-lightborder dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center space-x-2 font-pixel text-2xl tracking-wide text-python-blue dark:text-python-yellow hover:opacity-80 transition-opacity"
          aria-label="Ir para a página inicial"
        >
          <i className="fa-solid fa-terminal text-lg" aria-hidden="true" />
          <span>BYTE_LORE</span>
        </button>

        {/* Busca */}
        <div className="relative w-full md:w-72">
          <i
            className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-60"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar artigos..."
            aria-label="Buscar artigos"
            className="w-full bg-white dark:bg-slate-800 border border-slate-700 pl-8 pr-3 py-1.5 text-xs font-mono rounded focus:outline-none focus:border-python-blue"
          />
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="bg-white dark:bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-mono pixel-border-sm hover:bg-python-blue hover:text-white transition-all"
          >
            <i
              className={darkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}
              aria-hidden="true"
            />
          </button>

          {/* Botão do CRM dinâmico (com base na autenticação) */}
          {isCrmAuthenticated ? (
            <button
              type="button"
              onClick={onOpenCrm}
              className="bg-python-blue text-python-yellow border border-slate-700 px-3 py-1.5 text-xs font-mono font-bold pixel-border-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform flex items-center"
            >
              <i className="fa-solid fa-user-shield mr-1.5" aria-hidden="true" />
              {user?.display_name || user?.username || 'CRM'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCrm}
              className="bg-python-blue text-python-yellow border border-slate-700 px-3 py-1.5 text-xs font-mono font-bold pixel-border-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform flex items-center"
            >
              <i className="fa-solid fa-lock mr-1.5" aria-hidden="true" />
              CRM
            </button>
          )}
        </div>
      </div>
    </header>
  );
}