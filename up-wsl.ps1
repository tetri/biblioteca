#!/usr/bin/env pwsh
# Script para subir ambiente completo via WSL/Docker
# Uso: .\up-wsl.ps1

Write-Host "🚀 Subindo ambiente Biblioteca via WSL..." -ForegroundColor Cyan

# Verificar se WSL está disponível
$wsl = Get-Command wsl -ErrorAction SilentlyContinue
if (-not $wsl) {
    Write-Host "❌ WSL não encontrado. Instale: wsl --install" -ForegroundColor Red
    exit 1
}

# Verificar se Docker está disponível no WSL
$dockerCheck = wsl docker --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker não encontrado no WSL. Instale o Docker Desktop com WSL integration." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker: $(wsl docker --version)" -ForegroundColor Green

# Converter caminho Windows para WSL
$currentDir = (Get-Location).Path
$wslPath = wsl wslpath -a "$currentDir" 2>$null
if (-not $wslPath) {
    # Fallback: converter manualmente
    $wslPath = "/" + ($currentDir -replace '\\', '/' -replace 'C:', 'mnt/c' -replace 'D:', 'mnt/d' -replace 'E:', 'mnt/e')
}

Write-Host "📁 Diretório: $wslPath" -ForegroundColor Gray

Write-Host ""
Write-Host "🔨 Compilando e subindo serviços..." -ForegroundColor Cyan
Write-Host "   (Primeira vez pode levar 5-10 minutos)" -ForegroundColor Yellow
Write-Host ""

# Executar docker compose via WSL
wsl -e bash -c "cd $wslPath && docker compose -f docker-compose.dev.yml up --build -d"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Ambiente rodando!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Endereços:" -ForegroundColor Cyan
    Write-Host "   Frontend:       http://localhost:3000"
    Write-Host "   Gateway:        http://localhost:5158"
    Write-Host "   UserService:    http://localhost:5146"
    Write-Host "   CatalogService: http://localhost:5147"
    Write-Host "   LoanService:    http://localhost:5118"
    Write-Host "   Notification:   http://localhost:5151"
    Write-Host "   MongoDB:        localhost:27017"
    Write-Host ""
    Write-Host "👤 Usuários de teste:" -ForegroundColor Cyan
    Write-Host "   Admin:  admin@biblioteca.com / temp123"
    Write-Host "   Demo:   demo@biblioteca.com / demo123"
    Write-Host ""
    Write-Host "📋 Comandos úteis:" -ForegroundColor Cyan
    Write-Host "   Ver logs:       wsl -e bash -c 'cd $wslPath && docker compose -f docker-compose.dev.yml logs -f'"
    Write-Host "   Parar tudo:     .\down-wsl.ps1"
    Write-Host "   Status:         wsl docker compose -f /mnt/d/tetri/git/centelha/projects/biblioteca/docker-compose.dev.yml ps"
} else {
    Write-Host ""
    Write-Host "❌ Erro ao subir o ambiente." -ForegroundColor Red
    Write-Host "   Verifique os logs: docker compose -f docker-compose.dev.yml logs" -ForegroundColor Yellow
}
