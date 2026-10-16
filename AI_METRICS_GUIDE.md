# Guia de Desenvolvimento com IA Local: Metodologia dos 3 Arquivos

Este documento serve como diretriz e memória técnica sobre como gerenciar o crescimento de uma aplicação utilizando Modelos de Linguagem Locais (LLMs) como assistentes de programação.

---

## 1. A Tríade de Contexto (`SPEC.md`, `PROGRESS.md`, `DECISIONS.md`)

Para mitigar a limitação de **janela de contexto** e raciocínio abstrato dos modelos locais, a aplicação deve ser guiada por três arquivos fundamentais na raiz do projeto:

*   **`SPEC.md` (Especificações Técnicas e de Negócio):** 
    *   *Objetivo:* Definir o escopo, stack tecnológica e comportamento esperado do sistema.
    *   *Papel na IA:* Funciona como uma âncora de realidade para evitar alucinações de escopo e sugestão de bibliotecas incompatíveis.
*   **`PROGRESS.md` (Controle de Linha do Tempo e Tarefas):** 
    *   *Objetivo:* Listar o que já foi feito, o que está em andamento e os próximos passos.
    *   *Papel na IA:* Atua como a memória de curto prazo do projeto. Permite que a IA saiba exatamente de onde continuar a cada nova sessão de chat.
*   **`DECISIONS.md` (Registro de Decisões de Arquitetura - ADR):** 
    *   *Objetivo:* Documentar o *porquê* de escolhas técnicas específicas (ex: autenticação, padrões de design).
    *   *Papel na IA:* Impede que o modelo tente refatorar códigos funcionais baseando-se apenas em preferências estéticas ou de treinamento da própria IA.

---

## 2. Viabilidade e Controle de Crescimento Local

É perfeitamente possível controlar o crescimento de um software robusto rodando apenas modelos locais na sua máquina, desde que a estratégia de **"Dividir e Conquistar"** seja rigorosamente aplicada.

### Vantagens do Setup Local com a Tríade
*   **Economia de Tokens:** Em vez de enviar múltiplos arquivos de código complexos, o envio dos 3 arquivos `.md` resume o estado global do projeto em poucos tokens.
*   **Foco em Microtarefas:** Modelos locais modernos (como *Qwen 2.5 Coder* ou *Llama 3.1 8B*) geram código de excelente qualidade desde que sejam instruídos a resolver um microproblema isolado por vez.

### O Limite do Modelo Local (Quando recorrer à nuvem?)
O ecossistema local fará 90% do trabalho. Os 10% restantes devem ser delegados a LLMs comerciais na Web (Claude 3.5 Sonnet, GPT-4o) nos seguintes cenários:
1.  **Arquitetura Inicial:** Planejar a estrutura inicial de pastas e preencher o primeiro esboço do `SPEC.md`.
2.  **Bugs Persistentes:** Loops onde o modelo local insiste em uma solução quebrada.
3.  **APIs Complexas/Novas:** Integrações com serviços externos recentes ou documentações escassas.

---

## 3. Gestão Prática do Contexto (Como alimentar a IA)

A IA não deve ler os arquivos "de tempos em tempos", mas sim **a cada nova instrução técnica**.

### Sintaxe de Prompting (Ferramentas de Contexto)
*   **Em Extensões de IDE (Cursor, Continue):** Use o operador `@` a cada nova tarefa relevante para puxar os arquivos para a memória de trabalho imediata:
    > *"Baseado no `@SPEC.md` e no `@PROGRESS.md`, crie a rota de autenticação descrita no item 3.1."*
*   **Em Agentes de Terminal (Aider, Roo Code):** Adicione os arquivos no início da sessão (ex: `/add SPEC.md`) para mantê-los fixos no contexto enquanto durar a sessão de chat.

---

## 4. Identificando e Corrigindo a "Amnésia" da IA

Modelos locais mudam bruscamente de comportamento quando sua janela de contexto fica saturada.

### Sinais Clássicos de Perda de Contexto
1.  **Alucinação Tecnológica:** Sugerir código em linguagens ou bancos de dados que contradizem o `SPEC.md`.
2.  **Loops de Código:** Reenviar o mesmo trecho de código quebrado repetidamente após pedidos de correção.
3.  **Respostas Evasivas:** Frases como *"adicione a lógica de validação aqui"* em vez de escrever o código de fato.
4.  **Invenção de Dependências:** Chamar funções ou importar módulos inexistentes no projeto.

### Protocolo de Recuperação (Sanity Check)
Se desconfiar do comportamento do modelo, execute o seguinte prompt de teste:
> *"Consulte o nosso `@PROGRESS.md`. Qual tarefa estamos executando exatamente agora e qual é o escopo definido no `@SPEC.md` para ela?"*

**Ações corretivas caso falhe:**
1. Marque manualmente a última tarefa concluída no `PROGRESS.md`.
2. **Feche o chat atual e limpe o histórico (Clear/New Session).**
3. Inicie um chat do zero referenciando os 3 arquivos markdown atualizados.

---

## 5. [BÔNUS] Dicas Extras de Performance para o Ambiente Local

Para extrair a máxima qualidade de código sem estourar o hardware da sua máquina local:

*   **A Regra do Arquivo Único:** Ao pedir uma implementação, tente manter a IA focada em alterar ou criar apenas **um arquivo de código por vez** (além dos `.md`).
*   **Uso de Modelos Quantizados (GGUF):** Utilize quantizações adequadas para sua GPU/RAM (geralmente `Q4_K_M` ou `Q8_0` oferecem o melhor equilíbrio entre velocidade e inteligência).
*   **Commit Cedo, Commit Sempre:** Sempre que a IA gerar um bloco de código funcional e passar nos testes, faça um commit Git. Se ela quebrar o código na tarefa seguinte, você pode dar *rollback* instantâneo sem perder o progresso.
