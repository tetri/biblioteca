@echo off
echo 🚀 Subindo ambiente Biblioteca (local)...
echo.

REM Verificar pré-requisitos
where dotnet >nul 2>&1 || (echo ❌ .NET SDK não encontrado & exit /b 1)
where node >nul 2>&1 || (echo ❌ Node.js não encontrado & exit /b 1)

echo ✅ .NET: & dotnet --version
echo ✅ Node: & node --version
echo.

echo 📦 Instalando dependências do frontend...
cd frontend && npm install && cd ..

echo.
echo 🌐 Iniciando serviços...

REM UserService
start "UserService" cmd /k "cd services\user-service\UserService.Api && dotnet run"
echo   → UserService: http://localhost:5146
timeout /t 2 /nobreak >nul

REM CatalogService
start "CatalogService" cmd /k "cd services\catalog-service\CatalogService.Api && dotnet run"
echo   → CatalogService: http://localhost:5147
timeout /t 2 /nobreak >nul

REM LoanService
start "LoanService" cmd /k "cd services\loan-service\LoanService.Api && dotnet run"
echo   → LoanService: http://localhost:5118
timeout /t 2 /nobreak >nul

REM NotificationService
start "NotificationService" cmd /k "cd services\notification-service\NotificationService.Api && dotnet run"
echo   → NotificationService: http://localhost:5151
timeout /t 2 /nobreak >nul

REM Gateway
start "Gateway" cmd /k "cd gateway\Gateway.Api && dotnet run"
echo   → Gateway: http://localhost:5158
timeout /t 2 /nobreak >nul

REM Frontend
start "Frontend" cmd /k "cd frontend && npm run dev"
echo   → Frontend: http://localhost:3000

echo.
echo ✅ Todos os serviços iniciados!
echo.
echo 📍 Endereços:
echo    Frontend:       http://localhost:3000
echo    Gateway:        http://localhost:5158
echo    UserService:    http://localhost:5146
echo    CatalogService: http://localhost:5147
echo    LoanService:    http://localhost:5118
echo    Notification:   http://localhost:5151
echo.
echo 👤 Usuários de teste:
echo    Admin:  admin@biblioteca.com / temp123
echo    Demo:   demo@biblioteca.com / demo123
echo.
echo ⚠️  Aguarde ~10 segundos para todos os serviços iniciarem.
echo    Feche as janelas do CMD para parar cada serviço.
pause
