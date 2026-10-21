# QuarkOps — Estrutura e Arquitetura Frontend

## 1. Visão Geral
O frontend foi refatorado para uma arquitetura modular baseada em React (Vite) e Tailwind CSS (v4). O estado global (tema, toast, autenticação) é gerenciado via **Context API**, enquanto o estado de dados (artigos) é centralizado em um **Custom Hook** (`useArticles`), preparando o terreno para a futura integração com o backend em Django.

## 2. Árvore de Diretórios (`src/`)
```text
src/
├── components/
│   ├── article/       # Componentes da página de leitura (Header do artigo, Comentários, TOC, etc.)
│   ├── crm/           # Modais e telas do painel administrativo (CrmModal, LoginGate, CodeBlockModal)
│   ├── home/          # Componentes da página inicial (Banner, Grid, FeaturedArticle)
│   ├── layout/        # Estrutura base (Header, Footer, ReadingProgressBar)
│   ├── providers/     # Provedores de Contexto (Theme, Toast, Auth)
│   └── ui/            # Componentes visuais genéricos e reutilizáveis (Button, Badge, Toast, ConfirmDialog)
├── contexts/          # Definição dos Contextos e Hooks de consumo (useTheme, useToast, useAuth)
├── hooks/             # Hooks customizados de lógica (useArticles, useReadingProgress, useToc)
├── pages/             # Composição das páginas (HomePage, ArticlePage)
├── utils/             # Constantes e Utilitários (storage.js, constants.js)
├── App.jsx            # Orquestrador principal (navegação e amarração dos modais)
└── main.jsx           # Ponto de entrada, envolto pelos Providers
```

## 3. Fluxo de Dados e Estado
- **Navegação (`App.jsx`):** `currentView`, `selectedArticleId`, `activeCategory`, `searchTerm`.
- **Autenticação (`AuthProvider`):** `isCrmAuthenticated`, `login()`, `logout()`.
- **CRUD de Dados (`useArticles`):** Toda a manipulação de artigos e comentários passa por aqui. Atualmente usa `localStorage`, mas está abstraído para facilitar a troca por `fetch` no futuro.
- **Apresentação:** A maior parte dos componentes (ex: `CommentItem`, `ArticleCard`) são "burros" (recebem props e renderizam), enquanto `App.jsx` e `ArticlePage` fazem a ponte com os hooks e contexts.

## 4. Pontos de Integração com o Backend (Próximos Passos)
Para plugar o Django, basta:
1. Criar `services/api.js`.
2. Substituir as chamadas do `storage.js` dentro de `hooks/useArticles.js` por chamadas à API.
3. Trocar a validação do `login()` no `AuthProvider` por um `POST /api/token/` (JWT).