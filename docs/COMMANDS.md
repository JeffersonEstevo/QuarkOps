# Guia de Comandos utilizados para desenvolvimento da aplicação

Aqui estão os comandos essenciais executados durante o desenvolvimento da aplicação para configurar o ambiente do frontend:

## 1. Criação do projeto
Cria a pasta do frontend utilizando o Vite com o template do React (em JavaScript):
```bash 
npm create vite@latest frontend -- --template react 
```

## 2. Instalação de dependências
Acesse a pasta do projeto recém-criada e instale os pacotes necessários:
```bash 
cd frontend; npm install 
```

## 3. Instalação do Tailwind CSS (v4)
Instale o Tailwind CSS e o plugin oficial para o Vite:
```bash 
npm install tailwindcss @tailwindcss/vite 
```

## 4. Configuração do Tailwind no Vite
Certifique-se de que o plugin está registrado no arquivo `vite.config.js`:
```javascript 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
}) 
```

*(E importe `@import "tailwindcss";` no topo do seu arquivo CSS principal).*

## 5. Instalar o plugin de tipografia para o Tailwind CSS
```bash 
npm i -D @tailwindcss/typography
```

## 6. Instalar o plugin de destaque de código

Para habilitar o destaque de sintaxe dos códigos nos posts, instale o pacote `highlight.js`:

```bash
npm i highlight.js
```

## Variáveis de Ambiente (Frontend — Vite)

Criar `.env.local` na raiz de `frontend/` para sobrescrever defaults:

| Variável | Valores | Default | Descrição |
|---|---|---|---|
| `VITE_API_ADAPTER` | `local` \| `http` | `local` | Seleciona o adapter da camada `services/api.js`. `local` = MVP (`localStorage`); `http` = Django/DRF (Passo 5). |
| `VITE_API_URL` | URL base | `/api` | Usado apenas quando `VITE_API_ADAPTER=http`. Base dos endpoints DRF. |

**Exemplo — preparar para o backend Django (fase futura):**
```bash
# frontend/.env.local
VITE_API_ADAPTER=http
VITE_API_URL=http://localhost:8000/api
```

No console (modo dev), o adapter ativo é logado: `[QuarkOps] API adapter ativo: local`.