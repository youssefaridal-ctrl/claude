import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { reportError } from '../src/diagnostics/error-reporter';
import { hasPinSetup } from '../src/infrastructure/crypto/pin-store';
import { useAuthStore } from '../src/presentation/stores/auth.store';
import { useAppStore } from '../src/store';
import { Colors } from '../src/theme/colors';

export default function Gateway() {
  const { status } = useAuthStore();
  const { isInitialized, user } = useAppStore();
  const splashHiddenRef = useRef(false);

  const hideSplash = useCallback(() => {
    if (!splashHiddenRef.current) {
      splashHiddenRef.current = true;
      void SplashScreen.hideAsync();
    }
  }, []);

  // Safety valve — never leave the splash screen up indefinitely
  useEffect(() => {
    const timer = setTimeout(hideSplash, 5_000);
    return () => clearTimeout(timer);
  }, [hideSplash]);

  // Check whether a PIN exists; resolves in <100 ms on device
  useEffect(() => {
    const { setStatus } = useAuthStore.getState();
    hasPinSetup()
      .then((has) => {
        hideSplash();
        setStatus(has ? 'locked' : 'no_pin');
      })
      .catch((err: unknown) => {
        reportError('SecureStoreError', err);
        setStatus('error');
      });
  }, [hideSplash]);

  // Still reading SecureStore — splash screen is still covering
  if (status === 'checking') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // SecureStore read failed — AppErrorBoundary will take over and show CrashScreen
  if (status === 'error') {
    return <View style={styles.center} />;
  }

  if (status === 'no_pin') return <Redirect href="/(auth)/pin-setup" />;
  if (status === 'locked') return <Redirect href="/(auth)/pin-unlock" />;

  // status === 'unlocked' — DB is open but app data may still be loading
  if (!isInitialized) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user.onboardingCompleted) return <Redirect href="/onboarding/welcome" />;
  return <Redirect href="/(tabs)/dashboard" />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
