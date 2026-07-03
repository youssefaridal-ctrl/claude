import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/colors';
import type { SwatchOption } from '../types/kitchen';

interface Props {
  options: SwatchOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ColorSwatchRow({ options, selectedId, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = opt.id === selectedId;
        return (
          <Pressable key={opt.id} onPress={() => onSelect(opt.id)} style={styles.item}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: opt.hex },
                active && styles.swatchActive,
              ]}
            >
              {active && <Text style={styles.check}>✓</Text>}
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {opt.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 14,
  },
  item: {
    alignItems: 'center',
    width: 62,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchActive: {
    borderColor: theme.primary,
  },
  check: {
    fontSize: 15,
    fontWeight: '900',
    color: '#00000099',
  },
  label: {
    color: theme.textDim,
    fontSize: 10.5,
    marginTop: 5,
    textAlign: 'center',
  },
});
