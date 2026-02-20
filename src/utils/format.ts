export function formatDate(date: Date, lang: 'ko' | 'en' | 'fr' | 'ja' = 'ko'): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  if (lang === 'ko') return `${y}.${m}.${d}`;
  if (lang === 'ja') return `${y}年${date.getMonth() + 1}月${date.getDate()}日`;
  if (lang === 'fr') return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelative(date: Date, lang: 'ko' | 'en' | 'fr' | 'ja' = 'ko'): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (lang === 'ko') {
    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    return `${days}일 전`;
  }
  if (lang === 'ja') {
    if (days === 0) return '今日';
    if (days === 1) return '昨日';
    return `${days}日前`;
  }
  if (lang === 'fr') {
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    return `Il y a ${days}j`;
  }
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

function toLocaleTag(lang: 'ko' | 'en' | 'fr' | 'ja'): string {
  if (lang === 'ko') return 'ko-KR';
  if (lang === 'fr') return 'fr-FR';
  if (lang === 'ja') return 'ja-JP';
  return 'en-US';
}

const intlCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = locale + JSON.stringify(options);
  if (!intlCache.has(key)) {
    try {
      intlCache.set(key, new Intl.DateTimeFormat(locale, options));
    } catch {
      intlCache.set(key, new Intl.DateTimeFormat(locale));
    }
  }
  return intlCache.get(key)!;
}

function parseYmd(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  return new Date(year, month - 1, day);
}

function parseClock(value: string): { h: number; m: number; s?: number } | null {
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = match[3] == null ? undefined : Number(match[3]);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  if (s != null && !Number.isFinite(s)) return null;
  return { h, m, s };
}

export function formatTime(value: string, lang: 'ko' | 'en' | 'fr' | 'ja' = 'ko'): string {
  const parsed = parseClock(value);
  if (!parsed) return value;
  const d = new Date(2000, 0, 1, parsed.h, parsed.m, parsed.s ?? 0);
  const options: Intl.DateTimeFormatOptions =
    parsed.s == null
      ? { hour: 'numeric', minute: '2-digit' }
      : { hour: 'numeric', minute: '2-digit', second: '2-digit' };
  return getFormatter(toLocaleTag(lang), options).format(d);
}

export function formatDateTime(value: string, lang: 'ko' | 'en' | 'fr' | 'ja' = 'ko'): string {
  const trimmed = value.trim();
  const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)$/.exec(trimmed);
  if (!match) return value;
  const date = parseYmd(match[1]);
  const time = parseClock(match[2]);
  if (!date || !time) return value;
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.h, time.m, time.s ?? 0);
  const options: Intl.DateTimeFormatOptions =
    time.s == null
      ? { dateStyle: 'medium', timeStyle: 'short' }
      : { dateStyle: 'medium', timeStyle: 'medium' };
  return getFormatter(toLocaleTag(lang), options).format(d);
}

export function formatIsoDateTime(value: string, lang: 'ko' | 'en' | 'fr' | 'ja' = 'ko'): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return getFormatter(toLocaleTag(lang), { dateStyle: 'medium', timeStyle: 'medium' }).format(parsed);
}

export function formatDateText(value: string, lang: 'ko' | 'en' | 'fr' | 'ja' = 'ko'): string {
  if (value === '-') return value;
  const parsed = parseYmd(value);
  if (!parsed) return value;
  return formatDate(parsed, lang);
}
