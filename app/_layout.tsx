import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Component, type ReactNode, useEffect, useRef } from 'react';
import { ActivityIndicator, I18nManager, StatusBar, StyleSheet, Text, View } from 'react-native';
import i18n, { LANGUAGES } from '../src/i18n';
import { hasPinSetup } from '../src/infrastructure/crypto/pin-store';
import { useAuthStore } from '../src/presentation/stores/auth.store';
import { useAppStore } from '../src/store';
import { Colors } from '../src/theme/colors';

SplashScreen.preventAutoHideAsync();

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface EBState {
  error: string | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null };

  static getDerivedStateFromError(error: Error): EBState {
    void SplashScreen.hideAsync();
    return { error: error.message ?? String(error) };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Erreur de démarrage</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// ─── Root Navigator ───────────────────────────────────────────────────────────

function RootNavigator() {
  const { status } = useAuthStore();
  const { isLoading, isInitialized, initError, user } = useAppStore();
  const { language } = user;
  const splashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Force-hide splash after 5 s regardless of state so the user never sees a
  // permanent black screen even if startup stalls.
  useEffect(() => {
    splashTimerRef.current = setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 5_000);
    return () => {
      if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    };
  }, []);

  // Sync stored language and RTL direction after the DB is open and user data is loaded
  useEffect(() => {
    if (!isInitialized) return;
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
    const langDef = LANGUAGES.find((l) => l.code === language);
    if (langDef) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(langDef.rtl);
    }
  }, [isInitialized, language]);

  // Determine initial auth state on mount
  useEffect(() => {
    const { setStatus } = useAuthStore.getState();
    hasPinSetup()
      .then((has) => setStatus(has ? 'locked' : 'no_pin'))
      .catch((err) => {
        console.error('[Auth] hasPinSetup failed:', err);
        setStatus('error');
      });
  }, []);

  // Route based on auth + onboarding state
  useEffect(() => {
    if (status === 'checking') return;

    if (status === 'error') {
      void SplashScreen.hideAsync();
      return;
    }

    if (status === 'no_pin') {
      void SplashScreen.hideAsync();
      router.replace('/(auth)/pin-setup');
      return;
    }

    if (status === 'locked') {
      void SplashScreen.hideAsync();
      router.replace('/(auth)/pin-unlock');
      return;
    }

    // status === 'unlocked' — wait for app store to finish initializing
    if (isLoading) return;
    if (initError) {
      void SplashScreen.hideAsync();
      return;
    }
    if (!isInitialized) return;

    void SplashScreen.hideAsync();
    if (!user.onboardingCompleted) {
      router.replace('/onboarding/welcome');
    } else {
      router.replace('/(tabs)/dashboard');
    }
  }, [status, isInitialized, isLoading, initError, user.onboardingCompleted]);

  if (status === 'checking' || (status === 'unlocked' && isLoading)) {
    return (
      <View style={[styles.errorContainer, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (status === 'error' || (status === 'unlocked' && !isLoading && initError)) {
    const message = initError ?? i18n.t('auth.error_message');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>{i18n.t('auth.error_title')}</Text>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg.primary} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    color: Colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <RootNavigator />
    </AppErrorBoundary>
  );
}
