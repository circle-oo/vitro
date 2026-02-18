export type Locale = 'ko' | 'en' | 'fr' | 'ja';

export interface LocalizedText {
  ko: string;
  en: string;
  [key: string]: string | undefined;
}

export function resolveLocalized(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text.en;
}
