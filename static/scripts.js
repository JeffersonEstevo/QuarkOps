/* ============================================================
   RETRO-TECH · scripts.js
   ============================================================ */

const AppState = {
  currentRoute: 'home',
  currentTopic: null,
  currentPostId: null,
  theme: localStorage.getItem('retrotech-theme') || 'dark',

  posts: [
    {
      id: 1,
      title: 'Rust vs. C++: A Batalha pela Performance Segura',
      category: 'Arquitetura de Software',
      tags: ['rust', 'cpp', 'performance'],
      date: '2025-03-12',
      readTime: '8 min',
      author: 'Ana Vega',
      excerpt: 'Ownership, borrow checker e zero-cost abstractions. Por que Rust está redefinindo o que esperamos de sistemas de alto desempenho.',
      cover: '🦀',
      featured: true,
      sections: [
        { id: 'intro', title: 'Introdução' },
        { id: 'ownership', title: 'Ownership e Borrowing' },
        { id: 'comparacao', title: 'Comparação de Performance' },
        { id: 'conclusao', title: 'Conclusão' }
      ],
      content: `
        <h2 id="intro">Introdução</h2>
        <p>Rust surgiu como uma alternativa moderna ao C++ para sistemas que exigem performance extrema <strong>sem abrir mão da segurança de memória</strong>.</p>
        <h2 id="ownership">Ownership e Borrowing</h2>
        <p>O sistema de <em>ownership</em> elimina toda uma classe de bugs em tempo de compilação. Veja um exemplo:</p>
        <pre><code class="language-rust">fn main() {
    let s1 = String::from("retro");
    let s2 = s1; // move — s1 não é mais válido
    println!("{}", s2);
}</code></pre>
        <div class="callout warning">⚠️ Diferente de C++, Rust não permite uso após move sem empréstimo explícito.</div>
        <h2 id="comparacao">Comparação de Performance</h2>
        <p>Benchmarks recentes mostram Rust empatando ou superando C++ em tarefas de parsing e concorrência.</p>
        <pre><code class="language-bash">$ hyperfine './cpp_parser' './rust_parser'
Benchmark 1: ./cpp_parser
  Time (mean ± σ):      1.24 s ±  0.05 s
Benchmark 2: ./rust_parser
  Time (mean ± σ):      1.18 s ±  0.03 s</code></pre>
        <h2 id="conclusao">Conclusão</h2>
        <p>Ambas as linguagens são excelentes. Rust traz segurança; C++ traz maturidade. O futuro é poli‑glota.</p>
      `
    },
    {
      id: 2,
      title: 'Kubernetes na Borda: Padrões para IoT em Larga Escala',
      category: 'DevOps & Cloud',
      tags: ['kubernetes', 'iot', 'edge'],
      date: '2025-03-08',
      readTime: '6 min',
      author: 'Carlos M.',
      excerpt: 'K3s, KubeEdge e estratégias para orquestrar milhares de dispositivos com latência mínima.',
      cover: '☸️',
      featured: false,
      sections: [{ id: 'intro', title: 'Introdução' }, { id: 'padroes', title: 'Padrões' }],
      content: `
        <h2 id="intro">Introdução</h2>
        <p>Levar Kubernetes para a borda exige repensar etcd, rede e atualizações.</p>
        <h2 id="padroes">Padrões</h2>
        <p>Use <strong>K3s</strong> para clusters leves e <strong>KubeEdge</strong> para sincronização cloud‑edge.</p>
        <pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: edge-agent
spec:
  replicas: 3
  template:
    spec:
      nodeSelector:
        node-role.kubernetes.io/edge: ""</code></pre>
      `
    },
    {
      id: 3,
      title: 'IA Generativa no Frontend: Riscos e Oportunidades',
      category: 'Inteligência Artificial',
      tags: ['ia', 'frontend', 'llm'],
      date: '2025-03-01',
      readTime: '5 min',
      author: 'Beatriz L.',
      excerpt: 'Como usar LLMs no navegador com WebGPU e quais cuidados tomar com privacidade.',
      cover: '🧠',
      featured: false,
      sections: [{ id: 'intro', title: 'Introdução' }, { id: 'webgpu', title: 'WebGPU' }],
      content: `
        <h2 id="intro">Introdução</h2>
        <p>Rodar modelos no cliente reduz latência e custo — mas exige atenção à privacidade.</p>
        <h2 id="webgpu">WebGPU</h2>
        <pre><code class="language-javascript">const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();
const model = await loadModel('./model.onnx');
const output = await model.run(input, { device });</code></pre>
      `
    },
    {
      id: 4,
      title: 'Zero Trust para Desenvolvedores: Um Guia Prático',
      category: 'Segurança',
      tags: ['zero-trust', 'seguranca', 'devops'],
      date: '2025-02-25',
      readTime: '7 min',
      author: 'Diego R.',
      excerpt: 'MFA, mTLS e políticas de menor privilégio aplicadas ao ciclo de desenvolvimento.',
      cover: '🔐',
      featured: false,
      sections: [{ id: 'intro', title: 'Introdução' }, { id: 'mtls', title: 'mTLS' }],
      content: `
        <h2 id="intro">Introdução</h2>
        <p>Zero Trust não é produto: é arquitetura. Comece pelo pipeline.</p>
        <h2 id="mtls">mTLS</h2>
        <pre><code class="language-bash"># Gerar par de chaves para serviço
openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \\
  -keyout service.key -out service.crt</code></pre>
      `
    }
  ]
};

// ============================================================
// TEMAS
// ============================================================
function initTheme() {
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const iconDark = document.getElementById('theme-icon-dark');
  const iconLight = document.getElementById('theme-icon-light');

  function applyTheme(theme) {
    if (theme === 'light') {
      html.classList.remove('dark');
      html.classList.add('light');
      iconDark.classList.add('hidden');
      iconLight.classList.remove('hidden');
    } else {
      html.classList.add('dark');
      html.classList.remove('light');
      iconDark.classList.remove('hidden');
      iconLight.classList.add('hidden');
    }
    AppState.theme = theme;
    localStorage.setItem('retrotech-theme', theme);
  }

  toggle.addEventListener('click', () => {
    applyTheme(AppState.theme === 'dark' ? 'light' : 'dark');
  });

  applyTheme(AppState.theme);
}

// ============================================================
// DIGITAÇÃO — APENAS NA MARCA (#terminal-brand)
// Nenhum outro elemento é tocado por esta função.
// ============================================================
function initTypingEffect() {
  const el = document.getElementById('terminal-brand');
  if (!el) return;

  const phrases = [
    { retro: 'Retro', tech: 'Tech' },
    { retro: 'Retro', tech: 'Dev' },
    { retro: 'Retro', tech: 'Code' },
    { retro: 'Retro', tech: 'Byte' }
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function render() {
    const { retro, tech } = phrases[phraseIndex];
    const full = retro + tech;
    const visible = full.substring(0, charIndex);

    if (visible.length <= retro.length) {
      el.innerHTML = visible;
    } else {
      const techVisible = visible.substring(retro.length);
      el.innerHTML = `${retro}<span class="text-neon-purple">${techVisible}</span>`;
    }
  }

  function tick() {
    const { retro, tech } = phrases[phraseIndex];
    const full = retro + tech;

    if (!deleting) {
      charIndex++;
      render();
      if (charIndex >= full.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 110);
    } else {
      charIndex--;
      render();
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 55);
    }
  }

  tick();
}

// ============================================================
// CANVAS DE FUNDO
// ============================================================
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const COUNT = 55;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.8,
        hue: Math.random() > 0.5 ? '#5eead4' : '#c084fc'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.hue;
      ctx.globalAlpha = 0.55;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].hue;
          ctx.globalAlpha = 0.07;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

// ============================================================
// PROGRESSO DE LEITURA
// ============================================================
function initReadingProgress() {
  const bar = document.getElementById('reading-progress-bar');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }

  window.addEventListener('scroll', update);
  window.addEventListener('resize', update);
}

// ============================================================
// COPIAR CÓDIGO
// ============================================================
function initCopyButtons() {
  document.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'copiar';
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.innerText);
        btn.textContent = 'copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'copiar';
          btn.classList.remove('copied');
        }, 1800);
      } catch (err) { console.warn(err); }
    });
    pre.appendChild(btn);
  });
}

// ============================================================
// SYNTAX HIGHLIGHTING
// ============================================================
function highlightAll() {
  document.querySelectorAll('pre code').forEach(block => {
    const lang = block.className.match(/language-(\w+)/);
    block.innerHTML = highlightCode(block.innerText, lang ? lang[1] : 'text');
  });
}

function highlightCode(code, lang) {
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  escaped = escaped.replace(/(\/\/[^\n]*|#[^\n]*)/g, '<span class="token comment">$1</span>');
  escaped = escaped.replace(/(["'`])(?:\\.|[^\\])*?\1/g, '<span class="token string">$&</span>');

  const keywords = {
    javascript: /\b(const|let|var|function|return|if|else|for|while|class|new|async|await|import|export|from|of|in|try|catch|throw|typeof|instanceof)\b/g,
    python: /\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|with|lambda|None|True|False|and|or|not|in|is)\b/g,
    rust: /\b(fn|let|mut|const|struct|enum|impl|trait|pub|use|mod|match|if|else|for|while|loop|return|move|async|await|where|Self|self)\b/g,
    bash: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|echo|export|source|alias|local)\b/g,
    yaml: /\b(apiVersion|kind|metadata|spec|name|replicas|template|containers|image|ports)\b/g
  };

  const kw = keywords[lang];
  if (kw) escaped = escaped.replace(kw, '<span class="token keyword">$&</span>');
  escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="token number">$1</span>');
  return escaped;
}

// ============================================================
// ROTEADOR
// ============================================================
function navigate(route, options = {}) {
  AppState.currentRoute = route;
  if (options.topic) AppState.currentTopic = options.topic;
  if (options.postId) AppState.currentPostId = options.postId;
  renderView();
  updateActiveNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.route === AppState.currentRoute) link.classList.add('active');
  });
}

// ============================================================
// VIEWS
// ============================================================
function renderHome() {
  const featured = AppState.posts.find(p => p.featured) || AppState.posts[0];
  const others = AppState.posts.filter(p => p.id !== featured.id);

  return `
    <section class="animate-fade-in-up">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div class="lg:col-span-2 post-card p-6 md:p-8 pixel-border">
          <span class="text-xs font-mono text-neon-purple uppercase tracking-widest">// destaque</span>
          <h1 class="mt-3 text-2xl md:text-4xl font-bold leading-tight">${featured.title}</h1>
          <p class="mt-4 text-gray-400 leading-relaxed">${featured.excerpt}</p>
          <div class="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-500 font-mono">
            <span class="px-2 py-1 rounded bg-deep-soft border border-gray-700">${featured.category}</span>
            <span>${featured.date}</span>
            <span>·</span>
            <span>${featured.readTime}</span>
            <span>·</span>
            <span>${featured.author}</span>
          </div>
          <button data-route="post" data-post-id="${featured.id}" class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-to-r from-neon-blue to-neon-purple text-deep font-semibold hover:opacity-90 transition-opacity">
            ler artigo
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>
        <div class="post-card p-6 flex flex-col justify-between glow-pulse">
          <div>
            <div class="text-6xl mb-4 text-center">${featured.cover}</div>
            <h3 class="font-mono text-sm text-neon-blue"># leitura_rapida</h3>
            <p class="mt-2 text-sm text-gray-400">Este é o artigo em destaque da semana. Não perca.</p>
          </div>
          <div class="mt-4 text-xs text-gray-500 font-mono">// ${featured.tags.join(' · ')}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <h2 class="text-xl font-bold border-b border-gray-800 pb-3">Últimos artigos</h2>
          ${others.map(p => renderPostCard(p)).join('')}
        </div>

        <aside class="space-y-6">
          <div class="sidebar-widget">
            <h3 class="font-mono text-sm text-neon-blue mb-3"># mais_lidos</h3>
            ${AppState.posts.slice(0, 5).map((p, i) => `
              <div class="ranked-post">
                <span class="ranked-number">${String(i + 1).padStart(2, '0')}</span>
                <div>
                  <button data-route="post" data-post-id="${p.id}" class="text-sm font-medium hover:text-neon-blue transition-colors text-left">${p.title}</button>
                  <div class="text-xs text-gray-500 mt-1 font-mono">${p.readTime} · ${p.author}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="sidebar-widget">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-deep font-bold font-display">RT</div>
              <div>
                <div class="font-semibold">Redação RetroTech</div>
                <div class="text-xs text-gray-500 font-mono">@retrotech</div>
              </div>
            </div>
            <p class="mt-3 text-sm text-gray-400">Escrevemos sobre o futuro com um toque de nostalgia. Tecnologia sem hype, com profundidade.</p>
          </div>

          <div class="sidebar-widget">
            <h3 class="font-mono text-sm text-neon-purple mb-2"># newsletter</h3>
            <p class="text-sm text-gray-400 mb-3">Receba artigos novos direto no seu e‑mail.</p>
            <form id="newsletter-form" class="space-y-2">
              <input type="email" required placeholder="seu@email.com" class="w-full px-3 py-2 rounded-md bg-deep border border-gray-700 text-sm focus:outline-none focus:border-neon-blue transition-colors font-mono">
              <button type="submit" class="w-full px-3 py-2 rounded-md bg-neon-blue text-deep font-semibold text-sm hover:opacity-90 transition-opacity">inscrever</button>
            </form>
            <div id="newsletter-feedback" class="form-feedback mt-2 text-xs text-green-400 opacity-0">✓ inscrição confirmada!</div>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderPostCard(post) {
  return `
    <article class="post-card p-5 flex gap-4 items-start">
      <div class="text-4xl flex-shrink-0">${post.cover}</div>
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1 font-mono">
          <span class="px-2 py-0.5 rounded bg-deep-soft border border-gray-700 text-neon-blue">${post.category}</span>
          <span>${post.date}</span>
          <span>·</span>
          <span>${post.readTime}</span>
        </div>
        <h3 class="font-semibold text-lg leading-snug hover:text-neon-blue transition-colors">
          <button data-route="post" data-post-id="${post.id}" class="text-left">${post.title}</button>
        </h3>
        <p class="mt-2 text-sm text-gray-400 line-clamp-2">${post.excerpt}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          ${post.tags.map(t => `<span class="text-xs font-mono text-neon-purple">#${t}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}

function renderTopics() {
  const topics = [
    { id: 'ia', name: 'Inteligência Artificial', icon: '🧠', desc: 'LLMs, visão computacional, ética em IA.' },
    { id: 'web', name: 'Desenvolvimento Web', icon: '🌐', desc: 'Frontend, backend, frameworks modernos.' },
    { id: 'arquitetura', name: 'Arquitetura de Software', icon: '🏗️', desc: 'Padrões, microsserviços, sistemas distribuídos.' },
    { id: 'devops', name: 'DevOps & Cloud', icon: '☁️', desc: 'CI/CD, Kubernetes, infraestrutura como código.' },
    { id: 'seguranca', name: 'Segurança', icon: '🔐', desc: 'Zero Trust, criptografia, AppSec.' }
  ];

  const active = AppState.currentTopic;
  const filtered = active
    ? AppState.posts.filter(p => p.category.toLowerCase().includes(active) || p.tags.includes(active))
    : AppState.posts;

  return `
    <section class="animate-fade-in-up">
      <h1 class="text-3xl font-bold mb-2">Conteúdos Gerais</h1>
      <p class="text-gray-400 mb-8">Explore por tema ou navegue pela árvore de conhecimento.</p>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        ${topics.map(t => `
          <button data-route="topics" data-topic="${t.id}"
            class="post-card p-4 text-left ${active === t.id ? 'border-neon-blue ring-1 ring-neon-blue' : ''}">
            <div class="text-2xl mb-2">${t.icon}</div>
            <div class="text-sm font-semibold">${t.name}</div>
            <div class="text-xs text-gray-500 mt-1">${t.desc}</div>
          </button>
        `).join('')}
      </div>

      <h2 class="text-xl font-bold border-b border-gray-800 pb-3 mb-6">
        ${active ? `// artigos em "${topics.find(t => t.id === active)?.name || active}"` : '// todos os artigos'}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${filtered.map(p => renderPostCard(p)).join('')}
      </div>
    </section>
  `;
}

function renderPostView() {
  const post = AppState.posts.find(p => p.id === AppState.currentPostId);
  if (!post) return `<div class="text-center py-20">Artigo não encontrado.</div>`;

  return `
    <article class="animate-fade-in-up max-w-4xl mx-auto">
      <button data-route="home" class="text-sm text-neon-blue hover:underline mb-6 inline-flex items-center gap-1 font-mono">
        ← ~/home
      </button>

      <div class="text-5xl mb-4">${post.cover}</div>
      <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3 font-mono">
        <span class="px-2 py-1 rounded bg-deep-soft border border-gray-700 text-neon-blue">${post.category}</span>
        <span>${post.date}</span>
        <span>·</span>
        <span>${post.readTime}</span>
        <span>·</span>
        <span>${post.author}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-6">${post.title}</h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside class="lg:col-span-1 toc-sidebar lg:sticky lg:top-24 h-fit">
          <div class="sidebar-widget">
            <h3 class="font-mono text-xs text-neon-purple mb-3 uppercase tracking-wider">// índice</h3>
            <nav class="space-y-1">
              ${post.sections.map(s => `<a href="#${s.id}" class="toc-link" data-toc="${s.id}">${s.title}</a>`).join('')}
            </nav>
          </div>
        </aside>

        <div class="lg:col-span-3 post-content">
          ${post.content}
        </div>
      </div>
    </article>
  `;
}

function renderAbout() {
  return `
    <section class="animate-fade-in-up max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Sobre o RetroTech</h1>
      <div class="callout">
        <p class="font-mono text-sm text-neon-blue">// nossa_missao</p>
        <p class="mt-2">Unir a estética pixelada e nostálgica dos primórdios da computação com conteúdo técnico de altíssimo nível.</p>
      </div>
      <p class="mt-6 text-gray-400 leading-relaxed">
        O RetroTech nasceu da ideia de que tecnologia não precisa ser descartável. Escrevemos artigos aprofundados, com código real e reflexões sobre o futuro.
      </p>
      <p class="mt-4 text-gray-400 leading-relaxed">
        Nossa equipe é formada por engenheiros, designers e curiosos que acreditam no poder do conhecimento compartilhado.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div class="sidebar-widget text-center">
          <div class="text-3xl font-bold text-neon-blue font-display">150+</div>
          <div class="text-xs text-gray-500 mt-1 font-mono">artigos publicados</div>
        </div>
        <div class="sidebar-widget text-center">
          <div class="text-3xl font-bold text-neon-purple font-display">12k</div>
          <div class="text-xs text-gray-500 mt-1 font-mono">leitores mensais</div>
        </div>
        <div class="sidebar-widget text-center">
          <div class="text-3xl font-bold text-neon-pink font-display">5</div>
          <div class="text-xs text-gray-500 mt-1 font-mono">autores</div>
        </div>
      </div>
    </section>
  `;
}

function renderContact() {
  return `
    <section class="animate-fade-in-up max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">Contato</h1>
      <p class="text-gray-400 mb-8">Tem uma sugestão de pauta, correção ou parceria? Escreva pra gente.</p>

      <form id="contact-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1 font-mono">// nome</label>
          <input type="text" required class="w-full px-3 py-2 rounded-md bg-deep-soft border border-gray-700 focus:outline-none focus:border-neon-blue transition-colors font-mono text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 font-mono">// email</label>
          <input type="email" required class="w-full px-3 py-2 rounded-md bg-deep-soft border border-gray-700 focus:outline-none focus:border-neon-blue transition-colors font-mono text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 font-mono">// mensagem</label>
          <textarea rows="5" required class="w-full px-3 py-2 rounded-md bg-deep-soft border border-gray-700 focus:outline-none focus:border-neon-blue transition-colors font-mono text-sm"></textarea>
        </div>
        <button type="submit" class="px-6 py-2.5 rounded-md bg-gradient-to-r from-neon-blue to-neon-purple text-deep font-semibold hover:opacity-90 transition-opacity font-mono">
          $ enviar
        </button>
      </form>
      <div id="contact-feedback" class="form-feedback mt-3 text-sm text-green-400 opacity-0 font-mono">✓ mensagem enviada!</div>
    </section>
  `;
}

function renderEditor() {
  return `
    <section class="animate-fade-in-up">
      <h1 class="text-3xl font-bold mb-2">Simulador de Editor</h1>
      <p class="text-gray-400 mb-8">Crie um artigo e veja‑o aparecer instantaneamente no feed.</p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form id="editor-form" class="space-y-4 post-card p-6">
          <div>
            <label class="block text-sm font-medium mb-1 font-mono">// título</label>
            <input name="title" type="text" required placeholder="Meu artigo retrô" class="w-full px-3 py-2 rounded-md bg-deep border border-gray-700 focus:outline-none focus:border-neon-blue transition-colors font-mono text-sm">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1 font-mono">// categoria</label>
              <select name="category" class="w-full px-3 py-2 rounded-md bg-deep border border-gray-700 focus:outline-none focus:border-neon-blue transition-colors font-mono text-sm">
                <option>Inteligência Artificial</option>
                <option>Desenvolvimento Web</option>
                <option>Arquitetura de Software</option>
                <option>DevOps & Cloud</option>
                <option>Segurança</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 font-mono">// autor</label>
              <input name="author" type="text" value="Você" class="w-full px-3 py-2 rounded-md bg-deep border border-gray-700 focus:outline-none focus:border-neon-blue transition-colors font-mono text-sm">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 font-mono">// resumo</label>
            <textarea name="excerpt" rows="2" required placeholder="Uma breve descrição..." class="w-full px-3 py-2 rounded-md bg-deep border border-gray-700 focus:outline-none focus:border-neon-blue transition-colors font-mono text-sm"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 font-mono">// tags</label>
            <input name="tags" type="text" placeholder="rust, performance, systems" class="w-full px-3 py-2 rounded-md bg-deep border border-gray-700 focus:outline-none focus:border-neon-blue transition-colors font-mono text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 font-mono">// conteúdo (HTML)</label>
            <textarea name="content" rows="6" placeholder="<p>Seu conteúdo aqui...</p>" class="w-full px-3 py-2 rounded-md bg-deep border border-gray-700 focus:outline-none focus:border-neon-blue transition-colors font-mono text-sm"></textarea>
          </div>
          <button type="submit" class="w-full px-6 py-3 rounded-md bg-gradient-to-r from-neon-blue to-neon-purple text-deep font-semibold hover:opacity-90 transition-opacity font-mono">
            $ publicar
          </button>
          <div id="editor-feedback" class="form-feedback text-sm text-green-400 opacity-0 text-center font-mono">✓ artigo publicado!</div>
        </form>

        <div class="post-card p-6">
          <h3 class="font-mono text-sm text-neon-purple mb-4"># preview_ao_vivo</h3>
          <div id="editor-preview" class="post-content">
            <p class="text-gray-500 italic">Preencha o formulário para ver o preview...</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// RENDER
// ============================================================
function renderView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  let html = '';
  switch (AppState.currentRoute) {
    case 'home': html = renderHome(); break;
    case 'topics': html = renderTopics(); break;
    case 'post': html = renderPostView(); break;
    case 'about': html = renderAbout(); break;
    case 'contact': html = renderContact(); break;
    case 'editor': html = renderEditor(); break;
    default: html = renderHome();
  }

  container.innerHTML = html;
  highlightAll();
  initCopyButtons();
  bindViewEvents();
}

// ============================================================
// EVENTOS DAS VIEWS
// ============================================================
function bindViewEvents() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fb = document.getElementById('newsletter-feedback');
      fb.style.opacity = '1';
      newsletterForm.reset();
      setTimeout(() => { fb.style.opacity = '0'; }, 3000);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fb = document.getElementById('contact-feedback');
      fb.style.opacity = '1';
      contactForm.reset();
      setTimeout(() => { fb.style.opacity = '0'; }, 3000);
    });
  }

  const editorForm = document.getElementById('editor-form');
  if (editorForm) {
    editorForm.addEventListener('submit', handleEditorSubmit);
    editorForm.addEventListener('input', updateEditorPreview);
    updateEditorPreview();
  }

  document.querySelectorAll('[data-toc]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.toc);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.dataset.route;
      const options = {};
      if (el.dataset.topic) options.topic = el.dataset.topic;
      if (el.dataset.postId) options.postId = parseInt(el.dataset.postId);
      navigate(route, options);
    });
  });
}

// ============================================================
// EDITOR
// ============================================================
function handleEditorSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  const newPost = {
    id: Date.now(),
    title: data.get('title'),
    category: data.get('category'),
    author: data.get('author') || 'Anônimo',
    excerpt: data.get('excerpt'),
    tags: (data.get('tags') || '').split(',').map(t => t.trim()).filter(Boolean),
    date: new Date().toISOString().split('T')[0],
    readTime: '3 min',
    cover: '📝',
    featured: false,
    sections: [],
    content: data.get('content') || '<p>Sem conteúdo.</p>'
  };

  AppState.posts.unshift(newPost);
  const fb = document.getElementById('editor-feedback');
  fb.style.opacity = '1';
  form.reset();
  setTimeout(() => { fb.style.opacity = '0'; }, 2500);
}

function updateEditorPreview() {
  const form = document.getElementById('editor-form');
  if (!form) return;
  const preview = document.getElementById('editor-preview');
  if (!preview) return;

  const title = form.title.value || 'Título do artigo';
  const excerpt = form.excerpt.value || 'Resumo aparecerá aqui...';
  const content = form.content.value || '<p class="text-gray-500 italic">Conteúdo aparecerá aqui...</p>';

  preview.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${escapeHtml(title)}</h2>
    <p class="text-gray-400 mb-4">${escapeHtml(excerpt)}</p>
    <hr class="border-gray-700 my-4">
    <div>${content}</div>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();      // só a marca
  initBackgroundCanvas();
  initReadingProgress();

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  }

  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.dataset.route;
      const options = {};
      if (el.dataset.topic) options.topic = el.dataset.topic;
      if (el.dataset.postId) options.postId = parseInt(el.dataset.postId);
      navigate(route, options);
      mobileMenu?.classList.add('hidden');
    });
  });

  renderView();
});