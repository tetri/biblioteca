# Design System: Biblioteca Minimalista

Este documento define as diretrizes visuais e de componentes para o sistema Biblioteca. A consistência deve ser mantida em todas as interfaces utilizando os componentes do `shadcn/ui`.

## 1. Fundamentos Visuais
- **Tipografia:** Sans-serif (Inter/Geist), hierarquia clara (H1: 2rem, H2: 1.5rem, Body: 1rem).
- **Espaçamento:** Sistema de grid de 4px (padrão Tailwind `gap-4`, `p-4`).
- **Paleta:** Foco em tons neutros (Slate/Gray) para minimalismo, com um acento de cor primária (Primary/Indigo).

## 2. Componentes (shadcn/ui)
Todos os componentes devem vir de `src/components/ui/` e seguir a especificação oficial mais atualizada.

### Componentes Core
- **Button:** `variant="default"`, `variant="outline"`, `variant="ghost"`.
- **Card:** `Card`, `CardContent`, `CardHeader`.
- **Input:** `Input` (base para formulários).
- **Alert:** `Alert` (versão `destructive` para erros).
- **Label:** `Label` (padrão de Acessibilidade).

## 3. Diretrizes de Implementação
- **Clean Code no UI:** Nunca use estilos inline. Use as classes do Tailwind e componentes do shadcn/ui.
- **Acessibilidade:** Todo input deve ter um `Label` associado via `htmlFor`.
- **Estado de Carga:** Usar `Skeleton` para loading states.
- **Resiliência:** Wrappers de erro obrigatórios em todas as chamadas de API.

## 4. Estrutura de Pastas
- `src/components/ui/` -> Componentes primitivos.
- `src/components/shared/` -> Componentes compostos (Layouts, Navbar).
- `src/pages/` -> Views específicas.
