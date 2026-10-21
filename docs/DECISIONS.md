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