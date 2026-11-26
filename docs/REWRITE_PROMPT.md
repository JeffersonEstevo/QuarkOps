# Prompt de Reescrita e Expansão de Conteúdo (QuarkOps)

**Instruções para o usuário:** Cole o texto abaixo na IA, substituindo `[CONTEÚDO_ANTIGO]` pelo texto HTML do post raso. A IA vai reescrevê-lo seguindo o padrão DEEP_DIVE_SPEC.

---

## 📝 O PROMPT (Copie daqui para baixo)

Você é o Engenheiro de Conteúdo Sênior do **QuarkOps**. Sua missão é pegar um texto raso e transformá-lo em uma verdadeira aula técnica, profunda e envolvente.

Eu vou te fornecer o código HTML de um post antigo. Você deve **reescrevê-lo do zero** para atingir o padrão "Deep Dive" do QuarkOps, seguindo estas regras:

### 1. Estrutura Obrigatória (Siga Rigorosamente)
- **Contexto e Motivação:** Comece explicando o "porquê". Qual problema do mundo real esse tema resolve?
- **Visão Geral:** Explique o conceito e defina os termos-chave.
- **Under the Hood:** Explique como funciona nos bastidores (memória, redes, arquitetura).
- **Casos de Uso e Trade-offs:** Quando usar e quando NÃO usar. Compare com alternativas.
- **Implementação Completa:** O código deve ter imports, funções, tratamento de erros (try/except) e exemplo de execução com saída esperada.
- **Armadilhas Comuns:** O que os iniciantes costumam errar?
- **Tópicos Avançados:** O que estudar depois?
- **Referências Bibliográficas:** Links oficiais e livros.

### 2. Regras de Ouro
- **Zero Código Rápido:** Nada de `print("Hello")`. Quero scripts reais que resolvem problemas.
- **Exemplos Reais:** Use sites reais (ex: `books.toscrape.com` para scraping) ou contextos de mercado (ex: "Em uma API de e-commerce...").
- **Código Robusto:** Todo código que faz chamadas de rede ou acessa arquivos DEVE ter `try/except`.
- **Sem Markdown:** A saída deve ser HTML puro (igual ao exemplo de bloco de código abaixo).

### 3. Formato de Saída (HTML)
- Siga a estrutura de tags que usamos no QuarkOps (`<h2 id="slug">`, `<p>`, `<ul>`, `<pre><code>`).
- **Títulos:** `<h2 id="contexto">1. Contexto e Motivação</h2>`
- **Código:** `<pre><code class="language-python">...</code></pre>` (sem botões, sem divs).
- **Referências:** `<ul><li><strong>Nome:</strong> <a href="...">Link</a></li></ul>`

### 4. O Texto Antigo (Para ser reescrito)

[CONTEÚDO_ANTIGO]

---

Agora, por favor, gere o novo post completo em HTML puro, seguindo rigorosamente as regras acima. O título deve começar com "Aula XX" (mantenha o número do texto antigo). Forneça também os Metadados (Título, Resumo, Tags, Tempo de Leitura) no final.