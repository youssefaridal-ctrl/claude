import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../src/components/AppButton';
import ColorSwatchRow from '../src/components/ColorSwatchRow';
import OptionCard from '../src/components/OptionCard';
import SectionTitle from '../src/components/SectionTitle';
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
import type { ApplianceKey } from '../src/types/kitchen';

export default function Options() {
  const router = useRouter();
  const config = useKitchenStore((s) => s.config);
  const setLayout = useKitchenStore((s) => s.setLayout);
  const setStyle = useKitchenStore((s) => s.setStyle);
  const setCabinetColor = useKitchenStore((s) => s.setCabinetColor);
  const setCountertop = useKitchenStore((s) => s.setCountertop);
  const setFlooring = useKitchenStore((s) => s.setFlooring);
  const setWallColor = useKitchenStore((s) => s.setWallColor);
  const toggleAppliance = useKitchenStore((s) => s.toggleAppliance);

  const recommendedLayouts = LAYOUTS.filter(
    (l) => config.widthCm >= l.minWidth && config.lengthCm >= l.minLength
  ).map((l) => l.id);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepHeader
        title="خيارات التصميم"
        subtitle="اختر شكل المطبخ والستايل والألوان والخامات"
        step={2}
        totalSteps={4}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionTitle title="شكل المطبخ" hint="بناءً على المساحة المدخلة" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hScrollContent}
        >
          {LAYOUTS.map((l) => (
            <OptionCard
              key={l.id}
              title={l.name}
              desc={l.desc}
              active={config.layout === l.id}
              onPress={() => setLayout(l.id)}
              icon={recommendedLayouts.includes(l.id) ? '✅' : '📐'}
            />
          ))}
        </ScrollView>

        <SectionTitle title="الستايل" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hScrollContent}
        >
          {STYLES.map((s) => (
            <OptionCard
              key={s.id}
              title={s.name}
              desc={s.desc}
              active={config.style === s.id}
              onPress={() => setStyle(s.id)}
            />
          ))}
        </ScrollView>

        <SectionTitle title="لون الخزائن" />
        <ColorSwatchRow options={CABINET_COLORS} selectedId={config.cabinetColorId} onSelect={setCabinetColor} />

        <SectionTitle title="خامة الكاونتر" />
        <ColorSwatchRow options={COUNTERTOPS} selectedId={config.countertopId} onSelect={setCountertop} />

        <SectionTitle title="الأرضية" />
        <ColorSwatchRow options={FLOORING} selectedId={config.flooringId} onSelect={setFlooring} />

        <SectionTitle title="لون الحائط" />
        <ColorSwatchRow options={WALL_COLORS} selectedId={config.wallColorId} onSelect={setWallColor} />

        <SectionTitle title="الأجهزة" hint="اختر الأجهزة التي تريد إظهارها" />
        <View style={styles.applianceGrid}>
          {APPLIANCES.map((a) => (
            <ApplianceChip
              key={a.id}
              name={a.name}
              icon={a.icon}
              active={config.appliances.includes(a.id)}
              onPress={() => toggleAppliance(a.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="عرض المطبخ 3D" onPress={() => router.push('/preview')} />
      </View>
    </SafeAreaView>
  );
}

function ApplianceChip({
  name,
  icon,
  active,
  onPress,
}: {
  name: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[chipStyles.chip, active && chipStyles.chipActive]}>
      <Text style={chipStyles.icon}>{icon}</Text>
      <Text style={[chipStyles.text, active && chipStyles.textActive]}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  hScroll: {
    marginHorizontal: -20,
  },
  hScrollContent: {
    paddingHorizontal: 20,
    flexDirection: 'row-reverse',
  },
  applianceGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
});

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.card,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: theme.border,
  },
  chipActive: {
    borderColor: theme.accent,
    backgroundColor: theme.cardAlt,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    color: theme.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  textActive: {
    color: theme.accent,
  },
});
