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
 *  - selectedArticleId  → refaz quando o artigo muda
 *  - content            → refaz quando o HTML muda (criação/edição via CRM)
 *
 * Estratégia anti-corrida:
 *  - requestAnimationFrame garante que o commit do React terminou.
 *  - Se os <h2> ainda não existirem (ex: dangerouslySetInnerHTML pesado),
 *    um MutationObserver aguarda o DOM do body até os headings aparecerem,
 *    desconectando-se em seguida. Zero polling.
 *
 * Container alvo:  #art-detail-body
 * Container TOC:   #toc-container
 */
export function useToc({
  currentView,
  selectedArticleId,
  content,
  bodyId = 'art-detail-body',
  tocId = 'toc-container',
}) {
  useEffect(() => {
    if (currentView !== VIEWS.ARTICLE) return;

    let observer = null;
    let cancelled = false;

    const buildToc = () => {
      if (cancelled) return true; // retorna true = "terminei, pode parar de observar"

      const body = document.getElementById(bodyId);
      const tocContainer = document.getElementById(tocId);
      if (!body || !tocContainer) return false;

      const h2Elements = body.querySelectorAll('h2');
      if (h2Elements.length === 0) {
        // Pode ser artigo vazio OU conteúdo ainda não montado.
        // Só consideramos "vazio definitivo" se o body já tem HTML.
        if (body.innerHTML.trim() === '') return false;

        tocContainer.innerHTML =
          '<p class="opacity-60 italic">// Nenhum índice disponível.</p>';
        return true;
      }

      let tocHtml = '';
      h2Elements.forEach((h2, index) => {
        if (!h2.id) h2.id = `heading-${index}`;
        tocHtml += `
          <a href="#${h2.id}" class="block py-1.5 px-2 rounded hover:bg-python-blue hover:text-white transition-colors truncate cursor-pointer">
            &gt; ${h2.innerText}
          </a>
        `;
      });
      tocContainer.innerHTML = tocHtml;
      return true;
    };

    // 1) Tenta no próximo frame (após commit do React)
    const raf = requestAnimationFrame(() => {
      if (buildToc()) return; // achou h2, ou artigo genuinamente vazio

      // 2) Fallback: observa o body até o HTML dos headings aparecer
      const body = document.getElementById(bodyId);
      if (!body) return;

      observer = new MutationObserver(() => {
        if (buildToc()) {
          observer?.disconnect();
          observer = null;
        }
      });
      observer.observe(body, { childList: true, subtree: true });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [currentView, selectedArticleId, content, bodyId, tocId]);
}