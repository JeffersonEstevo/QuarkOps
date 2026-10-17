# Log de Decisões Técnicas (ADR — Architecture Decision Records)

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