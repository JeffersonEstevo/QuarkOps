// frontend/src/components/article/SystemTelemetry.jsx
/**
 * Caixinha de "telemetria" decorativa da sidebar do artigo.
 * Puramente visual (mantém paridade com o original).
 */
export default function SystemTelemetry() {
  return (
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
  );
}