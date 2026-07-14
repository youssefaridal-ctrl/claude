import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { CapturedError } from '../../diagnostics/error-reporter';

interface StackFrame {
  fn: string;
  location: string;
}

function parseStack(stack: string): StackFrame[] {
  return stack
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('at ') || line.includes('@'))
    .slice(0, 30)
    .map((line) => {
      // Hermes format: "methodName@file:line:col"
      const hermesMatch = line.match(/^(.+?)@(.+)$/);
      if (hermesMatch) return { fn: hermesMatch[1], location: hermesMatch[2] };
      // V8 format: "at methodName (file:line:col)"
      const v8Match = line.match(/^at\s+(.+?)\s+\((.+)\)$/);
      if (v8Match) return { fn: v8Match[1], location: v8Match[2] };
      // V8 anonymous: "at file:line:col"
      const anonMatch = line.match(/^at\s+(.+)$/);
      if (anonMatch) return { fn: '<anonymous>', location: anonMatch[1] };
      return { fn: line, location: '' };
    });
}

interface Props {
  error: CapturedError;
}

export function CrashScreen({ error }: Props) {
  const frames = parseStack(error.stack);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.badge}>{error.type}</Text>
        <Text style={styles.title}>Startup Error</Text>
        <Text style={styles.ts}>{error.timestamp}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>MESSAGE</Text>
        <Text style={styles.message} selectable>
          {error.message || '(no message)'}
        </Text>

        {frames.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>STACK TRACE</Text>
            {frames.map((frame, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: diagnostic display only
              <View key={i} style={styles.frame}>
                <Text style={styles.frameFn} selectable numberOfLines={1}>
                  {frame.fn}
                </Text>
                {frame.location ? (
                  <Text style={styles.frameLoc} selectable numberOfLines={2}>
                    {frame.location}
                  </Text>
                ) : null}
              </View>
            ))}
          </>
        )}

        {!frames.length && error.stack ? (
          <>
            <Text style={styles.sectionLabel}>STACK</Text>
            <Text style={styles.rawStack} selectable>
              {error.stack}
            </Text>
          </>
        ) : null}

        <Text style={styles.hint}>
          {'Full error saved to:\n'}
          <Text style={styles.hintPath}>{'[documentDirectory]/startup-error.txt'}</Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const BG = '#0d0d0d';
const RED = '#ff4444';
const YELLOW = '#ffcc00';
const MUTED = '#888';
const WHITE = '#f0f0f0';
const FRAME_BG = '#1a1a1a';
const FRAME_BORDER = '#2a2a2a';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: FRAME_BORDER,
  },
  badge: {
    color: RED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  title: {
    color: WHITE,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  ts: {
    color: MUTED,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },
  sectionLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 20,
    marginBottom: 8,
  },
  message: {
    color: YELLOW,
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  frame: {
    backgroundColor: FRAME_BG,
    borderLeftWidth: 2,
    borderLeftColor: RED,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  frameFn: {
    color: WHITE,
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  frameLoc: {
    color: MUTED,
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  rawStack: {
    color: MUTED,
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  hint: {
    color: MUTED,
    fontSize: 12,
    marginTop: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  hintPath: {
    color: '#5599ff',
    fontFamily: 'monospace',
  },
});
