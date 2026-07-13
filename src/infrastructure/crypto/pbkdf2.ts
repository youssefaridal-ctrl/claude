/**
 * PIN → encryption key derivation.
 *
 * Uses the Web Crypto API (crypto.subtle) available in Hermes 0.13 / RN 0.76.
 * 600,000 PBKDF2-SHA256 iterations per SPEC-SEC-001 §6.2.
 *
 * Key is returned as a 64-char hex string (256 bits).
 * It is NEVER stored — derived fresh on each unlock.
 */

import * as ExpoC from 'expo-crypto';

export const PBKDF2_ITERATIONS = 600_000;
const SALT_BYTES = 32;
const KEY_BITS = 256;
const VERIFIER_SUFFIX = ':finance_bag_v1_verify';

// ── Hex utilities ─────────────────────────────────────────────────────────────

function uint8ToHex(buf: Uint8Array): string {
  let hex = '';
  for (const b of buf) hex += b.toString(16).padStart(2, '0');
  return hex;
}

function hexToUint8(hex: string): Uint8Array<ArrayBuffer> {
  const len = hex.length / 2;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return arr as Uint8Array<ArrayBuffer>;
}

// ── Salt ──────────────────────────────────────────────────────────────────────

/** Generate a cryptographically random 32-byte salt (hex-encoded). */
export async function generateSalt(): Promise<string> {
  const bytes = await ExpoC.getRandomBytesAsync(SALT_BYTES);
  return uint8ToHex(bytes);
}

// ── Key derivation ────────────────────────────────────────────────────────────

/**
 * Derive a 256-bit encryption key from a PIN and hex salt.
 * Returns the key as a 64-char hex string.
 */
export async function derivePinKey(pin: string, saltHex: string): Promise<string> {
  const pinBytes = new TextEncoder().encode(pin);
  const salt = hexToUint8(saltHex);

  const keyMaterial = await crypto.subtle.importKey('raw', pinBytes, 'PBKDF2', false, [
    'deriveBits',
  ]);

  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    KEY_BITS
  );

  return uint8ToHex(new Uint8Array(derivedBits));
}

// ── Verifier ──────────────────────────────────────────────────────────────────

/**
 * Compute a one-way verifier from the derived key.
 * Stored in SecureStore; used to confirm correct PIN without exposing the DB key.
 *
 * verifier = SHA-256(derivedKey + suffix)
 * Even if SecureStore is read, the attacker cannot use this value as the DB key.
 */
export async function computeVerifier(derivedKeyHex: string): Promise<string> {
  const input = new TextEncoder().encode(derivedKeyHex + VERIFIER_SUFFIX);
  const hashBuffer = await crypto.subtle.digest('SHA-256', input);
  return uint8ToHex(new Uint8Array(hashBuffer));
}
