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


## Backend (Django + PostgreSQL)

### Pré-requisitos (instalação única, em qualquer máquina)

Instale, caso ainda não tenha:

- **Python 3.11+** — https://www.python.org/downloads/ (marque *"Add Python to PATH"* no Windows)
- **Docker Desktop** — https://www.docker.com/products/docker-desktop/
  - No Windows, requer WSL2 habilitado (instalador já oferece).

> Não é necessário instalar PostgreSQL localmente — ele roda em container Docker.

### 1. Criar ambiente virtual e instalar dependências

```bash
cd backend

# Criar venv
python -m venv venv

# Ativar (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Ativar (Windows cmd)
.\venv\Scripts\activate.bat

# Ativar (Git Bash / WSL / macOS / Linux)
source venv/Scripts/activate     # Windows (Git Bash)
source venv/bin/activate         # macOS / Linux

# Instalar dependências
pip install -r requirements.txt
```

> Se o PowerShell bloquear a ativação (*execution policy*), execute antes:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

### 2. Configurar variáveis de ambiente

```bash
# Copiar o modelo
cp .env.example .env
```

Editar `backend/.env` e substituir `DJANGO_SECRET_KEY` por uma chave real:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3. Subir o PostgreSQL (Docker)

```bash
# Na pasta backend/
docker compose -f docker-compose.yml up -d

# Conferir saúde do container
docker compose -f docker-compose.yml ps
# Esperado: quarkops_db ... Up (healthy)

# Logs (se algo falhar)
docker compose -f docker-compose.yml logs db
```

### 4. Aplicar migrations e subir o servidor

```bash
python manage.py check           # deve retornar "no issues"
python manage.py migrate         # aplica migrations default do Django no Postgres
python manage.py runserver       # sobe em http://127.0.0.1:8000/
```

Acesse **`http://localhost:8000/admin/`** — tela de login do Django Admin.

### 5. (Opcional) Criar superusuário do Admin

```bash
python manage.py createsuperuser
```

Guarde as credenciais — serão usadas para testar login real no Passo 6.

### Comandos úteis do dia a dia

```bash
# Ver logs do Postgres
docker compose -f docker-compose.yml logs -f db

# Parar Postgres (mantém dados no volume)
docker compose -f docker-compose.yml down

# Parar Postgres E apagar dados (⚠️ destrutivo)
docker compose -f docker-compose.yml down -v

# Criar novas migrations (após editar models.py)
python manage.py makemigrations
python manage.py migrate

# Abrir shell interativo do Django
python manage.py shell
```

### 6. Popular banco com dados iniciais (seed)

Após rodar `migrate` pela primeira vez, popule o banco com autores e artigos iniciais (idempotente — pode rodar várias vezes):

```bash
python manage.py seed_articles
```

Esperado: `Seed concluído: 3 novos posts criados, 3 posts no total.`

### 7. Testar endpoints da API (via curl)

Com `runserver` ativo em outro terminal:

```bash
# Listar posts
curl http://localhost:8000/api/posts/

# Detalhe (substituir <uuid> pelo id retornado acima)
curl http://localhost:8000/api/posts/<uuid>/

# Curtir (público)
curl -X POST http://localhost:8000/api/posts/<uuid>/like/

# Visualizar (público)
curl -X POST http://localhost:8000/api/posts/<uuid>/view/

# Comentar anonimamente (RF-006)
curl -X POST http://localhost:8000/api/posts/<uuid>/comments/ \
  -H "Content-Type: application/json" \
  -d '{"author_name":"Test Reader","text":"Muito bom!","role":"Leitor"}'

# Listar comentários do post
curl http://localhost:8000/api/posts/<uuid>/comments/

# Criar post (exige staff autenticado — deve retornar 403 sem token)
curl -X POST http://localhost:8000/api/posts/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","category":"Test","summary":"x","content":"<p>x</p>"}'
```

### 8. Resetar banco do zero (⚠️ destrutivo)

Se precisar recriar tudo (ex: após alterar models com dependência forte):

```bash
docker compose -f docker-compose.yml down -v
docker compose -f docker-compose.yml up -d
python manage.py migrate
python manage.py seed_articles
```
