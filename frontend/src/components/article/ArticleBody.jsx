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

    // 1. Aplica o highlight.js em todos os blocos de código
    const codeBlocks = currentRef.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      try {
        hljs.highlightElement(block);
      } catch {
        // ignora
      }
    });

    // 2. Encontra os blocos <pre> e cria o botão ao redor deles
    const preElements = currentRef.querySelectorAll('pre');
    
    preElements.forEach((pre) => {
      // Evita duplicar se o React já passou aqui
      if (pre.parentElement.classList.contains('my-custom-code-wrapper')) return;

      // Cria a caixa escura
      const wrapper = document.createElement('div');
      wrapper.className = 'my-custom-code-wrapper';
      wrapper.style.cssText = `
        position: relative; 
        background-color: #0f172a; 
        padding: 1rem; 
        border-radius: 0.5rem; 
        border: 1px solid #334155; 
        margin: 1.5rem 0; 
        overflow-x: auto;
      `;

      // Cria o botão de copiar
      const btn = document.createElement('button');
      btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
      btn.style.cssText = `
        position: absolute; top: 0.5rem; right: 0.5rem; 
        background-color: #1e293b; color: #fcd34d; 
        padding: 0.25rem 0.5rem; border-radius: 0.25rem; 
        border: 1px solid #334155; font-size: 0.75rem; 
        cursor: pointer; z-index: 10; transition: all 0.2s;
      `;

      // Ação de copiar
      btn.onclick = () => {
        const codeElement = pre.querySelector('code');
        const textToCopy = codeElement ? codeElement.innerText : pre.innerText;
        navigator.clipboard.writeText(textToCopy);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        btn.style.backgroundColor = '#10b981';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
          btn.style.backgroundColor = '#1e293b';
        }, 2000);
      };

      // Move o <pre> para dentro da caixa e adiciona o botão
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(btn);
      wrapper.appendChild(pre);
      
      // Remove fundos do prose
      pre.style.margin = '0';
      pre.style.padding = '0';
      pre.style.backgroundColor = 'transparent';
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