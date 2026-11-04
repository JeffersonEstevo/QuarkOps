// frontend/src/utils/constants.js
// Constantes globais da aplicação. Evita strings mágicas espalhadas pelo código.

export const STORAGE_VERSION = '4.0.0';

export const STORAGE_KEYS = {
  ARTICLES: 'quarkops_articles',
  ARTICLES_VERSION: 'quarkops_articles_version',
  STORAGE_VERSION: 'quarkops_storage_version',
  THEME: 'quarkops_theme',
  // Legado — removidos na migração de versão
  LEGACY_THEME: 'theme',
  LEGACY_BYTE_LORE_THEME: 'byte_lore_theme',
  CRM_AUTH: 'quarkops_crm_auth',
};

export const CATEGORIES = [
  'ALL',
  'Programação',
  'IA',
  'DevOps',
  'Linux',
  'Infraestrutura',
];

export const DEFAULT_AUTHOR = 'Guido Dev';
export const DEFAULT_READ_TIME = '5 min de leitura';

export const TOAST_DURATION_MS = 3000;

export const VIEWS = {
  HOME: 'home',
  ARTICLE: 'article',
};


/**
 * Template HTML de um bloco de código com botão "Copiar".
 * Idêntico ao usado em storage.js para manter paridade visual.
 * O botão chama `window.triggerToast` (bridge registrada no ToastProvider).
 */
export const CODE_BLOCK_TEMPLATE = `
<div class="relative bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 code-block my-4 text-sm overflow-x-auto">
  <button onclick="navigator.clipboard.writeText(this.parentElement.querySelector('pre').innerText); window.triggerToast('Código copiado para a área de transferência!');" class="absolute top-2 right-2 bg-slate-800 hover:bg-sky-600 text-amber-300 px-2 py-1 text-xs rounded border border-slate-700 transition-colors cursor-pointer">
    <i class="fa-regular fa-copy mr-1"></i> Copiar
  </button>
  <pre><code>COLE_O_CODIGO_AQUI</code></pre>
</div>`;

/**
 * Senha local do CRM (simulação de RF-013).
 * ⚠️ Em produção: substituir por autenticação real (Django JWT ou Session Auth).
 * Ver docs/DECISIONS.md → ADR-010.
 */
export const CRM_PASSWORD = 'admin123';