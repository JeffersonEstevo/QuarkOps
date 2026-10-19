// frontend/src/components/StoragePanel.jsx
import { useState, useMemo } from 'react';
import {
  resetArticles,
  clearAllStorage,
  inspectStorage,
} from '../utils/storage';

export default function StoragePanel({ onArticlesChanged, triggerToast }) {
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);

  // Calculado durante o render — sem effect, sem cascata
  const info = useMemo(() => inspectStorage(), [tick, open]);

  const refresh = () => setTick(t => t + 1);

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  const handleReset = () => {
    if (!window.confirm('RESET: apaga artigos do CRM e volta aos iniciais. Continuar?')) return;
    const fresh = resetArticles();
    onArticlesChanged(fresh);
    refresh();
    triggerToast('RESET aplicado: artigos iniciais recarregados.');
  };

  const handleClearAll = () => {
    if (!window.confirm('LIMPAR TUDO: apaga TODAS as chaves do localStorage. Continuar?')) return;
    clearAllStorage();
    const fresh = resetArticles();
    onArticlesChanged(fresh);
    refresh();
    triggerToast('localStorage limpo. Artigos iniciais recarregados.');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 font-mono text-xs">
      <button
        onClick={handleToggle}
        className="bg-slate-900 text-python-yellow border-2 border-python-yellow px-3 py-2 pixel-border-sm"
      >
        <i className="fa-solid fa-database mr-1"></i>
        STORAGE {open ? '▾' : '▸'}
      </button>

      {open && (
        <div className="mt-2 bg-white dark:bg-[#1e3048] border-2 border-slate-800 dark:border-slate-700 p-3 pixel-border space-y-2 w-72">
          <div className="font-bold text-[#387eb8]">// STORAGE_INSPECTOR</div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>versão salva:</span>
              <span className="font-bold">{info.version ?? '(nenhuma)'}</span>
            </div>
            <div className="flex justify-between">
              <span>versão código:</span>
              <span className="font-bold text-[#ffd43b]">{info.currentVersion}</span>
            </div>
            <div className="flex justify-between">
              <span>artigos:</span>
              <span className="font-bold">{info.articlesCount}</span>
            </div>
            <div className="flex justify-between">
              <span>tema:</span>
              <span className="font-bold">{info.theme ?? '(nenhum)'}</span>
            </div>
            <div className="pt-1 border-t border-slate-300 dark:border-slate-700">
              <span>chaves ({info.keys.length}):</span>
              <div className="break-all opacity-70">{info.keys.join(', ') || '(vazio)'}</div>
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-slate-300 dark:border-slate-700">
            <button
              onClick={handleReset}
              className="bg-[#387eb8] text-white px-2 py-1.5 font-bold pixel-border-sm"
            >
              RESET (iniciais, apaga CRM)
            </button>
            <button
              onClick={handleClearAll}
              className="bg-red-600 text-white px-2 py-1.5 font-bold pixel-border-sm"
            >
              LIMPAR TUDO (localStorage.clear)
            </button>
            <button
              onClick={() => { refresh(); triggerToast('Estado atualizado.'); }}
              className="bg-slate-200 dark:bg-slate-700 px-2 py-1.5 font-bold pixel-border-sm"
            >
              ATUALIZAR INSPEÇÃO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}