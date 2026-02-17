import { useState, useEffect } from 'react';

type Mode = 'light' | 'dark';

export function useTheme() {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('vitro-mode') as Mode | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    localStorage.setItem('vitro-mode', mode);
  }, [mode]);

  return {
    mode,
    setMode,
    toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
  };
}
