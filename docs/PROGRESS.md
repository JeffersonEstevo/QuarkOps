# Progresso da Aplicação (Progress Log)

## Status Atual
- **Fase Atual:** [Fase 5 Concluída: Integração Frontend ↔ Backend (leitura) operacional]
- **Última Atualização:** 02/11/2026
- **Meta Imediata:** Migrar `AuthProvider` para JWT real (Passo 6).

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
- [x] **Passo 4 (Backend):** Sanitização server-side com `nh3` (ADR-013). `Post.save()` aplica `sanitize_html()` antes de persistir. `highlight.js` mantido no cliente. Comando `sanitize_existing_posts` com `--dry-run` para migração manual. Config preserva `class` (Tailwind/highlight) e `id` de headings (TOC), remove `<script>`/`onerror`/`style`/`javascript:`, adiciona `rel="noopener noreferrer"` em links externos.
- [x] **Passo 5 (Integração):** `httpAdapter.js` reescrito com mapeamento backend→frontend (`mapPost`, `mapComment`, `formatDate`, `formatRelativeDate`, `getInitials`). `frontend/.env.local` com `VITE_API_ADAPTER=http`. Leitura HTTP funcionando (posts, comentários, curtidas, views). Escritas bloqueadas por `401` (backend protegido). Fallback `localStorage` intacto. Bug 2 resolvido no frontend via `authorBio` (ADR-014).

### 🟨 Em Andamento (Foco Atual)
- [ ] **Passo 6 (Segurança):** Migrar `AuthProvider` para JWT real (`POST /api/token/`) e adicionar UI de erro mínima (toast) para falhas de escrita.

### 🟥 A Fazer (Trilha para Produção Backend)
> Passos ainda **não iniciados**. Ao começar um item, mova-o para 🟨. Ao concluir, mova-o para 🟩.
- [ ] **Passo 7 (Deploy):** Docker Compose (PostgreSQL + Django + Frontend) e variáveis de ambiente.
- [ ] **Passo 8 (Polish):** UI de erro (toast + mensagens amigáveis), paginação infinita (> 20 posts), estados de `loading` com skeletons.

### 📌 Backlog (não bloqueia a trilha de produção)
- [ ] Migrar `AuthProvider` para `api.login()` (hoje usa senha hardcoded — ADR-007). Previsto no Passo 6.