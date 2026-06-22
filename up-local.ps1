#!/usr/bin/env pwsh
# Script de subida do ambiente sem Docker (Windows/PowerShell)

Write-Host "🚀 Subindo ambiente Biblioteca (local)..." -ForegroundColor Cyan

# Verificar pré-requisitos
$dotnet = Get-Command dotnet -ErrorAction SilentlyContinue
$node = Get-Command node -ErrorAction SilentlyContinue

if (-not $dotnet) {
    Write-Host "❌ .NET SDK não encontrado. Instale: https://dotnet.microsoft.com/download" -ForegroundColor Red
    exit 1
}
if (-not $node) {
    Write-Host "❌ Node.js não encontrado. Instale: https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "✅ .NET: $(dotnet --version)" -ForegroundColor Green
Write-Host "✅ Node: $(node --version)" -ForegroundColor Green

# Verificar MongoDB
$mongo = Get-Command mongod -ErrorAction SilentlyContinue
if ($mongo) {
    Write-Host "✅ MongoDB encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB não encontrado no PATH. Certifique-se de que está rodando." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Cyan
Push-Location frontend
npm install
Pop-Location

Write-Host ""
Write-Host "🌐 Iniciando serviços..." -ForegroundColor Cyan

# UserService (porta 5146)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\services\user-service\UserService.Api'; dotnet run" -WindowStyle Normal
Write-Host "  → UserService: http://localhost:5146" -ForegroundColor Gray
Start-Sleep -Seconds 2

# CatalogService (porta 5147)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\services\catalog-service\CatalogService.Api'; dotnet run" -WindowStyle Normal
Write-Host "  → CatalogService: http://localhost:5147" -ForegroundColor Gray
Start-Sleep -Seconds 2

# LoanService (porta 5118)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\services\loan-service\LoanService.Api'; dotnet run" -WindowStyle Normal
Write-Host "  → LoanService: http://localhost:5118" -ForegroundColor Gray
Start-Sleep -Seconds 2

# NotificationService (porta 5151)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\services\notification-service\NotificationService.Api'; dotnet run" -WindowStyle Normal
Write-Host "  → NotificationService: http://localhost:5151" -ForegroundColor Gray
Start-Sleep -Seconds 2

# Gateway (porta 5158)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\gateway\Gateway.Api'; dotnet run" -WindowStyle Normal
Write-Host "  → Gateway: http://localhost:5158" -ForegroundColor Gray
Start-Sleep -Seconds 2

# Frontend (porta 3000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev" -WindowStyle Normal
Write-Host "  → Frontend: http://localhost:3000" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ Todos os serviços iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Endereços:" -ForegroundColor Cyan
Write-Host "   Frontend:       http://localhost:3000"
Write-Host "   Gateway:        http://localhost:5158"
Write-Host "   UserService:    http://localhost:5146"
Write-Host "   CatalogService: http://localhost:5147"
Write-Host "   LoanService:    http://localhost:5118"
Write-Host "   Notification:   http://localhost:5151"
Write-Host ""
Write-Host "👤 Usuários de teste:" -ForegroundColor Cyan
Write-Host "   Admin:  admin@biblioteca.com / temp123"
Write-Host "   Demo:   demo@biblioteca.com / demo123"
Write-Host ""
Write-Host "⚠️  Aguarde ~10 segundos para todos os serviços iniciarem." -ForegroundColor Yellow
Write-Host "   Feche as janelas do PowerShell para parar cada serviço." -ForegroundColor Yellow
