# QuarkOps — Estrutura e Arquitetura Frontend

## 1. Visão Geral
O frontend foi refatorado para uma arquitetura modular baseada em React (Vite) e Tailwind CSS (v4). O estado global (tema, toast, autenticação) é gerenciado via **Context API**, enquanto o estado de dados (artigos) é centralizado em um **Custom Hook** (`useArticles`), preparando o terreno para a futura integração com o backend em Django.

## 2. Árvore de Diretórios (`src/`)
```text
src/
├── components/
│   ├── article/
│   ├── crm/
│   ├── home/
│   ├── layout/
│   ├── providers/
│   └── ui/
├── contexts/
├── hooks/
├── pages/
├── services/                # 🆕 Camada de dados (fachada + adapters)
│   ├── adapters/
│   │   ├── localStorageAdapter.js   # MVP
│   │   └── httpAdapter.js           # Stub Django/DRF (Passo 5)
│   └── api.js               # Fachada única consumida pela aplicação
├── utils/                   # constants.js, storage.js (legado)
├── App.jsx
└── main.jsx
```

## 3. Fluxo de Dados e Estado
- **Navegação (`App.jsx`):** `currentView`, `selectedArticleId`, `activeCategory`, `searchTerm`.
- **Autenticação (`AuthProvider`):** `isCrmAuthenticated`, `login()`, `logout()`.
- **CRUD de Dados (`useArticles` → `services/api.js`):** `useArticles` consome a fachada `api` (não `localStorage` diretamente). O adapter ativo (`local` por padrão, `http` no futuro) é escolhido via `VITE_API_ADAPTER`. No Passo 5, `httpAdapter` reescreve o shape do backend (snake_case, author objeto) para o shape do frontend (camelCase, author string) via `mapPost`/`mapComment` (ADR-014). Trocar de backend não toca em hook nem em componente.
- **Apresentação:** A maior parte dos componentes (ex: `CommentItem`, `ArticleCard`) são "burros" (recebem props e renderizam), enquanto `App.jsx` e `ArticlePage` fazem a ponte com os hooks e contexts.

## 4. Pontos de Integração com o Backend (Próximos Passos)

A fachada já existe. Para plugar o Django:
1. Implementar os endpoints DRF conforme o contrato de `services/api.js`.
2. Definir `VITE_API_ADAPTER=http` e `VITE_API_URL=<base>` no `.env.local` do frontend.
3. Substituir a validação do `AuthProvider` por `api.login()` (POST /api/token/) — Passo 6.
4. Adicionar estados de `loading`/`error` na UI (skeletons, toasts de erro) — os dados já estão expostos pelo hook.
5. Remover `storage.js` e `localStorageAdapter.js` quando o backend estiver estável em produção.

## 5. Backend (Django + PostgreSQL)

### Arquitetura atual (após Passo 3)

- **Projeto Django:** `core/` (settings, urls, wsgi, asgi).
- **App de domínio:** `api/` com **models** (`User`, `Post`, `Comment`), **serializers**, **views** (ViewSets + ações customizadas), **urls** (DefaultRouter), **permissions** (`IsAdminOrReadOnly`, `AllowAnyForCreateReadAuth`) e **sanitizers** (`nh3` com config permissiva — ADR-013).
- **Comando de seed:** `python manage.py seed_articles` (idempotente — popula autores e 3 artigos iniciais).
- **Comando de migração de sanitização:** `python manage.py sanitize_existing_posts [--dry-run]` (aplica `nh3` em posts antigos — ADR-013).
- **Banco:** PostgreSQL 16 via Docker Compose (`quarkops_db`, porta 5432, volume `quarkops_pgdata`).
- **Autenticação:** SimpleJWT instalado e configurado. O endpoint `/api/token/` será criado no Passo 6.
- **CORS:** `localhost:5173` (Vite dev) liberado via `django-cors-headers`.

### Integração com o frontend (Passo 5)

- **Leitura:** `GET /api/posts/`, `GET /api/posts/{id}/`, `GET /api/posts/{id}/comments/` — públicos, consumidos pelo frontend via `httpAdapter`.
- **Escrita pública:** `POST /api/posts/{id}/like/`, `POST /api/posts/{id}/view/`, `POST /api/posts/{id}/comments/` — funcionam sem auth (RF-006, RF-011).
- **Escrita protegida (staff):** `POST/PUT/DELETE /api/posts/`, `DELETE /api/comments/{id}/` — retornam `401` até o Passo 6 (JWT).
- **Mapeamento no adapter:** `frontend/src/services/adapters/httpAdapter.js` traduz `snake_case` → `camelCase`, `author` objeto → string + `avatar` derivada, `created_at` ISO → string formatada (ADR-014).
- **`AuthProvider`:** permanece com senha local (`admin123`) até o Passo 6. `httpAdapter.login()` é stub.

### Endpoints implementados (Passo 3)

| Método em `services/api.js` | Endpoint Django | Auth |
|---|---|---|
| `listArticles()` | `GET /api/posts/` | público |
| `getArticle(id)` | `GET /api/posts/:id/` | público |
| `createArticle(data)` | `POST /api/posts/` | staff |
| `updateArticle(id, data)` | `PUT /api/posts/:id/` | staff |
| `deleteArticle(id)` | `DELETE /api/posts/:id/` | staff |
| `incrementLikes(id)` | `POST /api/posts/:id/like/` | público |
| `incrementViews(id)` | `POST /api/posts/:id/view/` | público |
| `postComment(articleId, c)` | `POST /api/posts/:id/comments/` | público |
| `deleteComment(articleId, cId)` | `DELETE /api/comments/:cId/` | staff |
| `login(creds)` | `POST /api/token/` (Passo 6) | — |
