/**
 * PIN → encryption key derivation.
 *
 * Uses a local Expo native module (expo-pbkdf2) backed by:
 *   Android: javax.crypto.Mac("HmacSHA256")
 *   iOS:     CommonCrypto CCKeyDerivationPBKDF
 *
 * The verifier SHA-256 uses expo-crypto's native digest, which is available on
 * all platforms without any polyfill.
 *
 * 600,000 PBKDF2-SHA256 iterations per SPEC-SEC-001 §6.2.
 * Key is returned as a 64-char hex string (256 bits).
 * It is NEVER stored — derived fresh on each unlock.
 */

import * as ExpoC from 'expo-crypto';
import { pbkdf2HmacSha256 } from 'expo-pbkdf2';

export const PBKDF2_ITERATIONS = 600_000;
const SALT_BYTES = 32;
const KEY_BITS = 256;
const KEY_BYTES = KEY_BITS / 8;
const VERIFIER_SUFFIX = ':finance_bag_v1_verify';

// ── Hex utilities ─────────────────────────────────────────────────────────────

function uint8ToHex(buf: Uint8Array): string {
  let hex = '';
  for (const b of buf) hex += b.toString(16).padStart(2, '0');
  return hex;
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
 *
 * PIN is UTF-8 encoded then hex-encoded before passing to the native layer
 * so the native module only handles hex strings (no encoding ambiguity).
 */
export async function derivePinKey(pin: string, saltHex: string): Promise<string> {
  const pinBytes = new TextEncoder().encode(pin);
  const pinHex = uint8ToHex(pinBytes);
  return pbkdf2HmacSha256(pinHex, saltHex, PBKDF2_ITERATIONS, KEY_BYTES);
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
  const input = derivedKeyHex + VERIFIER_SUFFIX;
  return ExpoC.digestStringAsync(ExpoC.CryptoDigestAlgorithm.SHA256, input, {
    encoding: ExpoC.CryptoEncoding.HEX,
  });
}
