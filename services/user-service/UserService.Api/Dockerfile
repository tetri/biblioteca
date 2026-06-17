FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["services/user-service/UserService.Api/UserService.Api.csproj", "services/user-service/UserService.Api/"]
COPY ["services/user-service/UserService.Application/UserService.Application.csproj", "services/user-service/UserService.Application/"]
COPY ["services/user-service/UserService.Domain/UserService.Domain.csproj", "services/user-service/UserService.Domain/"]
COPY ["services/user-service/UserService.Infrastructure/UserService.Infrastructure.csproj", "services/user-service/UserService.Infrastructure/"]
COPY ["shared/Shared.Observability/Shared.Observability.csproj", "shared/Shared.Observability/"]
COPY ["shared/Shared.Contracts/Shared.Contracts.csproj", "shared/Shared.Contracts/"]

RUN dotnet restore "services/user-service/UserService.Api/UserService.Api.csproj"

COPY . .
RUN dotnet publish "services/user-service/UserService.Api/UserService.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "UserService.Api.dll"]
