/**
 * PIN unlock screen — shown after first launch whenever the session is locked.
 *
 * Flow:
 *   1. On mount: attempt biometric auth (FaceID / fingerprint)
 *      — if approved, show PIN entry (v1.0: biometric gates UI but key is PIN-derived)
 *   2. PIN entry: user enters 6-digit PIN
 *      — unlockWithPin use case: derive key → verify → open DB → 'unlocked'
 *   3. Wrong PIN: show error, clear dots, allow retry (no lockout in v1.0)
 */

import * as LocalAuth from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { unlockWithPin } from '../../src/application/auth/unlock-with-pin.usecase';
import { ErrorCode } from '../../src/domain/shared/errors/domain-error';
import { PinPad } from '../../src/presentation/components/auth/PinPad';
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
      // v1.0: biometric is a UX gate only — the DB key is PIN-derived and never stored.
      // Prompt for PIN after biometric approval so the key can be re-derived.
      // TODO(v1.1): cache key in a biometric-protected SecureStore item.
      setError('Biometric verified. Please enter your PIN to continue.');
    }
  };

  const verifyPin = useCallback(async (candidate: string) => {
    setBusy(true);
    setError('');
    const result = await unlockWithPin(candidate);
    if (!result.ok) {
      const isWrongPin = result.error.code === ErrorCode.UNAUTHORIZED;
      setError(isWrongPin ? 'Incorrect PIN. Please try again.' : result.error.message);
      setPin('');
      setBusy(false);
    }
    // On success: auth store transitions to 'unlocked' → root navigator routes away
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
