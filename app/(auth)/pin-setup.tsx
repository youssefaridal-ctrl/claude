/**
 * First-launch PIN setup.
 *
 * Flow:
 *   1. User enters a 6-digit PIN
 *   2. User confirms the PIN
 *   3. App generates a random salt, derives the key (PBKDF2), computes verifier
 *   4. Salt + verifier saved to SecureStore
 *   5. Database opened with derived key
 *   6. Auth store set to 'unlocked' → root navigator routes to main app
 */

import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { initDatabase } from '../../src/database/client';
import {
  computeVerifier,
  derivePinKey,
  generateSalt,
} from '../../src/infrastructure/crypto/pbkdf2';
import { savePinCredentials } from '../../src/infrastructure/crypto/pin-store';
import { PinPad } from '../../src/presentation/components/auth/PinPad';
import { useAuthStore } from '../../src/presentation/stores/auth.store';
import { useAppStore } from '../../src/store';
import { Colors } from '../../src/theme/colors';

type Step = 'enter' | 'confirm';

const PIN_LENGTH = 6;
const DOT_IDS = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'] as const;

export default function PinSetupScreen() {
  const [step, setStep] = useState<Step>('enter');
  const [pin, setPin] = useState('');
  const [confirming, setConfirming] = useState('');
  const [busy, setBusy] = useState(false);
  const firstPin = useRef('');

  const handleDigit = useCallback(
    (digit: string) => {
      if (busy) return;

      if (step === 'enter') {
        const next = pin + digit;
        setPin(next);
        if (next.length === PIN_LENGTH) {
          firstPin.current = next;
          setPin('');
          setStep('confirm');
        }
      } else {
        const next = confirming + digit;
        setConfirming(next);
        if (next.length === PIN_LENGTH) {
          if (next !== firstPin.current) {
            Alert.alert('PINs do not match', 'Please try again.');
            firstPin.current = '';
            setConfirming('');
            setStep('enter');
          } else {
            void finalize(next);
          }
        }
      }
    },
    [step, pin, confirming, busy]
  );

  const handleDelete = useCallback(() => {
    if (busy) return;
    if (step === 'enter') setPin((p) => p.slice(0, -1));
    else setConfirming((p) => p.slice(0, -1));
  }, [step, busy]);

  const finalize = async (confirmedPin: string) => {
    setBusy(true);
    try {
      const salt = await generateSalt();
      const key = await derivePinKey(confirmedPin, salt);
      const verifier = await computeVerifier(key);
      await savePinCredentials(salt, verifier);
      await initDatabase(key);
      await useAppStore.getState().initializeApp();
      useAuthStore.getState().unlock(key);
    } catch {
      Alert.alert('Setup failed', 'Please try again.');
      firstPin.current = '';
      setConfirming('');
      setStep('enter');
      setBusy(false);
    }
  };

  const current = step === 'enter' ? pin : confirming;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step === 'enter' ? 'Create your PIN' : 'Confirm your PIN'}</Text>
      <Text style={styles.subtitle}>
        {step === 'enter'
          ? 'Choose a 6-digit PIN to protect your data'
          : 'Re-enter your PIN to confirm'}
      </Text>

      <View style={styles.dots}>
        {DOT_IDS.map((id, i) => (
          <View key={id} style={[styles.dot, i < current.length && styles.dotFilled]} />
        ))}
      </View>

      {busy ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : (
        <PinPad onDigit={handleDigit} onDelete={handleDelete} />
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
    marginBottom: 48,
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
  loader: {
    marginTop: 40,
  },
});
