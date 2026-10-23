# Progresso da Aplicação (Progress Log)

## Status Atual
- **Fase Atual:** [Fase 1 Concluída: Frontend Modularizado e Funcional + Camada de Serviços pronta]
- **Última Atualização:** 21/10/2026
- **Meta Imediata:** Iniciar a configuração do backend (Django + PostgreSQL).

## Quadro de Tarefas

### 🟩 Concluído (Frontend MVP)
- [x] [RNF-001] Definição da arquitetura inicial utilizando `LocalStorage`.
- [x] [RNF-002] Configuração do Tailwind CSS v4 (`@theme`, `@custom-variant`).
- [x] [RNF-003] Refatoração modular completa em React (`components`, `pages`, `hooks`, `contexts`).
- [x] [RF-004 ao RF-010] Leitura, TOC, listagem, filtros e busca.
- [x] [RF-011 & RF-012] Curtidas, comentários, copiar link e notificações Toast.
- [x] [RF-013] Autenticação local simulada no CRM (ADR-007).
- [x] [RF-014 ao RF-017] CRUD de artigos no CRM (criar, editar, excluir) e moderação de comentários.
- [x] [UX] Substituição de `window.prompt/confirm/alert` por modais próprios (`CodeBlockModal`, `ConfirmDialog`).
- [x] [UX] Highlight syntax no CRM (`highlight.js`) e correção de scroll do TOC.
- [x] Sincronização final dos arquivos de documentação (`docs/`).
- [x] **Passo 1 (Frontend):** Criada camada `services/api.js` com fachada + adapters (`localStorageAdapter` MVP, `httpAdapter` stub). `useArticles` migrado (contrato preservado) com `loading`/`error`. `storage.js` marcado como legado (ADR-009).
- [x] **Bug TOC:** Gerado índice resiliente a criação/edição de artigos via `requestAnimationFrame` + `MutationObserver` + `content` como dependência (ADR-010).

### 🟨 Em Andamento (Foco Atual)
- [ ] _Nada no frontend no momento._ Próximo foco: backend (Passo 2).

### 🟥 A Fazer (Próximos Passos — Trilha para Produção Backend)
- [ ] **Passo 2 (Backend):** Inicializar o projeto Django em `backend/` e conectar ao **PostgreSQL**.
- [ ] **Passo 3 (Backend):** Modelar `Post`, `Comment` e `User` no Django e expor endpoints (DRF).
- [ ] **Passo 4 (Backend):** Implementar highlight e sanitização no servidor (usar `Pygments` ou `markdown-it`).
- [ ] **Passo 5 (Integração):** Substituir o adaptador `LocalStorage` por chamadas `fetch` reais.
- [ ] **Passo 6 (Segurança):** Substituir a senha local por JWT/DRF Token Auth no `AuthProvider`.
- [ ] **Passo 7 (Deploy):** Docker Compose (PostgreSQL + Django + Frontend) e variáveis de ambiente.

### 📌 Backlog (não bloqueia a trilha de produção)
- [ ] **Bug 2 — Subtítulo "Engenheiro de Software & Maintainer" hardcoded** em `ArticleHeader.jsx`. Solução planejada: modelar `Author` (name/bio/avatar) no Django (Passo 3+) e tornar o subtítulo opcional no artigo. Enquanto isso, o texto fixo é mantido por decisão de escopo (Opção A).
- [ ] Migrar `AuthProvider` para `api.login()` (hoje usa senha hardcoded — ADR-007). Previsto no Passo 6.
- [ ] Sanitização de HTML (`DOMPurify` no frontend / `bleach` no backend) antes do `dangerouslySetInnerHTML` em produção (ADR-008).