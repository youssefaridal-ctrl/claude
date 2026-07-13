import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { I18nManager, StatusBar, View } from 'react-native';
import i18n, { LANGUAGES } from '../src/i18n';
import { hasPinSetup } from '../src/infrastructure/crypto/pin-store';
import { useAuthStore } from '../src/presentation/stores/auth.store';
import { useAppStore } from '../src/store';
import { Colors } from '../src/theme/colors';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function RootNavigator() {
  const { status } = useAuthStore();
  const { isLoading, isInitialized, user } = useAppStore();
  const { language } = user;

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
      .catch(() => setStatus('no_pin'));
  }, []);

  // Route based on auth + onboarding state
  useEffect(() => {
    if (status === 'checking') return;

    if (status === 'no_pin') {
      SplashScreen.hideAsync();
      router.replace('/(auth)/pin-setup');
      return;
    }

    if (status === 'locked') {
      SplashScreen.hideAsync();
      router.replace('/(auth)/pin-unlock');
      return;
    }

    // status === 'unlocked' — wait for app store to finish initializing
    if (!isInitialized || isLoading) return;

    SplashScreen.hideAsync();
    if (!user.onboardingCompleted) {
      router.replace('/onboarding/welcome');
    } else {
      router.replace('/(tabs)/dashboard');
    }
  }, [status, isInitialized, isLoading, user.onboardingCompleted]);

  if (status === 'checking' || (status === 'unlocked' && (isLoading || !isInitialized))) {
    return <View style={{ flex: 1, backgroundColor: Colors.bg.primary }} />;
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
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
