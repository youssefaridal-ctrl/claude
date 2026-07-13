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

// ── Brute-force lockout ───────────────────────────────────────────────────────

const KEY_ATTEMPTS = 'finance_bag_pin_attempts_v1';

interface AttemptState {
  count: number;
  lockedUntil: number | null;
}

export async function loadAttemptState(): Promise<AttemptState> {
  const raw = await SecureStore.getItemAsync(KEY_ATTEMPTS);
  if (!raw) return { count: 0, lockedUntil: null };
  try {
    return JSON.parse(raw) as AttemptState;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

export async function recordFailedAttempt(): Promise<AttemptState> {
  const state = await loadAttemptState();
  const count = state.count + 1;
  let lockedUntil: number | null = null;
  if (count >= 15) lockedUntil = Date.now() + 30 * 60 * 1000;
  else if (count >= 10) lockedUntil = Date.now() + 5 * 60 * 1000;
  else if (count >= 5) lockedUntil = Date.now() + 30 * 1000;
  const next: AttemptState = { count, lockedUntil };
  await SecureStore.setItemAsync(KEY_ATTEMPTS, JSON.stringify(next));
  return next;
}

export async function resetAttemptState(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_ATTEMPTS);
}
