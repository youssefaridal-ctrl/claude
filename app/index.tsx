import { View } from 'react-native';
import { Colors } from '../src/theme/colors';

/**
 * Initial route — Expo Router requires a root index file.
 * The root layout (_layout.tsx) handles all navigation decisions
 * and routes away from here once auth state is known.
 */
export default function Index() {
  return <View style={{ flex: 1, backgroundColor: Colors.bg.primary }} />;
}
