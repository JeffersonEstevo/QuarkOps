// frontend/src/components/ui/Toast.jsx
export default function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-slate-900 text-python-yellow border-2 border-python-yellow p-4 pixel-border font-mono text-xs flex items-center space-x-3 shadow-xl max-w-sm">
        <i className="fa-solid fa-terminal text-base"></i>
        <span>{message}</span>
      </div>
    </div>
  );
}