// frontend/src/components/layout/ReadingProgressBar.jsx
/**
 * Barra fixa no topo que mostra o progresso de leitura (0–100%).
 * Só deve ser renderizada na view de artigo (o App controla isso).
 */
export default function ReadingProgressBar({ progress }) {
  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent">
      <div
        className="h-full bg-python-yellow transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}