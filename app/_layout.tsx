import { useEffect } from 'react';
import { View, StatusBar, I18nManager } from 'react-native';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import '../src/i18n';
import { initDatabase } from '../src/database/client';
import { useAppStore } from '../src/store';
import { Colors } from '../src/theme/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoading, isInitialized, user, initializeApp } = useAppStore();

  useEffect(() => {
    initDatabase().then(() => initializeApp()).catch(() => initializeApp());
  }, []);

  useEffect(() => {
    if (isInitialized && !isLoading) {
      SplashScreen.hideAsync();
      if (!user.onboardingCompleted) {
        router.replace('/onboarding/welcome');
      } else {
        router.replace('/(tabs)/dashboard');
      }
    }
  }, [isInitialized, isLoading, user.onboardingCompleted]);

  if (isLoading) {
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
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
