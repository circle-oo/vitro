# Migration Guide: Raw CSS → Vitro Components

## Step-by-step

1. **Add Vitro** as a git submodule or npm package
2. **Import CSS** in your layout:
   ```tsx
   import '@circle-oo/vitro/styles/base.css';
   import '@circle-oo/vitro/styles/themes/pantry.css'; // or flux.css
   ```
3. **Set data attributes** on `<html>`:
   ```html
   <html data-svc="pantry" data-mode="light" data-mesh="on">
   ```
4. **Replace HTML patterns** with components:

| Before (raw CSS) | After (Vitro) |
|---|---|
| `<div class="gc pd">...</div>` | `<GlassCard>...</GlassCard>` |
| `<span class="bg bg-s">OK</span>` | `<Badge variant="success">OK</Badge>` |
| `<button class="btn btn1">Go</button>` | `<Button variant="primary">Go</Button>` |
| `<input class="inp gi">` | `<Input placeholder="..." />` |
| `<div class="prg"><div class="prf" style="width:40%">` | `<ProgressBar value={40} />` |
| `<aside id="sb" class="gs">...` | `<GlassSidebar ... />` |
| Canvas area chart | `<VitroAreaChart data={...} />` |
| HTML heatmap grid | `<VitroHeatmap data={...} />` |

## Notes

- Remove all `backdrop-filter` from your CSS — Vitro handles it
- Remove hardcoded color values — use CSS variable tokens
- Charts: Replace canvas/SVG with recharts wrappers from Vitro
