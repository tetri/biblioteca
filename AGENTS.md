# AGENTS.md - Guia Operacional para Agentes de IA

Este arquivo consolida a documentacao do projeto para acelerar onboarding e execucao de tarefas por agentes de IA.

## 1) Resumo
- Projeto: Sistema de Biblioteca (monorepo open source).
- Arquitetura: microsservicos em .NET 9 + frontend React 19/Vite.
- Objetivos: escalabilidade, observabilidade e consistencia de design.

## 2) Stack Tecnica
- Backend: ASP.NET Core (.NET 10), YARP, OpenAPI/Scalar.
- Persistencia: MongoDB por servico.
- Frontend: React 19, TypeScript, Vite, Tailwind CSS v4, Radix/shadcn/ui.
- Estado de servidor: TanStack Query.
- Observabilidade: `shared/Shared.Observability` (OpenTelemetry).
- Runtime frontend padrao: Node.js 24+.

## 3) Servicos
- Gateway: `gateway/Gateway.Api`.
- UserService: `services/user-service`.
- CatalogService: `services/catalog-service`.
- LoanService: `services/loan-service`.
- NotificationService: `services/notification-service`.

## 4) Rotas do Gateway
Config em `gateway/Gateway.Api/appsettings.json`:
- `/user/{**catch-all}` -> `userservice.api:8080`
- `/catalog/{**catch-all}` -> `catalogservice.api:8080`
- `/loan/{**catch-all}` -> `loanservice.api:8080`
- `/notification/{**catch-all}` -> `notificationservice.api:8080`
- `/{**catch-all}` -> frontend (`frontend:80`)

Convencao de consumo no frontend:
- chamadas ao UserService devem usar prefixo `/user` (ex.: `/user/api/auth/register`, `/user/api/auth/login`).
- chamadas ao CatalogService devem usar prefixo `/catalog`.
- chamadas ao LoanService devem usar prefixo `/loan`.

Docs agregadas em `gateway/Gateway.Api/Program.cs`:
- `/docs/user`
- `/docs/catalog`
- `/docs/loan`
- `/docs/notification`

## 5) Regras de Negocio Criticas (LoanService)
Fonte: `services/loan-service/DOCS.md`.
- Verificar disponibilidade no CatalogService antes de emprestimo.
- Limite de 3 emprestimos ativos por usuario.
- Prazo padrao de 14 dias.
- Status `Overdue` bloqueia novos emprestimos.
- Validacoes na camada Application.

## 6) Padroes Arquiteturais
- CQRS com handlers registrados via DI (`AddScoped`).
- Convencao de pastas: `Application/Commands`, `Application/Queries`, `Application/Handlers`.
- Interfaces: `ICommandHandler<TCommand, TResult>` e `IQueryHandler<TQuery, TResult>`.

## 7) Frontend
- Seguir `DESIGN.md` (premium minimalista).
- Evitar estilos inline.
- Garantir estados de loading/erro em chamadas de API.
- Referencia operacional do frontend: `frontend/README.md`.

## 8) Internacionalizacao (i18n)
- Framework: `i18next` + `react-i18next`.
- Configuracao: `frontend/src/i18n/config.ts` (pt-BR default, en fallback).
- Preferencia do usuario persistida em `localStorage('app-language')`.
- Hook: `useLanguage()` em `frontend/src/hooks/useLanguage.ts`.
- Componente seletor: `LanguageSwitcher` (`frontend/src/components/language-switcher.tsx`).
- Arquivos de traducao:
  - `frontend/src/i18n/locales/pt-BR/translation.json`
  - `frontend/src/i18n/locales/en/translation.json`
- Comunidade contribui via PR adicionando novos arquivos em `locales/`.
- Backend retorna codigos de erro estruturados; frontend mapeia via i18next.
- Uso: `const { t } = useTranslation()` em function components. Para class components, usar `import i18n from '../i18n/config'` e `i18n.t('key')`.

## 9) Execucao Local
- Subida completa: `./up.sh`.
- Alternativa: `docker compose up -d --build`.
- Endpoints:
  - Gateway: `http://localhost:80`
  - Frontend: `http://localhost:3000`
  - Docs: `http://localhost:80/docs/user|catalog|loan|notification`

## 10) Docker Compose (resumo)
- Mongo UserService: host `27017`.
- Mongo CatalogService: host `27018`.
- UserService: `8080`.
- CatalogService: `8082`.
- LoanService: `8083` (com variaveis JWT obrigatorias no compose).
- NotificationService: `8084`.

## 11) Testes e CI
- Backend local: `dotnet test Biblioteca.sln`.
- Frontend local: `cd frontend && npm ci && npm test`.
- Workflow CI: `.github/workflows/dotnet-build-test.yml`, `.github/workflows/commitlint.yml`, `.github/workflows/ci-cd-pipeline.yml`.
  - Backend: restore/build/test com .NET 10.
  - Frontend: Node 24, build e Vitest.
- Commit convention: Conventional Commits via commitlint (`commitlint.config.js`).
  - Header max 72 caracteres.
  - Scopes permitidos: `ci`, `user-service`, `catalog-service`, `loan-service`, `notification-service`, `gateway`, `frontend`, `shared`, `infra`, `deps`, `docs`, `repo`, `auth`, `api`, `ui`, `admin`, `tests`.
  - Workflow em `.github/workflows/commitlint.yml` (Node 24).
  - Frontend: Node 24, build e Vitest.
- CI lint: ESLint 10 flat config (`frontend/eslint.config.js`), `eslint-plugin-react-hooks` v7+ strict rules.

## 12) Seguranca e Acesso
- Credenciais de seed (dev):
  - Admin: `admin@biblioteca.com` / `temp123` (troca obrigatoria).
  - Demo: `demo@biblioteca.com` / `demo123`.
- Politica de seguranca: `SECURITY.md`.
- Nao expor segredos reais em repositorio.

## 13) Area Administrativa
- Endpoints administrativos no UserService (requer role `Admin`):
  - `GET /user/api/users/admin` (filtros: `search`, `isApproved`, `role`)
  - `PATCH /user/api/users/admin/{userId}/approve`
  - `PATCH /user/api/users/admin/{userId}/role` (body: `{ \"role\": \"Admin\" | \"Member\" }`)
- Endpoint administrativo no LoanService (requer role `Admin`):
  - `GET /loan/api/loans/admin`
- Rotas frontend administrativas:
  - `/admin` (dashboard inicial)
  - `/admin/usuarios`
  - `/admin/livros`
  - `/admin/emprestimos`
- A area admin usa layout com sidebar (desktop) e navegacao horizontal (mobile).
- Usuarios novos entram como `Member` e `IsApproved = false`; sem aprovacao, o login retorna erro amigavel `403`.

## 14) Fonte de Verdade
Em caso de conflito, priorizar:
1. Codigo atual (`Program.cs`, controllers/handlers, `docker-compose.yml`, workflow CI).
2. `README.md` (operacao e execucao).
3. Documentos de diretriz (`GEMINI.md`, `DESIGN.md`, `DEPLOY.md`, `DOCS.md`).
4. `WIKI.json` como mapa de onboarding.

## 15) Versionamento Semantico (MinVer)

- Todos os projetos .NET herdam `Directory.Build.props` na raiz.
- A versao e gerada automaticamente pelo **MinVer** a partir de tags git com prefixo `v`.
- Sem tags: versao `0.0.0-alpha.0.N` (N = altura de commits).
- Tag `v1.0.0` produz versao exata `1.0.0`.
- Frontend (`package.json`) versionado manualmente para espelhar.
- Politica completa em `VERSIONING.md`.

## 16) Checklist de Inicio Rapido para Agentes
1. Ler este `AGENTS.md`.
2. Subir ambiente (`./up.sh`).
3. Validar docs via gateway em `/docs/*`.
4. Rodar testes backend/frontend.
5. Em alteracoes de emprestimo, revisar `services/loan-service/DOCS.md`.
6. Em alteracoes de UI, seguir `DESIGN.md`.

## 17) Fontes utilizadas nesta consolidacao
- `README.md`
- `frontend/README.md`
- `services/loan-service/DOCS.md`
- `CONTRIBUTING.md`
- `DEPLOY.md`
- `DESIGN.md`
- `GEMINI.md`
- `SECURITY.md`
- `WIKI.json`
- Arquivos de codigo/config relevantes: `Directory.Build.props`, `VERSIONING.md`, `docker-compose.yml`, `up.sh`, `gateway/Gateway.Api/Program.cs`, `gateway/Gateway.Api/appsettings.json`, `services/*/Program.cs`, `.github/workflows/dotnet-build-test.yml`, `frontend/package.json`.
