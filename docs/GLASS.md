# Glass Material Reference

## Light Mode Values

```
Level 1 Surface:
  background: rgba(255,255,255, 0.35)
  border: 1px solid rgba(255,255,255, 0.38)

Level 2 Card:
  background: rgba(255,255,255, 0.38)
  border: 1px solid rgba(255,255,255, 0.45)
  box-shadow: 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.50)
  specular: linear-gradient(180deg, rgba(255,255,255,0.18) → 0.05 → transparent)

Level 3 Interactive:
  background: rgba(255,255,255, 0.40)
  border: 1px solid rgba(255,255,255, 0.42)

Level 4 Overlay:
  background: rgba(255,255,255, 0.48)
  border: 1px solid rgba(255,255,255, 0.50)
  box-shadow: 0 20px 50px rgba(0,0,0,0.08)
```

## Dark Mode Values

```
Level 1: rgba(22,22,28, 0.50) / border rgba(255,255,255, 0.06)
Level 2: rgba(28,28,35, 0.45) / border rgba(255,255,255, 0.07)
Level 3: rgba(48,48,55, 0.45) / border rgba(255,255,255, 0.06)
Level 4: rgba(22,22,28, 0.68) / border rgba(255,255,255, 0.07)
```

## Interaction States

- **Card hover:** translateY(-2px), bg opacity +0.10, border opacity +0.25, shadow grows
- **Interactive hover:** bg opacity +0.20
- **Focus ring:** box-shadow: 0 0 0 3px rgba(var(--glow), 0.22)
- **Specular:** Card ::before pseudo-element, top-to-bottom gradient

## Rules

- Max 3 glass layers overlapping in one viewport
- Use `nh` class on `.gc` to disable hover lift (for data-heavy cards)
- Don't apply backdrop-filter to children of glass elements
