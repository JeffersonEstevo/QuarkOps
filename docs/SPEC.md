# QuarkOps — Especificação Técnica & Funcional

## 1. Visão Geral do Projeto
*   **Nome do Projeto:** [QuarkOps]
*   **Objetivo:** [Blog/Agregador_de_Conteúdo/Leitor_de_RSS]
*   **Público-Alvo:** [Desenvolvedores/Amantes_de_Tecnologia]

## 2. Stack Tecnológica (REGRAS RÍGIDAS)
> **Instrução para a IA:** Não sugira nenhuma biblioteca ou ferramenta fora desta lista.
*   **Linguagem:** HTML / Javascript / CSS
*   **Framework/Lib (Frontend):** React (Vite)
*   **Framework/Lib (Backend):** Django (Python)
*   **Banco de Dados:** Postgres
*   **Estilização:** Tailwind CSS

## 3. Requisitos Funcionais (RF)
*   [RF-001] Uso de LocalStorage para MVP.
*   [RF-002] Tailwind CSS em vez de Styled Components.
*   [RF-003] O HTML da aplicação deve ser separados nas menores partes independetenes possível
*   [RF-004] O usuário deve conseguir ler posts e artigos em uma página limpa e clara.
*   [RF-005] O sistema deve ter um post mais lido sendo exibido na página principal.
*   [RF-006] O usuário deve conseguir enviar comentários.

## 4. Estrutura de Pastas Inicial
```text
📁 026_QuarkOps
├── 📁 docs
│   ├── 📖 DECISIONS.md
│   ├── 📖 PROGRESS.md
│   └── 📖 SPEC.md
├── 📁 static
│   ├── 🟨 scripts.js
│   └── 🎨 styles.css
├── 🐙 .gitignore
└── 🌐 index.html              # Arquivo Principal da aplicação
```

---