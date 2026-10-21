// frontend/src/components/crm/CrmModal.jsx
import { useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import Button from '../ui/Button';
import CodeBlockModal from './CodeBlockModal'; // <-- Importando o novo modal
import {
  CATEGORIES_FOR_FORM,
  DEFAULT_AUTHOR,
  DEFAULT_CATEGORY,
  DEFAULT_READ_TIME,
} from '../../utils/constants';

// Registra linguagens
hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('xml', xml);

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function CrmModal({ isOpen, initialArticle, onClose, onSubmit }) {
  const isEditing = Boolean(initialArticle);

  const [title, setTitle] = useState(() => initialArticle?.title ?? '');
  const [category, setCategory] = useState(() => initialArticle?.category ?? DEFAULT_CATEGORY);
  const [tags, setTags] = useState(() => (initialArticle?.tags ?? []).join(', '));
  const [author, setAuthor] = useState(() => initialArticle?.author ?? DEFAULT_AUTHOR);
  const [readTime, setReadTime] = useState(() => initialArticle?.readTime ?? DEFAULT_READ_TIME);
  const [summary, setSummary] = useState(() => initialArticle?.summary ?? '');
  const [content, setContent] = useState(() => initialArticle?.content ?? '');

  // Estado do sub-modal de código
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const contentRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      category,
      tags: tags.split(',').map((t) => t.trim().replace('#', '')).filter(Boolean),
      author: author.trim(),
      readTime: readTime.trim(),
      summary: summary.trim(),
      content: content.trim(),
    });
  };

  // Chamado quando o CodeBlockModal envia o código
  const handleInsertCode = (lang, rawCode) => {
    const highlighted =
      lang === 'plaintext'
        ? escapeHtml(rawCode)
        : hljs.highlight(rawCode, { language: lang }).value;

    const htmlSnippet = `
<div class="relative bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 code-block my-4 text-sm overflow-x-auto">
  <button onclick="navigator.clipboard.writeText(this.parentElement.querySelector('pre').innerText); window.triggerToast('Código copiado para a área de transferência!');" class="absolute top-2 right-2 bg-slate-800 hover:bg-sky-600 text-amber-300 px-2 py-1 text-xs rounded border border-slate-700 transition-colors cursor-pointer z-10">
    <i class="fa-regular fa-copy mr-1"></i> Copiar
  </button>
  <pre><code class="language-${lang} hljs">${highlighted}</code></pre>
</div>`.trim();

    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? content.length;
    const end = textarea.selectionEnd ?? content.length;

    const before = content.slice(0, start);
    const after = content.slice(end);
    const next = `${before}\n\n${htmlSnippet}\n\n${after}`;
    
    setContent(next);
    setIsCodeModalOpen(false); // Fecha o modal de código

    const newCursorPos = before.length + htmlSnippet.length + 4;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 w-full max-w-2xl p-6 pixel-border space-y-6 my-8 font-mono text-xs">
          
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-lg retro-title font-bold">
              {isEditing ? '[CRM_ADMIN // EDITAR ARTIGO]' : '[CRM_ADMIN // NOVO ARTIGO]'}
            </h3>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-100 font-mono text-base px-2 py-0.5 bg-slate-200 dark:bg-slate-800" aria-label="Fechar modal">
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título, Categoria, Tags, Autor, Tempo de Leitura, Resumo (mesmos de antes) */}
            <div>
              <label className="block mb-1 font-bold">Título do Artigo:</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="ex: Otimizando Queries SQL" className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Categoria:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue">
                  {CATEGORIES_FOR_FORM.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-bold">Tags (separadas por vírgula):</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} required placeholder="python, backend" className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold">Autor:</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue" />
              </div>
              <div>
                <label className="block mb-1 font-bold">Tempo de Leitura:</label>
                <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} required className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue" />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold">Resumo:</label>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required rows={2} className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue resize-none" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold">Conteúdo HTML:</label>
                <span className="text-[10px] opacity-60 italic">(use &lt;h2&gt; para o TOC)</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                <Button type="button" variant="outline" size="sm" icon="fa-solid fa-code" onClick={() => setIsCodeModalOpen(true)}>
                  + Bloco de código
                </Button>
              </div>
              
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
                placeholder='<h2>1. Introdução</h2><p>Texto...</p>'
                className="w-full bg-python-lightbg dark:bg-slate-900 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:border-python-blue font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
              <Button type="button" variant="secondary" onClick={onClose}>CANCELAR</Button>
              <Button type="submit" variant="primary">
                {isEditing ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR ARTIGO'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* O sub-modal do código aparece POR CIMA do CrmModal (z-[60]) */}
      {isCodeModalOpen && (
        <CodeBlockModal
          onClose={() => setIsCodeModalOpen(false)}
          onInsert={handleInsertCode}
        />
      )}
    </>
  );
}