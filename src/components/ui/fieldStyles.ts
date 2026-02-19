import type { CSSProperties } from 'react';
import { fontPx, radiusPx, spacePx, touchPx } from '../../utils/scaledCss';

const FIELD_BASE_STYLE: CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font)',
  fontSize: fontPx(13),
  color: 'var(--t1)',
  borderRadius: radiusPx(14),
  outline: 'none',
  transition: 'all .15s',
};

export const INPUT_FIELD_STYLE: CSSProperties = {
  ...FIELD_BASE_STYLE,
  padding: `${spacePx(12)} ${spacePx(16)}`,
  minHeight: touchPx(44),
};

export const SELECT_FIELD_STYLE: CSSProperties = {
  ...INPUT_FIELD_STYLE,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%237C839B' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: `right ${spacePx(14)} center`,
  paddingRight: spacePx(36),
};

export const TEXTAREA_FIELD_STYLE: CSSProperties = {
  ...FIELD_BASE_STYLE,
  padding: `${spacePx(12)} ${spacePx(16)}`,
  minHeight: touchPx(88),
  resize: 'vertical',
  lineHeight: 1.6,
};

export const DATE_FIELD_STYLE: CSSProperties = {
  ...FIELD_BASE_STYLE,
  padding: `${spacePx(12)} ${spacePx(44)} ${spacePx(12)} ${spacePx(16)}`,
  minHeight: touchPx(44),
  fontVariantNumeric: 'tabular-nums',
};
