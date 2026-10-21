// frontend/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ThemeProvider from './components/providers/ThemeProvider';
import ToastProvider from './components/providers/ToastProvider';
import AuthProvider from './components/providers/AuthProvider';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);