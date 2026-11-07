# Guia de Comandos utilizados para desenvolvimento da aplicação

Aqui estão os comandos essenciais executados durante o desenvolvimento da aplicação para configurar o ambiente do frontend:

## 1. Frontend — Setup Inicial

### 1.1 Criação do projeto
Cria a pasta do frontend utilizando o Vite com o template do React (em JavaScript):
```bash 
npm create vite@latest frontend -- --template react 
```

### 1.2 Instalação de dependências
Acesse a pasta do projeto recém-criada e instale os pacotes necessários:
```bash 
cd frontend; npm install 
```

### 1.3 Instalação do Tailwind CSS (v4)
Instale o Tailwind CSS e o plugin oficial para o Vite:
```bash 
npm install tailwindcss @tailwindcss/vite 
```

### 1.4 Configuração do Tailwind no Vite
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

### 1.5 Instalar o plugin de tipografia para o Tailwind CSS
```bash 
npm i -D @tailwindcss/typography
```

### 1.6 Instalar o plugin de destaque de código
Para habilitar o destaque de sintaxe dos códigos nos posts, instale o pacote `highlight.js`:
```bash
npm i highlight.js
```

### 1.7 Variáveis de Ambiente (Frontend — Vite)
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

---

## 2. Backend — Setup Inicial (Django + PostgreSQL)

### Pré-requisitos (instalação única, em qualquer máquina)
Instale, caso ainda não tenha:
- **Python 3.11+** — https://www.python.org/downloads/ (marque *"Add Python to PATH"* no Windows)
- **Docker Desktop** — https://www.docker.com/products/docker-desktop/
  - No Windows, requer WSL2 habilitado (instalador já oferece).

> Não é necessário instalar PostgreSQL localmente — ele roda em container Docker.

### 2.1 Criar ambiente virtual e instalar dependências
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

### 2.2 Configurar variáveis de ambiente
```bash
# Copiar o modelo
cp .env.example .env
```

Editar `backend/.env` e substituir `DJANGO_SECRET_KEY` por uma chave real:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2.3 Subir o PostgreSQL (Docker — dev local)
```bash
# Na pasta backend/
docker compose -f docker-compose.yml up -d

# Conferir saúde do container
docker compose -f docker-compose.yml ps
# Esperado: quarkops_db ... Up (healthy)

# Logs (se algo falhar)
docker compose -f docker-compose.yml logs db
```

### 2.4 Aplicar migrations e subir o servidor
```bash
python manage.py check           # deve retornar "no issues"
python manage.py migrate         # aplica migrations default do Django no Postgres
python manage.py runserver       # sobe em http://127.0.0.1:8000/
```
Acesse **`http://localhost:8000/admin/`** — tela de login do Django Admin.

### 2.5 (Opcional) Criar superusuário do Admin
```bash
python manage.py createsuperuser
```
Guarde as credenciais — serão usadas para testar login real no Passo 6.

### 2.6 Popular banco com dados iniciais (seed)
Após rodar `migrate` pela primeira vez, popule o banco com autores e artigos iniciais (idempotente — pode rodar várias vezes):
```bash
python manage.py seed_articles
```
Esperado: `Seed concluído: 3 novos posts criados, 3 posts no total.`

### 2.7 Gerenciar Categorias e Subcategorias (Passo 8A)
Categorias e subcategorias são gerenciadas **exclusivamente** via Django Admin.

1. Acesse `http://localhost:8000/admin/api/category/`.
2. Clique em **Adicionar Category**.
3. Preencha:
   - **Name:** Nome exibido (ex: `Matemática`).
   - **Slug:** Gerado automaticamente (pode editar, mas evite).
   - **Description:** Opcional.
   - **Order:** Ordenação manual (menor primeiro). Ex: `Programação` = 1, `Matemática` = 10.
   - **Subcategories:** Adicione inline (ex: `Álgebra`, `Cálculo`).
4. **Salvar**.

**Regras:**
- Uma categoria pode **não ter** subcategorias (posts ficam direto nela).
- Um post pertence a **uma** categoria e, opcionalmente, a **uma** subcategoria.
- Deletar categoria com posts é **bloqueado** (PROTECT). Mova/remova os posts primeiro.

**Testar via API:**
```bash
# Categorias com subcategorias aninhadas
curl.exe http://localhost:8000/api/categories/

# Filtrar subcategorias por categoria (slug ou UUID)
curl.exe "http://localhost:8000/api/subcategories/?category_slug=programacao"
curl.exe "http://localhost:8000/api/subcategories/?category=<uuid>"

# Posts (cada um com category e subcategory aninhadas)
curl.exe http://localhost:8000/api/posts/
```

### 2.8 Comandos úteis do dia a dia (Backend)
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

### 2.9 Resetar banco do zero (⚠️ destrutivo)
Se precisar recriar tudo (ex: após alterar models com dependência forte):
```bash
docker compose -f docker-compose.yml down -v
docker compose -f docker-compose.yml up -d
python manage.py migrate
python manage.py seed_articles
```

### 2.10 Sanitizar posts existentes (após ADR-013)
Se houver posts criados **antes** do Passo 4 (sem sanitização), re-salve-os para aplicar `sanitize_html`:
```bash
# Modo seguro — apenas lista o que seria alterado
python manage.py sanitize_existing_posts --dry-run

# Aplicar as mudanças
python manage.py sanitize_existing_posts
```
Esperado: `Resumo: N post(s) alterado(s), M sem mudanças.`
> ⚠️ Sempre rode `--dry-run` primeiro. Posts com tags/atributos não permitidos terão esses trechos removidos.

---

## 3. Banco de Dados (PostgreSQL no Docker)

### 3.1 Acessar o banco via terminal (psql)
Para rodar comandos SQL diretamente no banco de dados dentro do container:
```bash
docker exec -it quarkops_db psql -U quarkops -d quarkops
```
*(Para sair do terminal do psql, digite `\q` e aperte Enter).*

### 3.2 Comandos SQL mais usados no dia a dia

**Listar todas as tabelas do projeto:**
```sql
\dt
```
*(As principais tabelas são: `api_category`, `api_subcategory`, `api_post`, `api_comment`, `api_user`).*

**Ver a estrutura de uma tabela (ex: posts):**
```sql
\d api_post
```

**Listar todos os posts (título e data):**
```sql
SELECT id, title, created_at FROM api_post;
```

**Contar quantos posts existem:**
```sql
SELECT COUNT(*) FROM api_post;
```

**Ver categorias e suas subcategorias juntas:**
```sql
SELECT c.name AS categoria, s.name AS subcategoria 
FROM api_category c
LEFT JOIN api_subcategory s ON s.category_id = c.id;
```

**Ver os 5 comentários mais recentes:**
```sql
SELECT author_name, text, created_at 
FROM api_comment 
ORDER BY created_at DESC 
LIMIT 5;
```

**Verificar usuários cadastrados (sem mostrar a senha):**
```sql
SELECT username, display_name, is_staff, is_superuser FROM api_user;
```

**Verificar quantos likes/views um post tem:**
```sql
SELECT title, views, likes FROM api_post ORDER BY views DESC;
```

### 3.3 Fazer Backup do Banco (Salvar em arquivo .sql)
Com o container rodando, execute na raiz do projeto:
```bash
docker exec -t quarkops_db pg_dump -U quarkops quarkops > backup_quarkops.sql
```
Isso criará um arquivo `backup_quarkops.sql` na pasta onde você rodou o comando.

### 3.4 Restaurar um Backup (.sql)
Se precisar jogar o backup de volta para o banco (⚠️ isso sobrescreve os dados atuais):
```bash
Get-Content backup_quarkops.sql | docker exec -i quarkops_db psql -U quarkops -d quarkops
```

---

## 4. Integração Frontend ↔ Backend (Passo 5)

### 4.1 Alternar entre adapters (localStorage ↔ HTTP)
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

### 4.2 Ordem de inicialização completa (dev)
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

### 4.3 Testar Hierarquia no Frontend (Passo 8B)
A Home e o CRM agora consomem as categorias dinamicamente.

1. **Criar uma categoria nova:**
   - No Django Admin (`http://localhost:8000/admin/api/category/`), crie `Matemática` (order: 6).
   - Na Home, o filtro deve mostrar `Matemática` automaticamente (recarregar a página).

2. **Criar subcategoria:**
   - No Admin, adicione `Cálculo` dentro de `Matemática`.
   - Na Home, clique em `Matemática` -> `Cálculo` deve aparecer na segunda linha.

3. **Criar post no CRM:**
   - Abra o CRM, clique em "Novo artigo".
   - O select de categoria deve listar todas (incluindo as novas).
   - Ao escolher `Matemática`, o select de subcategoria deve listar `Cálculo`.

4. **Filtrar:**
   - Clicar na categoria filtra os posts.
   - Clicar na subcategoria filtra ainda mais.

### 4.4 Validação rápida dos 3 cenários
| Cenário | Configuração | Esperado |
|---|---|---|
| **1. Leitura HTTP** | `VITE_API_ADAPTER=http` + backend up | Home lista posts do Postgres (3 do seed). Curtidas/comentários anônimos funcionam. |
| **2. Escrita bloqueada** | Idem, tentar CRM "Publicar" | Backend responde `401 Unauthorized` (staff exigido). UI silenciosa (erro fica no estado `error` do hook, sem toast — Passo 6). |
| **3. Fallback local** | `VITE_API_ADAPTER=local` | Home lista 6 artigos do `localStorage`. CRM funciona (criar/editar/deletar). |

> **Sobre o `[::1]:8000`:** ver nota na seção Backend. Docker Desktop pode comentar as entradas de `localhost` no `hosts` do Windows; `[::1]` contorna sem precisar editar arquivos do sistema.

---

## 5. API (Testes via curl)

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

### 5.1 Testar Autenticação JWT (via curl)
O SimpleJWT está configurado no backend. O frontend usa o `httpAdapter` para renovar os tokens automaticamente.

```bash
# 1. Obter os tokens (substitua por suas credenciais do superusuário)
curl.exe -X POST http://localhost:8000/api/token/ -H "Content-Type: application/json" -d "{\"username\":\"SEU_USER\",\"password\":\"SUA_SENHA\"}"

# 2. Consultar o perfil do usuário logado
curl.exe http://localhost:8000/api/users/me/ -H "Authorization: Bearer SEU_ACCESS_TOKEN"

# 3. Testar o refresh de token (simula o que o frontend faz sozinho)
curl.exe -X POST http://localhost:8000/api/token/refresh/ -H "Content-Type: application/json" -d "{\"refresh\":\"SEU_REFRESH_TOKEN\"}"
```

---

## 6. Deploy Unificado (Docker Compose — Produção Simulada)

### Pré-requisitos
- **Docker Desktop** aberto (ícone da baleia na bandeja do sistema).
- Arquivo `.env` na raiz do projeto (copiar de `.env.example` e gerar `DJANGO_SECRET_KEY`).

Gerar `DJANGO_SECRET_KEY`:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 6.1 Subir tudo (primeira vez)
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

### 6.2 Criar superusuário (primeira vez)
Em outro terminal (o `up` fica travado mostrando logs):
```bash
docker compose exec backend python manage.py createsuperuser
```

### 6.3 Acessar
- **App:** `http://localhost/`
- **Admin:** `http://localhost/admin/`
- **API:** `http://localhost/api/posts/`

### 6.4 Comandos úteis (Deploy)
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

### 6.5 Fluxo de desenvolvimento (alternativo ao deploy)
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
---

## 7. Deploy em Nuvem (Railway)

O QuarkOps está hospedado no Railway (plano gratuito com limites). A arquitetura usa 3 serviços separados: `Backend` (Django), `Frontend` (Nginx) e `Postgres`.

### 1. Variáveis de Ambiente no Backend

No painel do Railway, vá em **Backend** -> **Variables** e configure:

```env
DJANGO_SECRET_KEY=sua_chave_gerada
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend,quarkops.railway.internal,healthcheck.railway.app,quarkops-backend-production.up.railway.app,frontend-production-a978.up.railway.app
CORS_ALLOWED_ORIGINS=https://frontend-production-a978.up.railway.app
CSRF_TRUSTED_ORIGINS=https://frontend-production-a978.up.railway.app
POSTGRES_DB=${{Postgres.PGDATABASE}}
POSTGRES_USER=${{Postgres.PGUSER}}
POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}
POSTGRES_HOST=${{Postgres.PGHOST}}
POSTGRES_PORT=${{Postgres.PGPORT}}
```

> ⚠️ **Atenção:** O domínio `frontend-production-a978...` e `quarkops-backend-production...` mudam de projeto para projeto. Use os domínios reais que o Railway gerou para você.

### 2. Nginx Dinâmico (Fix para erro 504)

O `frontend/nginx.conf` usa uma configuração especial para o Railway:

```nginx
resolver [fd12::10] valid=10s; # DNS interno do Railway
# ...
location /api/ {
    set $backend_upstream "http://quarkops.railway.internal:8000";
    proxy_pass $backend_upstream/api/;
    # ...
}
```
Isso evita o erro `504 Gateway Timeout` quando o Railway reinicia o container do backend e troca o IP interno.

### 3. Comandos Úteis no Railway

Para rodar comandos no banco ou no backend, use o **Console** (terminal do navegador):

```bash
# Criar superusuário (primeiro acesso)
python manage.py createsuperuser

# Resetar senha
python manage.py changepassword <username>

# Rodar migrations manualmente (se necessário)
python manage.py migrate

# Acessar o shell do Django
python manage.py shell
```

### 4. Fazer o Deploy

O Railway está conectado ao repositório do GitHub. Para atualizar a aplicação:
1. Faça o commit e o push das suas alterações.
2. O Railway detecta e faz o build automaticamente.
3. Se o build falhar, a versão anterior continua no ar.

---


## 8. Rodar a aplicação localmente (Ambiente de Desenvolvimento)

Para testar alterações de código sem precisar esperar o deploy na nuvem, siga estes passos. O fluxo local usa o Docker apenas para o banco de dados, enquanto o Django e o React rodam nativamente com *hot reload*.

### 8.1 Subir o Banco de Dados (PostgreSQL)
1. Abra o **Docker Desktop**.
2. No terminal, acesse a pasta do backend e suba o container:
```bash
cd backend
docker compose -f docker-compose.yml up -d
```
*(Isso vai subir o banco na porta 5432).*

### 8.2 Rodar o Backend (Django)
Em um terminal, acesse a pasta `backend`, ative o ambiente virtual e inicie o servidor:
```bash
cd backend
.\venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver "[::1]:8000"
```
*(O terminal vai travar mostrando os logs das requisições).*

### 8.3 Criar Superusuário Local (Primeira vez)
Como o banco local é separado do banco de produção (Railway), você precisa de um usuário para acessar o CRM localmente. Em **outro terminal**:
```bash
cd backend
.\venv\Scripts\Activate.ps1
python manage.py createsuperuser
```

### 8.4 Rodar o Frontend (React/Vite)
Abra um **segundo terminal** (deixe o do Django rodando), acesse a pasta `frontend` e inicie o Vite:
```bash
cd frontend
npm run dev
```
*(O site estará disponível em `http://localhost:5173`).*

### 8.5 Configurar Variáveis de Ambiente (Frontend)
Garanta que o arquivo `frontend/.env.local` está apontando para o backend local:
```env
VITE_API_ADAPTER=http
VITE_API_URL=http://localhost:8000/api
```
> ⚠️ **Atenção:** Se você alterar o `.env.local`, é obrigatório parar o Vite (`Ctrl+C`) e rodá-lo novamente (`npm run dev`) para que a nova variável seja lida.

### 8.6 Testando e Debugando
- **Frontend:** Abra o DevTools do navegador (F12) para ver erros de React, console e rede. O Vite fará o *hot reload* automaticamente ao salvar um arquivo.
- **Backend:** Os erros do Django aparecerão no terminal onde o `runserver` está rodando.
- **Banco de dados:** Se precisar rodar comandos SQL, você pode acessar o container do banco local via `docker exec -it quarkops_db psql -U quarkops -d quarkops`.

### 8.7 Fazer a atualização no ambiente de produção
Quando terminar os testes locais e validar que tudo está funcionando:
1. Faça o commit das alterações no Git.
2. Envie para o GitHub (push).
3. O Railway fará o deploy automático em alguns minutos.