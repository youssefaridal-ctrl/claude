/**
 * PIN verifier persistence via expo-secure-store.
 *
 * Stores two values:
 *   KEY_SALT    — random 32-byte hex salt (input to PBKDF2)
 *   KEY_VERIFIER — SHA-256(derivedKey + suffix) used to confirm correct PIN
 *
 * The derived key is NEVER stored. Salt + verifier are wiped on PIN reset.
 */

import * as SecureStore from 'expo-secure-store';

const KEY_SALT = 'finance_bag_pin_salt_v1';
const KEY_VERIFIER = 'finance_bag_pin_verifier_v1';

// ── Read ──────────────────────────────────────────────────────────────────────

export async function loadSalt(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY_SALT);
}

export async function loadVerifier(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY_VERIFIER);
}

/** Returns true when a PIN has been set up (salt + verifier both present). */
export async function hasPinSetup(): Promise<boolean> {
  const [salt, verifier] = await Promise.all([loadSalt(), loadVerifier()]);
  return salt !== null && verifier !== null;
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function savePinCredentials(saltHex: string, verifierHex: string): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEY_SALT, saltHex),
    SecureStore.setItemAsync(KEY_VERIFIER, verifierHex),
  ]);
}

// ── Delete ────────────────────────────────────────────────────────────────────

/** Wipe PIN credentials — call before setting a new PIN or on factory reset. */
export async function clearPinCredentials(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEY_SALT),
    SecureStore.deleteItemAsync(KEY_VERIFIER),
  ]);
}
