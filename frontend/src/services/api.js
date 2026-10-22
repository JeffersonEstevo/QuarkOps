// src/services/api.js
// Fachada única consumida pela aplicação (useArticles, AuthProvider, etc.).
// Trocar de adapter é só mudar VITE_API_ADAPTER (local | http).
// Default: local (MVP). http é stub — pronto para o Passo 5 do PROGRESS.md.

import { localStorageAdapter } from './adapters/localStorageAdapter';
import { httpAdapter } from './adapters/httpAdapter';

const ADAPTERS = {
  local: localStorageAdapter,
  http: httpAdapter,
};

const ADAPTER_NAME = import.meta.env.VITE_API_ADAPTER || 'local';

if (!ADAPTERS[ADAPTER_NAME]) {
  throw new Error(
    `[QuarkOps] Unknown VITE_API_ADAPTER: "${ADAPTER_NAME}". Use "local" ou "http".`
  );
}

if (import.meta.env.DEV) {
  console.info(`[QuarkOps] API adapter ativo: ${ADAPTER_NAME}`);
}

export const api = ADAPTERS[ADAPTER_NAME];