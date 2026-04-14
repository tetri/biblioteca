# Roadmap de Implementação: Sistema de Biblioteca

Este documento serve como guia para a arquitetura e futuras implementações no monorepo Biblioteca.

## 1. Arquitetura Padrão (CQRS Nativo)
- O projeto adota o padrão CQRS utilizando `Microsoft.Extensions.DependencyInjection`.
- **Regras:**
    - Commands e Queries devem ser definidos em `Application/Commands` ou `Application/Queries`.
    - Handlers devem implementar `ICommandHandler<TCommand, TResult>` ou `IQueryHandler<TQuery, TResult>`.
    - Os Handlers devem ser registrados no `Program.cs` via `AddScoped`.
- **Exemplo de registro:** `builder.Services.AddScoped<ICommandHandler<CreateLoanCommand, LoanResponseDto>, CreateLoanHandler>();`

## 2. Telemetria (OpenTelemetry)
- **Implementação:** Todos os serviços devem usar `OpenTelemetry.Instrumentation.AspNetCore` e `OpenTelemetry.Exporter.Console` (ou Jaeger em produção).
- **Traces:** Manter o `TraceId` trafegando entre os microsserviços via headers HTTP.

## 3. Checklist de Implementação Pendente
- [ ] **LoanService:** Refatorado para o padrão CQRS "Vanilla" (Remover `LoanService.cs` e criar Handlers).
- [ ] **CatalogService:** Refatorado para CQRS.
- [x] **OpenTelemetry:** Configurar telemetria em todos os microsserviços e no Gateway (Base implementada no Shared.Observability).
- [x] **Contract Tests:** Implementar verificação de schemas entre `LoanService` -> `CatalogService`.
- [x] **Frontend:**
    - [x] Executar `npm install` para dependências de teste.
    - [x] Implementar testes unitários para componentes da pasta `components/ui` com `Vitest`.
    - [x] Criar testes de integração para fluxos de `login` e `catalog`.
    - [x] Adicionar e configurar `MSW (Mock Service Worker)` para isolar testes de frontend.


- [x] **CI/CD:** Configurar GitHub Actions para execução de testes unitários (backend e frontend) e build Docker.
- [x] **Orquestração:** Script de subida `up.sh` e otimização para ambiente WSL2/Linux.

## 6. Escalabilidade e Melhorias Futuras
- **Escalabilidade:** O sistema suporta escalabilidade horizontal via Docker Compose/Kubernetes. O estado é centralizado nos bancos MongoDB.
- **Mensageria:** A introdução de um Message Broker (RabbitMQ) está mapeada como melhoria futura para comunicação assíncrona entre `LoanService` e `NotificationService`.
- **Testes de Estresse:** Recomenda-se o uso de k6 para testes de exaustão e validação de latência sob carga alta.

## 7. Diretrizes de Design e Interface (Frontend)
- **Design System:** Baseado em Radix UI + Tailwind CSS para garantir acessibilidade e consistência visual.
- **Padrão de Interface:** Componentes devem ser reutilizáveis (Atomic Design).
- **Resiliência:** Uso obrigatório de `ErrorMessage` em fluxos de erro e `Loading` states para todas as chamadas de API.

## 8. Segurança e Acesso
- **Admin Padrão:** Criado automaticamente pelo `UserSeeder` no primeiro boot.
    - **Email:** `admin@biblioteca.com`
    - **Senha:** `temp123`
- **Usuário Demo:** Criado para testes.
    - **Email:** `demo@biblioteca.com`
    - **Senha:** `demo123`
- **Setup Obrigatório:** O Admin possui a flag `IsSetupRequired = true`, exigindo alteração de senha no primeiro acesso.
