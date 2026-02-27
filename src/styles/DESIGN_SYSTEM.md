# KodNest Premium Build System

Design system for the Placement Readiness application. B2C product quality — calm, intentional, coherent.

## Philosophy

- **Calm, Intentional, Coherent, Confident**
- No gradients, glassmorphism, neon, or animation noise
- One mind designed it — no visual drift

## Color (max 4)

| Token        | Value     | Use           |
|-------------|-----------|---------------|
| `--color-bg`    | `#F7F6F3` | Background    |
| `--color-text`  | `#111111` | Primary text  |
| `--color-accent`| `#8B0000` | Accent / primary actions |
| `--color-success` | `#4a5d4a` | Success       |
| `--color-warning` | `#6b5d3a` | Warning       |

## Typography

- **Headings:** `--font-serif` (Source Serif 4), large, confident, generous spacing
- **Body:** `--font-sans` (Source Sans 3), 17px, line-height 1.65, max-width 720px for text blocks

## Spacing (strict scale)

Use only: `--space-1` (8px), `--space-2` (16px), `--space-3` (24px), `--space-4` (40px), `--space-5` (64px).

## Layout

Every page: **Top Bar** → **Context Header** → **Primary Workspace (70%) + Secondary Panel (30%)** → **Proof Footer**.

## Components

- **Button:** Primary = solid deep red; Secondary = outlined. Same hover and radius everywhere.
- **Input:** Clean borders, no heavy shadows, clear focus state.
- **Card:** Subtle border, no drop shadows, balanced padding.

## Transitions

150–200ms, ease-in-out. No bounce, no parallax.

## Error & Empty States

- **Errors:** Explain what went wrong + how to fix. Never blame the user.
- **Empty:** Provide next action. Never feel dead.
