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
- **CRUD de Dados (`useArticles` → `services/api.js`):** `useArticles` consome a fachada `api` (não `localStorage` diretamente). O adapter ativo (`local` por padrão, `http` no futuro) é escolhido via `VITE_API_ADAPTER`. Trocar de backend não toca em hook nem em componente (ADR-009).
- **Apresentação:** A maior parte dos componentes (ex: `CommentItem`, `ArticleCard`) são "burros" (recebem props e renderizam), enquanto `App.jsx` e `ArticlePage` fazem a ponte com os hooks e contexts.

## 4. Pontos de Integração com o Backend (Próximos Passos)

A fachada já existe. Para plugar o Django:
1. Implementar os endpoints DRF conforme o contrato de `services/api.js`.
2. Definir `VITE_API_ADAPTER=http` e `VITE_API_URL=<base>` no `.env.local` do frontend.
3. Substituir a validação do `AuthProvider` por `api.login()` (POST /api/token/) — Passo 6.
4. Adicionar estados de `loading`/`error` na UI (skeletons, toasts de erro) — os dados já estão expostos pelo hook.
5. Remover `storage.js` e `localStorageAdapter.js` quando o backend estiver estável em produção.

## 5. Backend (Django + PostgreSQL)

### Arquitetura atual (Passo 2)

- **Projeto Django:** `core/` (settings, urls, wsgi, asgi).
- **App de domínio:** `api/` (vazio nesta fase — `models.py` recebe `Post`, `Comment` no Passo 3).
- **Banco:** PostgreSQL 16 via Docker Compose (`quarkops_db`, porta 5432, volume `quarkops_pgdata`).
- **Autenticação:** SimpleJWT instalado e configurado, endpoint `/api/token/` será criado no Passo 6.
- **CORS:** `localhost:5173` (Vite dev) liberado via `django-cors-headers`.

### Como os endpoints vão bater com o frontend

O contrato de `frontend/src/services/api.js` define os paths REST esperados. No Passo 3, os endpoints DRF serão criados espelhando esse contrato:

| Método em `services/api.js` | Endpoint Django (Passo 3) |
|---|---|
| `listArticles()` | `GET /api/posts/` |
| `getArticle(id)` | `GET /api/posts/:id/` |
| `createArticle(data)` | `POST /api/posts/` |
| `updateArticle(id, data)` | `PUT /api/posts/:id/` |
| `deleteArticle(id)` | `DELETE /api/posts/:id/` |
| `incrementLikes(id)` | `POST /api/posts/:id/like/` |
| `incrementViews(id)` | `POST /api/posts/:id/view/` |
| `postComment(articleId, c)` | `POST /api/posts/:id/comments/` |
| `deleteComment(articleId, cId)` | `DELETE /api/posts/:id/comments/:cId/` |
| `login(creds)` | `POST /api/token/` |
