# Log de Decisões Técnicas (ADR — Architecture Decision Records)

## ADR-001: Uso de LocalStorage para MVP
- **Data:** 15/10/2026
- **Status:** Aceito
- **Contexto:** Precisamos de um protótipo funcional rápido rodando no navegador sem depender de infraestrutura complexa de backend e banco de dados nos primeiros dias de testes de interface.
- **Decisão:** Utilizaremos a API nativa do `localStorage` do navegador para persistir posts, comentários e curtidas temporariamente.
- **Consequências:** 
    * *Positiva:* Desenvolvimento acelerado e zero configuração de servidores nesta fase inicial.
    * *Negativa:* Armazenamento restrito ao navegador e ausência de banco relacional centralizado (com migração futura planejada para Django + PostgreSQL).

## ADR-002: Tailwind CSS (v4) com Vite
- **Data:** 15/10/2026
- **Status:** Aceito
- **Contexto:** Precisamos de agilidade na estilização e facilidade para a IA gerar layouts limpos e consistentes com suporte a temas dinâmicos.
- **Decisão:** Adotar estritamente Tailwind CSS v4 integrado ao Vite, configurando variantes customizadas para o suporte à classe `.dark`.
- **Consequências:** Código de componentes mais enxutos, alta manutenibilidade, agilidade visual e adaptação ao novo motor do Tailwind v4.

## ADR-003: Migração e Refatoração para Arquitetura Modular em React + Vite
- **Data:** 17/10/2026
- **Status:** Aceito
- **Contexto:** O projeto original baseava-se em uma estrutura estática em HTML/JS puro, o que limitava a escalabilidade de componentes, o gerenciamento de estados globais (como o tema escuro/claro e notificações Toast) e a manutenção limpa do código.
- **Decisão:** Realizar a migração completa da aplicação para uma arquitetura moderna baseada em componentes modulares em **React (Vite)**, estruturando um monorepo com isolamento claro entre o frontend e o futuro backend Django, além de adotar o **Tailwind CSS v4** com variantes customizadas para o sistema de temas.
- **Consequências:** 
    * *Positiva:* Modularização robusta do código, reatividade nativa para elementos dinâmicos (como o Sumário/TOC e feedbacks via Toast), melhor manutenibilidade a longo prazo e paridade funcional completa com o sistema original.
    * *Negativa:* Esforço inicial de refatoração e adaptação de scripts legados (como manipulação direta de DOM) para o paradigma declarativo do React.

