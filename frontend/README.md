# Frontend - Biblioteca

Aplicação React 19 + Vite + TypeScript para a interface pública e autenticada do ecossistema Biblioteca.

## Stack
- React 19
- Vite 7
- TypeScript 5
- Tailwind CSS v4
- Radix UI + shadcn/ui
- TanStack Query
- Vitest + Testing Library + MSW

## Pré-requisitos
- Node.js 24+
- npm 10+

## Scripts
- `npm run dev`: inicia ambiente de desenvolvimento.
- `npm run build`: gera build de produção.
- `npm run preview`: sobe preview do build.
- `npm run lint`: executa lint.
- `npm test`: executa testes (Vitest run).

## Estrutura principal
- `src/components/ui/`: componentes de base (primitivos).
- `src/components/shared/`: componentes compostos/layout.
- `src/lib/`: utilitários e cliente de API.
- `src/mocks/`: handlers MSW para testes.
- `src/*/page.tsx`: páginas por rota.

## Padrões obrigatórios
- Não usar estilos inline; preferir Tailwind + componentes reutilizáveis.
- Garantir estados de loading e erro em chamadas de API.
- Seguir diretrizes visuais do arquivo raiz `DESIGN.md`.
