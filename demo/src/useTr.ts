import { useCallback } from 'react';
import { useLocale } from './i18n';

export type DemoLocale = 'ko' | 'en' | 'fr' | 'ja';

export function translateByLocale(
  locale: DemoLocale,
  ko: string,
  en: string,
  fr?: string,
  ja?: string,
): string {
  if (locale === 'ko') return ko;
  if (locale === 'fr') return fr ?? en;
  if (locale === 'ja') return ja ?? en;
  return en;
}

export function useTr() {
  const { locale } = useLocale();

  return useCallback(
    (ko: string, en: string, fr?: string, ja?: string) =>
      translateByLocale(locale as DemoLocale, ko, en, fr, ja),
    [locale],
  );
}
