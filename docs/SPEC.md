# QuarkOps — Especificação Técnica & Funcional

## 1. Sumário Executivo
O **QuarkOps** é um template de blog técnico/desenvolvedor moderno, altamente otimizado para leitura prolongada, focado em ergonomia visual (anti-fadiga) e com identidade visual inspirada em terminais e design futurista clean...
Este projeto consiste em um template de blog técnico/desenvolvedor moderno, altamente otimizado para leitura prolongada, focado em ergonomia visual (anti-fadiga) e com identidade visual inspirada em terminais e design futurista clean. A aplicação conta com suporte nativo a múltiplos temas (Dark Mode imersivo e Light Mode fosco/antirreflexo), tipografia rica (Space Grotesk, Orbitron e JetBrains Mono), blocos de código com realce de sintaxe (Prism.js) e botão de copiar dedicado, além de elementos estruturais estáticos no cabeçalho para máxima performance e usabilidade.

## 2. Objetivos & Não-Objetivos
### Objetivos
- **Conforto Visual Absoluto:** Eliminar o branco puro no tema claro (utilizando um fundo cinza-gelo fosco `#eef1f5` que absorve o reflexo da tela) e evitar o preto absoluto no dark mode.
- **Isolamento de Temas (Dark vs Light):** Garantir que o Tema Light tenha identidade própria, variáveis dedicadas e alta legibilidade, sem herdar cores ou comportamentos inadequados do Dark Mode (como vazamento de submenus ciano/verde).
- **Consistência de Cores:** Padronizar uma paleta de destaque corporativa e elegante (Teal encorpado `#0d9488`, Roxo sofisticado `#7e22ce` e Rosa/Vinho focado em legibilidade `#db2777` para o Light; e versões pastéis vibrantes equivalentes para o Dark).
- **Performance e Estabilidade do Header:** Garantir que o cabeçalho e seus componentes internos não possuam animações ou transições desnecessárias (travas de performance via CSS), mantendo apenas o cursor da marca interativo.

### Não-Objetivos
- **Utilizar Branco Puro (`#ffffff`) como fundo geral:** Evitado propositalmente por causar cansaço visual e reflexo excessivo em ambientes iluminados.
- **Uso de dependências pesadas de UI:** O design e os componentes são estruturados com CSS puro e variáveis nativas (`var()`), garantindo leveza e carregamento instantâneo.