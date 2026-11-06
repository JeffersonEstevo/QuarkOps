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

export default function ArticleBody({ content }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      // Verifica se o elemento clicado (ou o pai dele) tem a classe 'copy-code-btn'
      const btn = e.target.closest('.copy-code-btn');
      if (!btn) return;

      const codeBlock = btn.parentElement.querySelector('pre');
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.innerText);
        
        // Feedback visual (opcional)
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Copiado!';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }
    };

    const currentRef = bodyRef.current;
    if (currentRef) {
      currentRef.addEventListener('click', handleClick);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('click', handleClick);
      }
    };
  }, [content]); // Roda sempre que o conteúdo do artigo mudar

  return (
    <div 
      ref={bodyRef}
      id="art-detail-body" 
      className="prose prose-slate dark:prose-invert max-w-none" 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}