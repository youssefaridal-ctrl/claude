import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../src/components/AppButton';
import { theme } from '../src/theme/colors';

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>🍳</Text>
        </View>
        <Text style={styles.brand}>مطبخي 3D</Text>
        <Text style={styles.tagline}>صمّم مطبخ أحلامك خلال دقائق</Text>
      </View>

      <View style={styles.previewBox}>
        <KitchenIllustration />
      </View>

      <View style={styles.stepsList}>
        <StepRow number="1" text="أدخل أبعاد المطبخ يدويًا أو ارسمها" />
        <StepRow number="2" text="اختر شكل المطبخ والستايل والألوان" />
        <StepRow number="3" text="شاهد مطبخك بتصميم ثلاثي الأبعاد فوري" />
      </View>

      <View style={styles.footer}>
        <AppButton title="ابدأ التصميم الآن" onPress={() => router.push('/measurements')} />
        <Text style={styles.footNote}>لا يتطلب أي خبرة تصميم مسبقة</Text>
      </View>
    </SafeAreaView>
  );
}

function StepRow({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.stepRow}>
      <Text style={styles.stepText}>{text}</Text>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
    </View>
  );
}

function KitchenIllustration() {
  return (
    <View style={illus.wrap}>
      <View style={[illus.cabinet, { backgroundColor: '#C9A876' }]} />
      <View style={[illus.cabinet, { backgroundColor: '#E8DFC8', left: 70 }]} />
      <View style={[illus.cabinet, { backgroundColor: '#8A9A7E', left: 140 }]} />
      <View style={illus.counter} />
      <View style={illus.island} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    marginTop: 20,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  badgeIcon: { fontSize: 34 },
  brand: {
    fontSize: 30,
    fontWeight: '900',
    color: theme.text,
  },
  tagline: {
    fontSize: 15,
    color: theme.textDim,
    marginTop: 6,
  },
  previewBox: {
    height: 140,
    borderRadius: 20,
    backgroundColor: theme.card,
    overflow: 'hidden',
  },
  stepsList: {
    gap: 14,
  },
  stepRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontWeight: '800',
    color: '#1B1204',
  },
  stepText: {
    color: theme.text,
    fontSize: 14.5,
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    marginBottom: 12,
    gap: 10,
  },
  footNote: {
    textAlign: 'center',
    color: theme.textDim,
    fontSize: 12,
  },
});

const illus = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'relative',
  },
  cabinet: {
    position: 'absolute',
    bottom: 30,
    width: 64,
    height: 60,
    borderRadius: 8,
  },
  counter: {
    position: 'absolute',
    bottom: 88,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#EDEBE6',
  },
  island: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#3B3F45',
  },
});
