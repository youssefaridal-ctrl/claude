/**
 * PIN → encryption key derivation.
 *
 * Uses @noble/hashes — a pure-JS, zero-dependency PBKDF2-HMAC-SHA256
 * implementation that works in Hermes (React Native) without any native module.
 *
 * pbkdf2Async yields to the event loop every 10 iterations so the UI stays
 * responsive during the ~1–3 s derivation on mobile hardware.
 *
 * 600,000 PBKDF2-SHA256 iterations per SPEC-SEC-001 §6.2.
 * Key is returned as a 64-char hex string (256 bits).
 * It is NEVER stored — derived fresh on each unlock.
 */

import { pbkdf2Async } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';
import * as ExpoC from 'expo-crypto';

export const PBKDF2_ITERATIONS = 600_000;
const SALT_BYTES = 32;
const KEY_BYTES = 32; // 256 bits
const VERIFIER_SUFFIX = ':finance_bag_v1_verify';

// ── Hex utilities ─────────────────────────────────────────────────────────────

function uint8ToHex(buf: Uint8Array): string {
  let hex = '';
  for (const b of buf) hex += b.toString(16).padStart(2, '0');
  return hex;
}

function hexToUint8(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// ── Salt ──────────────────────────────────────────────────────────────────────

/** Generate a cryptographically random 32-byte salt (hex-encoded). */
export async function generateSalt(): Promise<string> {
  const bytes = await ExpoC.getRandomBytesAsync(SALT_BYTES);
  return uint8ToHex(bytes);
}

// ── Key derivation ────────────────────────────────────────────────────────────

/**
 * Derive a 256-bit encryption key from a PIN and hex salt using PBKDF2-HMAC-SHA256.
 * Returns the key as a 64-char hex string.
 *
 * pbkdf2Async is used so the JS thread stays responsive while computing
 * 600,000 iterations (expected ~1–3 s on mobile).
 */
export async function derivePinKey(pin: string, saltHex: string): Promise<string> {
  const pinBytes = new TextEncoder().encode(pin);
  const saltBytes = hexToUint8(saltHex);
  const keyBytes = await pbkdf2Async(sha256, pinBytes, saltBytes, {
    c: PBKDF2_ITERATIONS,
    dkLen: KEY_BYTES,
  });
  return uint8ToHex(keyBytes);
}

// ── Verifier ──────────────────────────────────────────────────────────────────

/**
 * Compute a one-way verifier from the derived key.
 * Stored in SecureStore; used to confirm correct PIN without exposing the DB key.
 *
 * verifier = SHA-256(derivedKey + suffix)
 */
export async function computeVerifier(derivedKeyHex: string): Promise<string> {
  const input = derivedKeyHex + VERIFIER_SUFFIX;
  return ExpoC.digestStringAsync(ExpoC.CryptoDigestAlgorithm.SHA256, input, {
    encoding: ExpoC.CryptoEncoding.HEX,
  });
}
