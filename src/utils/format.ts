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
