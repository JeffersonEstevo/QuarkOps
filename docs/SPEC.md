# QuarkOps — Especificação Técnica & Funcional

## 1. Visão Geral do Projeto
- **Nome do Projeto:** [QuarkOps]
- **Objetivo:** [Blog/Agregador_de_Conteúdo/Leitor_de_RSS]
- **Público-Alvo:** [Desenvolvedores/Amantes_de_Tecnologia]

## 2. Stack Tecnológica (REGRAS RÍGIDAS)
> **Instrução para a IA:** Não sugira nenhuma biblioteca ou ferramenta fora desta lista.
- **Linguagem:** HTML5 / JavaScript (ES6+) / CSS3 / Python 3.11+
- **Framework/Lib (Frontend):** React (Vite)
- **Framework/Lib (Backend):** Django 5.1 + Django REST Framework (+ SimpleJWT)
- **Banco de Dados:** PostgreSQL 16 (via Docker Compose)
- **Estilização:** Tailwind CSS (v4)

## 3. Requisitos do Sistema

### Requisitos Não Funcionais (RNF) — Tecnologias e Arquitetura
- [RNF-001] O armazenamento de dados (posts, comentários e curtidas) utilizou o `LocalStorage` do navegador no MVP e está integrado ao Django + PostgreSQL. A camada `services/api.js` do frontend abstrai o adapter ativo (`local` ou `http`) via `VITE_API_ADAPTER` (ADR-009, ADR-014).
- [RNF-002] O design e a estilização da interface devem ser desenvolvidos utilizando **Tailwind CSS (v4)** com suporte a variantes customizadas de tema.
- [RNF-003] O código da interface deve ser estruturado em componentes modulares, isolados e nas menores partes independentes possíveis (ex: Cards, Botões, Cabeçalho, Rodapé) dentro do diretório do React.
- [RNF-004] A aplicação deve ser totalmente responsiva, adaptando-se a dispositivos móveis, tablets e desktops.
- [RNF-005] O HTML dos posts deve ser sanitizado no servidor (via `nh3`) antes de ser persistido, removendo scripts, event handlers inline (`on*`), `style` e URLs perigosas (`javascript:`, `data:`). Classes CSS (Tailwind/highlight.js) e IDs de headings (TOC) são preservados (ADR-013).
- [RNF-006] A conversão de shape entre backend e frontend (snake_case ↔ camelCase, author objeto ↔ string, ISO date ↔ string formatada) deve ser centralizada no `httpAdapter` (`frontend/src/services/adapters/httpAdapter.js`), mantendo `useArticles` e componentes agnósticos ao backend (ADR-014).
- [RNF-007] O sistema deve suportar hierarquia de categorias em 2 níveis (`Category` → `Subcategory`). Categorias e subcategorias são entidades dinâmicas (gerenciadas no Admin), não valores hardcoded no frontend (ADR-017).

### Requisitos Funcionais (RF) — Módulo 1: Leitura e Navegação (Público)
- [RF-004] O usuário deve conseguir ler posts e artigos em uma página de leitura limpa, clara e focada em tipografia.
- [RF-005] O sistema deve exibir um post em destaque (ou o mais lido/relevante) na seção principal da página inicial.
- [RF-007] O usuário deve visualizar uma listagem de posts recentes na página inicial, ordenados por data de publicação decrescente.
- [RF-008] O usuário deve conseguir filtrar posts por categoria e subcategoria. A hierarquia (Categoria → Subcategoria) é gerenciada dinamicamente no Django Admin e consumida pelo frontend via selects no CRM e filtros expansíveis na Home (ADR-017, ADR-018).
- [RF-009] O sistema deve disponibilizar uma barra de busca em tempo real para encontrar posts por título ou palavras-chave.
- [RF-010] O sistema deve exibir o tempo estimado de leitura em cada card e página de post.

### Requisitos Funcionais (RF) — Módulo 2: Interação do Leitor
- [RF-006] O usuário deve conseguir enviar comentários em um post informando seu nome e o texto do comentário.
- [RF-011] O usuário deve conseguir interagir com posts através de um botão de curtidas (*likes*), com o contador sendo persistido no `LocalStorage`.
- [RF-012] O usuário deve conseguir copiar o link direto de um post para a área de transferência com facilidade, recebendo feedback visual via notificação Toast.

### Requisitos Funcionais (RF) — Módulo 3: Gestão de Conteúdo (Painel Administrativo)
- [RF-013] O sistema deve contar com uma área administrativa protegida (simulada via senha local) para o gerenciamento do blog.
- [RF-014] O administrador deve conseguir criar novos posts, definindo título, resumo, categoria, tags, imagem de capa (URL) e conteúdo.
- [RF-015] O administrador deve conseguir editar o conteúdo de posts já existentes.
- [RF-016] O administrador deve conseguir excluir posts do sistema.
- [RF-017] O administrador deve conseguir visualizar e moderar (excluir) comentários inadequados enviados pelos leitores.

## 4. Estrutura de Pastas (estado atual)

```text
📁 026_QuarkOps
├── 📁 docs
│   ├── 📖 COMMANDS.md         # Guia de comandos (dev + deploy)
│   ├── 📖 DECISIONS.md        # ADRs (001 a 016)
│   ├── 📖 PROGRESS.md         # Quadro de tarefas e backlog
│   ├── 📖 SPEC.md             # Este arquivo
│   └── 📖 STRUCTURE.md        # Arquitetura frontend + backend + deploy
├── 📁 backend                 # Django 5.1 + DRF + SimpleJWT + PostgreSQL
│   ├── 📁 core                # Projeto Django (settings, urls, wsgi, asgi)
│   ├── 📁 api                 # App de domínio (User, Category, Subcategory, Post, Comment)
│   │   ├── 📁 management/commands  # seed_articles, sanitize_existing_posts
│   │   ├── 📁 migrations      # 0001_initial, 0002_category_subcategory_and_more
│   │   ├── 📄 admin.py        # Registro no Django Admin
│   │   ├── 📄 apps.py
│   │   ├── 📄 models.py       # User, Post, Comment (UUIDs)
│   │   ├── 📄 permissions.py  # IsAdminOrReadOnly, AllowAnyForCreateReadAuth
│   │   ├── 📄 sanitizers.py   # nh3 (sanitização HTML — ADR-013)
│   │   ├── 📄 serializers.py
│   │   ├── 📄 urls.py         # DefaultRouter + rotas JWT
│   │   └── 📄 views.py        # ViewSets + ações customizadas
│   ├── 📁 venv                # Ambiente virtual (NÃO commitar)
│   ├── 📄 manage.py
│   ├── 📄 requirements.txt
│   ├── 📄 Dockerfile          # 🆕 Imagem de produção (Gunicorn)
│   ├── 📄 entrypoint.sh       # 🆕 migrate + collectstatic + seed + gunicorn
│   ├── 📄 gunicorn.conf.py    # 🆕 Config do Gunicorn (workers)
│   ├── 📄 docker-compose.yml  # Postgres (dev local)
│   ├── 📄 .dockerignore       # 🆕
│   ├── 📄 .env.example        # Modelo de variáveis (commitar)
│   ├── 📄 .env                # Variáveis locais (NÃO commitar)
│   └── 📄 .gitignore
└── 📁 frontend                # React + Vite + Tailwind CSS v4
    ├── 📁 src
    │   ├── 📁 components      # article/, crm/, home/, layout/, providers/, ui/
    │   ├── 📁 contexts        # useTheme, useToast, useAuth
    │   ├── 📁 hooks           # useArticles, useReadingProgress, useToc
    │   ├── 📁 pages           # HomePage, ArticlePage
    │   ├── 📁 services        # Camada de dados
    │   │   ├── 📁 adapters    # localStorageAdapter.js, httpAdapter.js (JWT)
    │   │   ├── 📄 api.js      # Fachada única (VITE_API_ADAPTER)
    │   │   └── 📄 authStorage.js  # 🆕 Persistência de tokens JWT
    │   ├── 📁 utils           # constants.js, storage.js (legado)
    │   ├── 📄 App.jsx
    │   └── 📄 main.jsx
    ├── 📄 index.css           # Tailwind v4 (@theme, @custom-variant)
    ├── 📄 package.json
    ├── 📄 vite.config.js
    ├── 📄 Dockerfile          # 🆕 Build multi-stage (Node → Nginx)
    ├── 📄 nginx.conf          # 🆕 Reverse proxy + estáticos
    ├── 📄 .dockerignore       # 🆕
    └── 📄 .env.local          # VITE_API_ADAPTER + VITE_API_URL (NÃO commitar)
├── 📄 docker-compose.yml      # 🆕 Deploy unificado (db + backend + frontend)
├── 📄 .env                    # 🆕 Variáveis de deploy (NÃO commitar)
├── 📄 .env.example            # 🆕 Modelo público de variáveis de deploy
└── 📄 .gitignore              # 🆕 Ignora .env, node_modules, venv, etc.
```

> **Notas de infraestrutura:**
> - **`backend/docker-compose.yml`** (dev): sobe **apenas** o Postgres. Usado no fluxo de desenvolvimento local (backend via `runserver`, frontend via `npm run dev`).
> - **`docker-compose.yml`** (raiz): orquestra **tudo** (Postgres + Gunicorn + Nginx) para simular produção. Usado no deploy unificado (ADR-016).
> - **Nginx** (`frontend/nginx.conf`): serve o build do React, faz `proxy_pass` para `/api/` e `/admin/` (backend Gunicorn) e serve `/static/` do Django via volume compartilhado.
> - **`entrypoint.sh`** (backend): ao subir o container, roda automaticamente `migrate`, `collectstatic`, `seed_articles` e inicia o Gunicorn. Não é necessário rodar comandos manuais no primeiro `docker compose up`.
> - **`venv/`** e **`node_modules/`** são ignorados pelo `.gitignore` (não vão para o repositório).
> - **`.env`** (raiz e backend) nunca é commitado — apenas `.env.example`.
> - A configuração do Tailwind v4 vive em `index.css` via `@theme` e `@custom-variant` (não há `tailwind.config.js`).
> - O `highlight.js` permanece no cliente (ADR-005, ADR-013). O backend apenas sanitiza o HTML via `nh3`.
> - **Estrutura detalhada** do `src/` e do backend em `docs/STRUCTURE.md`.
---