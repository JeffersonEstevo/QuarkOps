# Progresso da Aplicação (Progress Log)

## Status Atual
- **Fase Atual:** [Fase 8A Concluída: Hierarquia de Categorias no Backend]
- **Última Atualização:** 04/11/2026
- **Meta Imediata:** Conectar o frontend ao novo sistema de categorias (Passo 8B).

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
- [x] **Passo 6 (Segurança):** JWT implementado. `AuthProvider` gerencia `user`, `access` e `refresh` tokens (ADR-015). `httpAdapter` reescrito com `fetchWithAuth` (refresh automático com fila). `LoginGate` exige usuário/senha. Escritas desbloqueadas. UI de erro genérica implementada via `onError`.
- [x] **Passo 7 (Deploy):** Docker Compose unificado na raiz. Frontend multi-stage (Node build → Nginx). Backend com Gunicorn + `entrypoint.sh` (migrate, collectstatic, seed). Nginx como reverse proxy (`/api/` e `/admin/`) e serving de estáticos. Variáveis de ambiente via `.env` (ADR-016). Staging local em `http://localhost`.
- [x] **Passo 8A (Backend):** Modelagem de `Category` e `Subcategory` com slugs e ordenação. `Post` migrado de `CharField` para FKs (migração 0002). Serializers e ViewSets read-only (`/api/categories/`, `/api/subcategories/`). Validação de categoria↔subcategoria. Admin configurado com inline e autocomplete. Seed refatorado (ADR-017).


### 🟨 Em Andamento (Foco Atual)
- [ ] **Passo 8B (Frontend):** Integrar seleção dinâmica de categorias/subcategorias no CRM e filtros hierárquicos na Home.

### 🟥 A Fazer (Backlog de Evolução)
> Passos ainda **não iniciados**. Ao começar um item, mova-o para 🟨.
- [ ] **Passo 9 (Produção):** Deploy real (HTTPS, domínio, cookies httpOnly, backups).
- [ ] **Passo 10 (Polish):** Skeletons, paginação infinita, WYSIWYG no CRM.

### 📌 Backlog (não bloqueia a trilha de produção)
- [ ] **Autor no CRM:** Substituir o campo `author` de texto livre no `CrmModal` por uma exibição readonly do usuário logado (ou select de usuários). *(Previsto no Passo 8B ou 10)*
- [ ] **Segurança JWT:** Migrar tokens de `localStorage` para cookie `httpOnly` (proteção total contra XSS). *(Previsto no Passo 9 — Produção)*
- [ ] **Skeletons de Loading:** Adicionar UI de loading (hoje o estado `loading` do `useArticles` existe mas não é exibido). *(Previsto no Passo 10 — Polish)*
- [ ] **Paginação Infinita:** Suportar mais de 20 posts na Home (hoje o DRF pagina em `PAGE_SIZE=20`). *(Previsto no Passo 10 — Polish)*
- [ ] **WYSIWYG no CRM:** Substituir o textarea de HTML puro por um editor rico (TipTap, Quill). *(Previsto no Passo 10 — Polish)*
- [ ] **Backups Automáticos:** Cronjob diário de `pg_dump` com retenção (7/30 dias). *(Previsto no Passo 9 — Produção)*
- [ ] **Produção Real:** Domínio + HTTPS (Let's Encrypt/Caddy) + hardening (`SECURE_*`). *(Previsto no Passo 9 — Produção)*