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
- [ ] **Contract Tests:** Implementar verificação de schemas entre `LoanService` -> `CatalogService`.
- [x] **Frontend:**
    - [x] Executar `npm install` para dependências de teste.
    - [x] Implementar testes unitários para componentes da pasta `components/ui` com `Vitest`.
    - [x] Criar testes de integração para fluxos de `login` e `catalog`.
    - [x] Adicionar e configurar `MSW (Mock Service Worker)` para isolar testes de frontend.


- [x] **CI/CD:** Configurar GitHub Actions para execução de testes unitários (backend e frontend) e build Docker.

## 4. Notas para Agentes
- **Não use MediatR** (Licenciamento comercial). Use sempre `Microsoft.Extensions.DependencyInjection`.
- Priorize a manutenibilidade e padrões sólidos (SOLID).
- Ao alterar APIs, mantenha a compatibilidade ou versione via Header/URL.
