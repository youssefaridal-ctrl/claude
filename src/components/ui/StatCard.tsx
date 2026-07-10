import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Radius, Spacing } from '../../theme/spacing';

interface Props {
  label: string;
  value: string;
  subValue?: string;
  icon?: string;
  color?: string;
  gradient?: readonly [string, string];
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  style?: ViewStyle;
}

export function StatCard({
  label,
  value,
  subValue,
  icon,
  color = Colors.primary,
  gradient,
  trend,
  trendValue,
  style,
}: Props) {
  const trendColor = trend === 'up' ? Colors.success : trend === 'down' ? Colors.danger : Colors.text.secondary;
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  const content = (
    <>
      <View style={styles.topRow}>
        {icon && (
          <View style={[styles.iconBg, { backgroundColor: `${color}20` }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        )}
        {trend && trendValue && (
          <View style={[styles.trend, { backgroundColor: `${trendColor}18` }]}>
            <Text style={[styles.trendText, { color: trendColor }]}>
              {trendIcon} {trendValue}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.value, { color: gradient ? Colors.white : color }]}>{value}</Text>
      <Text style={[styles.label, { color: gradient ? 'rgba(255,255,255,0.75)' : Colors.text.secondary }]}>
        {label}
      </Text>
      {subValue && (
        <Text style={[styles.subValue, { color: gradient ? 'rgba(255,255,255,0.6)' : Colors.text.tertiary }]}>
          {subValue}
        </Text>
      )}
    </>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, style]}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: Colors.bg.card, borderColor: Colors.border.default, borderWidth: 1 }, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.base,
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    minHeight: 36,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  trend: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },
  value: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    marginBottom: 2,
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
  subValue: {
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
});
