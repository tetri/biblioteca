#!/usr/bin/env pwsh
# Script para parar ambiente via WSL/Docker
# Uso: .\down-wsl.ps1 [-clean]

param([switch]$clean)

Write-Host "🛑 Parando ambiente Biblioteca..." -ForegroundColor Cyan

# Converter caminho Windows para WSL
$currentDir = (Get-Location).Path
$wslPath = wsl wslpath -a "$currentDir" 2>$null
if (-not $wslPath) {
    $wslPath = "/" + ($currentDir -replace '\\', '/' -replace 'C:', 'mnt/c' -replace 'D:', 'mnt/d' -replace 'E:', 'mnt/e')
}

if ($clean) {
    Write-Host "🧹 Removendo containers e volumes..." -ForegroundColor Yellow
    wsl -e bash -c "cd $wslPath && docker compose -f docker-compose.dev.yml down -v"
} else {
    wsl -e bash -c "cd $wslPath && docker compose -f docker-compose.dev.yml down"
}

Write-Host ""
Write-Host "✅ Ambiente parado." -ForegroundColor Green
