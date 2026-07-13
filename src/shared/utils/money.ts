import { ZERO, toMoney } from '../types/money';
import type { Money } from '../types/money';

export type { Money };

// ── Arithmetic ────────────────────────────────────────────────────────────────

export function add(a: Money, b: Money): Money {
  return toMoney(a + b);
}

export function sub(a: Money, b: Money): Money {
  return toMoney(a - b);
}

export function mul(amount: Money, factor: number): Money {
  return toMoney(Math.round(amount * factor));
}

export function negate(amount: Money): Money {
  return toMoney(-amount);
}

export function abs(amount: Money): Money {
  return toMoney(Math.abs(amount));
}

export function sum(amounts: Money[]): Money {
  return amounts.reduce<Money>((acc, m) => toMoney(acc + m), ZERO);
}

// ── Conversion ────────────────────────────────────────────────────────────────

/**
 * Parse a user-visible display string into centimes.
 * "1 000.50" with decimals=2 → 100_050
 * Strips thousands separators (spaces, commas) before parsing.
 */
export function fromDisplayString(raw: string, decimals = 2): Money {
  const cleaned = raw.replace(/[\s,]/g, '').replace(',', '.');
  const float = Number.parseFloat(cleaned);
  if (Number.isNaN(float)) throw new RangeError(`Cannot parse money: "${raw}"`);
  return toMoney(Math.round(float * 10 ** decimals));
}

/** Convert centimes to a display number (e.g. 100_050 → 1000.50). */
export function toDisplayNumber(amount: Money, decimals = 2): number {
  return amount / 10 ** decimals;
}

export { toMoney, ZERO };
