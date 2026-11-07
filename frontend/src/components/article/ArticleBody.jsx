// frontend/src/components/article/ArticleBody.jsx
/**
 * Corpo do artigo — injeta HTML via dangerouslySetInnerHTML.
 * O `id="art-detail-body"` é lido pelo hook `useToc` para gerar o índice.
 *
 * Depende de `@tailwindcss/typography` (plugin `@plugin "@tailwindcss/typography"`
 * no index.css). Sem o plugin, `prose` é uma classe morta e os títulos/parágrafos
 * ficam sem estilo.
 *
 * ⚠️ Segurança: conteúdo vem do CRM local (localStorage) via textarea.
 * Em produção (backend Django), sanitizar com DOMPurify antes de renderizar (ADR-007).
 *
 * Props:
 *  - content → string HTML
 */

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('xml', xml);

export default function ArticleBody({ content }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Encontra todos os blocos <pre> renderizados no artigo
    const preElements = containerRef.current.querySelectorAll('pre');

    preElements.forEach((pre) => {
      // 1. Garante que o <pre> está dentro da caixa de fundo estilizada (.code-block)
      let wrapper = pre.closest('.code-block');

      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'relative bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 code-block my-4 text-sm overflow-x-auto';
        
        // Move o <pre> para dentro da nova caixa de fundo
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }

      // Estiliza o pre interno para não conflitar com a caixa
      pre.className = 'bg-transparent p-0 m-0 overflow-x-auto';

      // 2. Adiciona o botão de copiar dinamicamente se já não existir
      if (!wrapper.querySelector('.copy-code-btn')) {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn absolute top-2 right-2 bg-slate-800 hover:bg-sky-600 text-amber-300 px-2 py-1 text-xs rounded border border-slate-700 transition-colors cursor-pointer z-10 flex items-center gap-1 font-mono';
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
        
        copyBtn.onclick = () => {
          const codeText = pre.innerText;
          navigator.clipboard.writeText(codeText).then(() => {
            copyBtn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> Copiado!';
            setTimeout(() => {
              copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
            }, 2000);

            // Se houver toast global, chama também
            if (typeof window.triggerToast === 'function') {
              window.triggerToast('Código copiado para a área de transferência!');
            }
          });
        };

        wrapper.appendChild(copyBtn);
      }

      // 3. Aplica o Highlight.js no elemento <code> interno
      const code = pre.querySelector('code');
      if (code) {
        hljs.highlightElement(code);
      }
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      id="art-detail-body"
      className="
        prose dark:prose-invert max-w-none font-sans leading-relaxed space-y-6
        prose-headings:font-bold prose-headings:font-sans prose-headings:tracking-tight
        prose-h2:text-2xl prose-h2:pt-2 prose-h2:mt-6
        prose-h3:text-xl prose-h3:pt-2 prose-h3:mt-4
        prose-p:opacity-95
        prose-a:text-python-blue dark:prose-a:text-python-yellow prose-a:underline hover:prose-a:opacity-80
        prose-strong:text-python-blue dark:prose-strong:text-python-yellow
        
        /* --- CÓDIGO INLINE --- */
        prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
        
        prose-blockquote:border-l-4 prose-blockquote:border-python-yellow prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:opacity-90
        prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
        prose-img:rounded prose-img:border prose-img:border-slate-700
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}