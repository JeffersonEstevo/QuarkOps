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