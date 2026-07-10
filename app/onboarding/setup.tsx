import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, Radius } from '../../src/theme/spacing';
import { useAppStore } from '../../src/store';
import { Input } from '../../src/components/ui/Input';
import { AmountInput } from '../../src/components/ui/AmountInput';
import { Button } from '../../src/components/ui/Button';
import { Currency } from '../../src/store/types';

const CURRENCIES: { code: Currency; symbol: string; name: string }[] = [
  { code: 'MAD', symbol: 'DH', name: 'Dirham' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar' },
  { code: 'GBP', symbol: '£', name: 'Livre' },
  { code: 'TND', symbol: 'DT', name: 'Dinar' },
  { code: 'DZD', symbol: 'DA', name: 'Dinar DZ' },
  { code: 'SAR', symbol: 'SR', name: 'Riyal' },
  { code: 'AED', symbol: 'AED', name: 'Dirham AE' },
];

export default function SetupScreen() {
  const { user, completeOnboarding } = useAppStore();
  const [name, setName] = useState('');
  const [salaryStr, setSalaryStr] = useState('');
  const [currency, setCurrency] = useState<Currency>(user.currency || 'MAD');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    const salary = parseFloat(salaryStr.replace(',', '.')) || 0;
    if (!name.trim()) {
      Alert.alert('', 'Veuillez entrer votre prénom.');
      return;
    }
    if (salary <= 0) {
      Alert.alert('', 'Veuillez entrer votre salaire mensuel.');
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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
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

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Configurons{'\n'}votre profil</Text>
            <Text style={styles.subtitle}>Quelques informations pour personnaliser votre expérience.</Text>

            {/* Name */}
            <Input
              label="Votre prénom"
              value={name}
              onChangeText={setName}
              placeholder="Ex: Ahmed"
              autoCapitalize="words"
            />

            {/* Salary */}
            <AmountInput
              label="Salaire mensuel net"
              value={salaryStr}
              onChangeText={setSalaryStr}
              currency={CURRENCIES.find((c) => c.code === currency)?.symbol || 'DH'}
              placeholder="0"
              large
            />

            {/* Currency */}
            <Text style={styles.sectionLabel}>Devise</Text>
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
                  <Text style={[styles.currencySymbol, currency === c.code && styles.currencySymbolSelected]}>
                    {c.symbol}
                  </Text>
                  <Text style={[styles.currencyName, currency === c.code && styles.currencyNameSelected]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tip */}
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                Votre salaire sera automatiquement réparti selon vos catégories de dépenses.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={loading ? 'Chargement...' : 'Commencer →'}
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
  currencyBtnSelected: {
    borderColor: Colors.primary,
  },
  currencySymbol: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  currencySymbolSelected: { color: Colors.white },
  currencyName: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  currencyNameSelected: { color: 'rgba(255,255,255,0.8)' },
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
