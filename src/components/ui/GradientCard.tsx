import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Radius, Shadow } from '../../theme/spacing';

interface Props {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  padding?: number;
}

export function GradientCard({
  children,
  colors = Colors.gradient.card,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  padding = 20,
}: Props) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.card, { padding }, style]}
    >
      {children}
    </LinearGradient>
  );
}

interface PlainCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, style, padding = 16 }: PlainCardProps) {
  return (
    <View style={[styles.plainCard, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Shadow.md,
  },
  plainCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Shadow.sm,
  },
});
