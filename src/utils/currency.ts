import type { Currency } from '../store/types';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  MAD: 'DH',
  EUR: '€',
  USD: '$',
  GBP: '£',
  TND: 'DT',
  DZD: 'DA',
  SAR: 'SR',
  AED: 'AED',
};

const LOCALES: Record<string, string> = {
  fr: 'fr-FR',
  ar: 'ar-MA',
  en: 'en-US',
};

export function formatCurrency(amount: number, currency: Currency = 'MAD', lang = 'fr'): string {
  if (!Number.isFinite(amount)) return `– ${CURRENCY_SYMBOLS[currency]}`;
  const symbol = CURRENCY_SYMBOLS[currency];
  const locale = LOCALES[lang] ?? 'fr-FR';
  const formatted = amount.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${formatted} ${symbol}`;
}

export function formatAmount(amount: number, lang = 'fr'): string {
  if (!Number.isFinite(amount)) return '–';
  const locale = LOCALES[lang] ?? 'fr-FR';
  return amount.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency];
}
