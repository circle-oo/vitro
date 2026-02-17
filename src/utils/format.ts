export function formatDate(date: Date, lang: 'ko' | 'en' = 'ko'): string {
  if (lang === 'ko') {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelative(date: Date, lang: 'ko' | 'en' = 'ko'): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days === 0) return lang === 'ko' ? '오늘' : 'Today';
  if (days === 1) return lang === 'ko' ? '어제' : 'Yesterday';
  return lang === 'ko' ? `${days}일 전` : `${days}d ago`;
}
