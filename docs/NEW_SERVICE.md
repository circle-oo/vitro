# Adding a New Service Theme

## 1. Create a theme CSS file

Create `src/styles/themes/{service}.css`:

```css
[data-svc=myservice] {
  --p50:  #...;
  --p100: #...;
  --p200: #...;
  --p300: #...;
  --p400: #...;
  --p500: #...;   /* Primary color */
  --p600: #...;
  --p700: #...;
  --gl: R, G, B;  /* Primary color as RGB triplet for rgba() */
}
```

## 2. Add per-service background overrides (optional)

In `base.css`, add overrides if you want a tinted background:

```css
[data-mode=light][data-svc=myservice] { --bg: #E8ECF2; }
[data-mode=dark][data-svc=myservice]  { --bg: #0A0A0C; }
```

## 3. Set data attributes in your layout

```html
<html data-svc="myservice" data-mode="light" data-mesh="on">
```

## 4. Import the theme

```tsx
import '@circle-oo/vitro/styles/themes/myservice.css';
```

## That's it

All Vitro components automatically pick up the new colors via CSS variables.
No component code changes needed.
