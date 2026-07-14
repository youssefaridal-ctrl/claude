export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function formatDate(dateStr: string, lang = 'fr'): string {
  const date = new Date(`${dateStr}T12:00:00`);
  const locales: Record<string, string> = { fr: 'fr-FR', ar: 'ar-MA', en: 'en-US' };
  return date.toLocaleDateString(locales[lang] || 'fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string, lang = 'fr'): string {
  const date = new Date(`${dateStr}T12:00:00`);
  const locales: Record<string, string> = { fr: 'fr-FR', ar: 'ar-MA', en: 'en-US' };
  return date.toLocaleDateString(locales[lang] || 'fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

export function monthsUntilDate(targetDateStr: string): number {
  const now = new Date();
  const target = new Date(`${targetDateStr}T12:00:00`);
  return (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
}

export function getGreeting(lang: string): string {
  const hour = new Date().getHours();
  const keys: Record<string, [string, string, string]> = {
    fr: ['Bonjour', 'Bon après-midi', 'Bonsoir'],
    ar: ['صباح الخير', 'مساء الخير', 'مساء النور'],
    en: ['Good morning', 'Good afternoon', 'Good evening'],
  };
  const greetings = keys[lang] || keys.fr;
  if (hour < 12) return greetings[0];
  if (hour < 18) return greetings[1];
  return greetings[2];
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const targetMonth = d.getMonth() + months;
  d.setDate(1);
  d.setMonth(targetMonth);
  return d;
}

export function getMonthName(monthStr: string, lang = 'fr'): string {
  const [y, m] = monthStr.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  const locales: Record<string, string> = { fr: 'fr-FR', ar: 'ar-MA', en: 'en-US' };
  return date.toLocaleDateString(locales[lang] || 'fr-FR', { month: 'long', year: 'numeric' });
}
