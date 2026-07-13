import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { I18nManager, StatusBar, StyleSheet, Text, View } from 'react-native';
import i18n, { LANGUAGES } from '../src/i18n';
import { hasPinSetup } from '../src/infrastructure/crypto/pin-store';
import { useAuthStore } from '../src/presentation/stores/auth.store';
import { useAppStore } from '../src/store';
import { Colors } from '../src/theme/colors';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { status } = useAuthStore();
  const { isLoading, isInitialized, initError, user } = useAppStore();
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
      .catch(() => setStatus('error'));
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
    return <View style={{ flex: 1, backgroundColor: Colors.bg.primary }} />;
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
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

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

export default function RootLayout() {
  return <RootNavigator />;
}
