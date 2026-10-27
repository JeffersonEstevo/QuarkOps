# Progresso da Aplicação (Progress Log)

## Status Atual
- **Fase Atual:** [Fase 3 Concluída: Domínio modelado + Endpoints DRF operacionais]
- **Última Atualização:** 27/10/2026
- **Meta Imediata:** Implementar highlight e sanitização no servidor (Passo 4).

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
- [x] **Passo 2 (Backend):** Projeto Django inicializado em `backend/` (`core/` + app `api/`), DRF + SimpleJWT + CORS configurados, PostgreSQL 16 via Docker Compose, migrations default aplicadas, Django Admin acessível (ADR-011).
- [x] **Passo 3 (Backend):** Modelados `User` (AbstractUser com display_name/bio/avatar_url/role), `Post` (FK author, tags JSON, views/likes) e `Comment` (híbrido: author_name + author_user opcional). UUIDs em todas as entidades. ViewSets DRF com permissões finas (`IsAdminOrReadOnly`, `AllowAnyForCreateReadAuth`). Ações `like`/`view`/`comments` customizadas. Seed idempotente (`seed_articles`). Comentário anônimo funcional (RF-006) (ADR-012).

### 🟨 Em Andamento (Foco Atual)
- [ ] **Passo 4 (Backend):** Implementar highlight e sanitização de HTML no servidor.

### 🟥 A Fazer (Trilha para Produção Backend)
> Passos ainda **não iniciados**. Ao começar um item, mova-o para 🟨. Ao concluir, mova-o para 🟩.
- [ ] **Passo 5 (Integração):** Substituir o adaptador `LocalStorage` por chamadas `fetch` reais.
- [ ] **Passo 6 (Segurança):** Substituir a senha local por JWT Auth no `AuthProvider`.
- [ ] **Passo 7 (Deploy):** Docker Compose (PostgreSQL + Django + Frontend) e variáveis de ambiente.

### 📌 Backlog (não bloqueia a trilha de produção)
- [ ] **Bug 2 (resolvido no backend):** O `User.bio` existe agora (ADR-012), mas o frontend ainda não consome. No Passo 5, trocar o subtítulo hardcoded de `ArticleHeader.jsx` por `article.author.bio` (com fallback para `'Engenheiro de Software & Maintainer'` se vazio).
- [ ] Migrar `AuthProvider` para `api.login()` (hoje usa senha hardcoded — ADR-007). Previsto no Passo 6.
- [ ] Sanitização de HTML (`DOMPurify` no frontend / `bleach` no backend) antes do `dangerouslySetInnerHTML` em produção (ADR-008).