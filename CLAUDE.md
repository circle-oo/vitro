# CLAUDE.md — Vitro Design System Guide for LLM

## What is Vitro?
Vitro is a Liquid Glass design system for Won's Mac Mini services.
React + Tailwind v4. Git submodule. Used by Pantry, Flux, etc.

## Quick Start for a new service
1. Add vitro as git submodule: `git submodule add <repo> packages/vitro`
2. Import base CSS: `import '@circle-oo/vitro/styles/base.css'`
3. Import theme: `import '@circle-oo/vitro/styles/themes/pantry.css'`
4. Wrap app: `<html data-svc="pantry" data-mode="light" data-mesh="on">`
5. Use components: `import { GlassCard, Button, Badge } from '@circle-oo/vitro'`

## Component Pattern
Every component follows this pattern:
- Glass material via CSS variables (not hardcoded colors)
- `data-svc` attribute controls point color (flux/pantry)
- `data-mode` attribute controls light/dark
- `data-mesh` attribute controls mesh animation (on/off)
- All interactive elements: min-height 42-44px
- All text: Inter for sans, JetBrains Mono for mono

## Glass Levels
| Level | Class | Use | Blur |
|-------|-------|-----|------|
| 1 Surface | `.gs` | Sidebar, panels | 40px |
| 2 Card | `.gc` | Cards, widgets | 24px |
| 3 Interactive | `.gi` | Buttons, inputs | 16px |
| 4 Overlay | `.go` | Modals, palettes | 48px |

## DO
- Use Vitro components, don't create custom glass cards
- Use Badge with variant prop, don't use raw colored spans
- Use semantic color tokens (--p500, --ok, --err), not hex values
- Use the grid system (r2, r4, ben), not custom grids
- Import charts from @circle-oo/vitro (VitroAreaChart, etc.)

## DON'T
- Don't use rgba(var(--gl),...) for badge backgrounds (use opaque Badge component)
- Don't put more than 3 glass layers in one viewport
- Don't use backdrop-filter directly (use Glass* components)
- Don't hardcode colors — everything goes through CSS variables
- Don't nest GlassCard inside GlassCard

## i18n
- Vitro components never hardcode text. Pass all labels as props.
- Use lang="ko" or lang="en" on `<html>` for typography adjustment.
- Use formatDate, formatRelative from '@circle-oo/vitro' for dates.
- Actual translations are the service's responsibility.

## File Map
- `src/components/` — All React components
- `src/styles/` — CSS tokens, themes, base
- `src/charts/` — recharts wrappers + Heatmap
- `src/hooks/` — useTheme, useCommandK, useMesh
- `src/utils/` — cn (classname merge), format (date utils)
- `docs/` — Detailed specs
- `demo/` — Vite + React demo app (visual reference)

## Build
```bash
npm run build    # tsup → dist/ (ESM + CJS + types)
```
