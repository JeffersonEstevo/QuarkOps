# QuarkOps — Especificação Técnica & Funcional

## 1. Visão Geral do Projeto
- **Nome do Projeto:** [QuarkOps]
- **Objetivo:** [Blog/Agregador_de_Conteúdo/Leitor_de_RSS]
- **Público-Alvo:** [Desenvolvedores/Amantes_de_Tecnologia]

## 2. Stack Tecnológica (REGRAS RÍGIDAS)
> **Instrução para a IA:** Não sugira nenhuma biblioteca ou ferramenta fora desta lista.
- **Linguagem:** HTML5 / JavaScript (ES6+) / CSS3
- **Framework/Lib (Frontend):** React (Vite)
- **Framework/Lib (Backend):** Django (Python) — *Planejado para fase posterior*
- **Banco de Dados:** Postgres (via Django) — *Planejado para fase posterior* (MVP utiliza `LocalStorage`)
- **Estilização:** Tailwind CSS (v4)

## 3. Requisitos do Sistema

### Requisitos Não Funcionais (RNF) — Tecnologias e Arquitetura
- [RNF-001] O armazenamento de dados (posts, comentários e curtidas) deve utilizar o `LocalStorage` do navegador para a versão MVP, com posterior migração para Django + Postgres.
- [RNF-002] O design e a estilização da interface devem ser desenvolvidos utilizando **Tailwind CSS (v4)** com suporte a variantes customizadas de tema.
- [RNF-003] O código da interface deve ser estruturado em componentes modulares, isolados e nas menores partes independentes possíveis (ex: Cards, Botões, Cabeçalho, Rodapé) dentro do diretório do React.
- [RNF-004] A aplicação deve ser totalmente responsiva, adaptando-se a dispositivos móveis, tablets e desktops.

### Requisitos Funcionais (RF) — Módulo 1: Leitura e Navegação (Público)
- [RF-004] O usuário deve conseguir ler posts e artigos em uma página de leitura limpa, clara e focada em tipografia.
- [RF-005] O sistema deve exibir um post em destaque (ou o mais lido/relevante) na seção principal da página inicial.
- [RF-007] O usuário deve visualizar uma listagem de posts recentes na página inicial, ordenados por data de publicação decrescente.
- [RF-008] O usuário deve conseguir filtrar posts clicando em categorias ou tags específicas.
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
│   ├── 📖 COMMANDS.md
│   ├── 📖 DECISIONS.md
│   ├── 📖 PROGRESS.md
│   ├── 📖 SPEC.md
│   └── 📖 STRUCTURE.md
├── 📁 backend                # Django 5.1 + DRF + SimpleJWT + PostgreSQL
│   ├── 📁 core               # Projeto Django (settings, urls, wsgi, asgi)
│   ├── 📁 api                # App de domínio (models vazios — Passo 3)
│   │   └── 📁 migrations
│   ├── 📄 manage.py
│   ├── 📄 requirements.txt
│   ├── 📄 docker-compose.yml # PostgreSQL 16 (container quarkops_db)
│   ├── 📄 .env.example       # Modelo de variáveis (commitar)
│   ├── 📄 .env               # Variáveis locais (NÃO commitar)
│   └── 📄 .gitignore
└── 📁 frontend               # React + Vite + Tailwind CSS v4
    ├── 📁 src
    │   ├── 📁 components     # article/, crm/, home/, layout/, providers/, ui/
    │   ├── 📁 contexts       # useTheme, useToast, useAuth
    │   ├── 📁 hooks          # useArticles, useReadingProgress, useToc
    │   ├── 📁 pages          # HomePage, ArticlePage
    │   ├── 📁 services       # 🆕 Camada de dados
    │   │   ├── 📁 adapters   # localStorageAdapter.js, httpAdapter.js
    │   │   └── 📄 api.js     # Fachada única (VITE_API_ADAPTER)
    │   ├── 📁 utils          # constants.js, storage.js (legado)
    │   ├── 📄 App.jsx
    │   └── 📄 main.jsx
    ├── 📄 index.css          # Tailwind v4 (@theme, @custom-variant)
    ├── 📄 package.json
    └── 📄 vite.config.js
```
---