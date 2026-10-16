# Modelos de Estrutura para os 3 Arquivos de Contexto

Este arquivo reúne os templates ideais para consumo de IAs locais. Use exatamente estas marcações (`[ ]`, `[x]`, tabelas e subcabeçalhos) para que o modelo entenda o escopo instantaneamente via comandos `@`.

---

## 1. Modelo para o `SPEC.md`
# ESPECIFICAÇÃO TÉCNICA (SPEC.md)

## 1. Visão Geral do Projeto
*   **Nome do Projeto:** [Nome do App]
*   **Objetivo:** [Ex: Aplicativo local de notas criptografadas em markdown]
*   **Público-Alvo:** [Ex: Desenvolvedores preocupados com privacidade]

## 2. Stack Tecnológica (REGRAS RÍGIDAS)
> **Instrução para a IA:** Não sugira nenhuma biblioteca ou ferramenta fora desta lista.
*   **Linguagem:** TypeScript / Node.js
*   **Framework/Lib:** React (Vite)
*   **Banco de Dados:** SQLite
*   **Estilização:** Tailwind CSS

## 3. Requisitos Funcionais (RF)
*   [RF-001] O usuário deve conseguir criar notas em formato Markdown.
*   [RF-002] O sistema deve salvar as notas localmente de forma automática.
*   [RF-003] O usuário deve conseguir categorizar notas por tags.

## 4. Estrutura de Pastas Esperada
```text
src/
├── components/     # Componentes visuais isolados
├── hooks/          # Lógica e estado reutilizável
├── services/       # Conexão com banco/APIs
└── types/          # Definições de tipos TypeScript
```

---

## 2. Modelo para o `PROGRESS.md`
# PROGRESSO DO PROJETO (PROGRESS.md)

## Status Atual
*   **Fase Atual:** [Fase 1: Setup e Autenticação]
*   **Última Atualização:** 15/10/2026
*   **Meta Imediata:** Colocar a tela de login funcional integrada ao banco de dados.

## Quadro de Tarefas

### 🟩 Concluído (Backlog Concluído)
*   [x] Inicializar projeto com Vite e TypeScript.
*   [x] Configurar Tailwind CSS e testar injeção de estilos.

### 🟨 Em Andamento (Foco Atual da IA)
*   [ ] [RF-001] Criar componente de editor de texto básico (`src/components/Editor.tsx`).
*   [ ] Configurar armazenamento local via localStorage como fallback inicial.

### 🟥 A Fazer (Próximos Passos - Não Mexer Ainda)
*   [ ] Criar sistema de criptografia para salvar no banco.
*   [ ] Implementar barra de busca de notas por tag.

---

## 3. Modelo para o `DECISIONS.md`
# DECISÕES DE ARQUITETURA (DECISIONS.md)

## ADR-001: Uso de LocalStorage para MVP
*   **Data:** 15/10/2026
*   **Status:** Aceito
*   **Contexto:** Precisamos de um protótipo funcional rápido rodando no navegador sem depender de infraestrutura complexa de banco de dados nos primeiros dias.
*   **Decisão:** Utilizaremos a API nativa do `localStorage` do navegador para persistir os dados textuais das notas temporariamente.
*   **Consequências:** 
    *   *Positiva:* Desenvolvimento acelerado e zero configuração de servidores.
    *   *Negativa:* Limite de armazenamento de ~5MB e ausência de criptografia robusta nesta fase.

## ADR-002: Tailwind CSS em vez de Styled Components
*   **Data:** 15/10/2026
*   **Status:** Aceito
*   **Contexto:** O modelo de IA local gera layouts muito mais rápidos e com menos bugs de tipagem quando usa classes utilitárias diretas.
*   **Decisão:** Adotar estritamente Tailwind CSS.
*   **Consequências:** Códigos de componentes mais enxutos e facilidade para a IA gerar CSS inline correto de primeira.

---

## 4. Exemplos Reais de Comandos (Como pedir à IA usando os arquivos)

Abaixo estão os padrões exatos de prompt que você digitará na sua extensão (Cursor / Continue) no dia a dia.

### Exemplo 1: Iniciando uma nova tarefa do PROGRESS.md
> "Olhe o `@PROGRESS.md` na seção 'Em Andamento'. Escreva o código para o item '[ ] [RF-001] Criar componente de editor'. Siga estritamente as regras de estilo de código e pastas que estão no `@SPEC.md`."

### Exemplo 2: Evitando que ela invente padrões errados
> "Preciso criar a função que salva o texto digitado. Consulte o `@DECISIONS.md` para entender onde e por que decidimos salvar os dados agora. Não use bancos de dados externos."

### Exemplo 3: Atualizando o progresso (Fechamento de ciclo)
> "Terminamos o componente de editor e ele está funcionando. Reescreva APENAS o `@PROGRESS.md` movendo essa tarefa para a seção 'Concluído' e marque a caixinha com [x]."
