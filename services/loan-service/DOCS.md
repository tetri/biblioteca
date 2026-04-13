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
