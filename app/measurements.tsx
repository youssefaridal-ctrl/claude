import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../src/components/AppButton';
import DimensionStepper from '../src/components/DimensionStepper';
import SketchPad from '../src/components/SketchPad';
import StepHeader from '../src/components/StepHeader';
import { useKitchenStore } from '../src/store/kitchenStore';
import { theme } from '../src/theme/colors';
import type { MeasurementMethod } from '../src/types/kitchen';

export default function Measurements() {
  const router = useRouter();
  const config = useKitchenStore((s) => s.config);
  const setDimensions = useKitchenStore((s) => s.setDimensions);
  const setHeight = useKitchenStore((s) => s.setHeight);
  const [method, setMethod] = useState<MeasurementMethod>(config.measurementMethod);
  const [width, setWidth] = useState(config.widthCm);
  const [length, setLength] = useState(config.lengthCm);

  const area = ((width * length) / 10000).toFixed(1);

  const handleContinue = () => {
    setDimensions(width, length, method);
    router.push('/options');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepHeader
        title="أبعاد المطبخ"
        subtitle="أدخل الطول والعرض يدويًا أو ارسم مخططًا مصغرًا للأرضية"
        step={1}
        totalSteps={4}
      />

      <View style={styles.tabs}>
        <TabButton
          label="إدخال يدوي"
          active={method === 'manual'}
          onPress={() => setMethod('manual')}
        />
        <TabButton
          label="ارسم المخطط"
          active={method === 'sketch'}
          onPress={() => setMethod('sketch')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {method === 'manual' ? (
          <View style={styles.card}>
            <DimensionStepper label="الطول" valueCm={length} onChange={setLength} />
            <View style={{ height: 12 }} />
            <DimensionStepper label="العرض" valueCm={width} onChange={setWidth} />
            <View style={{ height: 12 }} />
            <DimensionStepper
              label="ارتفاع السقف"
              valueCm={config.heightCm}
              min={220}
              max={330}
              step={5}
              onChange={setHeight}
            />
          </View>
        ) : (
          <View style={styles.card}>
            <SketchPad
              onChange={(w, l) => {
                setWidth(w);
                setLength(l);
              }}
            />
          </View>
        )}

        <View style={styles.summaryCard}>
          <SummaryItem label="الطول" value={`${length} سم`} />
          <SummaryItem label="العرض" value={`${width} سم`} />
          <SummaryItem label="المساحة التقريبية" value={`${area} م²`} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="التالي: اختيار التصميم" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  tabs: {
    flexDirection: 'row-reverse',
    marginHorizontal: 20,
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.primary,
  },
  tabText: {
    color: theme.textDim,
    fontWeight: '700',
    fontSize: 13.5,
  },
  tabTextActive: {
    color: '#1B1204',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: 'row-reverse',
    backgroundColor: theme.cardAlt,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  summaryLabel: {
    color: theme.textDim,
    fontSize: 11,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
});
