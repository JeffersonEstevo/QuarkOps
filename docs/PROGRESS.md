# Progresso da Aplicação (Progress Log)

## Status Atual
- **Fase Atual:** [Fase 1 Concluída: Frontend Modularizado e Funcional]
- **Última Atualização:** 20/10/2026
- **Meta Imediata:** Iniciar a configuração do backend (Django + PostgreSQL).

## Quadro de Tarefas

### 🟩 Concluído (Frontend MVP)
- [x] [RNF-001] Definição da arquitetura inicial utilizando `LocalStorage`.
- [x] [RNF-002] Configuração do Tailwind CSS v4 (`@theme`, `@custom-variant`).
- [x] [RNF-003] Refatoração modular completa em React (`components`, `pages`, `hooks`, `contexts`).
- [x] [RF-004 ao RF-010] Leitura, TOC, listagem, filtros e busca.
- [x] [RF-011 & RF-012] Curtidas, comentários, copiar link e notificações Toast.
- [x] [RF-013] Autenticação local simulada no CRM (ADR-007).
- [x] [RF-014 ao RF-017] CRUD de artigos no CRM (criar, editar, excluir) e moderação de comentários.
- [x] [UX] Substituição de `window.prompt/confirm/alert` por modais próprios (`CodeBlockModal`, `ConfirmDialog`).
- [x] [UX] Highlight syntax no CRM (`highlight.js`) e correção de scroll do TOC.

### 🟨 Em Andamento (Foco Atual)
- [ ] Sincronização final dos arquivos de documentação (`docs/`).

### 🟥 A Fazer (Próximos Passos — Trilha para Produção Backend)
- [ ] **Passo 1 (Frontend):** Criar a camada `services/api.js` mantendo um adaptador provisório para o `LocalStorage`.
- [ ] **Passo 2 (Backend):** Inicializar o projeto Django em `backend/` e conectar ao **PostgreSQL**.
- [ ] **Passo 3 (Backend):** Modelar `Post`, `Comment` e `User` no Django e expor endpoints (DRF).
- [ ] **Passo 4 (Backend):** Implementar highlight e sanitização no servidor (usar `Pygments` ou `markdown-it`).
- [ ] **Passo 5 (Integração):** Substituir o adaptador `LocalStorage` por chamadas `fetch` reais.
- [ ] **Passo 6 (Segurança):** Substituir a senha local por JWT/DRF Token Auth no `AuthProvider`.
- [ ] **Passo 7 (Deploy):** Docker Compose (PostgreSQL + Django + Frontend) e variáveis de ambiente.