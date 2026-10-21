// frontend/src/components/article/ArticleBody.jsx
/**
 * Corpo do artigo — injeta HTML via dangerouslySetInnerHTML.
 * O `id="art-detail-body"` é lido pelo hook `useToc` para gerar o índice.
 *
 * Depende de `@tailwindcss/typography` (plugin `@plugin "@tailwindcss/typography"`
 * no index.css). Sem o plugin, `prose` é uma classe morta e os títulos/parágrafos
 * ficam sem estilo.
 *
 * ⚠️ Segurança: conteúdo vem do CRM local (localStorage) via textarea.
 * Em produção (backend Django), sanitizar com DOMPurify antes de renderizar (ADR-007).
 *
 * Props:
 *  - content → string HTML
 */


export default function ArticleBody({ content }) {
  return (
    <div
      id="art-detail-body"
      className="
        prose dark:prose-invert max-w-none font-sans leading-relaxed space-y-6
        prose-headings:font-bold prose-headings:font-sans prose-headings:tracking-tight
        prose-h2:text-2xl prose-h2:pt-2 prose-h2:mt-6
        prose-h3:text-xl prose-h3:pt-2 prose-h3:mt-4
        prose-p:opacity-95
        prose-a:text-python-blue dark:prose-a:text-python-yellow prose-a:underline hover:prose-a:opacity-80
        prose-strong:text-python-blue dark:prose-strong:text-python-yellow
        
        /* --- CÓDIGO INLINE --- */
        prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
        
        /* --- O SEGREDO ESTÁ AQUI: Reset para blocos <pre> --- */
        prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none [&_pre_code]:text-inherit [&_pre_code]:font-normal [&_pre_code]:before:content-none [&_pre_code]:after:content-none
        
        prose-blockquote:border-l-4 prose-blockquote:border-python-yellow prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:opacity-90
        prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
        prose-img:rounded prose-img:border prose-img:border-slate-700
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}