#!/usr/bin/env pwsh
# Script para remover port forwarding Windows → WSL2
# Uso: .\remove-forward-ports.ps1

Write-Host "🧹 Removendo port forwarding..." -ForegroundColor Cyan

$ports = @(3000, 5158, 5146, 5147, 5118, 5151, 27017)

foreach ($port in $ports) {
    netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0 2>$null | Out-Null
    Write-Host "   ✅ Porta $port" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Port forwarding removido!" -ForegroundColor Green
