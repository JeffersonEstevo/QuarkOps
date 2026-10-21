// frontend/src/components/crm/CodeBlockModal.jsx
import { useState } from 'react';
import Button from '../ui/Button';

const SUPPORTED_LANGS = ['python', 'javascript', 'typescript', 'bash', 'json', 'sql', 'xml', 'plaintext'];

/**
 * Modal para inserir bloco de código no artigo.
 * Substitui os window.prompt.
 *
 * Props:
 *  - onClose  → () => void
 *  - onInsert → (lang, code) => void
 */
export default function CodeBlockModal({ onClose, onInsert }) {
  const [lang, setLang] = useState('python');
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    onInsert(lang, code);
  };

  // Permite usar a tecla Tab para identar dentro do textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newValue);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 w-full max-w-2xl p-6 pixel-border space-y-4 font-mono text-xs my-8"
      >
        <div className="border-b border-slate-700 pb-3">
          <h3 className="text-lg retro-title font-bold">[CODE_BLOCK // NOVO CÓDIGO]</h3>
        </div>

        <div>
          <label className="block mb-1 font-bold">Linguagem:</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue"
          >
            {SUPPORTED_LANGS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-bold">Código (use Tab para identar):</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={14}
            placeholder="Cole o código aqui..."
            className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue font-mono text-xs whitespace-pre"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            CANCELAR
          </Button>
          <Button type="submit" variant="primary" icon="fa-solid fa-code">
            INSERIR BLOCO
          </Button>
        </div>
      </form>
    </div>
  );
}