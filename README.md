# Vitro

> Liquid Glass design system for Mac Mini services.

React + Tailwind v4 shared component library. Used by **Flux**, **Pantry**, and other services.

## Quick Start

```bash
npm install @circle-oo/vitro
```

```tsx
// Import styles
import '@circle-oo/vitro/styles/base.css';
import '@circle-oo/vitro/styles/themes/pantry.css';

// Use components
import { GlassCard, Button, Badge, StatCard } from '@circle-oo/vitro';

// Set up layout
<html data-svc="pantry" data-mode="light" data-mesh="on">
```

## Features

- **4-level Glass Material** — Surface, Card, Interactive, Overlay
- **Service Theming** — Swap colors with a single `data-svc` attribute
- **Light/Dark Mode** — Full dark mode support with `data-mode`
- **Mesh Background** — Animated conic-gradient mesh with toggle
- **Chart Wrappers** — recharts with glass styling (Area, Bar, HBar, Sparkline, Heatmap)
- **Chat UI** — ChatBubble, ToolCallCard, ChatInput components
- **Command Palette** — Cmd+K powered navigation

## Components

| Category | Components |
|----------|-----------|
| Glass | GlassCard, GlassOverlay, GlassInteractive |
| Layout | MeshBackground, GlassSidebar, PageLayout |
| UI | Button, Badge, Input, Checkbox, FilterChips, ProgressBar, Toast, Modal |
| Data | StatCard, DataTable, Timeline |
| Charts | VitroAreaChart, VitroBarChart, VitroHBarChart, VitroSparkline, VitroHeatmap |
| Chat | ChatLayout, ChatBubble, ToolCallCard, ChatInput |
| Nav | CommandPalette, ThemeToggle, MeshToggle |

## Development

```bash
npm run build     # Build library (ESM + CJS + types)
npm run dev       # Watch mode

# Demo app
cd demo
npm install
npm run dev       # Vite dev server
```

## Docs

- `docs/SPEC.md` — Design system overview
- `docs/GLASS.md` — Glass material reference
- `docs/COLORS.md` — Color system reference
- `docs/MIGRATION.md` — Migrating from raw CSS
- `docs/NEW_SERVICE.md` — Adding a new service theme
- `demo/` — Vite + React demo app with all components
