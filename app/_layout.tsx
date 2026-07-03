import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
          animation: 'slide_from_left',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="measurements" />
        <Stack.Screen name="options" />
        <Stack.Screen name="preview" />
        <Stack.Screen name="summary" />
      </Stack>
    </SafeAreaProvider>
  );
}
