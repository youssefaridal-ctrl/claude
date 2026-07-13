/**
 * PIN unlock screen — shown after first launch whenever the session is locked.
 *
 * Flow:
 *   1. On mount: check brute-force lockout state; attempt biometric auth if available
 *   2. PIN entry: user enters 6-digit PIN
 *      — unlockWithPin use case: derive key → verify → open DB → 'unlocked'
 *   3. Wrong PIN: record failed attempt; enforce progressive lockout at 5/10/15 attempts
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { unlockWithPin } from '../../src/application/auth/unlock-with-pin.usecase';
import { ErrorCode } from '../../src/domain/shared/errors/domain-error';
import {
  loadAttemptState,
  recordFailedAttempt,
  resetAttemptState,
} from '../../src/infrastructure/crypto/pin-store';
import { PinPad } from '../../src/presentation/components/auth/PinPad';
import { Colors } from '../../src/theme/colors';

const PIN_LENGTH = 6;
const DOT_IDS = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'] as const;

export default function PinUnlockScreen() {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void init();
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = useCallback((until: number) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setLockedUntil(until);
    const update = () => {
      const remaining = Math.ceil((until - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setRemainingSeconds(0);
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      } else {
        setRemainingSeconds(remaining);
      }
    };
    update();
    countdownRef.current = setInterval(update, 1000);
  }, []);

  const init = async () => {
    const state = await loadAttemptState();
    if (state.lockedUntil && state.lockedUntil > Date.now()) {
      startCountdown(state.lockedUntil);
    }
  };

  const verifyPin = useCallback(
    async (candidate: string) => {
      const state = await loadAttemptState();
      if (state.lockedUntil && state.lockedUntil > Date.now()) {
        startCountdown(state.lockedUntil);
        setPin('');
        return;
      }

      setBusy(true);
      setError('');
      setInfo('');
      const result = await unlockWithPin(candidate);
      if (!result.ok) {
        const isWrongPin = result.error.code === ErrorCode.UNAUTHORIZED;
        if (isWrongPin) {
          const newState = await recordFailedAttempt();
          if (newState.lockedUntil && newState.lockedUntil > Date.now()) {
            startCountdown(newState.lockedUntil);
          } else {
            setError(t('auth.wrong_pin'));
          }
        } else {
          setError(result.error.message);
        }
        setPin('');
        setBusy(false);
      } else {
        await resetAttemptState();
        // On success: auth store transitions to 'unlocked' → root navigator routes away
      }
    },
    [t, startCountdown]
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (busy || lockedUntil) return;
      setError('');
      const next = pin + digit;
      setPin(next);
      if (next.length === PIN_LENGTH) {
        void verifyPin(next);
      }
    },
    [pin, busy, lockedUntil, verifyPin]
  );

  const handleDelete = useCallback(() => {
    if (!busy && !lockedUntil) setPin((p) => p.slice(0, -1));
  }, [busy, lockedUntil]);

  if (lockedUntil) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('auth.locked_title')}</Text>
        <Text style={styles.subtitle}>
          {t('auth.locked_message', { seconds: remainingSeconds })}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.unlock_title')}</Text>
      <Text style={styles.subtitle}>{t('auth.unlock_subtitle')}</Text>

      <View style={styles.dots}>
        {DOT_IDS.map((id, i) => (
          <View key={id} style={[styles.dot, i < pin.length && styles.dotFilled]} />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

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
});
