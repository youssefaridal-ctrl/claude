import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/colors';

interface Props {
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
  onBack?: () => void;
}

export default function StepHeader({ title, subtitle, step, totalSteps, onBack }: Props) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={onBack ?? (() => router.back())}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>→</Text>
        </Pressable>
        <View style={styles.dots}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i + 1 === step && styles.dotActive,
                i + 1 < step && styles.dotDone,
              ]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: theme.text,
    fontSize: 22,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row-reverse',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.border,
  },
  dotActive: {
    backgroundColor: theme.primary,
    width: 20,
  },
  dotDone: {
    backgroundColor: theme.accent,
  },
  title: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'right',
  },
  subtitle: {
    color: theme.textDim,
    fontSize: 14,
    textAlign: 'right',
    marginTop: 6,
    lineHeight: 20,
  },
});
