# Documentação: Regras de Negócio do Loan-Service

Este documento descreve as regras de negócio avançadas implementadas no serviço de empréstimos, garantindo a integridade e conformidade do sistema.

## Regras Implementadas
1. **Verificação de Disponibilidade:** Antes de efetivar um empréstimo, o sistema deve verificar se o livro está disponível (exige integração com `CatalogService`).
2. **Limite de Empréstimos:** O usuário não pode possuir mais de 3 empréstimos ativos simultâneos.
3. **Data de Vencimento:** O prazo padrão de empréstimo é de 14 dias.
4. **Status e Penalidades:**
    - Empréstimos não devolvidos após a data de vencimento mudam para `Overdue`.
    - Usuários com empréstimos `Overdue` não podem realizar novos empréstimos.

## Estratégia de Implementação
- **Validações:** Adicionadas na camada de `Application` dentro do `LoanService` antes da persistência.
- **Integrações:** Chamadas HTTP protegidas por `HttpClientFactory` para evitar sobrecarga.

## Resiliência e Tolerância a Falhas

### Timeouts
- **HttpClient (LoanService → CatalogService):** 10s hard timeout (HttpClient.Timeout).
- **Resilience Pipeline:** 5s timeout per attempt via `AddStandardResilienceHandler()`.
- **YARP Gateway:** 15s para user/catalog/notification, 20s para loan, 30s para frontend.

### Retry (Polly)
- **Método:** `AddStandardResilienceHandler()` via `Microsoft.Extensions.Http.Resilience`.
- **Tentativas:** 3 com backoff exponencial (500ms base) e jitter.
- **Critérios de retry:** `HttpRequestException`, `TimeoutRejectedException`, HTTP 502/503/504.

### Circuit Breaker (Polly)
- **Método:** Incluído no `AddStandardResilienceHandler()`.
- **Sampling:** 30 segundos.
- **Failure ratio:** 50% (abre após 50% de falhas no sampling window).
- **Minimum throughput:** 5 requisições antes de avaliar.
- **Break duration:** 30 segundos (recovery automático).

### Tratamento de Erros
- **CreateLoanHandler:** Try/catch envolve a chamada HTTP ao CatalogService.
  - `HttpRequestException` → "Serviço de catálogo indisponível."
  - `TaskCanceledException` (timeout) → "Timeout ao verificar disponibilidade."
  - HTTP 503 → "Serviço de catálogo indisponível. Tente novamente."
  - HTTP 404 → "Livro não encontrado."
- **Global Exception Handler:** LoanService e CatalogService retornam JSON estruturado com `traceId` em erros 500.

### Health Checks
- **LoanService:** `/health` (sem predicate), `/ready` (com predicate).
- **CatalogService:** `/health` e `/ready` com verificação MongoDB.
- **Gateway:** `/health` para status do proxy.
- **YARP:** Active health checks (10s interval, 5s timeout) + Passive (3 unhealthy responses antes de marcar como down).

### Validação de Input
- `CreateLoanCommand` valida `UserId` e `BookId` contra `Guid.Empty` antes de qualquer chamada HTTP.
- Erros de validação retornam `Result.Failure` sem impactar serviços downstream.

### Rate Limiting (Gateway)
- Fixed window: 100 requisições/segundo por IP.
- Rejeições retornam HTTP 429 Too Many Requests.

### Fluxo de uma Requisição com Falha
```
Cliente → Gateway (timeout 20s) → LoanService (timeout 10s) → CatalogService
                                    ↓
                              Try/catch captura HttpRequestException
                                    ↓
                              Return Result.Failure("Serviço indisponível")
                                    ↓
                              Gateway retorna 502 com mensagem amigável
```
