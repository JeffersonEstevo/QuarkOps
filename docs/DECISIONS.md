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

## ADR-011: Stack Backend — Django 5.1 + DRF + JWT + PostgreSQL (Docker)
- **Data:** 23/10/2026
- **Status:** Aceito
- **Contexto:** O frontend MVP está concluído e a camada `services/api.js` está pronta para receber dados reais. Precisamos inicializar o backend respeitando a stack rígida do `SPEC.md` (Django + PostgreSQL) e preparar o terreno para o Passo 5 (integração).
- **Decisão:**
  - **Django 5.1** como framework backend, projeto nomeado `core` (convenção: evita colisão com a pasta `backend/`).
  - **App único `api/`** para todas as entidades do domínio (`Post`, `Comment`, `User`). Blog com 3 entidades não justifica split em múltiplos apps — refatora-se se crescer.
  - **Django REST Framework** (`djangorestframework`) para endpoints.
  - **JWT via `djangorestframework-simplejwt`** — alinha com ADR-007 e com o `httpAdapter.js` do frontend (que já usa `Authorization: Bearer <token>`).
  - **PostgreSQL 16-alpine via Docker Compose** (`backend/docker-compose.yml`). Porta 5432, volume persistente nomeado (`quarkops_pgdata`), healthcheck `pg_isready` para evitar race condition no `migrate`.
  - **`python-dotenv`** para carregar `.env` em `settings.py` (mantém segredos fora do versionamento).
  - **`django-cors-headers`** configurado para permitir `localhost:5173` (Vite dev).
  - **`psycopg[binary]` v3** como driver Postgres (binário pré-compilado, evita compilar C no Windows).
  - **Estrutura final:** `backend/{manage.py, core/, api/, requirements.txt, docker-compose.yml, .env, .gitignore}`.
  - **Escopo do Passo 2 é infraestrutura apenas:** sem models, sem endpoints, sem serializers. Migrations default do Django (auth, sessions, admin) aplicadas no Postgres já.
- **Consequências:** Backend sobe com `python manage.py runserver`, aponta para Postgres do Docker, e o Django Admin é acessível em `/admin/`. Modelagem de domínio (`Post`, `Comment`) fica para o Passo 3. `docker-compose.yml` está em `backend/` por enquanto — no Passo 7 (deploy), unificamos na raiz do monorepo com o frontend.

## ADR-012: Modelagem de Domínio — User Customizado, UUIDs e Comentário Híbrido
- **Data:** 27/10/2026
- **Status:** Aceito
- **Contexto:** Passo 3 exige modelar `Post`, `Comment` e `User`. Decisões estruturais aqui (mudar depois = migrações dolorosas). O frontend MVP usava IDs string (`"art-1"`), autores como string livre (`"Guido Dev"`) e comentários anônimos. O RF-006 exige comentários sem login. O backlog (Bug 2) pedia modelar `Author` com `bio`/`avatar` para resolver o subtítulo hardcoded.
- **Decisão:**
  - **`User` customizado** (`AbstractUser` em `api.User`) com `id: UUID`, `display_name`, `bio`, `avatar_url`, `role`. Definido **antes** do primeiro `migrate` (via `AUTH_USER_MODEL = "api.User"`) — banco recriado, zero dados de domínio perdidos. Resolve o Bug 2 de raiz.
  - **`Post.author` = FK para `User`** (não string). Autor é entidade real. O CRM admin (staff) cria posts autenticado. `on_delete=CASCADE`.
  - **`Comment` híbrido:** `author_name: CharField` (sempre preenchido — RF-006) + `author_user: FK(User, null=True)` (preenchido só em comentários autenticados, futuro Passo 6). `on_delete=SET_NULL` (comentário sobrevive se o usuário for deletado). Zero atrito no Passo 5; "comentário verificado" no futuro é trivial.
  - **Todos os IDs são `UUID`** (`uuid.uuid4`). URLs não enumeráveis (compartilhamento — RF-012). Frontend já aceita IDs string.
  - **`Post.tags = JSONField`** (lista de strings). Simples e suficiente — `ArrayField` do Postgres exigiria dependência extra.
  - **`Post.views` e `Post.likes`** como `PositiveIntegerField` no próprio Post. Incrementos atômicos via `save(update_fields=["likes"])`.
  - **`Post.read_time` como `CharField`** (string formatada, ex: `"7 min de leitura"`). Coerente com o frontend MVP, que exibe direto.
  - **Permissões:**
    - `PostViewSet`: `IsAdminOrReadOnly` — GET público, escrita só staff.
    - Ações `like` e `view`: `AllowAnyForCreateReadAuth` — públicos.
    - `CommentViewSet`: apenas `DELETE` exposto (moderação, staff). Criação/listagem via `/api/posts/{id}/comments/`.
  - **Rotas DRF** (`DefaultRouter`): `/api/posts/`, `/api/posts/{id}/`, `/api/posts/{id}/like/`, `/api/posts/{id}/view/`, `/api/posts/{id}/comments/`, `/api/comments/{id}/` (DELETE).
  - **Comando `seed_articles`** (management command) para popular autores + 3 artigos iniciais. Idempotente (usa `get_or_create`).
- **Consequências:** Backend expõe o contrato de `services/api.js` quase 1:1 (Passo 5 só ajusta o adapter HTTP). Bug 2 resolvido. `author_user: null` em comentários anônimos permite badge "verificado" no futuro sem migração. UUID em todas as entidades — zero colisão em URLs compartilhadas. Seed permite testar `/api/posts/` imediatamente. **Dívida técnica:** `PostViewSet` ainda não tem autenticação JWT real ativa (Passo 6); o CRM continuará usando `admin123` no frontend até lá.


## ADR-013: Sanitização de HTML com `nh3` no `Post.save()`
- **Data:** 31/10/2026
- **Status:** Aceito
- **Contexto:** O `Post.content` é HTML arbitrário vindo do CRM. O ADR-008 registrou a dívida de sanitização como pendente. `highlight.js` gera `<span class="...">` no cliente, que precisa ser preservado. Precisávamos de uma solução server-side que remova XSS sem quebrar a formatação legítima.
- **Decisão:**
  - **Biblioteca:** `nh3` (wrapper Python do `ammonia` em Rust). Mais rápido e ativamente mantido que `bleach` (modo manutenção desde 2023).
  - **Estratégia de highlight:** manter `highlight.js` no cliente. O backend **apenas sanitiza** — o HTML chega do CRM já com spans coloridos pelo `highlight.js`, e o `nh3` preserva `class` em `span`/`div`/`pre`/`code` (necessário para Tailwind e highlight).
  - **Ponto de sanitização:** `Post.save()` em `models.py`. Garante que **nada** sujo entra no banco, independente de como o `Post` foi criado (API, admin, shell, script).
  - **Config permissiva:** lista explícita de tags (`ALLOWED_TAGS`) e atributos (`ALLOWED_ATTRIBUTES`) cobrindo tudo que o CRM gera. `class` liberado em qualquer tag (`"*": {"class"}`). `id` liberado em `h2`/`h3`/`h4` (TOC). `href`/`src` validados por esquema (`http`, `https`, `mailto`).
  - **Removidos por padrão:** `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, atributos `on*` (event handlers), `style` (injeção CSS), URLs `javascript:`/`data:`.
  - **Links externos:** `rel="noopener noreferrer"` adicionado automaticamente via `link_rel`. ⚠️ **Não listar `rel` em `ALLOWED_ATTRIBUTES["a"]`** — o `ammonia` entra em pânico (Rust panic) se você definir `rel` manualmente e usar `link_rel` ao mesmo tempo.
  - **Migração de dados:** comando `sanitize_existing_posts` (management command) com `--dry-run`, para re-salvar posts antigos (aplicação manual, não automática).
- **Consequências:** Banco só contém HTML seguro. Frontend pode renderizar via `dangerouslySetInnerHTML` com confiança. `highlight.js` continua no cliente (Passo 5 pode considerar remoção futura, mas não é prioridade). Custo de CPU no `save()` é desprezível (`nh3` é Rust, ~microssegundos por post). **Dívida técnica:** posts antigos (se houver) precisam rodar `sanitize_existing_posts` manualmente após revisão.

## ADR-014: Integração Frontend ↔ Backend — Mapeamento no Adapter, Auth Adiada
- **Data:** 02/11/2026
- **Status:** Aceito
- **Contexto:** O backend Django expõe os endpoints do contrato de `services/api.js` (Passo 3). O frontend precisa consumir dados reais. Porém, o shape do backend difere do esperado pelo frontend: `author` é objeto (`{display_name, avatar_url, bio, role}`), `created_at` é ISO 8601, campos em `snake_case` (`read_time`, `author_name`). O `AuthProvider` ainda usa senha local (`admin123` — ADR-007), e o endpoint `/api/token/` só existe no Passo 6.
- **Decisão:**
  - **Adapter HTTP com URL absoluta.** `VITE_API_URL=http://localhost:8000/api` em `frontend/.env.local`. CORS já configurado no backend (`localhost:5173`). Vite proxy **não** é usado — reservado para o deploy do Passo 7 (Nginx/Caddy reverse proxy real).
  - **Mapeamento no `httpAdapter.js`.** Toda tradução de shape (backend → frontend) vive no adapter, não em `useArticles` nem no backend. Motivo: o adapter é a **fronteira** entre "transporte" e "domínio do frontend". Se o backend mudar o shape, **só o adapter muda**. `useArticles` e componentes continuam "limpos".
  - **Funções de mapeamento:** `mapPost()` (backend post → frontend article), `mapComment()` (backend comment → frontend comment), `formatDate()` (ISO → "Hoje" / "02 Nov 2026"), `formatRelativeDate()` (ISO → "Há 2 horas"), `getInitials()` (fallback para avatar).
  - **Shape achatado (compatível com o MVP):** `author` (string), `avatar` (string), `date` (string formatada), `readTime` (string). Campos extras do backend (`authorBio`, `authorRole`) são expostos **junto**, para resolver o Bug 2 (`ArticleHeader` usa `article.authorBio || 'Engenheiro...'`).
  - **Paginação:** `listArticles()` detecta se DRF retorna `{results: [...]}` ou array direto. Com `PAGE_SIZE=20`, mais de 20 posts exigiriam paginação infinita (fora do escopo — dívida futura).
  - **`AuthProvider` NÃO migra no Passo 5.** `VITE_API_ADAPTER=http` + `admin123` local. Login JWT real é **Passo 6**.
  - **Escritas bloqueadas por 401** (esperado). `PostViewSet` exige staff autenticado. O frontend **não tem UI de erro** ainda (`error` do `useArticles` existe, mas nenhum componente consome). Toast de erro e mensagens amigáveis ficam para o Passo 6 (junto com JWT), quando erros deixam de ser 401 genérico e passam a ser "sessão expirada" etc.
  - **Validação tripla:** (1) leitura HTTP com backend real; (2) escritas bloqueadas por 401; (3) fallback `localStorage` (switch `VITE_API_ADAPTER=local`).
  - **`login(credentials)`** no `httpAdapter` é stub: lança `Error('Login JWT será implementado no Passo 6...')`. Não é chamado por nenhum componente (o `AuthProvider` ainda usa senha hardcoded).
- **Consequências:** Backend é consumido em modo leitura. Curtidas, views e comentários anônimos **funcionam** via HTTP (auth público). Escritas de posts (`createArticle`, `updateArticle`, `deleteArticle`) e moderação de comentários (`deleteComment`) retornam `401` — comportamento **correto e esperado** até o Passo 6. O adapter abstrai o shape, então o Passo 6 **não toca em `httpAdapter`** (só adiciona o header `Authorization`). Bug 2 resolvido no frontend via `authorBio` (o backend já tinha o dado desde o Passo 3). **Dívida técnica:** UI de erro (toast genérico + mensagens amigáveis) fica para o Passo 6; paginação infinita para quando houver > 20 posts.

## ADR-015: Autenticação JWT no Frontend com Refresh Automático
- **Data:** 03/11/2026
- **Status:** Aceito
- **Contexto:** O frontend precisava desbloquear as escritas (CRUD de posts e moderação), substituindo a senha hardcoded (`admin123` - ADR-007) por autenticação real no Django.
- **Decisão:**
  - **Endpoints:** SimpleJWT padrão (`POST /api/token/`, `POST /api/token/refresh/`) + endpoint customizado `GET /api/users/me/` para retornar os dados do usuário logado.
  - **Persistência:** Tokens salvos em `localStorage` via `authStorage.js`. (Dívida Técnica: vulnerável a XSS, mitigado pelo `nh3` no Passo 4. Migração para cookie `httpOnly` no Passo 7).
  - **Refresh Automático:** O `fetchWithAuth` no `httpAdapter.js` intercepta respostas `401`, solicita um novo `access` usando o `refresh` token, e refaz a requisição original de forma transparente (Fila de subscribers evita múltiplos refreshes simultâneos).
  - **Expiração:** `access` dura 5 minutos, `refresh` dura 1 dia.
  - **UI de Erro:** O hook `useArticles` recebeu a prop `onError`, conectada ao `triggerToast` no `App.jsx`, para exibir falhas de rede/auth ao usuário.
  - **LoginGate:** Agora exige `username` e `password`. Validação server-side (o frontend rejeita usuários com `is_staff === false` ou `is_superuser === false`).
- **Consequências:** O CRM agora é uma área verdadeiramente protegida. O fluxo de expiração de token é invisível para o usuário logado. O `AuthProvider` gerencia o estado do usuário (`user`) e se comunica com a API. **Backlog criado:** O autor dos posts agora é o usuário logado (FK), mas o `CrmModal` ainda não exibe essa informação (campo "Autor" no form foi mantido por compatibilidade visual, mas ignorado pelo backend). Categorias dinâmicas e subcategorias foram movidas para o Passo 7 (ver backlog).

## ADR-016: Deploy Unificado com Docker Compose (Nginx + Gunicorn)
- **Data:** 03/11/2026
- **Status:** Aceito
- **Contexto:** O backend e o banco rodavam em Docker (dev), mas o frontend rodava no Vite (fora do Docker). Isso exigia CORS configurado, Vite proxy, e dois comandos separados para subir tudo. Precisávamos de um ambiente de "staging" reproduzível, simulando produção real, que pudesse ser iniciado com um único comando.
- **Decisão:**
  - **Docker Compose unificado na raiz** (`docker-compose.yml`): orquestra `db` (Postgres 16), `backend` (Django + Gunicorn), `frontend` (Nginx).
  - **Backend em Gunicorn** (não `runserver`): imagem `python:3.13-slim`, `entrypoint.sh` roda `migrate` + `collectstatic` + `seed_articles` + `gunicorn core.wsgi:application`.
  - **Frontend build multi-stage:** Stage 1 (`node:20-alpine`) roda `npm ci` + `npm run build`; Stage 2 (`nginx:1.27-alpine`) serve o `dist/`.
  - **Nginx como reverse proxy:** serve `/` (React estático), faz `proxy_pass` para `/api/` e `/admin/` (backend Gunicorn), e serve `/static/` do Django via volume compartilhado (`quarkops_static`).
  - **Variáveis de ambiente via `.env` na raiz:** `DJANGO_SECRET_KEY`, `POSTGRES_PASSWORD`, `CORS_ALLOWED_ORIGINS`, etc. `.env.example` commitado (modelo), `.env` ignorado.
  - **Ambiente de Staging:** `DJANGO_DEBUG=False`, mas logs detalhados no console do container. HTTPS desabilitado (staging local em `http://localhost`). Linhas de segurança para produção (HTTPS, HSTS, cookies secure) comentadas no `settings.py`, prontas para ativar no Passo 8 (domínio real).
  - **Coexistência de fluxos:**
    - **Dev local:** backend `runserver` (pasta `backend/`) + frontend `npm run dev` (pasta `frontend/`) + Postgres no `backend/docker-compose.yml`. Para desenvolvimento rápido com hot reload.
    - **Deploy unificado:** `docker compose up --build` na raiz. Para simular produção.
  - **Volumes nomeados:** `quarkops_pgdata` (dados do Postgres) e `quarkops_static` (estáticos compartilhados entre backend e Nginx).
- **Consequências:** Um único comando sobe todo o QuarkOps. CORS desaparece (mesma origem `localhost:80`). Backend roda em modo de produção (Gunicorn). Estáticos servidos pelo Nginx (performance). **Dívida técnica:** backups automáticos ficam para o Passo 8 (comando manual documentado). HTTPS/domínio real também (Passo 8).

## ADR-017: Hierarquia de Categorias (2 níveis)
- **Data:** 04/11/2026
- **Status:** Aceito
- **Contexto:** O `Post.category` era `CharField` (texto livre), limitando a organização a categorias hardcoded no frontend. O objetivo é criar tutoriais estruturados (ex: `Programação > Python`), permitindo que o admin crie categorias e subcategorias dinamicamente sem deploy. Categorias podem existir sem subcategorias (ex: `Matemática`).
- **Decisão:**
  - **Modelagem em 2 níveis:** `Category` (nível 1) e `Subcategory` (nível 2, FK para `Category`).
  - **Post:** FK obrigatória para `Category` e FK opcional para `Subcategory` (`null=True`). Um post pode ir direto na categoria.
  - **Validação:** O model `Post.clean()` e o `PostSerializer` validam que a `Subcategory` pertence à `Category` escolhida.
  - **Slugs e Ordenação:** Adicionado `slug` (auto-gerado) para URLs futuras e `order` para ordenar o menu manualmente no Admin.
  - **Proteção:** `on_delete=PROTECT` na FK do Post impede deletar categorias com posts. `CASCADE` nas subcategorias (se categoria for deletada, subcategorias somem, mas o Admin exige esvaziar posts antes).
  - **Tags:** Permanecem como `JSONField` (texto livre) para granularidade fina e busca, separadas da hierarquia.
  - **Gestão:** A criação/edição de categorias é feita exclusivamente via Django Admin (ADR-017), mantendo o CRM focado em conteúdo.
  - **Migração (0002):** Script manual em 3 fases: cria tabelas, popula com dados iniciais, adiciona FK temporária, migra posts antigos (CharField → FK) e remove o campo antigo.
- **Consequências:** Backend preparado para trilhas infinitas (o usuário cria a hierarquia no Admin). Frontend (Passo 8B) consumirá via `/api/categories/` (com subcategorias aninhadas) e `/api/subcategories/`. A migração preservou todos os posts existentes. O seed foi refatorado para ser auto-suficiente (cria categorias/subcategorias se não existirem).

## ADR-018: Hierarquia de Categorias no Frontend (Filtros e CRM)
- **Data:** 04/11/2026
- **Status:** Aceito
- **Contexto:** O backend do Passo 8A entregou a API de categorias dinâmicas. O frontend precisava consumir essa hierarquia sem quebrar o design existente, permitindo filtros na Home e selects no CRM.
- **Decisão:**
  - **Adapter e Hooks:** `httpAdapter` (e `localStorageAdapter` como fallback) agora expõem `listCategories()` e `listSubcategories()`. Um novo hook `useCategories` faz o cache em memória (evita requisições repetidas).
  - **Filtros na Home (`Design A`):** Categorias aparecem em uma linha horizontal. Ao selecionar uma categoria, uma segunda linha expande com as subcategorias dela (ex: `Programação` -> `Python`, `JavaScript`). A opção "Tudo em [Categoria]" reseta o filtro para a categoria pai.
  - **CRM:** Os selects de categoria e subcategoria agora são dinâmicos (alimentados pelo backend). O campo "Autor" foi mantido como texto livre (dívida técnica registrada, para ser resolvida no Passo 9/10).
  - **Breadcrumb (`Design A`):** No `ArticleHeader`, a categoria e subcategoria são exibidas como breadcrumb clicável (`Programação › Python`). Clicar redireciona para a Home com o filtro aplicado.
  - **Remoção de Hardcode:** `CATEGORIES_FOR_FORM` e `DEFAULT_CATEGORY` foram removidos de `constants.js`.
  - **Payload do CRM:** O `CrmModal` agora envia `category_id` e `subcategory_id` (UUIDs) além dos nomes (para compatibilidade com o modo `localStorage`).
  - **Unificação de Componentes:** O arquivo `pages/HomePage.jsx` (legado) foi substituído pelo novo componente em `components/home/HomePage.jsx` (que já possuía a lógica correta de filtro por slug).
- **Consequências:** O QuarkOps agora suporta trilhas de conteúdo reais (Programação -> Python, Linux -> Ubuntu). O frontend é totalmente agnóstico às categorias (o admin pode criar novas no Django Admin e elas aparecerão imediatamente no CRM e na Home). **Bug resolvido:** conflito de importação do `HomePage` (o App importava o arquivo legado que não usava os slugs).