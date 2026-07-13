/**
 * First-launch PIN setup.
 *
 * Flow:
 *   1. User enters a 6-digit PIN
 *   2. User confirms the PIN
 *   3. setupPin use case: generates salt, derives key (PBKDF2), computes verifier,
 *      saves credentials, opens DB, transitions auth store → 'unlocked'
 *   4. Root navigator detects 'unlocked' and routes to onboarding / dashboard
 */

import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { setupPin } from '../../src/application/auth/setup-pin.usecase';
import { PinPad } from '../../src/presentation/components/auth/PinPad';
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
    const result = await setupPin(confirmedPin);
    if (!result.ok) {
      Alert.alert('Setup failed', result.error.message);
      firstPin.current = '';
      setConfirming('');
      setStep('enter');
      setBusy(false);
    }
    // On success: auth store transitions to 'unlocked' → root navigator routes away
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
