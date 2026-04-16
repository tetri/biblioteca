# Roadmap de Implementação: Sistema de Biblioteca

Este documento guia arquitetura, qualidade e evolução do monorepo Biblioteca.

## 1. Arquitetura Padrão (CQRS Nativo)
- O projeto adota CQRS usando `Microsoft.Extensions.DependencyInjection`.
- Regras:
  - Commands e Queries em `Application/Commands` e `Application/Queries`.
  - Handlers implementam `ICommandHandler<TCommand, TResult>` e `IQueryHandler<TQuery, TResult>`.
  - Handlers registrados via `AddScoped` no `Program.cs`.
- Exemplo: `builder.Services.AddScoped<ICommandHandler<CreateLoanCommand, LoanResponseDto>, CreateLoanHandler>();`

## 2. Telemetria (OpenTelemetry)
- Todos os serviços e o Gateway usam `Shared.Observability`.
- Traces devem preservar `TraceId` entre microsserviços.

## 3. Status de Implementação
- [x] **LoanService:** Queries CQRS e endpoint de "Meus Empréstimos".
- [x] **CatalogService:** CQRS implementado (commands, queries e handlers).
- [x] **Design:** páginas públicas (Busca, Detalhes, Perfil) no padrão premium minimalista.
- [x] **Gateway Docs:** rotas `/docs/user`, `/docs/catalog`, `/docs/loan`, `/docs/notification`.
- [x] **OpenTelemetry:** configurado em gateway e serviços principais.
- [x] **Contract Tests:** validação de contratos `LoanService` -> `CatalogService`.
- [x] **Frontend:** testes unitários/integrados e MSW.
- [x] **CI/CD:** GitHub Actions para build e testes (backend + frontend).
- [x] **Orquestração:** `up.sh` + Docker Compose com contexto na raiz.
- [x] **NotificationService:** endpoint funcional de disponibilidade (`/health` e `/api/notifications/ping`) e OpenAPI.

## 4. Escalabilidade e Melhorias Futuras
- Escalabilidade horizontal via Docker Compose/Kubernetes.
- Estado persistido em MongoDB por serviço.
- Evolução planejada: broker (RabbitMQ) para comunicação assíncrona entre `LoanService` e `NotificationService`.
- Recomendação: testes de estresse com k6.

## 5. Diretrizes de Interface (Frontend)
- Design system baseado em Radix UI + Tailwind CSS.
- Componentes reutilizáveis e consistentes.
- Fluxos de API devem sempre tratar erro (`ErrorMessage`) e carregamento (`Loading`/`Skeleton`).

## 6. Segurança e Acesso
- Admin padrão (seed):
  - Email: `admin@biblioteca.com`
  - Senha: `temp123`
- Usuário demo:
  - Email: `demo@biblioteca.com`
  - Senha: `demo123`
- Setup obrigatório de senha do admin no primeiro acesso (`IsSetupRequired = true`).

## 7. Padrão de Ambiente
- Node.js padrão do projeto: **22+**.
- CI usa Node 22; desenvolvimento local deve seguir a mesma versão para evitar divergências.
