# Design System: Biblioteca

Este documento define as diretrizes visuais e de componentes do sistema Biblioteca. Consistência deve ser mantida em todas as interfaces utilizando Tailwind CSS v4 e componentes `shadcn/ui`.

## 1. Fundamentos Visuais

### 1.1 Princípios
- **Espaço Negativo:** Use whitespace de forma intencional para dar respiração ao conteúdo.
- **Hierarquia Clara:** Use peso da fonte e tamanho para guiar o olhar, não apenas cores fortes.
- **Detalhes Sutis:** Bordas finas, sombras suaves (`shadow-sm`) e transições fluidas.
- **Foco no Conteúdo:** Elementos decorativos mínimos e intencionais.

### 1.2 Paleta de Cores

A paleta foi extraída de uma imagem de referência e organizada em famílias com escalas 50–950 centradas no 500:

| Família     | 500 (Base) | Uso Principal                        |
|-------------|-----------|--------------------------------------|
| **Brand**   | `#4cb797` | Ações primárias, links, destaque     |
| **Warm**    | `#eddabd` | Fundos secundários, badges, acentos  |
| **Sage**    | `#708f86` | Texto muted, bordas subtis           |
| **Clay**    | `#e54546` | Destrutivo, erros, alertas           |

Variáveis CSS disponíveis como `brand-{50..950}`, `warm-{50..950}`, `sage-{50..950}`, `clay-{50..950}`.

**Tokens semânticos (light mode):**

| Token        | Cor                    | OKLCH                          |
|-------------|------------------------|--------------------------------|
| `--primary`  | Brand 500              | `oklch(0.708 0.11 170)`       |
| `--secondary`| Warm 400               | `oklch(0.896 0.044 78)`       |
| `--muted`    | Sage 50                | `oklch(0.96 0.005 170)`       |
| `--destructive`| Clay 400             | `oklch(0.621 0.197 25)`       |
| `--accent`   | Warm 400               | `oklch(0.896 0.044 78)`       |

### 1.3 Tipografia

- **Fonte UI:** DM Sans (Google Fonts, pesos 300–700).
  - H1: `text-3xl font-bold tracking-tight`
  - H2: `text-xl font-semibold`
  - Body: `text-sm font-normal`
  - Small: `text-xs text-muted-foreground`
- Usar a classe `font-sans` (já configurada como DM Sans no `@theme inline`).

### 1.4 Mesh Gradients

Classes utilitárias em `index.css` para fundos com gradientes suaves:

| Classe         | Aplicação                          |
|---------------|-------------------------------------|
| `mesh-light`  | Fundo de página principal           |
| `mesh-card`   | Cards, headers, seções destacadas   |
| `mesh-hero`   | Hero sections, banners              |
| `mesh-sidebar`| Sidebar e painéis laterais          |

As cores dos meshes usam os tokens `--primary`, `--secondary` e `--muted` com opacidade entre 5–12%, adaptando-se automaticamente ao tema (light/dark).

## 2. Componentes (shadcn/ui)

### 2.1 Padrões
- **Button:** `rounded-lg` com `variant="outline"` para ações secundárias.
- **Card:** `rounded-xl` com `shadow-sm`.
- **Input:** Foco com anel `ring-primary/40`.
- **Tabelas:** `Table` com `TableHead` em `text-muted-foreground`.
- **Badges:** `Badge` com `variant="secondary"` para status, `variant="destructive"` para alertas.

### 2.2 Componentes Instalados
`badge`, `button`, `card`, `skeleton`, `input`, `label`, `table`, `dialog`, `select`, `tabs`, `separator`, `dropdown-menu`, `avatar`, `tooltip`.

## 3. Diretrizes de Implementação
- **Estilos:** Nunca use estilos inline. Use classes Tailwind e componentes shadcn/ui.
- **Acessibilidade:** Contraste mínimo 4.5:1 para texto. Labels obrigatórios em inputs.
- **Estados de Loading:** Usar `Skeleton` com animação de pulsação.
- **OrtoGrafia:** Texto em português brasileiro (PT-BR) com acentuação correta.

## 4. Estrutura de Pastas
- `frontend/src/components/ui/` → Componentes primitivos (Radix + Tailwind).
- `frontend/src/components/shared/` → Componentes compostos (Layouts, Navbar).
- Páginas em `frontend/src/<rota>/page.tsx`.
