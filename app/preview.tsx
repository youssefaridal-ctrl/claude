import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../src/components/AppButton';
import Kitchen3DView, { Kitchen3DViewHandle } from '../src/components/Kitchen3DView';
import StepHeader from '../src/components/StepHeader';
import { LAYOUTS, STYLES } from '../src/data/options';
import { useKitchenStore } from '../src/store/kitchenStore';
import { theme } from '../src/theme/colors';
import { toSceneConfig } from '../src/utils/sceneConfig';

export default function Preview() {
  const router = useRouter();
  const config = useKitchenStore((s) => s.config);
  const setLayout = useKitchenStore((s) => s.setLayout);
  const setStyle = useKitchenStore((s) => s.setStyle);
  const viewRef = useRef<Kitchen3DViewHandle>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    viewRef.current?.postConfig(toSceneConfig(config));
  }, [ready, config]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepHeader
        title="مطبخك 3D"
        subtitle="اسحب لتدوير الكاميرا، وجرّب أشكالًا وستايلات مختلفة فورًا"
        step={3}
        totalSteps={4}
      />

      <View style={styles.viewerWrap}>
        <Kitchen3DView ref={viewRef} onReady={() => setReady(true)} />
        {!ready && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <Text style={styles.loadingText}>جارِ التحميل...</Text>
          </View>
        )}
      </View>

      <View style={styles.quickSwitch}>
        <Text style={styles.quickLabel}>الشكل</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {LAYOUTS.map((l) => (
            <Pressable
              key={l.id}
              onPress={() => setLayout(l.id)}
              style={[styles.chip, config.layout === l.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, config.layout === l.id && styles.chipTextActive]}>
                {l.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.quickLabel}>الستايل</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {STYLES.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setStyle(s.id)}
              style={[styles.chip, config.style === s.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, config.style === s.id && styles.chipTextActive]}>
                {s.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <AppButton title="عرض ملخص التصميم" onPress={() => router.push('/summary')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  viewerWrap: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eef1f4',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: theme.textDim,
  },
  quickSwitch: {
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 4,
  },
  quickLabel: {
    color: theme.textDim,
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    paddingBottom: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  chipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  chipText: {
    color: theme.textDim,
    fontSize: 12.5,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#1B1204',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
});
