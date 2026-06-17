FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["services/notification-service/NotificationService.Api/NotificationService.Api.csproj", "services/notification-service/NotificationService.Api/"]
COPY ["services/notification-service/NotificationService.Application/NotificationService.Application.csproj", "services/notification-service/NotificationService.Application/"]
COPY ["services/notification-service/NotificationService.Domain/NotificationService.Domain.csproj", "services/notification-service/NotificationService.Domain/"]
COPY ["services/notification-service/NotificationService.Infrastructure/NotificationService.Infrastructure.csproj", "services/notification-service/NotificationService.Infrastructure/"]
COPY ["shared/Shared.Observability/Shared.Observability.csproj", "shared/Shared.Observability/"]
COPY ["shared/Shared.Contracts/Shared.Contracts.csproj", "shared/Shared.Contracts/"]

RUN dotnet restore "services/notification-service/NotificationService.Api/NotificationService.Api.csproj"

COPY . .
RUN dotnet publish "services/notification-service/NotificationService.Api/NotificationService.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.Api.dll"]
