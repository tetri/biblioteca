# Sistema de Biblioteca - MVP com Microsserviços

Este documento resume a arquitetura e os detalhes dos microsserviços planejados para um MVP de sistema de biblioteca.

---

## 1. User Service

### Objetivo
Gerenciar autenticação e dados de usuários que utilizarão o sistema de biblioteca.

### Responsabilidades
- Cadastro de novos usuários.
- Login e emissão de JWT.
- Consulta e atualização de perfil.
- Controle de papéis/permissões (admin/usuário).

### Banco de Dados (NoSQL)
**Coleção `users` (MongoDB)**

```json
{
  "_id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "passwordHash": "hashedpassword...",
  "role": "User",
  "createdAt": "2025-09-14T15:30:00Z",
  "updatedAt": "2025-09-14T15:30:00Z"
}
```

### Endpoints REST

* `POST /api/users/register`
  Entrada: `Name, Email, Password`
  Saída: usuário criado (sem senha)

* `POST /api/users/login`
  Entrada: `Email, Password`
  Saída: `{ token, expiresAt }`

* `GET /api/users/me`
  Retorna dados do usuário autenticado.

* `PUT /api/users/me`
  Atualiza nome ou senha do usuário.

### Fluxo JWT

1. Usuário faz login → validação de credenciais.
2. Se válido → gera JWT com claims (UserId, Role, Expiração).
3. Token é usado em todos os outros serviços via API Gateway.

---

## 2. Catalog Service

### Objetivo

Gerenciar os livros da biblioteca, fornecendo dados de disponibilidade.

### Responsabilidades

* CRUD de livros.
* Consulta e pesquisa por título, autor, categoria ou ISBN.
* Controle de estoque (`availableCopies`).
* Fornecer dados de livro para Loan Service.

### Banco de Dados (NoSQL)

**Coleção `books` (MongoDB)**

```json
{
  "_id": "uuid",
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "isbn": "9780134494166",
  "category": "Software Engineering",
  "availableCopies": 5,
  "totalCopies": 7,
  "createdAt": "2025-09-14T15:30:00Z",
  "updatedAt": "2025-09-14T15:30:00Z"
}
```

### Endpoints REST

* `POST /api/catalog/books` - criar livro
* `PUT /api/catalog/books/{id}` - atualizar livro
* `DELETE /api/catalog/books/{id}` - remover livro
* `GET /api/catalog/books` - listar livros
* `GET /api/catalog/books/{id}` - detalhes do livro
* `GET /api/catalog/books/search?query=...` - busca
* `GET /api/catalog/books/{id}/availability` - disponibilidade
* `PUT /api/catalog/books/{id}/decrement` - reduzir estoque (empréstimo)
* `PUT /api/catalog/books/{id}/increment` - aumentar estoque (devolução)

### Telas no Frontend

* Lista de livros (pública)
* Detalhe do livro (botão "Emprestar" apenas se logado)

---

## 3. Loan Service

### Objetivo

Gerenciar o ciclo de vida dos empréstimos de livros.

### Responsabilidades

* Criar empréstimos.
* Registrar devoluções.
* Consultar empréstimos ativos e históricos do usuário.
* Integrar com User Service (validação) e Catalog Service (estoque).

### Banco de Dados (Relacional sugerido)

**Tabela `Loans`**

| Campo      | Tipo      | Descrição                         |
| ---------- | --------- | --------------------------------- |
| Id         | GUID      | Identificador do empréstimo       |
| UserId     | GUID      | Usuário que pegou o livro         |
| BookId     | GUID      | Livro emprestado                  |
| LoanDate   | datetime  | Data do empréstimo                |
| DueDate    | datetime  | Prazo de devolução                |
| ReturnDate | datetime? | Data da devolução (null se ativo) |
| Status     | enum      | Active, Returned, Late            |

### Endpoints REST

* `POST /api/loans` - criar empréstimo (usuário logado)
* `PUT /api/loans/{id}/return` - registrar devolução (usuário logado)
* `GET /api/loans/me` - listar empréstimos do usuário (logado)
* `GET /api/loans/{id}` - detalhes do empréstimo (logado/admin)

### Fluxo de Empréstimo

1. Usuário logado solicita empréstimo.
2. Loan Service valida usuário via JWT.
3. Consulta disponibilidade do livro no Catalog Service.
4. Se disponível → cria registro de empréstimo e atualiza estoque.
5. Retorna sucesso ao frontend.

### Telas no Frontend

* Tela "Meus Empréstimos"
* Ação "Devolver" para empréstimos ativos

---

## 4. Notification Service (futuro)

### Objetivo

Enviar notificações para usuários sobre eventos do sistema, como:

* Aviso de devolução próxima
* Confirmação de empréstimo

### Integração

* Recebe eventos via **Message Bus** (RabbitMQ/Kafka) publicados por Loan Service ou outros serviços.
* Persiste logs de notificações ou envia e-mails/push.

---

## Arquitetura Geral

* **API Gateway**: ponto único de entrada, valida JWT e direciona chamadas.
* **User Service**: cadastro, login, perfil.
* **Catalog Service**: livros e estoque.
* **Loan Service**: empréstimos e devoluções.
* **Notification Service**: envio de avisos (eventos assíncronos).
* **Banco de Dados**:

  * User e Catalog → NoSQL (MongoDB)
  * Loan → Relacional (PostgreSQL ou SQLite)
* **Comunicação**:

  * Síncrona: REST/gRPC para validar usuários e estoque
  * Assíncrona: eventos para notificações
