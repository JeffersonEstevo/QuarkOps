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
import hljs from 'highlight.js';

export default function ArticleBody({ content }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const currentRef = bodyRef.current;
    if (!currentRef) return;

    // 1. Aplica a coloração do highlight.js em todos os códigos
    currentRef.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
      
      // 2. Envolve o <pre> em uma div bonita com o botão de copiar
      // Só faz isso se ainda não tiver o botão (para não duplicar)
      if (!block.parentElement.parentElement.classList.contains('custom-code-wrapper')) {
        const pre = block.parentElement;
        
        // Cria a div wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'relative bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 my-6 text-sm overflow-x-auto custom-code-wrapper';
        
        // Cria o botão
        const btn = document.createElement('button');
        btn.className = 'absolute top-2 right-2 bg-slate-800 hover:bg-sky-600 text-amber-300 px-2 py-1 text-xs rounded border border-slate-700 transition-colors cursor-pointer z-10 flex items-center gap-1';
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
        
        btn.onclick = () => {
          navigator.clipboard.writeText(block.innerText);
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
          btn.style.backgroundColor = '#10b981';
          setTimeout(() => {
            btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
            btn.style.backgroundColor = '';
          }, 2000);
        };

        // Move o <pre> para dentro da wrapper e adiciona o botão
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(btn);
        wrapper.appendChild(pre);
      }
    });
  }, [content]);

  return (
    <div 
      ref={bodyRef}
      id="art-detail-body" 
      className="prose prose-slate dark:prose-invert max-w-none" 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}