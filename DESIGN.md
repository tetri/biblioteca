# Design System: Biblioteca Minimalista Premium

Este documento define as diretrizes visuais e de componentes para o sistema Biblioteca, focando em uma estética **Premium Minimalista**. A consistência deve ser mantida em todas as interfaces utilizando os componentes do `shadcn/ui`.

## 1. Fundamentos Visuais

### 1.1 Princípios do Minimalismo Premium
- **Espaço Negativo:** Use o branco (whitespace) de forma intencional para dar "respiração" ao conteúdo.
- **Hierarquia Clara:** Use o peso da fonte e o tamanho para guiar o olhar, não apenas cores fortes.
- **Detalhes Sutis:** Bordas finas (`border-slate-200`), sombras suaves (`shadow-sm`) e transições fluidas.
- **Foco no Conteúdo:** Remova elementos decorativos desnecessários.

### 1.2 Paleta de Cores
- **Base:** White (`#FFFFFF`) e Slate-50 (`#F8FAFC`) para fundos.
- **Texto:** Slate-900 (Primário), Slate-600 (Secundário), Slate-400 (Desativado/Placeholder).
- **Acento:** Indigo-600 (Botões de ação primária, links importantes).
- **Bordas:** Slate-200 (Sutil e limpo).

### 1.3 Tipografia
- **UI & Interface:** `Inter` ou `Geist` (Sans-serif).
  - H1: 2.25rem (36px), font-bold, tracking-tight.
  - H2: 1.5rem (24px), font-semibold.
  - Body: 1rem (16px), font-normal.
- **Leitura (Long-form):** `Merriweather` ou `Georgia` (Serif) pode ser usada em artigos e termos legais para melhor legibilidade.

## 2. Componentes (shadcn/ui)

### Customizações Premium
- **Button:** `rounded-full` ou `rounded-lg`. Preferência por `variant="outline"` para ações secundárias.
- **Card:** Bordas arredondadas generosas (`rounded-xl`), sombra quase imperceptível.
- **Input:** Foco sutil com anel de cor `indigo-500/20`.

## 3. Diretrizes de Implementação
- **Clean Code no UI:** Nunca use estilos inline. Use as classes do Tailwind e componentes do shadcn/ui.
- **Acessibilidade:** Contraste mínimo de 4.5:1 para texto. Labels obrigatórios.
- **Estado de Carga:** `Skeleton` com animação suave de pulsação.

## 4. Estrutura de Pastas
- `src/components/ui/` -> Componentes primitivos (Radix + Tailwind).
- `src/components/shared/` -> Componentes compostos (Layouts, Navbar).
- Estrutura de Rotas -> Crie páginas como pastas de rota contendo um arquivo `page.tsx` (ex: `frontend/src/home/page.tsx` e `frontend/src/login/page.tsx`).
