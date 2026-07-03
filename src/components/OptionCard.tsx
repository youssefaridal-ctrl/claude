import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/colors';

interface Props {
  title: string;
  desc?: string;
  active: boolean;
  onPress: () => void;
  icon?: string;
}

export default function OptionCard({ title, desc, active, onPress, icon }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, active && styles.cardActive]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.title, active && styles.titleActive]}>{title}</Text>
      {desc ? <Text style={styles.desc} numberOfLines={2}>{desc}</Text> : null}
      {active && (
        <View style={styles.check}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 152,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    marginLeft: 10,
    borderWidth: 1.5,
    borderColor: theme.border,
  },
  cardActive: {
    borderColor: theme.primary,
    backgroundColor: theme.cardAlt,
  },
  icon: {
    fontSize: 22,
    marginBottom: 6,
    textAlign: 'right',
  },
  title: {
    color: theme.text,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'right',
  },
  titleActive: {
    color: theme.primary,
  },
  desc: {
    color: theme.textDim,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
    lineHeight: 15,
  },
  check: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#1B1204',
    fontSize: 11,
    fontWeight: '900',
  },
});
