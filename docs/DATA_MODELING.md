# QuarkOps — Modelagem de Dados e Integração

Este documento descreve a arquitetura de dados do QuarkOps, detalhando a modelagem do banco de dados PostgreSQL, a estrutura dos DTOs (Data Transfer Objects) e como o Frontend (React) e o Backend (Django) se comunicam.

---

## 1. Diagrama de Entidades (ERD)

O QuarkOps utiliza um banco relacional (PostgreSQL). A hierarquia principal é: **Categoria → Subcategoria → Post → Comentário**.

```text
+----------------+       +-------------------+       +-----------------+
|    Category    |       |    Subcategory    |       |      Post       |
+----------------+       +-------------------+       +-----------------+
| id (UUID) [PK] |<------| category_id [FK]  |<------| subcategory_id  |
| name           |       | id (UUID) [PK]    |       | category_id [FK]|
| slug (unique)  |       | name              |       | id (UUID) [PK]  |
| order          |       | slug              |       | title           |
+----------------+       | order             |       | content (HTML)  |
                         +-------------------+       | tags (JSON)     |
                                                     | author_id [FK]  |
                                                     +-----------------+
                                                              ^
                                                              |
+----------------+                                   +-----------------+
|      User      |<----------------------------------|     Comment     |
+----------------+                                   +-----------------+
| id (UUID) [PK] |                                   | id (UUID) [PK]  |
| username       |                                   | post_id [FK]    |
| display_name   |                                   | author_user [FK]|
| password       |                                   | author_name     |
| role           |                                   | text            |
+----------------+                                   +-----------------+
```

---

## 2. Modelagem no Backend (Django)

O backend utiliza o **Django ORM**. Todas as chaves primárias são **UUIDs** (para URLs não enumeráveis) e os modelos herdam de `models.Model`.

### 2.1 `User` (Custom User)
Substitui o usuário padrão do Django (`AbstractUser`).
*   **Tabela:** `api_user`
*   **Campos Chave:**
    *   `id` (UUID)
    *   `username` (String, único)
    *   `display_name` (String) — Nome exibido no blog.
    *   `bio`, `avatar_url`, `role` (Strings) — Metadados públicos.
    *   `is_staff` (Boolean) — Define quem pode acessar o CRM/Admin.

### 2.2 `Category` & `Subcategory`
Gerenciam a hierarquia do blog.
*   **Tabela:** `api_category` e `api_subcategory`
*   **Relação:** `Subcategory` tem uma FK (`category_id`) para `Category`.
*   **Campos Chave:**
    *   `name` (String) — Ex: "Python", "Linux".
    *   `slug` (String) — Gerado automaticamente (ex: `python`). Usado para filtros e URLs.
    *   `order` (Integer) — Ordem de exibição no frontend.

### 2.3 `Post`
A entidade central.
*   **Tabela:** `api_post`
*   **Relações:**
    *   `author_id` (FK para `User`).
    *   `category_id` (FK para `Category`).
    *   `subcategory_id` (FK opcional para `Subcategory`).
*   **Campos Chave:**
    *   `title`, `summary` (Strings).
    *   `content` (Text) — HTML sanitizado pelo `nh3`.
    *   `tags` (JSONField) — Array de strings (`["python", "backend"]`).
    *   `views`, `likes` (Integer) — Contadores.
    *   `read_time` (String) — Ex: "5 min de leitura".

### 2.4 `Comment`
Comentários aninhados nos posts.
*   **Tabela:** `api_comment`
*   **Relações:**
    *   `post_id` (FK para `Post`).
    *   `author_user` (FK opcional para `User`).
*   **Campos Chave:**
    *   `author_name` (String) — Sempre preenchido.
    *   `text` (Text).
    *   `is_authenticated` (Boolean virtual) — Derivado de `author_user != null`.

---

## 3. Contratos de API (JSON)

O Frontend nunca acessa o banco diretamente. Ele consome a API REST do Django. O `httpAdapter.js` faz o mapeamento de `snake_case` (backend) para `camelCase` (frontend).

### 3.1 `GET /api/posts/` (Leitura)
Retorna uma lista paginada de posts com dados aninhados.

**Response (Backend → Frontend):**
```json
{
  "id": "uuid-do-post",
  "title": "Desvendando o Python GIL",
  "content": "<h2>Introdução</h2><p>...</p>",
  "read_time": "7 min de leitura",
  "tags": ["python", "backend"],
  "author": {
    "display_name": "Guido Dev",
    "avatar_url": "",
    "bio": "Engenheiro",
    "role": "Backend Lead"
  },
  "category": {
    "id": "uuid-cat",
    "name": "Programação",
    "slug": "programacao"
  },
  "subcategory": {
    "id": "uuid-sub",
    "name": "Python",
    "slug": "python"
  },
  "views": 3420,
  "likes": 42
}
```

### 3.2 `POST /api/token/` (Login)
Autenticação via JWT.

**Request:**
```json
{ "username": "jeffe", "password": "senha" }
```

**Response:**
```json
{ "access": "eyJ...", "refresh": "eyJ..." }
```

---

## 4. Como o Frontend Consome os Dados

O React não usa `fetch` direto. Tudo passa pelo `services/api.js`, que escolhe o adapter correto.

### 4.1 Fluxo de Leitura (Home)
1.  O componente `HomePage` chama `useArticles()`.
2.  `useArticles` chama `api.listArticles()` (`httpAdapter`).
3.  O `httpAdapter` faz `GET /api/posts/`.
4.  Ao receber o JSON, `mapPost()` traduz o `snake_case` para `camelCase` e monta o objeto do frontend:
    ```javascript
    // Objeto final esperado pelo componente <ArticleCard>
    {
      id: "...",
      title: "...",
      author: "Guido Dev",
      category: "Programação",
      categorySlug: "programacao",
      subcategory: "Python",
      readTime: "7 min de leitura"
    }
    ```

### 4.2 Fluxo de Escrita (CRM)
1.  O usuário preenche o `CrmModal` e clica em "Publicar".
2.  O `App.jsx` chama `createArticle(payload)`.
3.  O `httpAdapter` monta o corpo (enviando `category_id`, `subcategory_id` e `content` sanitizado) e faz um `POST` autenticado com o token JWT.
4.  O Django recebe, valida, sanitiza o HTML (`nh3`) e salva no Postgres.

### 4.3 O Segredo dos Blocos de Código
*   O Frontend envia apenas `<pre><code>...</code></pre>` para o banco.
*   O `ArticleBody.jsx` no React lê esse HTML e **injeta dinamicamente** a caixa escura e o botão "Copiar" via JavaScript. Isso evita conflitos com o sanitizador `nh3`.