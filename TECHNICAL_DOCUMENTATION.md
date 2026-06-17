# Documentação Técnica - Sistema de Biblioteca

## Visão Geral

Este documento descreve a arquitetura, os padrões de projeto e as decisões de implementação do Sistema de Biblioteca, um ecossistema de biblioteca com arquitetura de microsserviços.

## Arquitetura

### Visão Geral

O sistema é construído com base no padrão **Microserviços**, onde cada componente de negócio é um serviço independente com sua própria base de dados. Um **Gateway Centralizado** (YARP) roteia as requisições entre os serviços e o frontend.

```
+-------------------------------------------------------+
|                      Gateway                          |
|  (YARP Reverse Proxy)                                  |
|                                                       |
|  +-------------------+  +-------------------+        |
|  |   /user/**       |  |   /catalog/**     |        |
|  |------------------|  |------------------|        |
|  |   /loan/**       |  |   /notification/**|        |
|  |------------------|  |------------------|        |
|  |   /**            |  |                   |        |
|  +-------------------+                   |
|                                         |
|  +-------------------+  (Frontend)      |
|  |   React + Vite   |                  |
|  +-------------------+                  |
+-------------------------------------------------------+

Serviços:
- UserService (usuarios, autenticação)
- CatalogService (livros, acervo)
- LoanService (empréstimos, reservas)
- NotificationService (notificações)
```

### Decisão de Arquitetura

#### Motivação

- **Escalabilidade**: Cada serviço pode ser escalado independentemente
- **Manutenção**: Serviços menores são mais fáceis de manter e atualizar
- **Resiliência**: Falhas em um serviço não afetam os outros
- **Desenvolvimento Paralelo**: Equipes podem trabalhar em serviços diferentes simultaneamente

#### Tecnologias Utilizadas

- **Backend**: .NET 9, ASP.NET Core, YARP, OpenAPI/Scalar
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui
- **Banco de Dados**: MongoDB por serviço
- **Observabilidade**: OpenTelemetry (Shared.Observability)
- **Autenticação**: JWT Bearer
- **Cache**: TanStack Query (React)

## Estrutura de Pastas

### Backend (.NET 9)

```
biblioteca/
├── services/
│   ├── user-service/
│   │   ├── UserService.Api/          # Controllers, Program.cs
│   │   ├── UserService.Application/   # Commands, Queries, Handlers
│   │   ├── UserService.Domain/       # Entidades, Interfaces
│   │   └── UserService.Infrastructure/ # Repositórios, Serviços
│   ├── catalog-service/
│   │   ├── CatalogService.Api/
│   │   ├── CatalogService.Application/
│   │   ├── CatalogService.Domain/
│   │   └── CatalogService.Infrastructure/
│   ├── loan-service/
│   │   ├── LoanService.Api/
│   │   ├── LoanService.Application/
│   │   ├── LoanService.Domain/
│   │   └── LoanService.Infrastructure/
│   └── notification-service/
│       ├── NotificationService.Api/
│       ├── NotificationService.Application/
│       ├── NotificationService.Domain/
│       └── NotificationService.Infrastructure/
├── shared/
│   ├── Shared.Contracts/      # DTOs, Result types
│   ├── Shared.Observability/  # OpenTelemetry config
│   ├── Shared.Tests/          # Testes compartilhados
│   └── Shared.Infrastructure/  # Configurações comuns
├── gateway/
│   ├── Gateway.Api/          # YARP reverse proxy
│   └── Gateway.Tests/         # Testes do gateway
└── frontend/                # Frontend React
```

### Frontend (React)

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/               # Componentes shadcn/ui
│   │   ├── shared/           # Componentes compostos/layout
│   │   └── auth/             # Componentes de autenticação
│   ├── lib/                 # Cliente de API, utilitários
│   ├── admin/              # Páginas administrativas
│   ├── catalog/            # Página de catálogo
│   ├── home/              # Página inicial
│   ├── login/             # Página de login
│   ├── perfil/            # Página de perfil
│   ├── meus-emprestimos/  # Página de empréstimos
│   └── cadastro/           # Página de cadastro
│   ├── components/        # Componentes compartilhados
│   ├── mocks/            # Handlers MSW para testes
│   └── lib/              # Utilitários e cliente de API
└── public/                # Arquivos estáticos
```

## Padrões de Projeto

### 1. CQRS (Command Query Responsibility Segregation)

**Visão Geral**

CQRS separa operações de leitura (Queries) de operações de escrita (Commands). Cada operação tem seu próprio handler, facilitando a separação de preocupações e otimizando o desempenho.

**Implementação**

```csharp
// Command (escrita)
public record CreateLoanCommand(Guid UserId, Guid BookId);
public record ReserveLoanCommand(Guid UserId, Guid BookId);
public record ReturnLoanCommand(Guid LoanId, Guid UserId);

// Query (leitura)
public record GetLoansByUserIdQuery(Guid UserId);

// Handlers
public class CreateLoanHandler : ICommandHandler<CreateLoanCommand, Result<LoanResponseDto>>
public class ReserveLoanHandler : ICommandHandler<ReserveLoanCommand, Result<LoanResponseDto>>
public class ReturnLoanHandler : ICommandHandler<ReturnLoanCommand, Result<LoanResponseDto>>
public class GetLoansByUserIdHandler : IQueryHandler<GetLoansByUserIdQuery, IEnumerable<LoanResponseDto>>
```

**Vantagens**

- **Separação de Preocupações**: Queries e Commands são tratados separadamente
- **Otimização**: Queries podem ser otimizadas para leitura, Commands para escrita
- **Testabilidade**: Handlers individuais são mais fáceis de testar
- **Escalabilidade**: Serviços de leitura e escrita podem ser escalados independentemente

### 2. Repository Pattern

**Visão Geral**

Abstrai a camada de persistência, permitindo que o código de negócio opere com objetos de domínio sem se preocupar com o armazenamento de dados.

**Implementação**

```csharp
public interface ILoanRepository
{
    Task<Loan?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Loan>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Loan>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Loan loan, CancellationToken cancellationToken = default);
    Task UpdateAsync(Loan loan, CancellationToken cancellationToken = default);
}

public class LoanRepository : ILoanRepository
{
    private readonly IMongoCollection<Loan> _loans;
    
    public LoanRepository(MongoContext context)
    {
        _loans = context.Loans;
    }
    
    // Implementação usando MongoDB
}
```

**Vantagens**

- **Testabilidade**: Mock repositories em testes unitários
- **Portabilidade**: Fácil mudar a implementação do repositório
- **Manutenção**: Lógica de negócio desacoplada da persistência

### 3. Dependency Injection (DI)

**Visão Geral**

Injeção de dependências para gerenciar o ciclo de vida e as relações entre componentes.

**Implementação**

```csharp
var builder = WebApplication.CreateBuilder(args);

// Registro de serviços
builder.Services.AddScoped<ILoanRepository, LoanRepository>();
builder.Services.AddScoped<ICommandHandler<CreateLoanCommand, Result<LoanResponseDto>>, CreateLoanHandler>();
builder.Services.AddScoped<IQueryHandler<GetLoansByUserIdQuery, IEnumerable<LoanResponseDto>>, GetLoansByUserIdHandler>();
builder.Services.AddHttpClient("CatalogService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["CatalogService:BaseUrl"]);
});
```

**Vantagens**

- **Testabilidade**: Fácil mockar dependências
- **Manutenção**: Acoplamento inverso
- **Reutilização**: Serviços podem ser reutilizados em diferentes contextos

### 4. MediatR Pattern

**Visão Geral**

MediatR implementa CQRS com um pipeline de tratamento de comandos e queries.

**Implementação**

```csharp
// No Program.cs
builder.Services.AddMediatR(typeof(Program).Assembly);

// Uso
await mediator.Send(createLoanCommand);
var loans = await mediator.Send(getLoansByUserIdQuery);
```

**Vantagens**

- **Pipeline**: Suporte a behaviors (logging, validation, etc.)
- **Simplicidade**: Reduz código boilerplate
- **Flexibilidade**: Fácil adicionar novos behaviors

### 5. Domain-Driven Design (DDD)

**Visão Geral**

Código de negócio focado no domínio do sistema de biblioteca (empréstimos, reservas, livros, usuários).

**Implementação**

```csharp
// Entidades de domínio
public class Loan
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid BookId { get; private set; }
    public DateTime LoanDate { get; private set; }
    public DateTime DueDate { get; private set; }
    public DateTime? ReturnDate { get; private set; }
    public LoanStatus Status { get; private set; }
    
    // Métodos de fábrica
    public static Result<Loan> Create(Guid userId, Guid bookId, IEnumerable<Loan> existingLoans)
    public static Result<Loan> Reserve(Guid userId, Guid bookId, IEnumerable<Loan> existingLoans)
    public static Result<Loan> Return(Guid id, IEnumerable<Loan> existingLoans)
    public static IEnumerable<Loan> UpdateOverdueStatus(IEnumerable<Loan> loans)
}
```

**Vantagens**

- **Domínio Centralizado**: Lógica de negócio no centro do sistema
- **Consistência**: Regras de negócio aplicadas em toda a aplicação
- **Testabilidade**: Domínio pode ser testado independentemente

## Padrões de Segurança

### 1. JWT Bearer Authentication

**Implementação**

```csharp
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });
```

### 2. Role-Based Access Control (RBAC)

**Implementação**

```csharp
[Authorize(Roles = "Admin")]
[HttpGet("admin")]
public async Task<IActionResult> GetAllLoansForAdmin(CancellationToken cancellationToken)
{
    // Apenas usuários com role Admin podem acessar
}

[Authorize]
[HttpPost("{id:guid}/return")]
public async Task<IActionResult> ReturnLoan(Guid id, CancellationToken cancellationToken)
{
    // Qualquer usuário autenticado pode devolver seus próprios empréstimos
}
```

### 3. Password Hashing

**Implementação**

```csharp
public class PasswordHasher : IPasswordHasher
{
    public string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
    
    public bool Verify(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}
```

## Padrões de Integração

### 1. HTTP Client Factory

**Implementação**

```csharp
builder.Services.AddHttpClient("CatalogService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["CatalogService:BaseUrl"]);
});

// Uso em handlers
var httpClient = _httpClientFactory.CreateClient("CatalogService");
var bookResponse = await httpClient.GetAsync($"api/books/{command.BookId}", cancellationToken);
```

**Vantagens**

- **Reutilização**: Mesmo cliente HTTP para múltiplas chamadas
- **Configuração**: Configuração centralizada
- **Escalabilidade**: Suporte a retry, timeout, logging

### 2. Circuit Breaker Pattern

**Implementação**

```csharp
builder.Services.AddHttpClient("CatalogService")
    .AddCircuitBreaker(options =>
    {
        options.DeliveryTimeout = TimeSpan.FromSeconds(30);
        options.FailureThreshold = 5;
        options.SamplingDuration = TimeSpan.FromSeconds(30);
        options.MinimumThroughput = 10;
        options.MaxBurstSize = 20;
    });
```

## Padrões de Observabilidade

### 1. OpenTelemetry

**Implementação**

```csharp
services.AddSharedObservability("LoanService");
```

**Configuração**

```xml
<PropertyGroup>
  <PackageReference Include="OpenTelemetry.Api" Version="1.7.0" />
  <PackageReference Include="OpenTelemetry.Exporter.Jaeger" Version="1.7.0" />
  <PackageReference Include="OpenTelemetry.Exporter.Console" Version="1.7.0" />
</PropertyGroup>
```

### 2. Logging Estruturado

**Implementação**

```csharp
_logger.LogInformation("Creating loan for user {UserId}, book {BookId}", command.UserId, command.BookId);

// Console output
// Information: Creating loan for user 123, book abc

// OpenTelemetry
activity.SetTag("user.id", command.UserId);
activity.SetTag("book.id", command.BookId);
```

## Padrões de Cache

### 1. TanStack Query (React Query)

**Implementação**

```typescript
const { data: books, isLoading, error } = useQuery({
  queryKey: ['books', queryParam],
  queryFn: () => fetchBooks(queryParam),
});
```

**Vantagens**

- **Cache**: Respostas em cache automaticamente
- **Sync**: Sincronização automática com servidor
- **Estado**: Gerenciamento de estado simplificado
- **Erro**: Tratamento de erros padronizado

## Padrões de Validação

### 1. FluentValidation

**Implementação**

```csharp
public class CreateLoanCommandValidator : AbstractValidator<CreateLoanCommand>
{
    public CreateLoanCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");
        
        RuleFor(x => x.BookId)
            .NotEmpty()
            .WithMessage("Book ID is required");
    }
}
```

## Padrões de Monitoramento

### 1. Health Checks

**Implementação**

```csharp
builder.Services.AddHealthChecks()
    .AddMongoDb(mongoSettings.ConnectionString, name: "MongoDB");
```

### 2. Metrics

**Implementação**

```csharp
services.AddOpenTelemetry()
    .WithMetrics(m =>
    {
        m.AddAspNetCoreInstrumentation();
        m.AddHttpClientInstrumentation();
        m.AddRuntimeInstrumentation();
    });
```

## Fluxo de Trabalho de Desenvolvimento

### 1. Desenvolvimento Local

```bash
# Subir todos os serviços com Docker
docker compose up -d --build

# Executar testes backend
dotnet test Biblioteca.sln

# Executar testes frontend
cd frontend
npm ci
npm test
```

### 2. CI/CD Pipeline

```yaml
name: .NET Build and Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    services:
      mongodb-user:
        image: mongo:latest
        ports:
          - 27017:27017
      mongodb-catalog:
        image: mongo:latest
        ports:
          - 27018:27018
      mongodb-loan:
        image: mongo:latest
        ports:
          - 27019:27019
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '9.0.x'
    
    - name: Restore dependencies
      run: dotnet restore Biblioteca.sln
    
    - name: Build
      run: dotnet build Biblioteca.sln --configuration Release
    
    - name: Test
      run: dotnet test Biblioteca.sln --configuration Release
```

## Melhores Práticas

### 1. Segurança

- **Nunca** expor segredos em código-fonte
- Usar variáveis de ambiente para segredos
- Implementar rate limiting
- Usar HTTPS em produção

### 2. Performance

- Usar paginação para queries de grande volume
- Implementar cache para dados imutáveis
- Usar CDNs para assets estáticos
- Implementar background jobs para tarefas pesadas

### 3. Manutenção

- Seguir convenções de nomenclatura consistentes
- Documentar APIs com OpenAPI/Swagger
- Implementar testes unitários e de integração
- Usar CI/CD para automação de build e deploy

### 4. Escalabilidade

- Projetar serviços com estado stateless
- Usar cache distributed para sessões
- Implementar load balancing
- Usar auto-scaling baseado em métricas

## Referências

1. **Microsoft .NET Documentation**: https://learn.microsoft.com/en-us/dotnet/
2. **YARP Documentation**: https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/yarp/
3. **React Documentation**: https://react.dev/
4. **Tailwind CSS Documentation**: https://tailwindcss.com/docs
5. **MongoDB .NET Driver**: https://www.mongodb.com/docs/drivers/dotnet/current/
6. **OpenTelemetry Documentation**: https://opentelemetry.io/docs/
7. **MediatR Documentation**: https://github.com/mediatr MediatR
8. **FluentValidation Documentation**: https://fluentvalidation.net/

## Agradecimentos

- Agradecemos a todos os contribuidores que ajudaram a construir este sistema
- Agradecemos à comunidade open source por excelentes bibliotecas e ferramentas
- Agradecemos à equipe de documentação por ajudar a manter a documentação atualizada

---

*Este documento é mantido por:
Equipe de Desenvolvimento do Sistema de Biblioteca
Última atualização: $(date)
Versão: 1.0.0*
