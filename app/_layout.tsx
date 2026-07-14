import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Component, type ReactNode, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, I18nManager, StatusBar, StyleSheet, View } from 'react-native';
import { CrashScreen } from '../src/components/ui/CrashScreen';
import {
  type CapturedError,
  getCapturedError,
  installGlobalHandlers,
  onErrorCaptured,
  reportError,
} from '../src/diagnostics/error-reporter';
import i18n, { LANGUAGES } from '../src/i18n';
import { hasPinSetup } from '../src/infrastructure/crypto/pin-store';
import { useAuthStore } from '../src/presentation/stores/auth.store';
import { useAppStore } from '../src/store';
import { Colors } from '../src/theme/colors';

// Install global JS exception + promise rejection handlers as early as possible.
installGlobalHandlers();

SplashScreen.preventAutoHideAsync();

// ─── Enhanced Error Boundary ──────────────────────────────────────────────────

interface EBState {
  crash: CapturedError | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { crash: getCapturedError() };

  private unsubscribe: (() => void) | null = null;

  componentDidMount() {
    this.unsubscribe = onErrorCaptured((err) => {
      void SplashScreen.hideAsync();
      this.setState({ crash: err });
    });
  }

  componentWillUnmount() {
    this.unsubscribe?.();
  }

  static getDerivedStateFromError(error: Error): EBState {
    void SplashScreen.hideAsync();
    reportError('ReactRenderError', error);
    return { crash: getCapturedError() };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[DiagnosticMode][componentDidCatch]', error, info.componentStack);
  }

  render() {
    const { crash } = this.state;
    if (crash) {
      return <CrashScreen error={crash} />;
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
  const [globalCrash, setGlobalCrash] = useState<CapturedError | null>(getCapturedError());

  // Subscribe to globally captured errors so the navigator can show CrashScreen
  // even for errors that happen outside the React tree (e.g. DB init, SecureStore).
  useEffect(() => {
    return onErrorCaptured((err) => {
      void SplashScreen.hideAsync();
      setGlobalCrash(err);
    });
  }, []);

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
        reportError('SecureStoreError', err);
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
      reportError('InitializationError', new Error(initError));
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

  // If a global (non-React-tree) error was captured, show the crash screen here too.
  if (globalCrash) {
    return <CrashScreen error={globalCrash} />;
  }

  if (status === 'checking' || (status === 'unlocked' && isLoading)) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (status === 'error' || (status === 'unlocked' && !isLoading && initError)) {
    const err = initError ? new Error(initError) : new Error('Unknown auth error');
    reportError('AuthError', err);
    const crash = getCapturedError();
    if (crash) return <CrashScreen error={crash} />;
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
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
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
