/**
 * PIN unlock screen — shown after first launch whenever the session is locked.
 *
 * Flow:
 *   1. On mount: attempt biometric auth (FaceID / fingerprint)
 *      — if approved, load salt from SecureStore, derive key (requires stored verifier),
 *        open DB, set 'unlocked'
 *   2. PIN fallback: user enters 6-digit PIN manually
 *      — derive key → compute verifier → compare → open DB → set 'unlocked'
 *   3. Wrong PIN: show error, clear dots, allow retry (no lockout in v1.0)
 */

import * as LocalAuth from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { initDatabase } from '../../src/database/client';
import { computeVerifier, derivePinKey } from '../../src/infrastructure/crypto/pbkdf2';
import { loadSalt, loadVerifier } from '../../src/infrastructure/crypto/pin-store';
import { PinPad } from '../../src/presentation/components/auth/PinPad';
import { useAuthStore } from '../../src/presentation/stores/auth.store';
import { useAppStore } from '../../src/store';
import { Colors } from '../../src/theme/colors';

const PIN_LENGTH = 6;
const DOT_IDS = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'] as const;

export default function PinUnlockScreen() {
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    void checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const compatible = await LocalAuth.hasHardwareAsync();
    const enrolled = await LocalAuth.isEnrolledAsync();
    if (compatible && enrolled) {
      setBiometricAvailable(true);
      void attemptBiometric();
    }
  };

  const attemptBiometric = async () => {
    const result = await LocalAuth.authenticateAsync({
      promptMessage: 'Unlock Finance Bag',
      fallbackLabel: 'Use PIN',
    });
    if (result.success) {
      await openWithStoredKey('__biometric__');
    }
  };

  /**
   * openWithStoredKey:
   *   - For biometric path: we cannot re-derive from PIN, so we need a
   *     different approach. In v1.0 the key is derived from PIN only.
   *     Biometric acts as a gate but still requires the PIN-derived key.
   *
   *   A pragmatic v1.0 approach: after biometric success, prompt for PIN once
   *   to re-derive the key, then keep it in memory for the session.
   *
   *   For simplicity in v1.0 we treat biometric as a UX shortcut that still
   *   requires the underlying PIN key — see attemptBiometric above.
   *   TODO(v1.1): use expo-secure-store biometric-protected item to cache key.
   */
  const openWithStoredKey = async (_source: string) => {
    // Biometric approved but we still need to verify PIN for key derivation.
    // Fall back to PIN entry for now with a helpful message.
    setError('Please enter your PIN to unlock.');
  };

  const verifyPin = useCallback(async (candidate: string) => {
    setBusy(true);
    setError('');
    try {
      const [salt, storedVerifier] = await Promise.all([loadSalt(), loadVerifier()]);
      if (!salt || !storedVerifier) throw new Error('No credentials found');

      const key = await derivePinKey(candidate, salt);
      const verifier = await computeVerifier(key);

      if (verifier !== storedVerifier) {
        setError('Incorrect PIN. Please try again.');
        setPin('');
        setBusy(false);
        return;
      }

      await initDatabase(key);
      await useAppStore.getState().initializeApp();
      useAuthStore.getState().unlock(key);
    } catch {
      setError('Something went wrong. Please try again.');
      setPin('');
      setBusy(false);
    }
  }, []);

  const handleDigit = useCallback(
    (digit: string) => {
      if (busy) return;
      setError('');
      const next = pin + digit;
      setPin(next);
      if (next.length === PIN_LENGTH) {
        void verifyPin(next);
      }
    },
    [pin, busy, verifyPin]
  );

  const handleDelete = useCallback(() => {
    if (!busy) setPin((p) => p.slice(0, -1));
  }, [busy]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Enter your PIN to continue</Text>

      <View style={styles.dots}>
        {DOT_IDS.map((id, i) => (
          <View key={id} style={[styles.dot, i < pin.length && styles.dotFilled]} />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {busy ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : (
        <>
          <PinPad onDigit={handleDigit} onDelete={handleDelete} />
          {biometricAvailable && (
            <TouchableOpacity style={styles.biometricBtn} onPress={attemptBiometric}>
              <Text style={styles.biometricText}>Use Face / Touch ID</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: Colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 48,
  },
  dots: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Colors.text.secondary,
  },
  dotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  error: {
    color: '#F87171',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  loader: {
    marginTop: 40,
  },
  biometricBtn: {
    marginTop: 24,
  },
  biometricText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
