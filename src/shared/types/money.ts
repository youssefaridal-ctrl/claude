/**
 * Money is a branded integer representing the smallest currency unit (centimes).
 * e.g. 1000 MAD = 100_000 centimes. No floating-point arithmetic is ever
 * performed on Money values; all operations must go through this module.
 */
declare const __moneyBrand: unique symbol;
export type Money = number & { readonly [__moneyBrand]: true };

/** Cast a raw integer centimes value to Money. Throws on non-integer input. */
export function toMoney(centimes: number): Money {
  if (!Number.isInteger(centimes)) {
    throw new RangeError(
      `Money must be an integer (smallest currency unit). Received: ${centimes}`
    );
  }
  return centimes as Money;
}

/** Zero centimes constant. */
export const ZERO: Money = 0 as Money;
