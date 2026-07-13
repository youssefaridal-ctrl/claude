import { ulid } from 'ulid';
import type { ULID } from '../types/ulid';

export type { ULID };

/** Generate a new ULID. Use this everywhere a primary key is created. */
export function generateId(): ULID {
  return ulid() as ULID;
}

/** Regex for a valid 26-char Crockford Base32 ULID. */
const ULID_RE = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/;

export function isValidULID(id: string): id is ULID {
  return ULID_RE.test(id);
}

/** Cast a trusted string to ULID without runtime check (for seeded constants). */
export function asULID(id: string): ULID {
  return id as ULID;
}
