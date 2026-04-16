# Sistema de Biblioteca (Open Source)

Este repositório implementa um ecossistema de biblioteca com arquitetura de microsserviços usando .NET 9, React 19 e Tailwind CSS v4.

## Arquitetura e Tecnologias

O sistema é dividido em serviços especializados, roteados por um Gateway centralizado.

### Backend (.NET 9)
- Gateway: YARP (Yet Another Reverse Proxy) para roteamento.
- Serviços:
  - `UserService`: usuários, autenticação JWT e perfis.
  - `CatalogService`: acervo de livros e disponibilidade.
  - `LoanService`: empréstimos e reservas (CQRS).
  - `NotificationService`: endpoint de disponibilidade e base para notificações assíncronas futuras.
- `Shared.Observability`: configuração padrão de OpenTelemetry (traces e metrics).
- Banco de dados: MongoDB.

### Frontend (React 19)
- Framework: React 19 com Vite.
- Estilização: Tailwind CSS v4.
- Componentes: shadcn/ui + Radix UI.
- Estado de servidor: TanStack Query.

## Como Executar

### Pré-requisitos
- Docker e Docker Compose.
- .NET 9 SDK (desenvolvimento local).
- Node.js 22+ e npm (frontend; alinhado ao CI).

### Rodando com Docker (recomendado)
```bash
./up.sh
```

Endpoints principais:
- Gateway: http://localhost:80
- Frontend: http://localhost:3000

### Documentação da API via Gateway
- User Service: `http://localhost:80/docs/user`
- Catalog Service: `http://localhost:80/docs/catalog`
- Loan Service: `http://localhost:80/docs/loan`
- Notification Service: `http://localhost:80/docs/notification`

## Credenciais de Acesso (Seed)

Usuários criados automaticamente no primeiro boot:
- Administrador:
  - Email: `admin@biblioteca.com`
  - Senha: `temp123` (troca obrigatória no primeiro acesso)
- Usuário demo:
  - Email: `demo@biblioteca.com`
  - Senha: `demo123`

Observação sobre cadastro e login:
- Novos cadastros entram como `Member` com aprovação pendente (`IsApproved = false`).
- Usuários pendentes não conseguem logar até aprovação administrativa.
- A aprovação e o gerenciamento de perfil de acesso são feitos no painel `/admin`.
- A área administrativa possui dashboard inicial e navegação para:
  - `/admin/usuarios`
  - `/admin/livros`
  - `/admin/emprestimos`

## Documentação Detalhada
- [Roadmap de Implementação (GEMINI.md)](GEMINI.md)
- [Design System (DESIGN.md)](DESIGN.md)
- [Estratégia de Deploy (DEPLOY.md)](DEPLOY.md)
- [Guia de Contribuição (CONTRIBUTING.md)](CONTRIBUTING.md)
- [Política de Segurança (SECURITY.md)](SECURITY.md)
- [Guia consolidado para agentes (AGENTS.md)](AGENTS.md)

## Desenvolvimento

### Backend
```bash
dotnet test Biblioteca.sln
```

### Frontend
```bash
cd frontend
npm ci
npm test
```

## Licença
Este projeto está sob a licença [MIT](LICENSE).
