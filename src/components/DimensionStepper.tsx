import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../theme/colors';

interface Props {
  label: string;
  valueCm: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function DimensionStepper({ label, valueCm, onChange, min = 100, max = 800, step = 10 }: Props) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.control}>
        <Pressable style={styles.btn} onPress={() => onChange(clamp(valueCm + step))}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
        <View style={styles.valueBox}>
          <TextInput
            style={styles.input}
            value={String(valueCm)}
            keyboardType="number-pad"
            textAlign="center"
            onChangeText={(t) => {
              const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
              if (!Number.isNaN(n)) onChange(clamp(n));
              else onChange(min);
            }}
          />
          <Text style={styles.unit}>سم</Text>
        </View>
        <Pressable style={styles.btn} onPress={() => onChange(clamp(valueCm - step))}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  label: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
  },
  control: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  btn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  valueBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    minWidth: 70,
    justifyContent: 'center',
  },
  input: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '700',
    width: 40,
    padding: 0,
  },
  unit: {
    color: theme.textDim,
    fontSize: 12,
  },
});
