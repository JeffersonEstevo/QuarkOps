# Progresso da Aplicação (Progress Log)

## 🚀 Fases Concluídas

### Fase 1: Estrutura Base e Tipografia (Concluída)
- [x] Configuração global do box-sizing e comportamento de rolagem suave (`html { scroll-behavior: smooth; }`).
- [x] Definição da tipografia mista: *Space Grotesk* para o corpo, *Orbitron* para títulos de destaque e *JetBrains Mono* para códigos e elementos técnicos.
- [x] Implementação da barra de rolagem lateral personalizada com gradiente.

### Fase 2: Implementação do Tema Escuro - Dark Mode (Concluída)
- [x] Definição de paleta imersiva baseada em cinzas profundos (`#0a0c10`, `#11161f`, `#1a2130`).
- [x] Configuração de destaques em tons pastel brilhantes (`#5eead4`, `#c084fc`, `#f472b6`).
- [x] Configuração de efeitos de pulso luminoso (`glowPulse`) e sombras dinâmicas.

### Fase 3: Reformulação e Refinamento do Tema Claro - Light Mode (Concluída)
- [x] Substituição do fundo claro por um cinza-gelo fosco suave (`--bg-primary: #eef1f5`) que absorve o brilho e elimina o reflexo da tela.
- [x] Calibração dos textos para cinza chumbo escuro (`--text-primary: #2b3137`), eliminando o efeito de vibração do preto puro.
- [x] Adaptação das cores de destaque para equivalentes encorpados e de alto contraste WCAG (`#0d9488` para Teal, `#7e22ce` para Roxo e `#db2777` para Rosa/Vinho).

### Fase 4: Blindagem e Isolamento de Componentes por Tema (Concluída)
- [x] **Header & Menus:** Correção das cores do menu "Conteúdos" (`.dev-link-special`) para o roxo sofisticado e eliminação do vazamento de tons ciano/verde do dark nos submenus (`.dropdown-item`).
- [x] **Botão de Copiar (`.copy-btn`):** Criação de variáveis dedicadas por tema (`--copy-btn-bg`, `--copy-btn-text`, `--copy-btn-hover-bg`, etc.) para garantir contraste perfeito tanto no modo escuro quanto no claro, mantendo o feedback de sucesso em verde esmeralda (`#10b981`).
- [x] **Documentação do Código CSS:** Organização modular por categorias lógicas e comentários descritivos em cada linha explicando o propósito de cada propriedade.