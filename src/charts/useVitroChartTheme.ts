import { useState, useEffect } from 'react';

interface VitroChartTheme {
  primary: string;
  primaryLight: string;
  text: string;
  textFaint: string;
  grid: string;
  bg: string;
  glow: string;
  mode: 'light' | 'dark';
}

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

export function useVitroChartTheme(): VitroChartTheme {
  const [theme, setTheme] = useState<VitroChartTheme>(() => {
    if (typeof window === 'undefined') {
      return { primary: '#4B6EF5', primaryLight: '#BFCFFD', text: '#7C839B', textFaint: '#A8AEBF', grid: 'rgba(0,0,0,.05)', bg: '#E8ECF2', glow: '75, 110, 245', mode: 'light' };
    }
    return getTheme();
  });

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'data-svc'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export function getTooltipStyle(mode: 'light' | 'dark'): React.CSSProperties {
  return mode === 'light'
    ? { background: 'rgba(26,31,54,0.88)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, padding: '6px 14px' }
    : { background: 'rgba(240,241,244,0.88)', color: '#1A1F36', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, padding: '6px 14px' };
}
