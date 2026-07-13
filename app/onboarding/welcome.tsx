import { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Radius, Spacing } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';

const { width } = Dimensions.get('window');

const FEATURES = [
  { key: 'salary', icon: '💰', gradient: Colors.gradient.salary, titleKey: 'feature1_title', descKey: 'feature1_desc' },
  { key: 'credits', icon: '📊', gradient: Colors.gradient.credits, titleKey: 'feature2_title', descKey: 'feature2_desc' },
  { key: 'goals', icon: '🎯', gradient: Colors.gradient.goals, titleKey: 'feature3_title', descKey: 'feature3_desc' },
] as const;

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < FEATURES.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else {
      router.push('/onboarding/language');
    }
  };

  const handleSkip = () => router.push('/onboarding/setup');

  return (
    <LinearGradient colors={['#090E1A', '#141C2E']} style={styles.container}>
      {/* Logo */}
      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>💼</Text>
        </View>
        <Text style={styles.appName}>{t('common.app_name')}</Text>
        <Text style={styles.tagline}>{t('onboarding.welcome_subtitle')}</Text>
      </View>

      {/* Features */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scroll}
      >
        {FEATURES.map((feature) => (
          <View key={feature.key} style={[styles.featurePage, { width }]}>
            <LinearGradient
              colors={feature.gradient}
              style={styles.featureIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.featureEmoji}>{feature.icon}</Text>
            </LinearGradient>
            <Text style={styles.featureTitle}>{t(`onboarding.${feature.titleKey}`)}</Text>
            <Text style={styles.featureDesc}>{t(`onboarding.${feature.descKey}`)}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Indicators */}
      <View style={styles.dots}>
        {FEATURES.map((feature) => (
          <View
            key={feature.key}
            style={[
              styles.dot,
              FEATURES[currentIndex].key === feature.key && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={currentIndex < FEATURES.length - 1 ? t('common.next') : t('onboarding.get_started')}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  logoArea: {
    alignItems: 'center',
    paddingBottom: Spacing['2xl'],
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  scroll: {
    flex: 1,
  },
  featurePage: {
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: {
    width: 100,
    height: 100,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  featureEmoji: {
    fontSize: 48,
  },
  featureTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  featureDesc: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border.default,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  actions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 48,
    gap: Spacing.md,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
  },
});
