# Estratégia de Deploy em Monorepo

Para garantir builds consistentes, o projeto usa Docker com contexto na raiz.

## Por que contexto Docker na raiz?
1. Visibilidade completa dos projetos `shared/`, `services/`, `gateway/` e `frontend/`.
2. Resolução correta de `ProjectReference` no `dotnet restore`.
3. Melhor aproveitamento de cache em camadas de build.

## Como fazer deploy de novos serviços
1. Atualize `docker-compose.yml` com contexto raiz (`.`).
2. Crie um `Dockerfile` na pasta `Api` do serviço.
3. Copie os `.csproj` mantendo estrutura do monorepo.
4. Exponha rota no Gateway (`gateway/Gateway.Api/appsettings.json`) quando o serviço for público.
5. Exponha documentação no Gateway (`gateway/Gateway.Api/Program.cs`) em `/docs/<servico>`.

## Ambiente local
- Entrada padrão: `./up.sh`.
- O ambiente sobe Gateway, Frontend, serviços e bancos necessários.

## Produção
Recomenda-se pipeline CI/CD para:
1. `docker build` a partir da raiz.
2. publicação das imagens em registry (ex.: GHCR).
3. deploy orquestrado (Compose, Swarm ou Kubernetes).
