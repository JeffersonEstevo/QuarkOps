# Log de Decisões Técnicas (ADR — Architecture Decision Records)

Registro de decisões técnicas relevantes do projeto, com data e motivo. Consulte antes de propor mudanças a algo já decidido aqui.

| Data | Decisão | Motivo |
| :--- | :--- | :--- |
| 2026-10-14 | **Adoção de Fundo Cinza-Gelo Fosco (`#eef1f5`) no Light Mode** | Evitar o uso de branco puro (`#ffffff`) no fundo geral, prevenindo fadiga ocular e absorvendo o reflexo de telas em ambientes claros. |
| 2026-10-14 | **Uso de Cinza Chumbo (`#2b3137`) em vez de Preto Puro (`#000000`) para Textos** | O preto absoluto sobre fundo claro gera o fenômeno de irradiação óptica, causando cansaço visual rápido. O cinza chumbo mantém 100% da legibilidade de forma confortável. |
| 2026-10-14 | **Isolamento de Variáveis para o Botão de Copiar (`.copy-btn`)** | Evitar conflitos visuais e perda de contraste entre os temas, criando propriedades dedicadas para o estado normal e de hover em cada modo de cor. |
| 2026-10-14 | **Travas de Performance no Header (`transition: none !important`)** | Garantir estabilidade visual absoluta no cabeçalho e impedir que micro-animações gerem recálculos de layout incômodos ao navegar. |
| 2026-10-14 | **Padronização do menu especial e submenus via variáveis dinâmicas** | Impedir o vazamento de cores do tema escuro (como o ciano brilhante) para dentro do tema claro, mantendo a consistência visual da paleta escolhida. |