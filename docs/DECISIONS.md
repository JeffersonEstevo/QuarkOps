# Log de Decisões Técnicas (ADR — Architecture Decision Records)

## ADR-001: Uso de LocalStorage para MVP
- **Data:** 15/10/2026
- **Status:** Aceito
- **Contexto:** Precisamos de um protótipo funcional rápido rodando no navegador sem depender de infraestrutura complexa de backend e banco de dados nos primeiros dias de testes de interface.
- **Decisão:** Utilizaremos a API nativa do `localStorage` do navegador para persistir posts, comentários e curtidas temporariamente.
- **Consequências:** 
    * *Positiva:* Desenvolvimento acelerado e zero configuração de servidores nesta fase inicial.
    * *Negativa:* Armazenamento restrito ao navegador e ausência de banco relacional centralizado (com migração futura planejada para Django + PostgreSQL).

## ADR-002: Tailwind CSS (v4) em vez de Styled Components
- **Data:** 15/10/2026
- **Status:** Aceito
- **Contexto:** Precisamos de agilidade na estilização e facilidade para a IA gerar layouts limpos e consistentes sem conflitos de tipagem.
- **Decisão:** Adotar estritamente Tailwind CSS v4 integrado ao Vite.
- **Consequências:** Código de componentes mais enxutos, alta manutenibilidade e agilidade na entrega visual.

## ADR-003: Arquitetura Monorepo com React + Vite e Futuro Django
- **Data:** 17/10/2026
- **Status:** Aceito
- **Contexto:** O projeto usará React (Vite) no frontend para o MVP e evoluirá para uma API Django com PostgreSQL no backend.
- **Decisão:** Estruturar o repositório separando as pastas `frontend/` e `backend/` desde o início, garantindo isolamento total das tecnologias.
- **Consequências:** Facilidade na transição do LocalStorage para a API do Django quando o backend for desenvolvido.