# Guia de Retomada de Contexto (Follow-up Prompt)

Este documento é o "passaporte" do projeto QuarkOps. Ele deve ser copiado e colado como o **primeiro prompt** em qualquer nova conversa com uma IA (Claude, ChatGPT, Gemini, DeepSeek ou Llama local) para garantir que o assistente absorva o contexto, a arquitetura e as regras sem alucinações.

---

## 📋 1. PROMPT DE RETOMADA (Copie daqui para baixo)

Você é um Engenheiro de Software Sênior atuando no projeto **QuarkOps**. Nós acabamos de finalizar uma grande etapa e você precisa absorver o contexto antes de começarmos a próxima tarefa.

**Regra de Ouro:** Não sugira bibliotecas ou ferramentas fora da stack oficial. Siga a arquitetura e as decisões registradas nos arquivos anexados.

**Contexto Atual do Projeto:**
- **Nome:** QuarkOps (Blog/Agregador de conteúdo técnico)
- **Stack:** React + Vite + Tailwind CSS v4 (Frontend) / Django + PostgreSQL (Backend planejado)
- **Status Atual:** Frontend MVP 100% concluído e refatorado. Backend prestes a iniciar.

**Antes de responder qualquer coisa, absorva estes 4 arquivos (que eu anexei ou colei abaixo):**
1. `SPEC.md` (O que o sistema deve fazer)
2. `STRUCTURE.md` (Como o código do frontend está organizado)
3. `DECISIONS.md` (As escolhas técnicas e dívidas técnicas)
4. `PROGRESS.md` (O que já foi feito e os próximos passos)

**A Tarefa Atual:**
*(Aqui você, desenvolvedor humano, substitui este texto pela sua nova feature. Ex: "Vamos iniciar o Backend Django conforme o Passo 2 do PROGRESS.md".)*

Confirme que absorveu o contexto e aguarde meu sinal verde (ou já comece a tarefa, se eu tiver anexado tudo corretamente).

---

## 🧠 2. Por que usar este método? (O que acontece se não usarmos)

1. **Context Window Limitada:** Se você continuar no mesmo chat antigo, a IA vai começar a esquecer as regras iniciais (como o pixel-border ou o highlight.js) e vai começar a "alucinar" (sugerir bibliotecas proibidas).
2. **Foco e Performance:** Um chat gigante processa milhares de tokens desnecessários, gastando mais energia/cota e sendo mais lento para responder.
3. **Onboarding de outras IAs:** Ao trocar de IA (ex: sair do Claude e ir para o Gemini), a documentação garante que a nova IA não precise "ler o código inteiro" para entender o projeto; ela lê a documentação.

---

## 🛠️ 3. Como e Quando iniciar um novo chat?

Sempre utilize a regra do **"Feature Branch de Conversa"**:

| Situação | Ação Recomendada |
| :--- | :--- |
| **Vou iniciar o Backend Django** | Abra um chat novo focado em Python/Django. Anexe os docs. |
| **Encontrei um bug isolado no Frontend** | Abra um chat novo. Anexe `STRUCTURE.md`, `SPEC.md` e o código do componente com o bug. |
| **Vou adicionar uma nova feature global** | Abra um chat novo. Anexe todos os docs. Peça para a IA te ajudar a planejar primeiro (atualizar o `SPEC.md`) e depois codar. |
| **Estou só tirando dúvidas conceituais** | Pode usar o chat que estiver aberto, não precisa de contexto novo. |

---

## 🦙 4. Dicas para uso de IA Local (Llama 3 / Ollama)

Se você quiser usar modelos locais (ex: `llama3` rodando no Ollama) para economizar custos ou por privacidade:
1. **Anexe a pasta do projeto inteira ou os arquivos de documentação.** Modelos locais tendem a se perder sem um contexto bem definido.
2. **Fale "curto e grosso":** Modelos locais de 7B/8B (como o Llama 3) são ótimos em instruções diretas (ex: *"Crie o arquivo models.py do Django com base no SPEC"*), mas ruins em raciocínios complexos de múltiplos passos. Divida a tarefa em partes pequenas.
3. **Use o modelo local como assistente de syntax:** Se você souber o que quer fazer, diga ao Llama: *"Escreva a função `postComment` em Python/Django que faz X, Y e Z"*. Ele acerta bem a sintaxe.
4. **Sempre revise:** A IA local pode inventar funcionalidades. Volte aos docs para confirmar se o que ela fez está no `SPEC.md`.

### 🚨 4.1 Resumo de Emergência (Fallback para IAs sem upload)
Se a IA reclamar que não consegue ler os anexos, ou se você estiver usando uma IA local que não tem upload de arquivos, use este texto compacto para injetar o contexto base:

```text
Contexto Rápido QuarkOps:
- Frontend 100% pronto (React + Vite + Tailwind v4). Usa LocalStorage no MVP. Estrutura: components/pages/hooks/contexts. 
- Regras rígidas: Não usar CSS solto (só Tailwind), usar componentes modulares e controle de estado estrito. Documentação rigorosa exigida.
- Decisões: Highlight.js no cliente (não no servidor). Auth local fajuta (senha admin123). Sem window.alert/confirm/prompt (apenas modais próprios).
- Próximo passo: Iniciar Backend Django + PostgreSQL. Não refaça o frontend, apenas crie as APIs para conversar com ele.
```

---

## 🏗️ 5. O Ritual de Finalização de Feature

Toda vez que uma grande feature for concluída (seja no frontend ou backend), antes de fechar o chat, faça o seguinte:
1. **Atualize o `PROGRESS.md`** (marque o que foi concluído e o que está no backlog).
2. **Atualize o `DECISIONS.md`** (se você tomou uma decisão importante, registre o ADR correspondente).
3. **Atualize o `STRUCTURE.md`** (se você criou novos arquivos ou pastas).
4. **Comite no Git** (ex: `git commit -m "feat: xxx"`).
5. **Feche a aba do chat.** Abra um novo, pule a etapa 1 da documentação e vá direto para o Prompt de Retomada.

---

**Lembre-se:** A IA é descartável, o conhecimento documentado é o que mantém o QuarkOps vivo.