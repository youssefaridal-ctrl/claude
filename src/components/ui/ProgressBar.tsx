import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface Props {
  progress: number; // 0–100
  color?: string;
  backgroundColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color = Colors.primary,
  backgroundColor = Colors.bg.elevated,
  height = 8,
  showLabel = false,
  label,
  animated = true,
  style,
}: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    if (animated) {
      Animated.timing(anim, {
        toValue: clampedProgress,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      anim.setValue(clampedProgress);
    }
  }, [clampedProgress]);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={style}>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showLabel && <Text style={[styles.percentage, { color }]}>{clampedProgress}%</Text>}
        </View>
      )}
      <View style={[styles.track, { backgroundColor, height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: color, height, borderRadius: height / 2, width }]}
        />
      </View>
    </View>
  );
}

interface MultiSegmentProps {
  segments: { value: number; color: string; label?: string }[];
  total: number;
  height?: number;
  style?: ViewStyle;
}

export function MultiProgressBar({ segments, total, height = 10, style }: MultiSegmentProps) {
  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: Colors.bg.elevated },
        style,
      ]}
    >
      {segments.map((seg, i) => {
        const width: `${number}%` =
          total > 0 ? `${Math.min(100, (seg.value / total) * 100)}%` : '0%';
        return (
          <View
            key={i}
            style={{
              height,
              width,
              backgroundColor: seg.color,
              borderRadius: i === 0 ? height / 2 : 0,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  percentage: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
  },
});
