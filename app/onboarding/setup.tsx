import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AmountInput } from '../../src/components/ui/AmountInput';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useAppStore } from '../../src/store';
import type { Currency } from '../../src/store/types';
import { Colors } from '../../src/theme/colors';
import { Radius, Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';

const CURRENCIES: { code: Currency; symbol: string }[] = [
  { code: 'MAD', symbol: 'DH' },
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' },
  { code: 'TND', symbol: 'DT' },
  { code: 'DZD', symbol: 'DA' },
  { code: 'SAR', symbol: 'SR' },
  { code: 'AED', symbol: 'AED' },
];

export default function SetupScreen() {
  const { t } = useTranslation();
  const { user, completeOnboarding } = useAppStore();
  const [name, setName] = useState('');
  const [salaryStr, setSalaryStr] = useState('');
  const [currency, setCurrency] = useState<Currency>(user.currency || 'MAD');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    const salary = Number.parseFloat(salaryStr.replace(',', '.')) || 0;
    if (!name.trim()) {
      Alert.alert('', t('onboarding.name_required'));
      return;
    }
    if (salary <= 0) {
      Alert.alert('', t('onboarding.salary_required'));
      return;
    }
    setLoading(true);
    try {
      await completeOnboarding(name.trim(), salary, user.language, currency);
      router.replace('/(tabs)/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const selectedSymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? 'DH';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={['#090E1A', '#141C2E']} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.progress}>
            <View style={[styles.progressStep, styles.progressDone]} />
            <View style={[styles.progressStep, styles.progressDone]} />
            <View style={[styles.progressStep, styles.progressActive]} />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>{t('onboarding.setup_title')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.setup_subtitle')}</Text>

            <Input
              label={t('onboarding.name_label')}
              value={name}
              onChangeText={setName}
              placeholder={t('onboarding.name_placeholder')}
              autoCapitalize="words"
            />

            <AmountInput
              label={t('onboarding.salary_label')}
              value={salaryStr}
              onChangeText={setSalaryStr}
              currency={selectedSymbol}
              placeholder={t('onboarding.salary_placeholder')}
              large
            />

            <Text style={styles.sectionLabel}>{t('onboarding.currency_label')}</Text>
            <View style={styles.currencyGrid}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  onPress={() => setCurrency(c.code)}
                  style={[styles.currencyBtn, currency === c.code && styles.currencyBtnSelected]}
                  activeOpacity={0.8}
                >
                  {currency === c.code && (
                    <LinearGradient
                      colors={Colors.gradient.primary}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.currencySymbol,
                      currency === c.code && styles.currencySymbolSelected,
                    ]}
                  >
                    {c.symbol}
                  </Text>
                  <Text
                    style={[
                      styles.currencyCode,
                      currency === c.code && styles.currencyCodeSelected,
                    ]}
                  >
                    {c.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.tip}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>{t('dashboard.tip_50_30_20')}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={loading ? t('common.loading') : `${t('onboarding.get_started')} →`}
            onPress={handleStart}
            loading={loading}
            fullWidth
            size="lg"
          />
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20, color: Colors.text.primary },
  progress: { flexDirection: 'row', gap: 6 },
  progressStep: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border.default,
  },
  progressDone: { backgroundColor: Colors.primary },
  progressActive: { backgroundColor: Colors.primaryLight, width: 40 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  title: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    marginBottom: Spacing['2xl'],
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.sm,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  currencyBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    minWidth: 72,
    overflow: 'hidden',
  },
  currencyBtnSelected: { borderColor: Colors.primary },
  currencySymbol: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  currencySymbolSelected: { color: Colors.white },
  currencyCode: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  currencyCodeSelected: { color: 'rgba(255,255,255,0.8)' },
  tip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(99,102,241,0.1)',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    marginTop: Spacing.md,
  },
  tipIcon: { fontSize: 20 },
  tipText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 48,
    paddingTop: Spacing.md,
  },
});
