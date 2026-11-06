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

    // Procura todos os blocos de código que vieram do banco
    const codeBlocks = currentRef.querySelectorAll('pre code');
    
    codeBlocks.forEach((block) => {
      // 1. Aplica as cores do highlight.js
      try {
        hljs.highlightElement(block);
      } catch (e) {
        console.warn('Erro no highlight', e);
      }

      // 2. Pega o <pre> (pai do code)
      const pre = block.parentElement;
      
      // Evita duplicar a caixa se o React já tiver processado
      if (pre.parentElement.classList.contains('my-custom-code-wrapper')) return;

      // 3. Cria a caixa escura
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

      // 4. Cria o botão
      const btn = document.createElement('button');
      btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
      btn.style.cssText = `
        position: absolute; top: 0.5rem; right: 0.5rem; 
        background-color: #1e293b; color: #fcd34d; 
        padding: 0.25rem 0.5rem; border-radius: 0.25rem; 
        border: 1px solid #334155; font-size: 0.75rem; 
        cursor: pointer; z-index: 10; transition: all 0.2s;
      `;

      // 5. Lógica de copiar
      btn.onclick = () => {
        navigator.clipboard.writeText(block.innerText);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        btn.style.backgroundColor = '#10b981';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
          btn.style.backgroundColor = '#1e293b';
        }, 2000);
      };

      // 6. Monta a estrutura: Wrapper > Botão + Pre
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(btn);
      wrapper.appendChild(pre);
      
      // Remove o estilo de fundo do pre para não ficar duplicado
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