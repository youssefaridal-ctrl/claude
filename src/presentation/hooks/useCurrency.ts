import { useAppStore } from '../../store';
import { formatCurrency, getCurrencySymbol } from '../../utils/currency';

/**
 * Returns currency formatting utilities scoped to the user's stored currency.
 * Components use `format(amount)` for display and `symbol` for suffix labels.
 */
export function useCurrency() {
  const currency = useAppStore((s) => s.user.currency);
  return {
    format: (amount: number) => formatCurrency(amount, currency),
    symbol: getCurrencySymbol(currency),
    code: currency,
  };
}
