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

## 3. Status de Implementação (Checklist Detalhada)

### 3.1 Infraestrutura & Gateway
- [x] **Roteamento Centralizado:** Gateway YARP configurado para todos os microsserviços.
- [x] **Service Discovery:** Orquestração via Docker Compose (`up.sh`).
- [x] **Documentação Unificada:** OpenAPI/Scalar integrada no Gateway (`/docs/*`).
- [x] **Observabilidade:** OpenTelemetry (traces/metrics) via `Shared.Observability` em todos os serviços.
- [x] **Persistência:** Instâncias de MongoDB segregadas por serviço.

### 3.2 User Service (Identidade & Acesso)
- [x] **Autenticação:** JWT com validação de Issuer, Audience e Key.
- [x] **Cadastro de Usuários:** Fluxo de auto-registro com aprovação pendente.
- [x] **Gestão Administrativa:** Aprovação de usuários e alteração de papéis (Admin/Member).
- [x] **Perfil:** Endpoint `/me` para consulta e atualização de dados pessoais.
- [x] **Segurança:** Setup de senha obrigatório no primeiro acesso para o Admin seed.
- [x] **Data Seeding:** Criação automática de Admin e Usuário Demo no primeiro boot.

### 3.3 Catalog Service (Acervo)
- [x] **CQRS Nativo:** Handlers separados para Commands e Queries.
- [x] **Gestão de Livros:** CRUD completo de títulos.
- [x] **Busca & Filtros:** Endpoint de busca textual e filtros por categoria/autor.
- [x] **Integridade:** Índice único para ISBN no MongoDB.
- [x] **Estoque:** Controle de cópias disponíveis e totais.

### 3.4 Loan Service (Empréstimos & Reservas)
- [x] **Regras de Negócio:**
    - [x] Limite de 3 empréstimos ativos por usuário.
    - [x] Bloqueio de novas operações para usuários com atrasos (`Overdue`).
    - [x] Impedimento de duplicidade de reserva/empréstimo ativo para o mesmo livro/usuário.
- [x] **Reserva:** Fluxo de reserva para retirada futura.
- [x] **Empréstimo:** Fluxo de checkout com verificação de disponibilidade.
- [x] **Integridade DB:** Índice parcial único para (UserId, BookId) em status `Reserved` ou `Active`.

### 3.5 Notification Service
- [x] **Disponibilidade:** Endpoints de `/health` e `/ping` funcionais.
- [x] **Arquitetura:** Base preparada para integração assíncrona (RabbitMQ).

### 3.6 Frontend (Interface Minimalista)
- [x] **Páginas Públicas:**
    - [x] Home (Landing Page).
    - [x] Catálogo com busca em tempo real e filtros avançados.
    - [x] Detalhes do Livro com CTA de reserva.
- [x] **Área do Usuário:**
    - [x] Dashboard de perfil com histórico de empréstimos.
    - [x] Edição de dados cadastrais.
- [x] **Área Administrativa:**
    - [x] Dashboard com indicadores operacionais (lucide-react).
    - [x] Gestão de usuários (aprovação/permissões).
    - [x] Gestão de catálogo (CRUD de livros).
    - [x] Gestão de empréstimos (visão macro).
- [x] **UX/UI:**
    - [x] Feedback visual (Skeletons, Toasts de erro/sucesso).
    - [x] Responsividade total (Mobile First).

### 3.7 Qualidade & CI/CD
- [x] **Testes Backend:** Cobertura de domínio e aplicação com xUnit e FluentAssertions.
- [x] **Testes Frontend:** Vitest + MSW para componentes e chamadas de API.
- [x] **Testes de Contrato:** Validação de integração entre `LoanService` e `CatalogService`.
- [x] **Esteira CI:** GitHub Actions validando build e testes a cada PR.

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
