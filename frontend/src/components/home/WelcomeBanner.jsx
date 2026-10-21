// frontend/src/components/home/WelcomeBanner.jsx
/**
 * Banner de boas-vindas estilo "terminal retrô".
 * Puramente visual — sem props.
 */
export default function WelcomeBanner() {
  return (
    <div className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-6 pixel-border relative overflow-hidden">
      <div
        className="absolute -right-10 -bottom-10 opacity-10 dark:opacity-5 text-9xl font-mono select-none"
        aria-hidden="true"
      >
        🐍
      </div>

      <div className="max-w-2xl relative z-10">
        <div className="inline-block bg-python-yellow text-slate-900 text-xs font-mono font-bold px-2 py-0.5 mb-3 pixel-border-sm">
          [ROOT_ACCESS_GRANTED]
        </div>

        <h1 className="text-3xl md:text-5xl retro-title font-bold mb-3 tracking-wide">
          CONHECIMENTO PROFUNDO EM TECNOLOGIA
        </h1>

        <p className="text-sm md:text-base opacity-90 font-mono mb-4 leading-relaxed">
          Artigos técnicos selecionados sobre Programação Avançada, Arquitetura
          de Sistemas, Inteligência Artificial, Infraestrutura Moderna, DevOps
          e Linux. Foco total em leitura limpa, código e engenharia de software.
        </p>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {['#python', '#linux_kernel', '#devops_cicd', '#ai_llms'].map((tag) => (
            <span
              key={tag}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}