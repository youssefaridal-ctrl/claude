import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/colors';

export default function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
    marginTop: 22,
  },
  title: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
  },
  hint: {
    color: theme.textDim,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
  },
});
