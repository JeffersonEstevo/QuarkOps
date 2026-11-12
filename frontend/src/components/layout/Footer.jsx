// frontend/src/components/layout/Footer.jsx
/**
 * Rodapé com copyright e atalhos (Home / CRM).
 *
 * Props:
 *  - onNavigateHome → clique em "Home"
 *  - onOpenCrm      → clique em "[ CRM Admin ]"
 */
export default function Footer({ onNavigateHome, onOpenCrm }) {
  return (
    <footer className="border-t border-python-lightborder dark:border-slate-800 bg-white/50 dark:bg-python-deep/50 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono opacity-80">
        <div>
          <p>&copy; 2026 QUARK_OPS. Todos os direitos reservados sob licença MIT.</p>
          <p className="mt-1 text-python-blue">
            Desenvolvido com estética Retro, Python Colors &amp; Foco em Leitura.
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:underline cursor-pointer"
          >
            Home
          </button>
          <a href="#featured-section" className="hover:underline cursor-pointer">
            Destaques
          </a>
          <button
            type="button"
            onClick={onOpenCrm}
            className="hover:underline text-python-yellow cursor-pointer"
          >
            [ CRM Admin ]
          </button>
        </div>
      </div>
    </footer>
  );
}