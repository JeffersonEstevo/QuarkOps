
        // Data Base of Articles
        const articlesDatabase = [
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
                        <button onclick="copyCode(this)" class="absolute top-2 right-2 bg-slate-800 hover:bg-python-blue text-python-yellow px-2 py-1 text-xs rounded border border-slate-700 transition-colors">
                            <i class="fa-regular fa-copy mr-1"></i> Copiar
                        </button>
                        <pre><code><span class="text-python-yellow">import</span> multiprocessing
<span class="text-python-yellow">import</span> time

<span class="text-python-yellow">def</span> <span class="text-blue-400">heavy_computation</span>(worker_id):
    print(f"Processo {worker_id} iniciado...")
    total = sum(i * i <span class="text-python-yellow">for</span> i in range(<span class="text-emerald-400">10_000_000</span>))
    <span class="text-python-yellow">return</span> total

<span class="text-python-yellow">if</span> __name__ == <span class="text-emerald-300">"__main__"</span>:
    start_time = time.time()
    with multiprocessing.Pool(processes=4) as pool:
        results = pool.map(heavy_computation, range(4))
    print(f"Tempo total com múltiplos processos: {time.time() - start_time:.2f}s")</code></pre>
                    </div>

                    <h2 id="ilustracao-arquitetural" class="text-2xl font-bold font-sans pt-4">3. Arquitetura de Execução</h2>
                    <p>Para ilustrar o fluxo de threads sob o interpretador padrão, observe o diagrama esquemático abaixo:</p>

                    <div class="my-6 p-4 bg-slate-100 dark:bg-slate-900 border border-python-lightborder dark:border-slate-700 rounded text-center">
                        <img src="https://placehold.co/800x400/1e3048/ffd43b?text=PYTHON+GIL+ARCHITECTURE+DIAGRAM" alt="Arquitetura GIL" class="w-full h-auto rounded pixel-border-sm" onerror="this.src='https://placehold.co/800x400/387eb8/ffffff?text=Diagrama+Indisponivel'">
                        <p class="text-xs font-mono mt-2 opacity-70">Figura 1.1: Mecanismo de liberação de lock entre threads e cores de CPU.</p>
                    </div>

                    <h2 id="futuro-sem-gil" class="text-2xl font-bold font-sans pt-4">4. O Futuro: PEP 703 e o Python Sem GIL</h2>
                    <p>Com as discussões lideradas por Sam Gross e aceitas pelo comitê do Python, o futuro aponta para builds opcionais onde o GIL pode ser desativado. Isso abrirá portas para aplicações concorrentes em larga escala sem a necessidade obrigatória de arquiteturas complexas baseadas estritamente em multiprocessamento.</p>
                `,
                comments: [
                    { author: 'Ana_DevOps', role: 'SRE Specialist', date: 'Há 2 horas', text: 'Excelente artigo! O uso de multiprocessing sempre foi nosso workaround favorito em lambdas e microsserviços.' },
                    { author: 'Carlos_Py', role: 'Backend Lead', date: 'Há 5 horas', text: 'Muito claro. A explicação da PEP 703 tirou todas as minhas dúvidas sobre o futuro da linguagem.' }
                ]
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
                        <button onclick="copyCode(this)" class="absolute top-2 right-2 bg-slate-800 hover:bg-python-blue text-python-yellow px-2 py-1 text-xs rounded border border-slate-700 transition-colors">
                            <i class="fa-regular fa-copy mr-1"></i> Copiar
                        </button>
                        <pre><code><span class="text-python-yellow">FROM</span> python:3.11-slim AS builder
<span class="text-python-yellow">WORKDIR</span> /app
<span class="text-python-yellow">COPY</span> requirements.txt .
<span class="text-python-yellow">RUN</span> pip install --no-cache-dir --user -r requirements.txt

<span class="text-python-yellow">FROM</span> python:3.11-alpine
<span class="text-python-yellow">WORKDIR</span> /app
<span class="text-python-yellow">COPY</span> --from=builder /root/.local /root/.local
<span class="text-python-yellow">COPY</span> . .
<span class="text-python-yellow">ENV</span> PATH=/root/.local/bin:$PATH
<span class="text-python-yellow">EXPOSE</span> 8000
<span class="text-python-yellow">CMD</span> ["python", "main.py"]</code></pre>
                    </div>

                    <h2 id="conclusoes-infra" class="text-2xl font-bold font-sans pt-4">3. Considerações Finais</h2>
                    <p>Manter o escopo das imagens reduzido minimiza a superfície de ataque e acelera o tempo de deploy em pipelines CI/CD modernos.</p>
                `,
                comments: [
                    { author: 'Julio_Sec', role: 'Security Engineer', date: 'Ontem', text: 'A abordagem multi-stage com alpine é indispensável hoje em dia.' }
                ]
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
                        <button onclick="copyCode(this)" class="absolute top-2 right-2 bg-slate-800 hover:bg-python-blue text-python-yellow px-2 py-1 text-xs rounded border border-slate-700 transition-colors">
                            <i class="fa-regular fa-copy mr-1"></i> Copiar
                        </button>
                        <pre><code><span class="text-python-yellow">from</span> peft <span class="text-python-yellow">import</span> LoraConfig, get_peft_model
<span class="text-python-yellow">import</span> torch

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
                comments: []
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
                comments: []
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
                comments: []
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
                comments: []
            }
        ];

        let currentActiveCategory = 'ALL';
        let currentArticleId = null;

        // Initialize application on load
        window.onload = function() {
            const savedTheme = localStorage.getItem('byte_lore_theme');
            if (savedTheme === 'light') {
                document.documentElement.classList.remove('dark');
                document.getElementById('theme-icon').className = 'fa-solid fa-moon text-sm';
                if(document.getElementById('theme-icon-mob')) document.getElementById('theme-icon-mob').className = 'fa-solid fa-moon text-sm';
            } else {
                document.documentElement.classList.add('dark');
                document.getElementById('theme-icon').className = 'fa-solid fa-sun text-sm';
                if(document.getElementById('theme-icon-mob')) document.getElementById('theme-icon-mob').className = 'fa-solid fa-sun text-sm';
            }

            renderHomeView();
        };

        // Theme Toggle Handler
        function toggleTheme() {
            const isDark = document.documentElement.classList.contains('dark');
            const icon = document.getElementById('theme-icon');
            const iconMob = document.getElementById('theme-icon-mob');
            if (isDark) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('byte_lore_theme', 'light');
                icon.className = 'fa-solid fa-moon text-sm';
                if(iconMob) iconMob.className = 'fa-solid fa-moon text-sm';
                showToast('Tema Claro Suave (Soft Ivory) ativado.');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('byte_lore_theme', 'dark');
                icon.className = 'fa-solid fa-sun text-sm';
                if(iconMob) iconMob.className = 'fa-solid fa-sun text-sm';
                showToast('Tema Escuro (Midnight Python) ativado.');
            }
        }

        // Navigation Controllers
        function navigateHome() {
            currentArticleId = null;
            document.getElementById('view-article').classList.add('hidden');
            document.getElementById('view-home').classList.remove('hidden');
            document.getElementById('progress-container').classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function openArticle(id) {
            currentArticleId = id;
            const article = articlesDatabase.find(a => a.id === id);
            if (!article) return;

            article.views += 1;

            document.getElementById('art-detail-cat').innerText = article.category;
            document.getElementById('art-detail-date').innerText = article.date;
            document.getElementById('art-detail-readtime').innerText = article.readTime;
            document.getElementById('art-detail-views').innerText = article.views;
            document.getElementById('art-detail-title').innerText = article.title;
            document.getElementById('art-detail-author').innerText = article.author;
            document.getElementById('art-detail-avatar').innerText = article.author.substring(0, 2).toUpperCase();
            document.getElementById('art-detail-body').innerHTML = article.content;

            const tagsContainer = document.getElementById('art-detail-tags');
            tagsContainer.innerHTML = article.tags.map(t => `<span class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2.5 py-1">#${t}</span>`).join('');

            renderComments(article);
            generateTableOfContents();

            document.getElementById('view-home').classList.add('hidden');
            document.getElementById('view-article').classList.remove('hidden');
            document.getElementById('progress-container').classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // CRM Modal Controllers
        function openNewArticleModal() {
            document.getElementById('crm-modal').classList.remove('hidden');
        }

        function closeNewArticleModal() {
            document.getElementById('crm-modal').classList.add('hidden');
        }

        // Handle CRM Create Article Form Submission
        function handleCreateArticle(e) {
            e.preventDefault();
            const title = document.getElementById('crm-title').value.trim();
            const category = document.getElementById('crm-category').value;
            const author = document.getElementById('crm-author').value.trim();
            const readTime = document.getElementById('crm-readtime').value.trim();
            const tagsRaw = document.getElementById('crm-tags').value.trim();
            const summary = document.getElementById('crm-summary').value.trim();
            const content = document.getElementById('crm-content').value.trim();

            const newArt = {
                id: 'art-' + (articlesDatabase.length + 1),
                title: title,
                category: category,
                date: 'Hoje',
                readTime: readTime,
                views: 1,
                author: author,
                avatar: author.substring(0, 2).toUpperCase(),
                summary: summary,
                tags: tagsRaw.split(',').map(t => t.trim().replace('#', '')),
                content: content,
                comments: []
            };

            articlesDatabase.unshift(newArt);
            closeNewArticleModal();
            document.getElementById('crm-form').reset();
            renderHomeView(currentActiveCategory);
            showToast('Artigo publicado com sucesso pelo CRM!');
            
            // Open the newly created article immediately
            openArticle(newArt.id);
        }

        // Render Home View
        function renderHomeView(filter = 'ALL') {
            const sortedByViews = [...articlesDatabase].sort((a, b) => b.views - a.views);
            const featured = sortedByViews[0];

            const featuredCard = document.getElementById('featured-article-card');
            featuredCard.innerHTML = `
                <div class="flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div class="space-y-3 flex-1">
                        <div class="flex items-center space-x-3">
                            <span class="bg-python-yellow text-slate-900 font-mono text-xs font-bold px-2.5 py-1 pixel-border-sm">
                                ${featured.category}
                            </span>
                            <span class="text-xs font-mono opacity-75"><i class="fa-solid fa-chart-line text-python-yellow"></i> ${featured.views} acessos</span>
                            <span class="text-xs font-mono opacity-75"><i class="fa-regular fa-clock"></i> ${featured.readTime}</span>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-bold font-sans group-hover:text-python-blue transition-colors">
                            ${featured.title}
                        </h3>
                        <p class="text-sm opacity-95 font-sans leading-relaxed">
                            ${featured.summary}
                        </p>
                        <div class="flex items-center space-x-3 pt-2">
                            <div class="w-7 h-7 bg-python-blue text-python-yellow font-mono font-bold text-xs flex items-center justify-center pixel-border-sm">
                                ${featured.avatar}
                            </div>
                            <span class="text-xs font-mono">Por ${featured.author} &bull; ${featured.date}</span>
                        </div>
                    </div>
                    <div class="hidden lg:flex flex-col items-center justify-center bg-slate-900 text-python-yellow p-6 border border-slate-700 pixel-border-sm min-w-[180px] text-center font-mono">
                        <i class="fa-solid fa-award text-3xl mb-2"></i>
                        <span class="text-xs font-bold">TOP POST #1</span>
                        <span class="text-[10px] opacity-70 mt-1">Leitura Recomendada</span>
                    </div>
                </div>
            `;

            const filtered = filter === 'ALL' ? articlesDatabase : articlesDatabase.filter(a => a.category === filter);
            const grid = document.getElementById('articles-grid');
            
            grid.innerHTML = filtered.map(art => `
                <div onclick="openArticle('${art.id}')" class="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-5 pixel-border hover:-translate-y-1 transition-transform cursor-pointer flex flex-col justify-between space-y-4 group">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between text-xs font-mono">
                            <span class="bg-slate-200 dark:bg-slate-800 text-python-blue dark:text-python-yellow font-bold px-2 py-0.5 pixel-border-sm">
                                ${art.category}
                            </span>
                            <span class="opacity-60"><i class="fa-solid fa-eye mr-1"></i>${art.views}</span>
                        </div>
                        <h4 class="text-lg font-bold font-sans group-hover:text-python-blue transition-colors line-clamp-2">
                            ${art.title}
                        </h4>
                        <p class="text-xs opacity-80 font-sans line-clamp-3 leading-relaxed">
                            ${art.summary}
                        </p>
                    </div>
                    <div class="pt-4 border-t border-python-lightborder dark:border-slate-700 flex items-center justify-between text-xs font-mono opacity-80">
                        <span><i class="fa-regular fa-calendar mr-1"></i>${art.date}</span>
                        <span class="text-python-blue dark:text-python-yellow font-bold group-hover:underline">Ler artigo &gt;</span>
                    </div>
                </div>
            `).join('');
        }

        function filterCategory(cat) {
            currentActiveCategory = cat;
            document.querySelectorAll('.cat-btn').forEach(btn => {
                if (btn.innerText.includes(cat) || (cat === 'ALL' && btn.innerText === 'TODOS')) {
                    btn.className = 'cat-btn px-3 py-1 bg-python-blue text-white pixel-border-sm font-bold transition-all';
                } else {
                    btn.className = 'cat-btn px-3 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-python-blue hover:text-white pixel-border-sm transition-all';
                }
            });
            renderHomeView(cat);
        }

        function handleSearch(query) {
            if (!query.trim()) {
                renderHomeView(currentActiveCategory);
                return;
            }
            const q = query.toLowerCase();
            const results = articlesDatabase.filter(a => 
                a.title.toLowerCase().includes(q) || 
                a.summary.toLowerCase().includes(q) ||
                a.tags.some(t => t.toLowerCase().includes(q))
            );

            const grid = document.getElementById('articles-grid');
            if (results.length === 0) {
                grid.innerHTML = `<div class="col-span-full py-12 text-center font-mono text-sm opacity-70">// Nenhum artigo encontrado para "${query}"</div>`;
                return;
            }

            grid.innerHTML = results.map(art => `
                <div onclick="openArticle('${art.id}')" class="bg-white dark:bg-python-darkblue border-2 border-slate-800 dark:border-slate-700 p-5 pixel-border hover:-translate-y-1 transition-transform cursor-pointer flex flex-col justify-between space-y-4 group">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between text-xs font-mono">
                            <span class="bg-slate-200 dark:bg-slate-800 text-python-blue dark:text-python-yellow font-bold px-2 py-0.5 pixel-border-sm">
                                ${art.category}
                            </span>
                            <span class="opacity-60"><i class="fa-solid fa-eye mr-1"></i>${art.views}</span>
                        </div>
                        <h4 class="text-lg font-bold font-sans group-hover:text-python-blue transition-colors line-clamp-2">
                            ${art.title}
                        </h4>
                        <p class="text-xs opacity-80 font-sans line-clamp-3 leading-relaxed">
                            ${art.summary}
                        </p>
                    </div>
                    <div class="pt-4 border-t border-python-lightborder dark:border-slate-700 flex items-center justify-between text-xs font-mono opacity-80">
                        <span><i class="fa-regular fa-calendar mr-1"></i>${art.date}</span>
                        <span class="text-python-blue dark:text-python-yellow font-bold group-hover:underline">Ler artigo &gt;</span>
                    </div>
                </div>
            `).join('');
        }

        function generateTableOfContents() {
            const body = document.getElementById('art-detail-body');
            const h2Elements = body.querySelectorAll('h2');
            const tocContainer = document.getElementById('toc-container');

            if (h2Elements.length === 0) {
                tocContainer.innerHTML = '<p class="opacity-60 italic">Nenhum índice disponível.</p>';
                return;
            }

            let tocHtml = '';
            h2Elements.forEach((h2, index) => {
                if (!h2.id) {
                    h2.id = `heading-${index}`;
                }
                tocHtml += `
                    <a href="#${h2.id}" onclick="scrollToHeading(event, '${h2.id}')" class="block py-1.5 px-2 rounded hover:bg-python-blue hover:text-white transition-colors truncate">
                        &gt; ${h2.innerText}
                    </a>
                `;
            });
            tocContainer.innerHTML = tocHtml;
        }

        function scrollToHeading(e, id) {
            e.preventDefault();
            const el = document.getElementById(id);
            if (el) {
                const yOffset = -80; 
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }

        function renderComments(article) {
            const list = document.getElementById('comments-list');
            const countBadge = document.getElementById('comment-count-badge');
            countBadge.innerText = `${article.comments.length} posts`;

            if (article.comments.length === 0) {
                list.innerHTML = '<p class="text-xs font-mono opacity-60 italic">// Nenhum comentário ainda. Seja o primeiro a registrar sua contribuição!</p>';
                return;
            }

            list.innerHTML = article.comments.map(c => `
                <div class="bg-python-lightbg dark:bg-slate-900 border border-python-lightborder dark:border-slate-700 p-4 space-y-2 pixel-border-sm">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <div class="w-6 h-6 rounded bg-python-yellow text-slate-900 font-mono font-bold text-xs flex items-center justify-center pixel-border-sm">
                                ${c.author.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <span class="font-mono font-bold text-xs">${c.author}</span>
                                ${c.role ? `<span class="text-[10px] font-mono opacity-60 ml-2">(${c.role})</span>` : ''}
                            </div>
                        </div>
                        <span class="text-[10px] font-mono opacity-60">${c.date}</span>
                    </div>
                    <p class="text-xs font-sans opacity-90 pl-8 leading-relaxed">${c.text}</p>
                </div>
            `).join('');
        }

        function handlePostComment(e) {
            e.preventDefault();
            if (!currentArticleId) return;

            const authorInput = document.getElementById('comment-author');
            const roleInput = document.getElementById('comment-role');
            const textInput = document.getElementById('comment-text');

            const article = articlesDatabase.find(a => a.id === currentArticleId);
            if (!article) return;

            const newComment = {
                author: authorInput.value.trim(),
                role: roleInput.value.trim() || 'Leitor',
                date: 'Agora mesmo',
                text: textInput.value.trim()
            };

            article.comments.unshift(newComment);
            renderComments(article);

            authorInput.value = '';
            roleInput.value = '';
            textInput.value = '';

            showToast('Comentário postado com sucesso!');
        }

        function copyCode(btn) {
            const preTag = btn.parentElement.querySelector('pre');
            const textToCopy = preTag.innerText;
            
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast('Código copiado para a área de transferência!');
            } catch (err) {
                showToast('Erro ao copiar código.');
            }
            document.body.removeChild(textArea);
        }

        function shareArticle() {
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast('Link do artigo copiado para compartilhamento!');
            } catch (err) {
                showToast('Link copiado!');
            }
            document.body.removeChild(textArea);
        }

        function showToast(msg) {
            const toast = document.getElementById('toast-modal');
            const msgEl = document.getElementById('toast-message');
            msgEl.innerText = msg;
            toast.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
            setTimeout(() => {
                toast.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
            }, 3000);
        }

        window.addEventListener('scroll', () => {
            if (!currentArticleId) return;
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('progress-bar').style.width = scrolled + '%';
        });