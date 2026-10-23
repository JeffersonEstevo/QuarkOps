# Log de Decisões Técnicas (ADR — Architecture Decision Records)

## ADR-001: Uso de LocalStorage para MVP
- **Data:** 15/10/2026
- **Status:** Aceito
- **Contexto:** Precisamos de um protótipo funcional rápido rodando no navegador sem depender de infraestrutura complexa de backend.
- **Decisão:** Utilizaremos a API nativa do `localStorage` do navegador para persistir posts, comentários e curtidas temporariamente.
- **Consequências:** Desenvolvimento acelerado; ausência de banco relacional (migração futura para Django + PostgreSQL).

## ADR-002: Tailwind CSS (v4) com Vite
- **Data:** 15/10/2026
- **Status:** Aceito
- **Contexto:** Precisamos de agilidade na estilização e facilidade para a IA gerar layouts limpos e consistentes.
- **Decisão:** Adotar estritamente Tailwind CSS v4 integrado ao Vite, configurando variantes customizadas no arquivo `index.css` via `@theme` e `@custom-variant dark`.
- **Consequências:** Código enxuto, alta manutenibilidade visual e adaptação ao novo motor do Tailwind v4.

## ADR-003: Migração e Refatoração para Arquitetura Modular em React
- **Data:** 17/10/2026
- **Status:** Aceito
- **Contexto:** O projeto original era estático (HTML/JS). Limitava escalabilidade, gerenciamento de estados (tema/Toast) e manutenção.
- **Decisão:** Migrar completamente para React (Vite) com componentização modular (RNF-003).
- **Consequências:** Reatividade nativa, melhor manutenibilidade e paridade funcional completa.

## ADR-004: Separação de Contexts e Providers para Fast Refresh
- **Data:** 20/10/2026
- **Status:** Aceito
- **Contexto:** O Vite avisava "Fast refresh only works when a file only exports components".
- **Decisão:** Contexts (`createContext` + hooks) vivem em `src/contexts/`. Providers (componentes React) vivem em `src/components/providers/`, exportando apenas o default component.
- **Consequências:** Fast Refresh funciona perfeitamente sem warnings; separação conceitual melhora a clareza.

## ADR-005: Adoção de `@tailwindcss/typography` e Highlight.js
- **Data:** 20/10/2026
- **Status:** Aceito
- **Contexto:** O plugin `prose` não estava instalado (títulos e parágrafos ficavam sem estilo). Além disso, precisávamos colorir código sem depender do backend nesta fase.
- **Decisão:** Instalar `@tailwindcss/typography` (via `@plugin` no `index.css`) e `highlight.js` (no cliente, invocado no `CrmModal` via `CodeBlockModal`). As cores são forçadas com `!important` no `index.css` para vencer o `prose`.
- **Consequências:** Visual de leitura perfeito. Dependência extra no frontend (~5KB). O código é salvo no `localStorage` já com as tags `<span>` coloridas.

## ADR-006: Componente `CrmModal` unificado para Criar/Editar
- **Data:** 20/10/2026
- **Status:** Aceito
- **Contexto:** RF-014 e RF-015 compartilham formulários idênticos.
- **Decisão:** O `CrmModal` recebe `initialArticle`. Para evitar `useEffect` sincronizando estado (cascading renders), usamos a prop `key` no `App.jsx` (`${crmMode}-${id}-${count}`) para forçar o React a remontar o modal e resetar o `useState` corretamente.
- **Consequências:** Zero duplicação e zero warnings do React Compiler.

## ADR-007: Autenticação Local Simulada (RF-013)
- **Data:** 20/10/2026
- **Status:** Aceito
- **Contexto:** O MVP exige uma área protegida.
- **Decisão:** Usar `AuthProvider` + `LoginGate` com senha hardcoded (`admin123`) e persistência em `localStorage`.
- **Consequências:** UI de login pronta. **Dívida Técnica:** A senha é visível no bundle. Deve ser substituída por JWT do Django na fase de produção.

## ADR-008: Sanitização de HTML Pendente (DOMPurify)
- **Data:** 20/10/2026
- **Status:** Pendente para o Backend
- **Contexto:** O `dangerouslySetInnerHTML` renderiza o HTML salvo pelo CRM.
- **Decisão:** Como o autor é local, não sanitizamos agora. Em produção, o HTML deverá ser sanitizado antes de salvar ou renderizar, via `bleach` (Python) ou `DOMPurify` (React).

## ADR-009: Camada `services/api.js` com Adapters (LocalStorage → HTTP)
- **Data:** 21/10/2026
- **Status:** Aceito
- **Contexto:** O frontend MVP estava concluído com `localStorage` acessado diretamente por `useArticles` via `storage.js`. O Passo 5 (integração Django) exigiria reescrever o hook e todos os componentes dependentes. Precisávamos de uma fachada estável que permitisse trocar a fonte de dados sem tocar em UI.
- **Decisão:**
  - Criar `src/services/api.js` como **fachada única** consumida pela aplicação (contrato estável: `listArticles`, `getArticle`, `createArticle`, `updateArticle`, `deleteArticle`, `incrementLikes`, `incrementViews`, `postComment`, `deleteComment`, `login`).
  - Implementar dois adapters em `src/services/adapters/`:
    - `localStorageAdapter.js` (MVP) — reutiliza `storage.js` como persistência bruta.
    - `httpAdapter.js` (stub) — `fetch` contra Django/DRF, pronto para o Passo 5.
  - Selecionar adapter via `VITE_API_ADAPTER` (`local` default, `http` futuro). `VITE_API_URL` define a base da API HTTP (default `/api`).
  - `storage.js` vira **legado** (comentário de aviso), importado apenas por `localStorageAdapter.js`. Nenhum componente/hook importa `storage.js` diretamente.
  - **Comentários permanecem aninhados** em `article.comments[]` (shape atual do MVP), refletido no contrato (`postComment(articleId, comment)`, `deleteComment(articleId, commentId)`). Não há endpoints planos de comentário nesta fase.
  - **Hidratação de campos derivados** (`id`, `date`, `views`, `avatar`, `likes`) moveu do hook para o adapter — o hook apenas repassa `payload` cru.
  - `useArticles` migra para `api.*` e ganha `loading`/`error` (pré-requisito para `fetch` assíncrono). Contrato público **preservado 1:1**: `articles`, `featured`, `sortedByViews`, `filteredArticles`, `openArticle`, `createArticle`, `updateArticle`, `deleteArticle`, `postComment`, `deleteComment`, `likeArticle` + callbacks (`onOpen`, `onCreated`, `onUpdated`, `onDeleted`, `onComment`, `onCommentDeleted`).
- **Consequências:** Troca de backend é uma linha de env (`VITE_API_ADAPTER=http`). Nenhum componente sabe se os dados vêm de `localStorage` ou HTTP. `loading`/`error` existem mas não bloqueiam UI ainda (sem skeleton — fica para o Passo 5). `storage.js` será removido quando Django entrar em produção. **Dívida técnica:** `login()` existe no adapter mas o `AuthProvider` ainda usa senha hardcoded (ADR-007) — migração para `api.login()` é o Passo 6.

## ADR-010: Geração de TOC resiliente a criação/edição de artigos
- **Data:** 21/10/2026
- **Status:** Aceito
- **Contexto:** Após criar um artigo pelo CRM, o TOC (`#toc-container`) exibia `"// Nenhum índice disponível."` até que a página fosse recarregada. Causa: o `useToc` disparava `setTimeout(50)` reagindo a `selectedArticleId`, mas o commit do React com o novo `dangerouslySetInnerHTML` em `#art-detail-body` podia não ter ocorrido ainda — a corrida era ganha apenas no reload (artigo já no estado inicial). Além disso, o hook dependia só de `selectedArticleId`, então **editar** um artigo já aberto (mesmo `id`, `content` novo) não regenerava o TOC — bug latente.
- **Decisão:**
  - Adicionar `content` (string HTML) como dependência do `useEffect` no `useToc` — cobre criação **e** edição. Chamada no `App.jsx` passa `content: selectedArticle?.content`.
  - Substituir `setTimeout(50)` fixo por estratégia dupla: `requestAnimationFrame` (garante commit do React) + `MutationObserver` no `#art-detail-body` como fallback (aguarda os `<h2>` aparecerem em cenários lentos). Observer desconecta sozinho ao encontrar os headings — zero polling.
  - Mover a chamada de `useToc` no `App.jsx` para **depois** da declaração de `selectedArticle` (temporal dead zone do `const` — o uso anterior lançaria `ReferenceError`).
  - Contrato público do `useToc` preservado + `content` opcional (retrocompatível).
- **Consequências:** TOC renderiza de primeira em artigos criados/editados pelo CRM. Nenhum componente de artigo (`ArticleBody`, `TocSidebar`) precisou mudar. Zero `setInterval`. O custo do `MutationObserver` é desprezível (desconecta no primeiro `<h2>` encontrado).