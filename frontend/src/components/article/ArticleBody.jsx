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
    const currentRef = bodyRef.current;
    if (!currentRef) return;

    const handleClick = (e) => {
      const btn = e.target.closest('.copy-code-btn');
      if (!btn) return;

      const preElement = btn.parentElement.querySelector('pre');
      if (preElement) {
        const textToCopy = preElement.innerText.trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
          btn.style.backgroundColor = '#10b981'; // Verde
          
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = ''; // Volta ao normal
          }, 2000);
        });
      }
    };

    currentRef.addEventListener('click', handleClick);
    return () => currentRef.removeEventListener('click', handleClick);
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