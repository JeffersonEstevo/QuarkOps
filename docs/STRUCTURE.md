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