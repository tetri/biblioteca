# 📚 Sistema de Biblioteca (Open Source)

Este é um ecossistema de biblioteca completo, desenvolvido com uma arquitetura de microsserviços moderna utilizando **.NET 9**, **React 19** e **Tailwind CSS v4**. O projeto foi concebido para ser uma referência de implementação robusta, focada em escalabilidade, observabilidade e design premium.

---

## 🏗️ Arquitetura e Tecnologias

O sistema é dividido em microsserviços especializados, comunicando-se através de um Gateway centralizado.

### Backend (.NET 9)
- **Gateway:** Utiliza **YARP (Yet Another Reverse Proxy)** para roteamento inteligente de requisições.
- **Serviços:**
  - `UserService`: Gestão de usuários, autenticação JWT e perfis.
  - `CatalogService`: Gerenciamento do acervo de livros e disponibilidade.
  - `LoanService`: Controle de empréstimos e reservas (Padrão CQRS).
  - `NotificationService`: (Em desenvolvimento) Notificações assíncronas.
- **Shared.Observability:** Biblioteca compartilhada para configuração padronizada de **OpenTelemetry** (Traces e Metrics).
- **Banco de Dados:** MongoDB (NoSQL) para alta escalabilidade.

### Frontend (React 19)
- **Framework:** React 19 com Vite.
- **Estilização:** Tailwind CSS v4 seguindo um design **Premium Minimalista**.
- **Componentes:** Baseado em **shadcn/ui** e Radix UI.
- **Gerenciamento de Estado:** TanStack Query (React Query) para sincronização de dados do servidor.

---

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados.
- .NET 9 SDK (para desenvolvimento local).
- Node.js 20+ e npm (para desenvolvimento frontend).

### Rodando com Docker (Recomendado)
Para subir todo o ecossistema (Serviços, Gateway, Frontend e Banco de Dados):
```bash
./up.sh
```
- **Gateway:** [http://localhost:80](http://localhost:80)
- **Frontend:** [http://localhost:3000](http://localhost:3000)

### Documentação da API
Cada serviço possui sua própria documentação interativa (Scalar/OpenAPI) acessível via Gateway:
- **User Service:** `http://localhost:80/docs/user`
- **Catalog Service:** `http://localhost:80/docs/catalog`
- **Loan Service:** `http://localhost:80/docs/loan`

---

## 🔐 Credenciais de Acesso (Seed)

O sistema pré-carrega usuários para teste no primeiro boot:

- **Administrador:**
  - **Email:** `admin@biblioteca.com`
  - **Senha:** `temp123` (Exige alteração no primeiro acesso)
- **Usuário Demo:**
  - **Email:** `demo@biblioteca.com`
  - **Senha:** `demo123`

---

## 📖 Documentação Detalhada

Para mais informações sobre aspectos específicos do projeto, consulte:

- 🗺️ **[Roadmap de Implementação (GEMINI.md)](GEMINI.md)**: Guia de arquitetura, padrões CQRS e checklist de tarefas.
- 🎨 **[Design System (DESIGN.md)](DESIGN.md)**: Diretrizes visuais, paleta de cores e princípios do Minimalismo Premium.
- 🚢 **[Estratégia de Deploy (DEPLOY.md)](DEPLOY.md)**: Informações sobre Docker Context e processos de CI/CD.
- 🤝 **[Guia de Contribuição (CONTRIBUTING.md)](CONTRIBUTING.md)**: Como ajudar a evoluir o projeto.
- 🛡️ **[Segurança (SECURITY.md)](SECURITY.md)**: Política de segurança e reporte de vulnerabilidades.

---

## 🛠️ Desenvolvimento

### Backend
Para rodar os testes do backend:
```bash
dotnet test
```

### Frontend
Para rodar os testes do frontend:
```bash
cd frontend
npm install
npm test
```

---

## 📜 Licença
Este projeto está sob a licença [MIT](LICENSE).
