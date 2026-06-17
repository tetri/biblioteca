FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["gateway/Gateway.Api/Gateway.Api.csproj", "gateway/Gateway.Api/"]
COPY ["shared/Shared.Observability/Shared.Observability.csproj", "shared/Shared.Observability/"]
COPY ["shared/Shared.Contracts/Shared.Contracts.csproj", "shared/Shared.Contracts/"]

RUN dotnet restore "gateway/Gateway.Api/Gateway.Api.csproj"

COPY . .
RUN dotnet publish "gateway/Gateway.Api/Gateway.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Gateway.Api.dll"]
