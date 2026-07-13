import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { updateLanguage } from '../../src/application/profile/update-language.usecase';
import { updateProfile } from '../../src/application/profile/update-profile.usecase';
import { Input } from '../../src/components/ui/Input';
import { LANGUAGES } from '../../src/i18n';
import type { Language } from '../../src/i18n';
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

const FLAG: Record<Language, string> = { fr: '🇫🇷', ar: '🇲🇦', en: '🇺🇸' };

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { user } = useAppStore();

  const [name, setName] = useState(user.name);
  const [paymentDay, setPaymentDay] = useState(String(user.salaryPaymentDay));
  const [saving, setSaving] = useState(false);

  const profileDirty = name.trim() !== user.name || paymentDay !== String(user.salaryPaymentDay);

  const avatarLetter = (user.name || '?')[0].toUpperCase();

  const handleSaveProfile = async () => {
    const day = Number.parseInt(paymentDay, 10);
    if (Number.isNaN(day) || day < 1 || day > 28) {
      Alert.alert('', `${t('settings.payment_day')} (1–28)`);
      return;
    }
    setSaving(true);
    const result = await updateProfile({
      name: name.trim() || undefined,
      salaryPaymentDay: day,
    });
    setSaving(false);
    if (!result.ok) {
      Alert.alert(t('common.error'), result.error.message);
    }
  };

  const handleSelectLanguage = async (lang: Language) => {
    const result = await updateLanguage(lang);
    if (!result.ok) {
      Alert.alert(t('common.error'), result.error.message);
      return;
    }
    if (result.value.restartRequired) {
      Alert.alert('', t('settings.restart_required'));
    }
  };

  const handleSelectCurrency = async (code: Currency) => {
    const result = await updateProfile({ currency: code });
    if (!result.ok) {
      Alert.alert(t('common.error'), result.error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          </View>

          {/* Avatar card */}
          <View style={styles.avatarCard}>
            <LinearGradient
              colors={Colors.gradient.primary}
              style={styles.avatarCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarLetter}>{avatarLetter}</Text>
            </LinearGradient>
            <View>
              <Text style={styles.avatarName}>{user.name || '—'}</Text>
              <Text style={styles.avatarMeta}>
                {user.currency} · {user.language.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Profile section */}
          <Section title={t('settings.profile')}>
            <Input
              label={t('settings.name')}
              value={name}
              onChangeText={setName}
              placeholder={t('settings.name')}
              autoCapitalize="words"
            />
            <Input
              label={t('settings.payment_day')}
              value={paymentDay}
              onChangeText={setPaymentDay}
              placeholder="1"
              keyboardType="number-pad"
            />
            {profileDirty && (
              <TouchableOpacity
                onPress={handleSaveProfile}
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                activeOpacity={0.8}
                disabled={saving}
              >
                <LinearGradient
                  colors={Colors.gradient.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveBtnGradient}
                >
                  <Text style={styles.saveBtnText}>
                    {saving ? t('common.loading') : t('common.save')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Section>

          {/* Language section */}
          <Section title={t('settings.language')}>
            {LANGUAGES.map((lang) => {
              const isSelected = user.language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => handleSelectLanguage(lang.code)}
                  activeOpacity={0.8}
                  style={[styles.langItem, isSelected && styles.langItemSelected]}
                >
                  {isSelected && (
                    <LinearGradient
                      colors={Colors.gradient.primary}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  <View style={styles.langInfo}>
                    <Text style={styles.langFlag}>{FLAG[lang.code]}</Text>
                    <View>
                      <Text style={[styles.langNative, isSelected && styles.textWhite]}>
                        {lang.nativeLabel}
                      </Text>
                      <Text style={[styles.langLabel, isSelected && styles.textWhiteAlpha]}>
                        {lang.label}
                      </Text>
                    </View>
                  </View>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </Section>

          {/* Currency section */}
          <Section title={t('settings.currency')}>
            <View style={styles.currencyGrid}>
              {CURRENCIES.map((c) => {
                const isSelected = user.currency === c.code;
                return (
                  <TouchableOpacity
                    key={c.code}
                    onPress={() => handleSelectCurrency(c.code)}
                    style={[styles.currencyBtn, isSelected && styles.currencyBtnSelected]}
                    activeOpacity={0.8}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={Colors.gradient.primary}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    )}
                    <Text style={[styles.currencySymbol, isSelected && styles.textWhite]}>
                      {c.symbol}
                    </Text>
                    <Text style={[styles.currencyCode, isSelected && styles.textWhiteAlpha]}>
                      {c.code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Section>

          {/* About section */}
          <Section title={t('settings.about')}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>{t('settings.version')}</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
          </Section>

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  flex: { flex: 1 },
  scroll: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.base,
  },
  headerTitle: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },

  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  avatarName: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  avatarMeta: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    marginTop: 2,
  },

  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
    padding: Spacing.base,
    gap: Spacing.sm,
  },

  saveBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.white,
  },

  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
  },
  langItemSelected: { borderColor: Colors.primary, borderWidth: 1.5 },
  langInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  langFlag: { fontSize: 28 },
  langNative: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  langLabel: { fontSize: Typography.size.sm, color: Colors.text.secondary, marginTop: 2 },
  checkmark: { fontSize: 18, color: Colors.white, fontWeight: Typography.weight.bold },

  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  currencyBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    minWidth: 68,
    overflow: 'hidden',
  },
  currencyBtnSelected: { borderColor: Colors.primary },
  currencySymbol: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  currencyCode: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },

  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  aboutLabel: { fontSize: Typography.size.base, color: Colors.text.primary },
  aboutValue: { fontSize: Typography.size.base, color: Colors.text.tertiary },

  textWhite: { color: Colors.white },
  textWhiteAlpha: { color: 'rgba(255,255,255,0.8)' },

  bottomPad: { height: Spacing.xl },
});
