# Progresso Editorial — Reescrita e Aprofundamento (QuarkOps)

Este documento rastreia a atualização dos conteúdos da trilha de Python para o novo padrão editorial (`DEEP_DIVE_SPEC.md`).

**Legenda:**
- `[ ]` **Pendente:** Post no padrão antigo, precisa ser reescrito.
- `[~]` **Em Andamento:** Post em processo de reescrita ou revisão.
- `[x]` **Concluído:** Post reescrito, validado e publicado no padrão Deep Dive.

---

## 📌 Módulo 1: Fundamentos e Pensamento Computacional
*Foco: Ambiente, Tipos, Condicionais, Loops e Exceções.*

- [x] **Aula 01:** Introdução ao Python & O Ambiente de Desenvolvimento (VS Code + venv)
  * *Foco da melhoria:* Contexto histórico, Under the Hood do venv, `.gitignore`, menção a Poetry/uv.
- [x] **Aula 02:** Variáveis, Tipos de Dados e Mutabilidade
  * *Foco da melhoria:* Referências de memória, objetos mutáveis vs imutáveis, o bug de referências compartilhadas.
- [x] **Aula 03:** Operadores Lógicos, Condicionais e Controle de Fluxo
  * *Foco da melhoria:* Truthy/Falsy, Curto-Circuito, `is` vs `==`, operador ternário, Early Return.
- [x] **Aula 04:** Estruturas de Repetição: `for` vs `while`
  * *Foco da melhoria:* Protocolo de iteração (`__iter__`/`__next__`), `enumerate`, `zip`, `break`/`continue`/`else`.
- [x] **Aula 05:** Tratamento de Erros e Exceções (`try`, `except`, `else`, `finally`)
  * *Foco da melhoria:* Filosofia EAFP, exceções customizadas (`raise`), logging, o perigo do `except: pass`.

---

## 📌 Módulo 2: Estruturas de Dados e Organização
*Foco: Listas, Tuplas, Dicionários, Sets, Funções e Escopo.*

- [ ] **Aula 06:** Listas e Tuplas: Métodos, Fatiamento (Slicing) e Desempacotamento
  * *Foco da melhoria:* Under the Hood da alocação contígua, imutabilidade das tuplas, unpacking com asterisco.
- [ ] **Aula 07:** Dicionários e Conjuntos (Sets): Tabelas Hash por dentro
  * *Foco da melhoria:* Como a função hash funciona O(1), colisões, `defaultdict` e `Counter`.
- [ ] **Aula 08:** Compreensões de Listas, Dicionários e Sets
  * *Foco da melhoria:* Performance vs loops tradicionais, legibilidade, quando *não* usar compreensões.
- [ ] **Aula 09:** Funções I: Parâmetros Posicionais, Nomeados, `*args` e `**kwargs`
  * *Foco da melhoria:* Ordem de definição, flexibilidade, desempacotamento de argumentos na chamada.
- [ ] **Aula 10:** Funções II: Escopo de Variáveis (LEGB), Funções Anônimas (`lambda`) e *Closures*
  * *Foco da melhoria:* Regra LEGB, escopo global vs local, closures e como eles permitem funções fábrica.

---

## 📌 Módulo 3: Programação Orientada a Objetos (POO)
*Foco: Classes, Herança, Encapsulamento, Dunder Methods e Composição.*

- [ ] **Aula 11:** Introdução à POO: Classes, Instâncias, Atributos de Instância e de Classe
  * *Foco da melhoria:* O que é `self`, a diferença de atributos mutáveis na classe vs instância, métodos `@classmethod` e `@staticmethod`.
- [ ] **Aula 12:** Pilares da POO: Herança, Sobrescrita de Métodos e Polimorfismo
  * *Foco da melhoria:* Uso do `super()`, MRO (Method Resolution Order), o perigo da herança excessiva.
- [ ] **Aula 13:** Encapsulamento: Atributos Privados, Getters, Setters e `@property`
  * *Foco da melhoria:* Convenção `_` e `__` (name mangling), por que usar `@property` em vez de getters/setters tradicionais.
- [ ] **Aula 14:** Métodos Especiais (Dunder Methods)
  * *Foco da melhoria:* `__str__` vs `__repr__`, sobrecarga de operadores (`__add__`, `__eq__`), como fazer objetos se comportarem como listas.
- [ ] **Aula 15:** Composição vs Herança
  * *Foco da melhoria:* O problema do gorila com bananas, por que a composição é preferível em sistemas complexos.

---

## 📌 Módulo 4: Python Avançado e Funcional
*Foco: Iteradores, Geradores, Decoradores, Context Managers, Type Hints e Arquivos.*

- [ ] **Aula 16:** Iteradores e Geradores: O protocolo de iteração e `yield`
  * *Foco da melhoria:* Lazy evaluation, economia de memória, a diferença entre `return` e `yield`, `Generator Expressions`.
- [ ] **Aula 17:** Decoradores
  * *Foco da melhoria:* Closures na prática, `functools.wraps`, decoradores com parâmetros, casos de uso (logs, cache, autenticação).
- [ ] **Aula 18:** Gerenciadores de Contexto (`with`)
  * *Foco da melhoria:* Protocolo `__enter__`/`__exit__`, o módulo `contextlib`, quando criar o seu próprio gerenciador.
- [ ] **Aula 19:** Type Hints
  * *Foco da melhoria:* `typing` (List, Dict, Optional), `mypy`, como tipagem estática ajuda em equipes grandes.
- [ ] **Aula 20:** Manipulação de Arquivos (JSON, CSV)
  * *Foco da melhoria:* `encoding='utf-8'`, diferença de `json.dump` vs `json.dumps`, `DictReader` e `DictWriter` do CSV.

---

## 📌 Módulo 5: Qualidade de Código e Engenharia (Sênior)
*Foco: Testes, Pacotes, Assincronismo, GIL, Linters.*

- [ ] **Aula 21:** Testes Unitários com `pytest`
  * *Foco da melhoria:* `assert` do pytest vs unittest, Fixtures, Mocks, cobertura de testes (coverage).
- [ ] **Aula 22:** Gerenciamento de Pacotes (Poetry vs uv)
  * *Foco da melhoria:* `pyproject.toml`, lockfiles, resolução de dependências, vantagens do uv.
- [ ] **Aula 23:** Concorrência Assíncrona (`asyncio`)
  * *Foco da melhoria:* Event Loop, `async/await`, I/O Bound vs CPU Bound, quando *não* usar asyncio.
- [ ] **Aula 24:** Threads, Processos e o GIL
  * *Foco da melhoria:* O que é o GIL, quando usar threads (I/O), quando usar multiprocessing (CPU), o futuro sem GIL (PEP 703).
- [ ] **Aula 25:** PEP 8, Ruff e Black
  * *Foco da melhoria:* Legibilidade, Black como formatador sem discussão, Ruff como linter supersônico.

---

## 📌 Módulo 6: Engenharia Aplicada, Bancos e Docker
*Foco: `collections`, `datetime`, FastAPI, SQLAlchemy, Docker.*

- [ ] **Aula 26:** `collections` e `itertools`
  * *Foco da melhoria:* `deque` (complexidade O(1) nas pontas), `Counter` (contagem), `defaultdict`, `groupby`.
- [ ] **Aula 27:** `datetime` e `zoneinfo`
  * *Foco da melhoria:* Armadilha das datas *naive* vs *aware*, armazenamento em UTC, conversão de fuso horário.
- [ ] **Aula 28:** FastAPI e Pydantic
  * *Foco da melhoria:* Validação de tipos com Pydantic, documentação automática (Swagger), performance assíncrona.
- [ ] **Aula 29:** SQLAlchemy e Alembic
  * *Foco da melhoria:* ORM vs Core, sessões e transações, o papel do Alembic nas migrações de banco.
- [ ] **Aula 30:** Docker para Desenvolvedores Python
  * *Foco da melhoria:* Diferença de imagem e container, o Dockerfile passo a passo, Multi-stage builds.

---

## 📌 Módulo 7: Ciência da Computação Aplicada
*Foco: Memória, Big O, Estruturas Lineares, Árvores e Ordenação.*

- [ ] **Aula 31:** Arrays, Memória RAM e Big O
  * *Foco da melhoria:* Alocação contígua, notação Big O, complexidade de tempo e espaço.
- [ ] **Aula 32:** Pilhas, Filas e Deques
  * *Foco da melhoria:* LIFO (Stacks) e FIFO (Queues), aplicações (Ctrl+Z, filas de impressão).
- [ ] **Aula 33:** Listas Encadeadas
  * *Foco da melhoria:* Ponteiros (referências), alocação dinâmica, listas simples vs duplas.
- [ ] **Aula 34:** Árvores Binárias de Busca (BST) e AVL
  * *Foco da melhoria:* Busca O(log n), degeneração da árvore, rotações AVL, percursos (in-order, pre-order).
- [ ] **Aula 35:** Algoritmos de Busca
  * *Foco da melhoria:* Busca Linear vs Binária, o poder do Hashing O(1).
- [ ] **Aula 36:** Ordenação Elementar (Bubble, Selection, Insertion)
  * *Foco da melhoria:* Como eles funcionam, por que são O(n²), quando usar (listas quase ordenadas).
- [ ] **Aula 37:** Ordenação Avançada (Merge, Quick, Timsort)
  * *Foco da melhoria:* Dividir para conquistar, O(n log n), o Timsort como algoritmo nativo do Python.

---

## 📌 Módulo 8: Arquitetura, Segurança e Performance
*Foco: SOLID, Design Patterns, Segurança, Observabilidade, Alta Performance.*

- [ ] **Aula 38:** Princípios SOLID
  * *Foco da melhoria:* SRP, OCP, LSP, ISP, DIP com exemplos reais de Python.
- [ ] **Aula 39:** Design Patterns
  * *Foco da melhoria:* Singleton, Factory, Observer, Strategy. Quando usar e quando evitar.
- [ ] **Aula 40:** Segurança em Python
  * *Foco da melhoria:* Hash de senhas (bcrypt), JWT, OAuth2, gestão de segredos (variáveis de ambiente).
- [ ] **Aula 41:** Observabilidade
  * *Foco da melhoria:* Logging estruturado (JSON), Tracing, Métricas, OpenTelemetry.
- [ ] **Aula 42:** Alta Performance (Polars, Pandas, Celery)
  * *Foco da melhoria:* Polars (Rust) vs Pandas, processamento paralelo, tarefas assíncronas com Celery.

---

## 📌 Módulo 9: Inteligência Artificial e Machine Learning
*Foco: Data Science, Scikit-Learn, PyTorch, LLMs, RAG.*

- [ ] **Aula 43:** NumPy, Pandas e Visualização
  * *Foco da melhoria:* Arrays multidimensionais, DataFrame, visualizações com Seaborn.
- [ ] **Aula 44:** Machine Learning com Scikit-Learn
  * *Foco da melhoria:* Regressão vs Classificação, Overfitting, validação cruzada, métricas de avaliação.
- [ ] **Aula 45:** Deep Learning com PyTorch
  * *Foco da melhoria:* Tensores, GPU, camadas, backpropagation, o ciclo de treinamento.
- [ ] **Aula 46:** IA Generativa (Hugging Face, LangChain)
  * *Foco da melhoria:* Pipelines de NLP, integração com modelos, LangChain para orquestração.
- [ ] **Aula 47:** RAG e Fine-Tuning
  * *Foco da melhoria:* Bancos vetoriais, embeddings, o fluxo de RAG vs Fine-Tuning.

---

## 📌 Módulo 10: Bibliotecas Essenciais e Utilitários
*Foco: Automação de SO, SymPy, OpenCV, Web Scraping, GUI, Dashboards.*

- [ ] **Aula 48:** Automação com `shutil`, `pathlib` e `os`
  * *Foco da melhoria:* Caminhos multiplataforma, cópia e movimentação de arquivos, segurança em manipulação de arquivos.
- [ ] **Aula 49:** Computação Simbólica (`SymPy`)
  * *Foco da melhoria:* Símbolos vs números, resolução de equações, derivadas e integrais exatas.
- [ ] **Aula 50:** Visualização Estatística (`Seaborn`)
  * *Foco da melhoria:* Distribuição, correlação, boxplots e violin plots.
- [ ] **Aula 51:** Visão Computacional (`OpenCV`)
  * *Foco da melhoria:* Matrizes de pixels, filtros (Gaussian Blur), detecção de bordas (Canny), processamento de vídeo.
- [ ] **Aula 52:** Web Scraping (`requests`, `BeautifulSoup`)
  * *Foco da melhoria:* **PRIORIDADE ALTA.** Consumir APIs, parsing de HTML, lidar com paginação, headers para evitar bloqueios, ética em scraping.
- [ ] **Aula 53:** NLP (`NLTK` e `spaCy`)
  * *Foco da melhoria:* Tokenização, stopwords, lematização, Named Entity Recognition (NER).
- [ ] **Aula 54:** Interfaces Gráficas (`Tkinter` e `PyQt`)
  * *Foco da melhoria:* Event Loop, arquitetura MVC, quando usar Tkinter vs PyQt.
- [ ] **Aula 55:** Automação de Escritório (Excel, Word, PDF)
  * *Foco da melhoria:* `openpyxl`, `python-docx`, `pypdf`, automação de relatórios.
- [ ] **Aula 56:** Dashboards (`Streamlit` e `Plotly`)
  * *Foco da melhoria:* Web apps de dados, widgets interativos, deploy no Streamlit Cloud.