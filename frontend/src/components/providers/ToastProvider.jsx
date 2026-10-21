// frontend/src/components/providers/ToastProvider.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { ToastContext } from '../../contexts/ToastContext';
import { TOAST_DURATION_MS } from '../../utils/constants';
import Toast from '../ui/Toast';

export default function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const triggerToast = useCallback((msg) => {
    setMessage(msg);
    setVisible(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, TOAST_DURATION_MS);
  }, []);

  // Limpa o timer ao desmontar o provider (evita setState em componente desmontado)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Bridge para o HTML injetado via dangerouslySetInnerHTML
  // (botões "Copiar" nos code blocks do storage.js chamam window.triggerToast).
  useEffect(() => {
    window.triggerToast = triggerToast;
    return () => {
      if (window.triggerToast === triggerToast) {
        delete window.triggerToast;
      }
    };
  }, [triggerToast]);

  return (
    <ToastContext.Provider value={{ triggerToast }}>
      {children}
      <Toast message={message} visible={visible} />
    </ToastContext.Provider>
  );
}