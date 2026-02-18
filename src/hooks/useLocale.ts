import { useEffect } from 'react';
import { usePersistentState } from './usePersistentState';
import type { Locale } from '../utils/locale';

const LOCALE_KEY = 'vitro-locale';

const serializeLocale = (value: Locale) => value;

function readLocale(raw: string | null, fallback: Locale): Locale {
  if (raw === 'ko' || raw === 'en' || raw === 'fr' || raw === 'ja') return raw;
  return fallback;
}

export function useLocale(defaultLocale: Locale = 'ko') {
  const [locale, setLocale] = usePersistentState<Locale>(
    LOCALE_KEY,
    () => defaultLocale,
    serializeLocale,
    (raw) => readLocale(raw, defaultLocale),
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return { locale, setLocale } as const;
}
