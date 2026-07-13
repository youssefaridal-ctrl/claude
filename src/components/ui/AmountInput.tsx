import { StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  currency?: string;
  label?: string;
  placeholder?: string;
  style?: ViewStyle;
  large?: boolean;
}

export function AmountInput({
  value,
  onChangeText,
  currency = 'DH',
  label,
  placeholder = '0',
  style,
  large,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.wrapper, large && styles.largeWrapper]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={Colors.text.tertiary}
          style={[styles.input, large && styles.largeInput]}
        />
        <Text style={[styles.currency, large && styles.largeCurrency]}>{currency}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.xs,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingHorizontal: Spacing.base,
    height: 52,
  },
  largeWrapper: {
    height: 72,
    borderRadius: Radius.lg,
    backgroundColor: Colors.bg.card,
    borderColor: Colors.border.accent,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.md,
    color: Colors.text.primary,
    fontWeight: Typography.weight.semibold,
  },
  largeInput: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
  },
  currency: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginLeft: Spacing.sm,
  },
  largeCurrency: {
    fontSize: Typography.size.lg,
    color: Colors.primary,
  },
});
