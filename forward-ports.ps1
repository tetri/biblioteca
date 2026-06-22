#!/usr/bin/env pwsh
# Script para configurar port forwarding do Windows para WSL2
# Uso: .\forward-ports.ps1

Write-Host "🔧 Configurando port forwarding Windows → WSL2..." -ForegroundColor Cyan

# Obter IP do WSL2
$wslIP = (wsl hostname -I).Trim().Split(" ")[0]
Write-Host "   WSL2 IP: $wslIP" -ForegroundColor Gray

# Portas para forward
$ports = @(
    @{Port=3000; Name="Frontend"},
    @{Port=5158; Name="Gateway"},
    @{Port=5146; Name="UserService"},
    @{Port=5147; Name="CatalogService"},
    @{Port=5118; Name="LoanService"},
    @{Port=5151; Name="NotificationService"},
    @{Port=27017; Name="MongoDB"}
)

foreach ($p in $ports) {
    $port = $p.Port
    $name = $p.Name

    # Remover regra existente
    netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0 2>$null | Out-Null

    # Adicionar nova regra
    netsh interface portproxy add v4tov4 listenport=$port listenaddress=0.0.0.0 connectport=$port connectaddress=$wslIP
    Write-Host "   ✅ $name (porta $port)" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Port forwarding configurado!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Acesse pelo navegador:" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:3000"
Write-Host "   Gateway:     http://localhost:5158"
Write-Host "   UserService: http://localhost:5146"
Write-Host ""
Write-Host "⚠️  Para remover as regras:" -ForegroundColor Yellow
Write-Host "   .\remove-forward-ports.ps1"
