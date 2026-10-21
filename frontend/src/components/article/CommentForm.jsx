// frontend/src/components/article/CommentForm.jsx
import { useState } from 'react';
import Button from '../ui/Button';

/**
 * Formulário de novo comentário. Controla o próprio estado e só
 * chama `onSubmit(payload)` quando válido.
 *
 * Props:
 *  - onSubmit → ({ author, role, text }) => void
 */
export default function CommentForm({ onSubmit }) {
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    onSubmit({
      author: author.trim(),
      role: role.trim(),
      text: text.trim(),
    });

    // Reset
    setAuthor('');
    setRole('');
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-python-lightbg dark:bg-slate-900 border border-python-lightborder dark:border-slate-700 p-4 space-y-4 pixel-border-sm"
    >
      <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-python-blue">
        // Adicionar Novo Comentário
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono mb-1">Seu Nome / Handle:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            placeholder="ex: dev_ninja_99"
            className="w-full bg-white dark:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-python-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-mono mb-1">Cargo / Tag (Opcional):</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="ex: Python Dev @ Startup"
            className="w-full bg-white dark:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-python-blue"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono mb-1">Seu Comentário Técnico:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={3}
          placeholder="Compartilhe sua visão..."
          className="w-full bg-white dark:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-python-blue resize-none"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" icon="fa-solid fa-paper-plane">
          ENVIAR COMENTÁRIO
        </Button>
      </div>
    </form>
  );
}