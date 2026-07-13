import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface Props {
  label: string;
  variant?: Variant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', size = 'sm', style }: Props) {
  const configs: Record<Variant, { bg: string; text: string }> = {
    success: { bg: Colors.successBg, text: Colors.success },
    warning: { bg: Colors.warningBg, text: Colors.warning },
    danger: { bg: Colors.dangerBg, text: Colors.danger },
    info: { bg: Colors.infoBg, text: Colors.info },
    neutral: { bg: Colors.bg.elevated, text: Colors.text.secondary },
    primary: { bg: 'rgba(99,102,241,0.15)', text: Colors.primary },
  };

  const { bg, text } = configs[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[styles.badge, { backgroundColor: bg }, isSmall ? styles.small : styles.medium, style]}
    >
      <Text style={[styles.text, { color: text }, isSmall ? styles.smallText : styles.mediumText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  medium: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  text: {
    fontWeight: Typography.weight.semibold,
  },
  smallText: {
    fontSize: Typography.size.xs,
  },
  mediumText: {
    fontSize: Typography.size.sm,
  },
});
