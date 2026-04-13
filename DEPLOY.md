# Estratégia de Deploy em Monorepo

Para garantir builds eficientes e consistentes, seguimos o padrão de **Docker Context na Raiz**.

## Por que Docker na Raiz?
1. **Visibilidade:** O contêiner enxerga os projetos `shared/` e `services/` como uma estrutura única, permitindo que o `dotnet restore` resolva as `ProjectReference` naturalmente.
2. **Cache:** O Docker Cache funciona melhor ao copiar camadas de arquivos de projeto antes de copiar todo o código.

## Como fazer o deploy
Sempre que adicionar um novo serviço:
1. Atualize o `docker-compose.yml` (contexto raiz: `.`).
2. Crie um `Dockerfile` na pasta `Api` do serviço.
3. No `Dockerfile`, copie os arquivos `.csproj` mantendo a estrutura de pastas do monorepo (ex: `COPY ["services/nome/projeto.csproj", "services/nome/"]`).
4. Rode `./up.sh`.

## Documentação de Deploy
- O script `up.sh` é o ponto de entrada para o ambiente local.
- Para produção, recomenda-se o uso de uma esteira (GitHub Actions) que realiza o `docker build` a partir da raiz, enviando as imagens para um Registry (ex: GitHub Container Registry).
