# Vitro

> Liquid Glass design system for Mac Mini services.

React shared component library used by **Flux**, **Pantry**, and other internal services.

## Quick Start

```bash
npm install @circle-oo/vitro
```

```tsx
import '@circle-oo/vitro/styles/base.css';
import '@circle-oo/vitro/styles/themes/pantry.css';

import { GlassCard, Button, Badge } from '@circle-oo/vitro';
```

```html
<html data-svc="pantry" data-mode="light" data-mesh="on">
```

## Feature Set

- 4-level glass materials: Surface, Card, Interactive, Overlay
- Service theming via `data-svc`
- Light and dark modes via `data-mode`
- Mesh background support via `data-mesh`
- Data UI set: tables, timeline, log/markdown/json viewers
- Chart wrappers for Recharts with Vitro styles
- Chat UI primitives and command palette

## Components

| Category | Components |
|----------|-----------|
| Glass | `GlassCard`, `GlassOverlay`, `GlassInteractive` |
| Layout | `MeshBackground`, `GlassSidebar`, `SidebarRail`, `SidebarSectioned`, `SidebarDock`, `PageLayout` |
| Core UI | `Button`, `IconButton`, `Badge`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch` (`Toggle`) |
| Overlay UI | `Tooltip`, `Popover`, `DropdownMenu`, `Modal`, `Toast` |
| Utility UI | `Avatar`, `Skeleton`, `Breadcrumb`, `Separator` (`Divider`), `FilterChips`, `ProgressBar`, `Tabs`, `SegmentedControl`, `TreeNav`, `PageHeader`, `StatusDot`, `Kbd` |
| Form Flow | `RadioGroup`, `DatePicker`, `Slider`, `TagInput`, `Stepper` (`Wizard`), `Accordion` (`Collapsible`) |
| Feedback | `LoadingState`, `EmptyState`, `ErrorBanner`, `ConfirmDialog` |
| Data | `StatCard`, `DataTable`, `Timeline`, `JsonViewer`, `MarkdownViewer`, `LogViewer` |
| Charts | `VitroAreaChart`, `VitroBarChart`, `VitroHBarChart`, `VitroLineChart`, `VitroSparkline`, `VitroHeatmap`, `VitroPieChart` (`VittoPieChart`), `VitroDonutChart` |
| Chat | `ChatLayout`, `ChatBubble`, `ToolCallCard`, `ChatInput` |
| Navigation | `BottomNav`, `CommandPalette`, `ThemeToggle`, `MeshToggle` |

## Hooks

- `useTheme`, `useMesh`, `useCommandK`, `useMediaQuery`, `useMobile`
- `useClickOutside`
- `useDebounce`
- `useToast` + `ToastViewport`

## Usage Examples

### Toggle + Tooltip + Dropdown

```tsx
import { Button, DropdownMenu, Switch, Tooltip, IconButton } from '@circle-oo/vitro';

<Switch label="Auto refresh" defaultChecked />

<Tooltip content="Open settings">
  <IconButton aria-label="Settings">⚙</IconButton>
</Tooltip>

<DropdownMenu
  trigger={<Button variant="secondary" size="sm">More</Button>}
  items={[
    { id: 'duplicate', label: 'Duplicate', onSelect: () => {} },
    { id: 'archive', label: 'Archive', onSelect: () => {} },
    { id: 'delete', label: 'Delete', destructive: true, onSelect: () => {} },
  ]}
/>
```

### Imperative Toasts

```tsx
import { Button, ToastViewport, useToast } from '@circle-oo/vitro';

function Screen() {
  const toast = useToast();

  return (
    <>
      <Button onClick={() => toast.success('Saved')}>Save</Button>
      <ToastViewport toasts={toast.toasts} onDismiss={toast.remove} />
    </>
  );
}
```

### Pie / Donut Charts

```tsx
import { VitroPieChart, VitroDonutChart } from '@circle-oo/vitro';

<VitroPieChart
  data={[{ label: 'A', value: 30 }, { label: 'B', value: 70 }]}
  nameKey="label"
  valueKey="value"
/>

<VitroDonutChart
  data={[{ label: 'Success', value: 84 }, { label: 'Fail', value: 16 }]}
  nameKey="label"
  valueKey="value"
  centerSubLabel="Runs"
/>
```

## Development

```bash
npm install
npm run dev         # watch mode
npm run typecheck   # TS check
npm run build       # tsup build (ESM + CJS + d.ts)
npm run verify      # typecheck + build + dist export smoke check

# demo app
cd demo
npm install
npm run dev
npm run build
```

## Docs

- `docs/SPEC.md` - Design system overview
- `docs/GLASS.md` - Glass material reference
- `docs/COLORS.md` - Color token reference
- `docs/MIGRATION.md` - Migration guide from raw CSS
- `docs/NEW_SERVICE.md` - Add a new service theme
- `demo/` - Vite demo app with component showcase
