import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../src/theme/colors';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.bg.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
