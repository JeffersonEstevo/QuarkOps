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
│   │   └── HomePage.jsx     # Filtros hierárquicos (Categoria -> Subcategoria)
│   ├── layout/
│   ├── providers/
│   └── ui/
├── contexts/
├── hooks/
│   └── useCategories.js     # 🆕 Carrega categorias do backend (com cache)
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
- **Autenticação (`AuthProvider`):** Gerencia tokens JWT (`access`, `refresh`) no `localStorage` via `authStorage.js`. O `httpAdapter` intercepta `401` e faz refresh automático (`fetchWithAuth`). O `LoginGate` autentica contra `POST /api/token/` e valida `is_staff`.
- **Tratamento de Erros:** O hook `useArticles` recebe um callback `onError` que dispara `triggerToast` no `App.jsx`. Erros de auth, rede ou validação são exibidos ao usuário.
- **CRUD de Dados (`useArticles` → `services/api.js`):** `useArticles` consome a fachada `api` (não `localStorage` diretamente). O adapter ativo (`local` por padrão, `http` no futuro) é escolhido via `VITE_API_ADAPTER`. No Passo 5, `httpAdapter` reescreve o shape do backend (snake_case, author objeto) para o shape do frontend (camelCase, author string) via `mapPost`/`mapComment` (ADR-014). Trocar de backend não toca em hook nem em componente.
- **Apresentação:** A maior parte dos componentes (ex: `CommentItem`, `ArticleCard`) são "burros" (recebem props e renderizam), enquanto `App.jsx` e `ArticlePage` fazem a ponte com os hooks e contexts.
- **Categorias (`useCategories` → `api.listCategories`):** Carrega a árvore de categorias no mount. Cache em memória evita refetch. Usado pelo `HomePage` (filtros) e `CrmModal` (selects).
- **Navegação Hierárquica:** `activeCategory` (slug) e `activeSubcategory` (slug) vivem no `App.jsx` e são passados para `useArticles` (filtro) e `HomePage` (UI).

## 4. Pontos de Integração com o Backend (Próximos Passos)

A fachada já existe. Para plugar o Django:
1. Implementar os endpoints DRF conforme o contrato de `services/api.js`.
2. Definir `VITE_API_ADAPTER=http` e `VITE_API_URL=<base>` no `.env.local` do frontend.
3. Substituir a validação do `AuthProvider` por `api.login()` (POST /api/token/) — Passo 6.
4. Adicionar estados de `loading`/`error` na UI (skeletons, toasts de erro) — os dados já estão expostos pelo hook.
5. Remover `storage.js` e `localStorageAdapter.js` quando o backend estiver estável em produção.

## 5. Backend (Django + PostgreSQL)

### Arquitetura atual (após Passo 8A)

- **Projeto Django:** `core/` (settings, urls, wsgi, asgi).
- **App de domínio:** `api/` com **models** (`User`, `Category`, `Subcategory`, `Post`, `Comment`), **serializers**, **views** (ViewSets), **permissions**, **sanitizers** (`nh3`).
- **Hierarquia de categorias:** `Category` (nível 1) + `Subcategory` (nível 2, FK). Posts têm `category` (FK obrigatória) e `subcategory` (FK opcional). Validação de pertencimento via `clean()` e serializer (ADR-017).
- **Endpoints adicionais:** `GET /api/categories/` (com subcategorias aninhadas) e `GET /api/subcategories/?category_slug=...` (read-only público).
- **Admin:** gestão de categorias/subcategorias via inline, autocomplete no `PostAdmin`.
- **Banco:** PostgreSQL 16 via Docker Compose.
- **Autenticação:** JWT (SimpleJWT). `/api/users/me/` disponível.
- **CORS:** liberado para `localhost` (dev) e mesma origem no deploy (Nginx).

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

### Endpoints de categorias (Passo 8A)

| Método | Endpoint | Auth |
|---|---|---|
| `GET` | `/api/categories/` | público |
| `GET` | `/api/categories/:slug/` | público |
| `GET` | `/api/subcategories/` | público |
| `GET` | `/api/subcategories/?category_slug=:slug` | público |
| `GET` | `/api/subcategories/:slug/` | público |

**Shape de resposta (`/api/categories/`):**
```json
[
  {
    "id": "uuid",
    "name": "Programação",
    "slug": "programacao",
    "order": 1,
    "subcategories": [
      {"id": "uuid", "name": "Python", "slug": "python", "category": "uuid", "order": 1}
    ]
  }
]
```
---
## 6. Deploy (Docker Compose)

### Arquitetura de produção (staging)

```
┌─────────────┐    porta 80    ┌──────────────┐
│  Navegador  │ ─────────────> │    Nginx     │
└─────────────┘                │  (frontend)  │
                               └──────┬───────┘
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                     ▼                ▼                ▼
              / (React SPA)    /api/ (proxy)    /static/ (vol)
                                 │
                                 ▼
                          ┌──────────────┐
                          │   Gunicorn   │
                          │  (backend)   │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │  PostgreSQL  │
                          │    (db)      │
                          └──────────────┘
```

### Containers

| Container | Imagem | Porta externa | Função |
|---|---|---|---|
| `quarkops_frontend` | `nginx:1.27-alpine` | `80` | Serve React + reverse proxy |
| `quarkops_backend` | `python:3.13-slim` (custom) | (interno `8000`) | Gunicorn + Django |
| `quarkops_db` | `postgres:16-alpine` | (interno `5432`) | Postgres |

### Volumes

| Volume | Uso |
|---|---|
| `quarkops_pgdata` | Dados do Postgres |
| `quarkops_static` | Estáticos do Django (compartilhado backend ↔ Nginx) |

### Arquivos de configuração

- **`docker-compose.yml`** (raiz): orquestração.
- **`.env`** (raiz): variáveis (não commitado).
- **`backend/Dockerfile`**: imagem do Django.
- **`backend/entrypoint.sh`**: migrate + collectstatic + seed + gunicorn.
- **`backend/gunicorn.conf.py`**: config do Gunicorn.
- **`frontend/Dockerfile`**: build multi-stage (Node → Nginx).
- **`frontend/nginx.conf`**: reverse proxy + serving estático.

### Fluxo dev vs. deploy

O projeto mantém **dois fluxos** ativos:
- **Dev local:** `backend/docker-compose.yml` (só Postgres) + `runserver` + `npm run dev`.
- **Deploy:** `docker-compose.yml` (raiz) com tudo containerizado.

---
## 7. Deploy em Nuvem (Railway)

### Arquitetura

O Railway não lê o `docker-compose.yml` inteiro. Ele usa 3 serviços isolados:

```text
┌─────────────────────────────────────────┐
│             Railway Platform            │
│                                         │
│  ┌────────────┐       ┌──────────────┐  │
│  │  Frontend  │─────▶│   Backend    │  │
│  │  (Nginx)   │ HTTP  │  (Gunicorn)  │  │
│  │  :80       │       │   :8000      │  │
│  └────────────┘       └──────┬───────┘  │
│                              │          │
│                              ▼          │
│                       ┌──────────────┐  │
│                       │  PostgreSQL  │  │
│                       └──────────────┘  │
└─────────────────────────────────────────┘
```

- **Frontend:** Build do Vite servido pelo Nginx. Acesso público via HTTPS.
- **Backend:** Gunicorn rodando o Django. Comunicação apenas via rede privada (`quarkops.railway.internal:8000`).
- **Postgres:** Banco gerenciado. O Backend se conecta via rede privada.