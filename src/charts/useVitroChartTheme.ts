import { useState, useEffect } from 'react';

export interface VitroChartTheme {
  primary: string;
  primaryLight: string;
  text: string;
  textFaint: string;
  grid: string;
  bg: string;
  glow: string;
  mode: 'light' | 'dark';
}

const FALLBACK_THEME: VitroChartTheme = {
  primary: '#4B6EF5',
  primaryLight: '#BFCFFD',
  text: '#7C839B',
  textFaint: '#A8AEBF',
  grid: 'rgba(0,0,0,.05)',
  bg: '#E8ECF2',
  glow: '75, 110, 245',
  mode: 'light',
};

function getTheme(): VitroChartTheme {
  const cs = getComputedStyle(document.documentElement);
  const mode = (document.documentElement.dataset.mode ?? 'light') as 'light' | 'dark';
  return {
    primary: cs.getPropertyValue('--p500').trim(),
    primaryLight: cs.getPropertyValue('--p200').trim(),
    text: cs.getPropertyValue('--t3').trim(),
    textFaint: cs.getPropertyValue('--t4').trim(),
    grid: cs.getPropertyValue('--div').trim(),
    bg: cs.getPropertyValue('--bg').trim(),
    glow: cs.getPropertyValue('--gl').trim(),
    mode,
  };
}

function isSameTheme(a: VitroChartTheme, b: VitroChartTheme): boolean {
  return (
    a.primary === b.primary &&
    a.primaryLight === b.primaryLight &&
    a.text === b.text &&
    a.textFaint === b.textFaint &&
    a.grid === b.grid &&
    a.bg === b.bg &&
    a.glow === b.glow &&
    a.mode === b.mode
  );
}

export function useVitroChartTheme(): VitroChartTheme {
  const [theme, setTheme] = useState<VitroChartTheme>(() => {
    if (typeof window === 'undefined') return FALLBACK_THEME;
    return getTheme();
  });

  useEffect(() => {
    const updateTheme = () => {
      const next = getTheme();
      setTheme((prev) => (isSameTheme(prev, next) ? prev : next));
    };

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'data-svc'] });
    updateTheme();
    return () => observer.disconnect();
  }, []);

  return theme;
}

export function getTooltipStyle(mode: 'light' | 'dark'): React.CSSProperties {
  return mode === 'light'
    ? {
      background: 'rgba(255, 255, 255, 0.92)',
      color: '#111827',
      border: '1px solid rgba(148, 163, 184, 0.28)',
      borderRadius: 10,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.4,
      padding: '6px 10px',
      boxShadow: '0 10px 26px rgba(15, 23, 42, 0.14)',
    }
    : {
      background: 'rgba(15, 23, 42, 0.9)',
      color: '#F8FAFC',
      border: '1px solid rgba(148, 163, 184, 0.22)',
      borderRadius: 10,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.4,
      padding: '6px 10px',
      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.3)',
    };
}
