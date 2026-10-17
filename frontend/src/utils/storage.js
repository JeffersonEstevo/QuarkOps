// frontend/src/utils/storage.js

const INITIAL_ARTICLES = [
  {
    id: 'art-1',
    title: 'Desvendando o Python GIL (Global Interpreter Lock): O Que Muda na Concorrência Moderna',
    category: 'Programação',
    date: '14 Out 2026',
    readTime: '7 min de leitura',
    views: 3420,
    author: 'Guido Dev',
    avatar: 'GD',
    summary: 'Uma análise profunda sobre o funcionamento interno do CPython, o impacto histórico do GIL em processamento multi-core e as propostas recentes para a remoção definitiva do bloqueio.',
    tags: ['python', 'concurrency', 'cpython', 'backend'],
    content: `
      <h2 id="introducao-ao-gil" class="text-2xl font-bold font-sans pt-2">1. Introdução ao GIL e Seus Fundamentos</h2>
      <p>O Global Interpreter Lock (GIL) tem sido um dos tópicos mais debatidos na comunidade Python há décadas. Essencialmente, ele é um mutex que protege o acesso a objetos Python, impedindo que múltiplas threads executem bytecode Python simultaneamente no mesmo processo.</p>
      
      <p>Embora garanta extrema segurança de memória e simplicidade na gestão do coletor de lixo (garbage collector) baseada em contagem de referências, o GIL impõe limitações em tarefas intensivas de CPU (CPU-bound) em ambientes multithread.</p>

      <h2 id="exemplo-pratico-codigo" class="text-2xl font-bold font-sans pt-4">2. Exemplo Prático com Concorrência em Python</h2>
      <p>Abaixo temos um trecho clássico simulando uma rotina de processamento paralelo com múltiplos processos (alternativa padrão ao GIL):</p>

      <div class="relative bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 code-block my-4 text-sm overflow-x-auto">
        <button onclick="navigator.clipboard.writeText(this.parentElement.querySelector('pre').innerText); alert('Código copiado!');" class="absolute top-2 right-2 bg-slate-800 hover:bg-sky-600 text-amber-300 px-2 py-1 text-xs rounded border border-slate-700 transition-colors cursor-pointer">
          <i class="fa-regular fa-copy mr-1"></i> Copiar
        </button>
        <pre><code><span class="text-amber-300">import</span> multiprocessing
<span class="text-amber-300">import</span> time

<span class="text-amber-300">def</span> <span class="text-sky-400">heavy_computation</span>(worker_id):
    print(f"Processo {worker_id} iniciado...")
    total = sum(i * i <span class="text-amber-300">for</span> i in range(<span class="text-emerald-400">10_000_000</span>))
    <span class="text-amber-300">return</span> total

<span class="text-amber-300">if</span> __name__ == <span class="text-emerald-300">"__main__"</span>:
    start_time = time.time()
    with multiprocessing.Pool(processes=4) as pool:
        results = pool.map(heavy_computation, range(4))
    print(f"Tempo total com múltiplos processos: {time.time() - start_time:.2f}s")</code></pre>
      </div>

      <h2 id="ilustracao-arquitetural" class="text-2xl font-bold font-sans pt-4">3. Arquitetura de Execução</h2>
      <p>Para ilustrar o fluxo de threads sob o interpretador padrão, observe o diagrama esquemático abaixo:</p>

      <div class="my-6 p-4 bg-stone-100 dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded text-center">
        <img src="https://placehold.co/800x400/1e3048/ffd43b?text=PYTHON+GIL+ARCHITECTURE+DIAGRAM" alt="Arquitetura GIL" class="w-full h-auto rounded shadow">
        <p class="text-xs font-mono mt-2 opacity-70">Figura 1.1: Mecanismo de liberação de lock entre threads e cores de CPU.</p>
      </div>

      <h2 id="futuro-sem-gil" class="text-2xl font-bold font-sans pt-4">4. O Futuro: PEP 703 e o Python Sem GIL</h2>
      <p>Com as discussões lideradas por Sam Gross e aceitas pelo comitê do Python, o futuro aponta para builds opcionais onde o GIL pode ser desativado. Isso abrirá portas para aplicações concorrentes em larga escala sem a necessidade obrigatória de arquiteturas complexas baseadas estritamente em multiprocessamento.</p>
    `,
    comments: [
      { author: 'Ana_DevOps', role: 'SRE Specialist', date: 'Há 2 horas', text: 'Excelente artigo! O uso de multiprocessing sempre foi nosso workaround favorito em lambdas e microsserviços.' },
      { author: 'Carlos_Py', role: 'Backend Lead', date: 'Há 5 horas', text: 'Muito claro. A explicação da PEP 703 tirou todas as minhas dúvidas sobre o futuro da linguagem.' }
    ],
    likes: 42
  },
  {
    id: 'art-2',
    title: 'Orquestração de Containers em Ambientes de Alta Performance com Docker e Kubernetes',
    category: 'DevOps',
    date: '12 Out 2026',
    readTime: '9 min de leitura',
    views: 2890,
    author: 'LinuxOps Master',
    avatar: 'LM',
    summary: 'Boas práticas para otimização de imagens Docker multi-stage, redução de vulnerabilidades em containers e gerenciamento de pods em clusters Kubernetes.',
    tags: ['devops', 'docker', 'kubernetes', 'linux'],
    content: `
      <h2 id="introducao-devops" class="text-2xl font-bold font-sans pt-2">1. Introdução à Engenharia de Containers</h2>
      <p>Containerização não se resume apenas a empacotar dependências, mas a garantir portabilidade segura e eficiência de recursos computacionais em ambientes de produção de missão crítica.</p>

      <h2 id="dockerfile-otimizado" class="text-2xl font-bold font-sans pt-4">2. Exemplo de Dockerfile Multi-Stage Otimizado</h2>
      <p>Veja como estruturar um build limpo utilizando Alpine Linux como base final:</p>

      <div class="relative bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 code-block my-4 text-sm overflow-x-auto">
        <button onclick="navigator.clipboard.writeText(this.parentElement.querySelector('pre').innerText); alert('Código copiado!');" class="absolute top-2 right-2 bg-slate-800 hover:bg-sky-600 text-amber-300 px-2 py-1 text-xs rounded border border-slate-700 transition-colors cursor-pointer">
          <i class="fa-regular fa-copy mr-1"></i> Copiar
        </button>
        <pre><code><span class="text-amber-300">FROM</span> python:3.11-slim AS builder
<span class="text-amber-300">WORKDIR</span> /app
<span class="text-amber-300">COPY</span> requirements.txt .
<span class="text-amber-300">RUN</span> pip install --no-cache-dir --user -r requirements.txt

<span class="text-amber-300">FROM</span> python:3.11-alpine
<span class="text-amber-300">WORKDIR</span> /app
<span class="text-amber-300">COPY</span> --from=builder /root/.local /root/.local
<span class="text-amber-300">COPY</span> . .
<span class="text-amber-300">ENV</span> PATH=/root/.local/bin:$PATH
<span class="text-amber-300">EXPOSE</span> 8000
<span class="text-amber-300">CMD</span> ["python", "main.py"]</code></pre>
      </div>

      <h2 id="conclusoes-infra" class="text-2xl font-bold font-sans pt-4">3. Considerações Finais</h2>
      <p>Manter o escopo das imagens reduzido minimiza a superfície de ataque e acelera o tempo de deploy em pipelines CI/CD modernos.</p>
    `,
    comments: [
      { author: 'Julio_Sec', role: 'Security Engineer', date: 'Ontem', text: 'A abordagem multi-stage com alpine é indispensável hoje em dia.' }
    ],
    likes: 29
  },
  {
    id: 'art-3',
    title: 'Fine-Tuning de LLMs Open-Source: Da Teoria à Aplicação Prática',
    category: 'IA',
    date: '10 Out 2026',
    readTime: '12 min de leitura',
    views: 4120,
    author: 'Dr. Neural',
    avatar: 'DN',
    summary: 'Como adaptar modelos de linguagem de grande porte usando técnicas eficientes de adaptação (LoRA e QLoRA) em GPUs de consumo.',
    tags: ['ai', 'llm', 'python', 'machine_learning'],
    content: `
      <h2 id="contexto-ia" class="text-2xl font-bold font-sans pt-2">1. O Cenário Atual dos LLMs</h2>
      <p>Treinar modelos do zero é proibitivo para a maioria das empresas. O fine-tuning eficiente via LoRA (Low-Rank Adaptation) permite personalizar modelos robustos com fração dos recursos computacionais.</p>

      <h2 id="script-python-lora" class="text-2xl font-bold font-sans pt-4">2. Configurando LoRA em Python</h2>
      <div class="relative bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 code-block my-4 text-sm overflow-x-auto">
        <button onclick="navigator.clipboard.writeText(this.parentElement.querySelector('pre').innerText); alert('Código copiado!');" class="absolute top-2 right-2 bg-slate-800 hover:bg-sky-600 text-amber-300 px-2 py-1 text-xs rounded border border-slate-700 transition-colors cursor-pointer">
          <i class="fa-regular fa-copy mr-1"></i> Copiar
        </button>
        <pre><code><span class="text-amber-300">from</span> peft <span class="text-amber-300">import</span> LoraConfig, get_peft_model
<span class="text-amber-300">import</span> torch

config = LoraConfig(
    r=<span class="text-emerald-400">16</span>,
    lora_alpha=<span class="text-emerald-400">32</span>,
    target_modules=[<span class="text-emerald-300">"q_proj"</span>, <span class="text-emerald-300">"v_proj"</span>],
    lora_dropout=<span class="text-emerald-400">0.05</span>,
    bias=<span class="text-emerald-300">"none"</span>,
    task_type=<span class="text-emerald-300">"CAUSAL_LM"</span>
)
print("Configuração LoRA aplicada com sucesso.")</code></pre>
      </div>
    `,
    comments: [],
    likes: 56
  },
  {
    id: 'art-4',
    title: 'Kernel Linux e Sysadmin: Monitorando Performance com eBPF',
    category: 'Linux',
    date: '08 Out 2026',
    readTime: '8 min de leitura',
    views: 1950,
    author: 'LinuxOps Master',
    avatar: 'LM',
    summary: 'Descubra como o eBPF revoluciona a observabilidade e segurança de sistemas operacionais modernos sem alterar o código kernel.',
    tags: ['linux', 'ebpf', 'kernel', 'sysadmin'],
    content: `
      <h2 id="introducao-ebpf" class="text-2xl font-bold font-sans pt-2">1. O Poder do eBPF no Kernel</h2>
      <p>Extended Berkeley Packet Filter permite executar programas sandbox diretamente no kernel Linux com segurança e alta performance.</p>
    `,
    comments: [],
    likes: 18
  },
  {
    id: 'art-5',
    title: 'Arquitetura de Microsserviços Resilientes com Event Sourcing',
    category: 'Infraestrutura',
    date: '05 Out 2026',
    readTime: '10 min de leitura',
    views: 2100,
    author: 'Guido Dev',
    avatar: 'GD',
    summary: 'Padrões avançados para persistência de estados imutáveis e garantia de consistência eventual em sistemas distribuídos.',
    tags: ['architecture', 'backend', 'events', 'infra'],
    content: `
      <h2 id="event-sourcing-basico" class="text-2xl font-bold font-sans pt-2">1. Imutabilidade e Auditoria Total</h2>
      <p>Em vez de armazenar apenas o estado atual de uma entidade, armazenamos cada mudança de estado como um evento sequencial.</p>
    `,
    comments: [],
    likes: 25
  },
  {
    id: 'art-6',
    title: 'TypeScript Avançado: Tipos Condicionais e Mapped Types na Prática',
    category: 'Programação',
    date: '02 Out 2026',
    readTime: '6 min de leitura',
    views: 2600,
    author: 'Dr. Neural',
    avatar: 'DN',
    summary: 'Domine a metaprogramação de tipos no TypeScript para criar APIs frontend totalmente seguras e autocompletáveis.',
    tags: ['typescript', 'frontend', 'javascript', 'code'],
    content: `
      <h2 id="tipos-avancados-ts" class="text-2xl font-bold font-sans pt-2">2. Mapped Types Explicados</h2>
      <p>Manipule propriedades de objetos dinamicamente com utilitários avançados de tipagem.</p>
    `,
    comments: [],
    likes: 31
  }
];

export const getStoredArticles = () => {
  const data = localStorage.getItem('quarkops_articles');
  if (!data) {
    localStorage.setItem('quarkops_articles', JSON.stringify(INITIAL_ARTICLES));
    return INITIAL_ARTICLES;
  }
  return JSON.parse(data);
};

export const saveArticles = (articles) => {
  localStorage.setItem('quarkops_articles', JSON.stringify(articles));
};