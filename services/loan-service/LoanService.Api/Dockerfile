FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["services/loan-service/LoanService.Api/LoanService.Api.csproj", "services/loan-service/LoanService.Api/"]
COPY ["services/loan-service/LoanService.Application/LoanService.Application.csproj", "services/loan-service/LoanService.Application/"]
COPY ["services/loan-service/LoanService.Domain/LoanService.Domain.csproj", "services/loan-service/LoanService.Domain/"]
COPY ["services/loan-service/LoanService.Infrastructure/LoanService.Infrastructure.csproj", "services/loan-service/LoanService.Infrastructure/"]
COPY ["shared/Shared.Observability/Shared.Observability.csproj", "shared/Shared.Observability/"]
COPY ["shared/Shared.Contracts/Shared.Contracts.csproj", "shared/Shared.Contracts/"]

RUN dotnet restore "services/loan-service/LoanService.Api/LoanService.Api.csproj"

COPY . .
RUN dotnet publish "services/loan-service/LoanService.Api/LoanService.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LoanService.Api.dll"]
