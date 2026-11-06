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

    // Procura tanto 'pre code' quanto 'div.code-container code'
    const blocks = currentRef.querySelectorAll('pre code, div.code-container code');
    
    blocks.forEach((block) => {
      try { 
        hljs.highlightElement(block); 
      } catch (err) {
        // Ignora o erro do highlight se o bloco não for válido
        console.warn('Erro ao aplicar highlight:', err);
      }

      const parent = block.parentElement.parentElement; // O <pre> ou o <div>
      
      if (parent.parentElement.classList.contains('my-custom-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'my-custom-wrapper';
      wrapper.style.cssText = 'position: relative; background: #0f172a; padding: 1rem; border-radius: 0.5rem; border: 1px solid #334155; margin: 1.5rem 0; overflow-x: auto;';

      const btn = document.createElement('button');
      btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
      btn.style.cssText = 'position: absolute; top: 0.5rem; right: 0.5rem; background: #1e293b; color: #fcd34d; padding: 0.25rem 0.5rem; border-radius: 0.25rem; border: 1px solid #334155; font-size: 0.75rem; cursor: pointer; z-index: 10;';

      btn.onclick = () => {
        navigator.clipboard.writeText(block.innerText);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        btn.style.backgroundColor = '#10b981';
        setTimeout(() => { 
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar'; 
          btn.style.backgroundColor = '#1e293b'; 
        }, 2000);
      };

      parent.parentNode.insertBefore(wrapper, parent);
      wrapper.appendChild(btn);
      wrapper.appendChild(parent);
      
      parent.style.margin = '0';
      parent.style.padding = '0';
      parent.style.backgroundColor = 'transparent';
    });
  }, [content]);

  return (
    <div ref={bodyRef} id="art-detail-body" className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
  );
}