const TYPE_SCALE_EXPR = 'var(--vitro-type-scale, 1) * var(--vitro-density-scale, 1) * var(--vitro-contrast-scale, 1)';
const SPACE_SCALE_EXPR = 'var(--vitro-space-scale, 1)';
const RADIUS_SCALE_EXPR = 'var(--vitro-radius-scale, 1)';
const TOUCH_SCALE_EXPR = 'var(--vitro-touch-scale, 1)';

function scalePx(value: number, scaleExpr: string): string {
  return `calc(${value}px * (${scaleExpr}))`;
}

export function fontPx(value: number): string {
  return scalePx(value, TYPE_SCALE_EXPR);
}

export function spacePx(value: number): string {
  return scalePx(value, SPACE_SCALE_EXPR);
}

export function radiusPx(value: number): string {
  return scalePx(value, RADIUS_SCALE_EXPR);
}

export function touchPx(value: number): string {
  return scalePx(value, TOUCH_SCALE_EXPR);
}

