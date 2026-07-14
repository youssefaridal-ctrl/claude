import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Component, type ReactNode, useEffect } from 'react';
import { I18nManager, StatusBar } from 'react-native';
import { CrashScreen } from '../src/components/ui/CrashScreen';
import {
  type CapturedError,
  getCapturedError,
  installGlobalHandlers,
  onErrorCaptured,
  reportError,
} from '../src/diagnostics/error-reporter';
import i18n, { LANGUAGES } from '../src/i18n';
import { useAppStore } from '../src/store';
import { Colors } from '../src/theme/colors';

// Install global handlers before any rendering or navigation.
installGlobalHandlers();
SplashScreen.preventAutoHideAsync();

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface EBState {
  crash: CapturedError | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { crash: getCapturedError() };
  private unsub: (() => void) | null = null;

  componentDidMount() {
    this.unsub = onErrorCaptured((err) => {
      void SplashScreen.hideAsync();
      this.setState({ crash: err });
    });
  }

  componentWillUnmount() {
    this.unsub?.();
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
    if (crash) return <CrashScreen error={crash} />;
    return this.props.children;
  }
}

// ─── Language / RTL sync ──────────────────────────────────────────────────────
// Rendered as a null component so it can use hooks without being a screen.

function LanguageSync() {
  const {
    isInitialized,
    user: { language },
  } = useAppStore();

  useEffect(() => {
    if (!isInitialized) return;
    if (i18n.language !== language) void i18n.changeLanguage(language);
    const langDef = LANGUAGES.find((l) => l.code === language);
    if (langDef) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(langDef.rtl);
    }
  }, [isInitialized, language]);

  return null;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
// The Stack ALWAYS renders so Expo Router's navigation container is never torn
// down and rebuilt. Auth / loading state is handled inside app/index.tsx via
// <Redirect> — the only pattern that works reliably in Expo Router v4.

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg.primary} />
      <LanguageSync />
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
    </AppErrorBoundary>
  );
}
