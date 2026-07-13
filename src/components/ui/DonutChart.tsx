import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface Segment {
  value: number;
  color: string;
  label?: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSubLabel?: string;
}

export function DonutChart({
  segments,
  size = 160,
  strokeWidth = 24,
  centerLabel,
  centerSubLabel,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const total = segments.reduce((acc, s) => acc + s.value, 0);
  if (total === 0) {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={Colors.bg.elevated}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>
        {centerLabel && (
          <View style={[StyleSheet.absoluteFill, styles.center]}>
            <Text style={styles.centerLabel}>{centerLabel}</Text>
            {centerSubLabel && <Text style={styles.centerSub}>{centerSubLabel}</Text>}
          </View>
        )}
      </View>
    );
  }

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const currentOffset = offset;
    offset += pct * circumference;
    return { ...seg, dash, gap, offset: currentOffset };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <G>
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={Colors.bg.elevated}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {arcs.map((arc, i) => (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              stroke={arc.color}
              strokeWidth={strokeWidth - 2}
              fill="none"
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="round"
            />
          ))}
        </G>
      </Svg>
      {centerLabel && (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Text style={styles.centerLabel}>{centerLabel}</Text>
          {centerSubLabel && <Text style={styles.centerSub}>{centerSubLabel}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  centerSub: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
