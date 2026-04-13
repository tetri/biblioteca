# Sistema de Biblioteca (Open Source)

Este é um projeto open source de sistema de biblioteca baseado em arquitetura de microsserviços.

## 🏗️ Arquitetura
O sistema utiliza microsserviços desacoplados com comunicação síncrona (REST/Gateway) e assíncrona planejada.

- **Backend:** .NET 9.0 com Clean Architecture e DDD.
- **Frontend:** React 19 com Vite, Tailwind CSS 4 e Radix UI.
- **Padrões:** CQRS Nativo (via `Microsoft.Extensions.DependencyInjection`), Observabilidade com OpenTelemetry.
- **Infraestrutura:** Docker, MongoDB.

## 🚀 Microsserviços
- **Gateway:** Proxy centralizado (YARP).
- **UserService:** Autenticação e gestão de usuários.
- **CatalogService:** Gestão de acervo de livros.
- **LoanService:** Gestão de empréstimos, devoluções e multas.
- **NotificationService:** Placeholder para notificações.

## 🛠️ Como rodar este sistema
Este projeto foi orquestrado para rodar nativamente em ambientes **Linux/WSL2** para máxima performance.

### Pré-requisitos
- .NET 9 SDK
- Node.js 22+
- Docker Engine (rodando no WSL2)

### Orquestração
1. Dê permissão de execução ao script:
   `chmod +x up.sh`
2. Suba todo o ambiente:
   `./up.sh`

O `docker-compose.yml` utiliza `healthcheck` para garantir que os microsserviços só iniciem após a prontidão dos bancos de dados, evitando falhas de inicialização.

## 🧪 Qualidade e Testes
O projeto conta com uma suíte de testes robusta:
- **Unitários:** XUnit (Backend) e Vitest (Frontend).
- **Mocks:** MSW (Mock Service Worker) no Frontend.
- **CI/CD:** GitHub Actions configurado para CI completo (Build e Test).

## 📝 Documentação Adicional
Consulte o arquivo `GEMINI.md` para ver o roadmap de implementação e protocolos para novos agentes.
