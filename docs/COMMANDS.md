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

### 7.1 Testar Autenticação JWT (via curl)

O SimpleJWT está configurado no backend. O frontend usa o `httpAdapter` para renovar os tokens automaticamente.

```bash
# 1. Obter os tokens (substitua por suas credenciais do superusuário)
curl.exe -X POST http://localhost:8000/api/token/ -H "Content-Type: application/json" -d "{\"username\":\"SEU_USER\",\"password\":\"SUA_SENHA\"}"

# 2. Consultar o perfil do usuário logado
curl.exe http://localhost:8000/api/users/me/ -H "Authorization: Bearer SEU_ACCESS_TOKEN"

# 3. Testar o refresh de token (simula o que o frontend faz sozinho)
curl.exe -X POST http://localhost:8000/api/token/refresh/ -H "Content-Type: application/json" -d "{\"refresh\":\"SEU_REFRESH_TOKEN\"}"
```

### 8. Resetar banco do zero (⚠️ destrutivo)

Se precisar recriar tudo (ex: após alterar models com dependência forte):

```bash
docker compose -f docker-compose.yml down -v
docker compose -f docker-compose.yml up -d
python manage.py migrate
python manage.py seed_articles
```

### 9. Sanitizar posts existentes (após ADR-013)

Se houver posts criados **antes** do Passo 4 (sem sanitização), re-salve-os para aplicar `sanitize_html`:

```bash
# Modo seguro — apenas lista o que seria alterado
python manage.py sanitize_existing_posts --dry-run

# Aplicar as mudanças
python manage.py sanitize_existing_posts
```

Esperado: `Resumo: N post(s) alterado(s), M sem mudanças.`

> ⚠️ Sempre rode `--dry-run` primeiro. Posts com tags/atributos não permitidos terão esses trechos removidos.

## Integração Frontend ↔ Backend (Passo 5)

### Alternar entre adapters (localStorage ↔ HTTP)

O frontend pode operar em **modo offline** (MVP, `localStorage`) ou **modo integrado** (backend Django). A troca é feita em `frontend/.env.local`.

**Modo HTTP (backend real):**
```env
# frontend/.env.local
VITE_API_ADAPTER=http
VITE_API_URL=http://localhost:8000/api
```

**Modo Local (fallback MVP):**
```env
# frontend/.env.local
VITE_API_ADAPTER=local
# VITE_API_URL=http://localhost:8000/api  ← pode deixar comentado
```

> ⚠️ **Vite só recarrega variáveis de ambiente na inicialização.** Após editar `.env.local`, é obrigatório reiniciar o Vite (`Ctrl+C` + `npm run dev`).

### Ordem de inicialização completa (dev)

Backend e frontend rodam em terminais separados.

**Terminal 1 — Backend:**
```bash
cd backend
# Docker Desktop aberto (ícone da baleia na bandeja)
docker compose -f docker-compose.yml ps         # confirmar 'healthy'
python manage.py runserver "[::1]:8000"
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev                                     # http://localhost:5173/
```

No navegador, abra o DevTools (F12) → Console. Esperado ver:
```
[QuarkOps] API adapter ativo: http
```

### Validação rápida dos 3 cenários

| Cenário | Configuração | Esperado |
|---|---|---|
| **1. Leitura HTTP** | `VITE_API_ADAPTER=http` + backend up | Home lista posts do Postgres (3 do seed). Curtidas/comentários anônimos funcionam. |
| **2. Escrita bloqueada** | Idem, tentar CRM "Publicar" | Backend responde `401 Unauthorized` (staff exigido). UI silenciosa (erro fica no estado `error` do hook, sem toast — Passo 6). |
| **3. Fallback local** | `VITE_API_ADAPTER=local` | Home lista 6 artigos do `localStorage`. CRM funciona (criar/editar/deletar). |

> **Sobre o `[::1]:8000`:** ver nota na seção Backend. Docker Desktop pode comentar as entradas de `localhost` no `hosts` do Windows; `[::1]` contorna sem precisar editar arquivos do sistema.

## Deploy Unificado (Docker Compose)

### Pré-requisitos
- **Docker Desktop** aberto (ícone da baleia na bandeja do sistema).
- Arquivo `.env` na raiz do projeto (copiar de `.env.example` e gerar `DJANGO_SECRET_KEY`).

Gerar `DJANGO_SECRET_KEY`:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Subir tudo (primeira vez)

```bash
# Na raiz do projeto (onde está docker-compose.yml)
docker compose up --build
```

Aguarde o build (2-5 min na primeira vez). Esperado:
```
✔ Network 026_quarkops_quarkops_net    Created
✔ Container quarkops_db                Started
✔ Container quarkops_backend           Started
✔ Container quarkops_frontend          Started
```

O backend roda automaticamente: `migrate`, `collectstatic`, `seed_articles`, `gunicorn`.

### Criar superusuário (primeira vez)

Em outro terminal (o `up` fica travado mostrando logs):

```bash
docker compose exec backend python manage.py createsuperuser
```

### Acessar

- **App:** `http://localhost/`
- **Admin:** `http://localhost/admin/`
- **API:** `http://localhost/api/posts/`

### Comandos úteis

```bash
# Ver logs (backend, frontend, banco)
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Parar tudo (mantém volumes)
docker compose down

# Parar E apagar dados (⚠️ destrutivo)
docker compose down -v

# Rebuild após mudança de código
docker compose up --build

# Rodar comandos no backend
docker compose exec backend python manage.py shell
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_articles

# Backup do banco
docker compose exec -T db pg_dump -U quarkops quarkops > backup_$(date +%Y%m%d).sql

# Restore do backup
docker compose exec -T db psql -U quarkops quarkops < backup_20261103.sql
```

### Fluxo de desenvolvimento (alternativo ao deploy)

O projeto tem **dois fluxos**:

| Modo | Backend | Frontend | Postgres | Quando usar |
|---|---|---|---|---|
| **Dev** | `runserver` | `npm run dev` | `backend/docker-compose.yml` | Desenvolvimento rápido (hot reload) |
| **Deploy** | Gunicorn (Docker) | Nginx (Docker) | Raiz `docker-compose.yml` | Simular produção |

**Dev local (em dois terminais):**
```bash
# Terminal 1 (backend)
cd backend
docker compose -f docker-compose.yml up -d   # Postgres
python manage.py runserver "[::1]:8000"

# Terminal 2 (frontend)
cd frontend
npm run dev                                   # http://localhost:5173
```