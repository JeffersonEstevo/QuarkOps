// frontend/src/hooks/useToc.js
import { useEffect } from 'react';
import { VIEWS } from '../utils/constants';

/**
 * Gera o índice (TOC) a partir dos <h2> dentro de um container com id fixo.
 *
 * Por que manipular o DOM aqui?
 *  - O conteúdo do artigo vem de `dangerouslySetInnerHTML` (HTML arbitrário),
 *    então não temos acesso declarativo aos headings. Ler o DOM após o render
 *    é a abordagem mais simples e confiável.
 *
 * Depende de:
 *  - currentView === VIEWS.ARTICLE
 *  - selectedArticleId (para refazer quando o artigo muda)
 *  - contentHash (opcional): qualquer valor que mude quando o conteúdo muda
 *    (útil se o mesmo id receber conteúdo atualizado via CRM).
 *
 * Container alvo:  #art-detail-body
 * Container TOC:   #toc-container
 */
export function useToc({ currentView, selectedArticleId, bodyId = 'art-detail-body', tocId = 'toc-container' }) {
  useEffect(() => {
    if (currentView !== VIEWS.ARTICLE) return;

    // Delay pequeno para garantir que o HTML injetado já foi montado no DOM
    const timer = setTimeout(() => {
      const body = document.getElementById(bodyId);
      const tocContainer = document.getElementById(tocId);
      if (!body || !tocContainer) return;

      const h2Elements = body.querySelectorAll('h2');
      if (h2Elements.length === 0) {
        tocContainer.innerHTML =
          '<p class="opacity-60 italic">// Nenhum índice disponível.</p>';
        return;
      }

      let tocHtml = '';
      h2Elements.forEach((h2, index) => {
        if (!h2.id) {
          h2.id = `heading-${index}`;
        }
        tocHtml += `
          <a href="#${h2.id}" class="block py-1.5 px-2 rounded hover:bg-python-blue hover:text-white transition-colors truncate cursor-pointer">
            &gt; ${h2.innerText}
          </a>
        `;
      });
      tocContainer.innerHTML = tocHtml;
    }, 50);

    return () => clearTimeout(timer);
  }, [currentView, selectedArticleId, bodyId, tocId]);
}