FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["services/catalog-service/CatalogService.Api/CatalogService.Api.csproj", "services/catalog-service/CatalogService.Api/"]
COPY ["services/catalog-service/CatalogService.Application/CatalogService.Application.csproj", "services/catalog-service/CatalogService.Application/"]
COPY ["services/catalog-service/CatalogService.Domain/CatalogService.Domain.csproj", "services/catalog-service/CatalogService.Domain/"]
COPY ["services/catalog-service/CatalogService.Infrastructure/CatalogService.Infrastructure.csproj", "services/catalog-service/CatalogService.Infrastructure/"]
COPY ["shared/Shared.Observability/Shared.Observability.csproj", "shared/Shared.Observability/"]
COPY ["shared/Shared.Contracts/Shared.Contracts.csproj", "shared/Shared.Contracts/"]

RUN dotnet restore "services/catalog-service/CatalogService.Api/CatalogService.Api.csproj"

COPY . .
RUN dotnet publish "services/catalog-service/CatalogService.Api/CatalogService.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CatalogService.Api.dll"]
