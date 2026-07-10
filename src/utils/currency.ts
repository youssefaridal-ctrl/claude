import { Currency } from '../store/types';

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

export function formatCurrency(amount: number, currency: Currency = 'MAD'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${formatted} ${symbol}`;
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency];
}
