import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../src/components/AppButton';
import StepHeader from '../src/components/StepHeader';
import {
  APPLIANCES,
  CABINET_COLORS,
  COUNTERTOPS,
  FLOORING,
  LAYOUTS,
  STYLES,
  WALL_COLORS,
} from '../src/data/options';
import { useKitchenStore } from '../src/store/kitchenStore';
import { theme } from '../src/theme/colors';
import { estimateCostRange, estimateLinearMeters } from '../src/utils/estimate';

function findName<T extends { id: string; name: string }>(list: T[], id: string) {
  return list.find((o) => o.id === id)?.name ?? '—';
}

export default function Summary() {
  const router = useRouter();
  const config = useKitchenStore((s) => s.config);
  const reset = useKitchenStore((s) => s.reset);

  const areaM2 = ((config.widthCm * config.lengthCm) / 10000).toFixed(1);
  const layoutName = findName(LAYOUTS, config.layout);
  const styleName = findName(STYLES, config.style);
  const cabinetName = findName(CABINET_COLORS, config.cabinetColorId);
  const countertopName = findName(COUNTERTOPS, config.countertopId);
  const flooringName = findName(FLOORING, config.flooringId);
  const wallName = findName(WALL_COLORS, config.wallColorId);
  const linearMeters = estimateLinearMeters(config).toFixed(1);
  const cost = estimateCostRange(config);

  const applianceNames = config.appliances
    .map((id) => APPLIANCES.find((a) => a.id === id))
    .filter(Boolean)
    .map((a) => `${a!.icon} ${a!.name}`);

  const handleShare = () => {
    Share.share({
      message:
        `تصميم مطبخي 3D 🍳\n` +
        `الأبعاد: ${config.lengthCm}×${config.widthCm} سم (${areaM2} م²)\n` +
        `الشكل: ${layoutName}\n` +
        `الستايل: ${styleName}\n` +
        `الخزائن: ${cabinetName} | الكاونتر: ${countertopName}\n` +
        `التكلفة التقريبية: ${cost.min}–${cost.max}$`,
    }).catch(() => {});
  };

  const handleNewDesign = () => {
    reset();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepHeader title="ملخص التصميم" subtitle="راجع تفاصيل مطبخك قبل الحفظ أو المشاركة" step={4} totalSteps={4} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.dimCard}>
          <DimBlock label="الطول" value={`${config.lengthCm}`} unit="سم" />
          <DimBlock label="العرض" value={`${config.widthCm}`} unit="سم" />
          <DimBlock label="المساحة" value={areaM2} unit="م²" />
        </View>

        <Card title="التصميم">
          <Row label="شكل المطبخ" value={layoutName} />
          <Row label="الستايل" value={styleName} />
        </Card>

        <Card title="الألوان والخامات">
          <Row label="لون الخزائن" value={cabinetName} />
          <Row label="خامة الكاونتر" value={countertopName} />
          <Row label="الأرضية" value={flooringName} />
          <Row label="لون الحائط" value={wallName} />
        </Card>

        <Card title="الأجهزة المختارة">
          <Text style={styles.appliancesText}>
            {applianceNames.length ? applianceNames.join('   ') : 'لا توجد أجهزة مختارة'}
          </Text>
        </Card>

        <Card title="تقدير التكلفة">
          <Row label="خزائن تقريبية (متر طولي)" value={`${linearMeters} م`} />
          <Row label="التكلفة التقريبية" value={`${cost.min} – ${cost.max} $`} highlight />
          <Text style={styles.disclaimer}>* تقدير أولي لأغراض العرض فقط، السعر الفعلي يعتمد على المورد والخامات</Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="مشاركة التصميم" onPress={handleShare} variant="secondary" />
        <View style={{ height: 10 }} />
        <AppButton title="تصميم مطبخ جديد" onPress={handleNewDesign} variant="ghost" />
      </View>
    </SafeAreaView>
  );
}

function DimBlock({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.dimBlock}>
      <Text style={styles.dimValue}>
        {value} <Text style={styles.dimUnit}>{unit}</Text>
      </Text>
      <Text style={styles.dimLabel}>{label}</Text>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>{value}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  dimCard: {
    flexDirection: 'row-reverse',
    backgroundColor: theme.cardAlt,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dimBlock: { alignItems: 'center', flex: 1 },
  dimValue: { color: theme.primary, fontSize: 18, fontWeight: '800' },
  dimUnit: { fontSize: 11, color: theme.textDim, fontWeight: '600' },
  dimLabel: { color: theme.textDim, fontSize: 11, marginTop: 4 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    color: theme.text,
    fontWeight: '800',
    fontSize: 14.5,
    textAlign: 'right',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: { color: theme.textDim, fontSize: 13 },
  rowValue: { color: theme.text, fontSize: 13, fontWeight: '700' },
  rowValueHighlight: { color: theme.primary, fontSize: 15 },
  appliancesText: {
    color: theme.text,
    textAlign: 'right',
    lineHeight: 26,
    fontSize: 14,
  },
  disclaimer: {
    color: theme.textDim,
    fontSize: 10.5,
    textAlign: 'right',
    marginTop: 8,
    lineHeight: 15,
  },
  footer: { paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
});
