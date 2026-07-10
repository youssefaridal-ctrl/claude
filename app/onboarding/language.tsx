import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, Radius } from '../../src/theme/spacing';
import { LANGUAGES, Language } from '../../src/i18n';
import { useAppStore } from '../../src/store';
import i18n from '../../src/i18n';

export default function LanguageScreen() {
  const { user, updateUser } = useAppStore();
  const [selected, setSelected] = React.useState<Language>(user.language);

  const handleSelect = async (lang: Language) => {
    setSelected(lang);
    await updateUser({ language: lang });
    i18n.changeLanguage(lang);
  };

  const handleNext = () => router.push('/onboarding/setup');

  return (
    <LinearGradient colors={['#090E1A', '#141C2E']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <Text style={styles.logo}>💼</Text>
          <Text style={styles.logoText}>Finance Bag</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Choisissez{'\n'}votre langue</Text>
        <Text style={styles.subtitle}>Sélectionnez la langue de l'interface</Text>

        <ScrollView style={styles.langList} showsVerticalScrollIndicator={false}>
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleSelect(lang.code)}
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
                  <Text style={styles.langFlag}>
                    {lang.code === 'fr' ? '🇫🇷' : lang.code === 'ar' ? '🇲🇦' : '🇺🇸'}
                  </Text>
                  <View>
                    <Text style={[styles.langNative, isSelected && styles.langNativeSelected]}>
                      {lang.nativeLabel}
                    </Text>
                    <Text style={[styles.langLabel, isSelected && styles.langLabelSelected]}>
                      {lang.label}
                    </Text>
                  </View>
                </View>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity onPress={handleNext} style={styles.nextBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={Colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>Suivant →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
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
  logoRow: { flexDirection: 'row', alignItems: 'center', marginLeft: Spacing.base },
  logo: { fontSize: 24 },
  logoText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  content: { flex: 1, paddingHorizontal: Spacing.xl },
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
  },
  langList: { flex: 1, marginBottom: Spacing.xl },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderRadius: Radius.xl,
    backgroundColor: Colors.bg.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  langItemSelected: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  langInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  langFlag: { fontSize: 32 },
  langNative: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  langNativeSelected: { color: Colors.white },
  langLabel: { fontSize: Typography.size.sm, color: Colors.text.secondary, marginTop: 2 },
  langLabelSelected: { color: 'rgba(255,255,255,0.8)' },
  checkmark: { fontSize: 20, color: Colors.white, fontWeight: Typography.weight.bold },
  nextBtn: { marginBottom: 48 },
  nextGradient: {
    paddingVertical: 18,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  nextText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});
