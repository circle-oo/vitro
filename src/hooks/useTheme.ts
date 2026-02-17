import { useEffect } from 'react';
import { usePersistentState } from './usePersistentState';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'vitro-mode';

const serializeMode = (value: ThemeMode) => value;

function readMode(raw: string | null): ThemeMode {
  if (raw === 'light' || raw === 'dark') return raw;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [mode, setMode] = usePersistentState<ThemeMode>(
    THEME_KEY,
    () => 'light',
    serializeMode,
    readMode,
  );

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return {
    mode,
    setMode,
    toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
  };
}
