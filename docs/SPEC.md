# Vitro — Design System Spec

> Full design specification. See `vitro-design-spec.md` in the repo root for the original Korean document.
> This is a quick-reference English summary.

## Glass Material Levels

| Level | Name | Use | Blur | Saturate |
|-------|------|-----|------|----------|
| 1 | Surface (.gs) | Sidebar, panels | 40px | 170% |
| 2 | Card (.gc) | Info cards, widgets | 24px | 170% |
| 3 | Interactive (.gi) | Buttons, inputs | 16px | 160% |
| 4 | Overlay (.go) | Modals, toasts | 48px | 190% |

## Color System

Service themes use `--p50` through `--p700` + `--gl` (glow RGB).

- **Flux:** Cobalt Blue (#4B6EF5)
- **Pantry:** Warm Amber (#E8850A)

Status colors (service-independent): ok (#10B981), err (#F43F5E), warn (#F59E0B), info (#0EA5E9)

## Typography

- Sans: Inter
- Mono: JetBrains Mono
- Sizes: micro (10-11px), body-sm (13px), body (14px), heading (20-24px), metric (36px)

## Layout

- Sidebar: 250px expanded / 64px collapsed
- Card padding: 22px, Page padding: 24px 28px
- Card gap: 14px, Touch target: 42-44px min-height
- Grids: .r2 (2-col), .r4 (4-col), .ben (2fr 1fr)

## Mesh Background

CSS conic-gradient with `@property` angle animation (20s rotation).
Toggle via `data-mesh="on|off"` on `<html>`.
