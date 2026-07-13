/**
 * ULID branded string type. 26 chars, Crockford Base32, lexicographically
 * sortable, globally unique. No external dep — just the type declaration.
 */
declare const __ulidBrand: unique symbol;
export type ULID = string & { readonly [__ulidBrand]: true };
