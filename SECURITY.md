# Política de Segurança

## Versões suportadas

Este projeto é um monorepo com versionamento contínuo. Recebem correções de segurança:
- `main` (branch principal)
- release mais recente, quando existir branch/tag de release ativa

Branches antigas e forks não recebem SLA de correção.

## Como reportar uma vulnerabilidade

Não publique vulnerabilidades em Issues públicas.

Canal recomendado:
- GitHub Security Advisory (Private Vulnerability Report) no repositório.

Canal alternativo (caso advisory não esteja disponível):
- abrir Issue privada para mantenedores ou contato direto do time responsável pelo repositório.

Inclua no reporte:
- descrição do problema e impacto
- passos para reprodução
- escopo afetado (serviço/endpoint/versão/commit)
- evidências (logs, payloads, PoC)
- sugestão de mitigação, se houver

## Processo de triagem
- Confirmação de recebimento: até 72 horas.
- Primeira avaliação de severidade: até 7 dias corridos.
- Atualizações de status: pelo menos semanais até o fechamento.

## Política de divulgação
- Correção e validação primeiro, divulgação pública depois.
- Créditos ao pesquisador podem ser adicionados no changelog, se solicitado.

## Boas práticas para contribuidores
- Nunca commitar segredos (`Jwt__Key`, tokens, senhas).
- Usar variáveis de ambiente para configuração sensível.
- Em PRs, validar `dotnet test Biblioteca.sln` e `cd frontend && npm test`.
- Revisar superfícies de autenticação/autorização em mudanças de `UserService` e `LoanService`.
