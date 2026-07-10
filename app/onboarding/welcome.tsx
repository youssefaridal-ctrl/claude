import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, Radius } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  {
    icon: '💰',
    gradient: Colors.gradient.salary,
    title_fr: 'Gérez votre salaire',
    title_ar: 'إدارة راتبك',
    title_en: 'Manage your salary',
    desc_fr: 'Répartissez intelligemment votre salaire selon la règle 50/30/20 ou vos propres priorités.',
    desc_ar: 'وزع راتبك بذكاء وفق قاعدة 50/30/20 أو حسب أولوياتك الخاصة.',
    desc_en: 'Intelligently distribute your salary using the 50/30/20 rule or your own priorities.',
  },
  {
    icon: '📊',
    gradient: Colors.gradient.credits,
    title_fr: 'Suivez vos crédits',
    title_ar: 'تتبع قروضك',
    title_en: 'Track your loans',
    desc_fr: 'Visualisez vos dettes, suivez vos remboursements et planifiez votre liberté financière.',
    desc_ar: 'تابع ديونك وأقساطك وخطط للتحرر المالي.',
    desc_en: 'Visualize your debts, track repayments, and plan your financial freedom.',
  },
  {
    icon: '🎯',
    gradient: Colors.gradient.goals,
    title_fr: 'Atteignez vos objectifs',
    title_ar: 'حقق أهدافك',
    title_en: 'Achieve your goals',
    desc_fr: 'Créez des objectifs financiers personnalisés et suivez votre progression chaque mois.',
    desc_ar: 'أنشئ أهدافاً مالية مخصصة وتابع تقدمك شهرياً.',
    desc_en: 'Create personalized financial goals and track your monthly progress.',
  },
];

export default function WelcomeScreen() {
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
        <Text style={styles.appName}>Finance Bag</Text>
        <Text style={styles.tagline}>Votre coach financier personnel</Text>
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
        {FEATURES.map((feature, i) => (
          <View key={i} style={[styles.featurePage, { width }]}>
            <LinearGradient
              colors={feature.gradient}
              style={styles.featureIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.featureEmoji}>{feature.icon}</Text>
            </LinearGradient>
            <Text style={styles.featureTitle}>{feature.title_fr}</Text>
            <Text style={styles.featureDesc}>{feature.desc_fr}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Indicators */}
      <View style={styles.dots}>
        {FEATURES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={currentIndex < FEATURES.length - 1 ? 'Suivant' : 'Commencer'}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Passer l'intro</Text>
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
    borderRadius: 30,
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
