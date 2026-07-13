import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../theme/colors';

const ROWS: { label: string; value: string }[][] = [
  [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ],
  [
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ],
  [
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
  ],
  [
    { label: '', value: '' },
    { label: '0', value: '0' },
    { label: '⌫', value: 'del' },
  ],
];

interface Props {
  onDigit: (digit: string) => void;
  onDelete: () => void;
}

export function PinPad({ onDigit, onDelete }: Props) {
  return (
    <View style={styles.grid}>
      {ROWS.map((row) => (
        <View key={row.map((k) => k.value).join('-')} style={styles.row}>
          {row.map(({ label, value }) => {
            if (value === '') return <View key="empty" style={styles.key} />;
            const isDelete = value === 'del';
            return (
              <TouchableOpacity
                key={value}
                style={styles.key}
                onPress={() => (isDelete ? onDelete() : onDigit(label))}
                activeOpacity={0.6}
                accessibilityLabel={isDelete ? 'Delete' : label}
              >
                <Text style={[styles.keyText, isDelete && styles.deleteText]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const KEY_SIZE = 72;

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 24,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    backgroundColor: Colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: Colors.text.primary,
    fontSize: 22,
    fontWeight: '500',
  },
  deleteText: {
    fontSize: 20,
  },
});
