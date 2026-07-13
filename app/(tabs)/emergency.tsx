import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmountInput } from '../../src/components/ui/AmountInput';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { useAppStore } from '../../src/store';
import { Colors } from '../../src/theme/colors';
import { Radius, Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { formatCurrency } from '../../src/utils/currency';
import { formatShortDate } from '../../src/utils/date';

export default function EmergencyScreen() {
  const { t } = useTranslation();
  const {
    user,
    emergencyFund,
    updateEmergencyFund,
    addEmergencyContribution,
    withdrawFromEmergency,
  } = useAppStore();

  const [showSetTarget, setShowSetTarget] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const [targetType, setTargetType] = useState<typeof emergencyFund.targetType>(
    emergencyFund.targetType
  );
  const [monthlyExpenses, setMonthlyExpenses] = useState(emergencyFund.monthlyExpenses.toString());
  const [customTarget, setCustomTarget] = useState(emergencyFund.targetAmount.toString());
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('');
  const [monthlyContrib, setMonthlyContrib] = useState(
    emergencyFund.monthlyContribution.toString()
  );

  const TARGET_TYPES = useMemo(
    () => [
      {
        value: '3_months' as const,
        label: `3 ${t('common.months')}`,
        sublabel: t('emergency.minimum'),
        multiplier: 3,
      },
      {
        value: '6_months' as const,
        label: `6 ${t('common.months')}`,
        sublabel: t('emergency.recommended'),
        multiplier: 6,
      },
      {
        value: '12_months' as const,
        label: `12 ${t('common.months')}`,
        sublabel: t('emergency.optimal'),
        multiplier: 12,
      },
      {
        value: 'custom' as const,
        label: t('salary.preset_custom'),
        sublabel: t('emergency.custom_sub'),
        multiplier: 0,
      },
    ],
    [t]
  );

  const progress =
    emergencyFund.targetAmount > 0
      ? (emergencyFund.currentAmount / emergencyFund.targetAmount) * 100
      : 0;

  const monthsToGoal =
    emergencyFund.monthlyContribution > 0 && emergencyFund.targetAmount > 0
      ? Math.ceil(
          (emergencyFund.targetAmount - emergencyFund.currentAmount) /
            emergencyFund.monthlyContribution
        )
      : null;

  const isGoalReached =
    emergencyFund.currentAmount >= emergencyFund.targetAmount && emergencyFund.targetAmount > 0;

  const handleSetTarget = useCallback(async () => {
    let target = 0;
    const expenses = Number.parseFloat(monthlyExpenses.replace(',', '.')) || 0;

    if (targetType === 'custom') {
      target = Number.parseFloat(customTarget.replace(',', '.')) || 0;
    } else {
      const multiplier = TARGET_TYPES.find((type) => type.value === targetType)?.multiplier ?? 0;
      target = expenses * multiplier;
    }

    if (target <= 0) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }

    await updateEmergencyFund({
      targetAmount: target,
      targetType,
      monthlyExpenses: expenses,
      monthlyContribution: Number.parseFloat(monthlyContrib) || 0,
    });
    setShowSetTarget(false);
  }, [
    monthlyExpenses,
    customTarget,
    targetType,
    monthlyContrib,
    t,
    TARGET_TYPES,
    updateEmergencyFund,
  ]);

  const handleContribute = useCallback(async () => {
    const amount = Number.parseFloat(contributionAmount.replace(',', '.'));
    if (Number.isNaN(amount) || amount <= 0) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }
    await addEmergencyContribution(amount, contributionNote);
    setContributionAmount('');
    setContributionNote('');
    setShowContribute(false);
  }, [contributionAmount, contributionNote, t, addEmergencyContribution]);

  const handleWithdraw = useCallback(async () => {
    const amount = Number.parseFloat(withdrawAmount.replace(',', '.'));
    if (Number.isNaN(amount) || amount <= 0) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }
    if (amount > emergencyFund.currentAmount) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }
    await withdrawFromEmergency(amount, withdrawReason);
    setWithdrawAmount('');
    setWithdrawReason('');
    setShowWithdraw(false);
  }, [withdrawAmount, withdrawReason, t, emergencyFund.currentAmount, withdrawFromEmergency]);

  const progressColor =
    progress >= 100 ? Colors.success : progress >= 60 ? Colors.warning : Colors.danger;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient.emergency} style={styles.header}>
          <Text style={styles.headerTitle}>🛡️ {t('emergency.title')}</Text>
          <Text style={styles.headerSub}>{t('emergency.subtitle')}</Text>

          {/* Main Card */}
          <View style={styles.mainCard}>
            {isGoalReached ? (
              <View style={styles.goalReached}>
                <Text style={styles.goalReachedIcon}>🎉</Text>
                <Text style={styles.goalReachedTitle}>{t('emergency.goal_reached')}</Text>
                <Text style={styles.goalReachedDesc}>{t('emergency.goal_reached_desc')}</Text>
              </View>
            ) : (
              <>
                <View style={styles.amountsRow}>
                  <View>
                    <Text style={styles.currentLabel}>{t('emergency.current_amount')}</Text>
                    <Text
                      style={[
                        styles.currentAmount,
                        {
                          color: progressColor === Colors.danger ? '#FF6B6B' : Colors.white,
                        },
                      ]}
                    >
                      {formatCurrency(emergencyFund.currentAmount, user.currency)}
                    </Text>
                  </View>
                  <View style={styles.targetInfo}>
                    <Text style={styles.currentLabel}>{t('emergency.target_amount')}</Text>
                    <Text style={styles.targetAmount}>
                      {emergencyFund.targetAmount > 0
                        ? formatCurrency(emergencyFund.targetAmount, user.currency)
                        : t('emergency.not_defined')}
                    </Text>
                  </View>
                </View>

                {emergencyFund.targetAmount > 0 && (
                  <>
                    <ProgressBar
                      progress={progress}
                      color="rgba(255,255,255,0.9)"
                      backgroundColor="rgba(255,255,255,0.2)"
                      height={10}
                      animated
                      style={styles.progressBar}
                    />
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressLabel}>
                        {Math.round(progress)}% {t('emergency.of_goal')}
                      </Text>
                      {monthsToGoal !== null && monthsToGoal > 0 && (
                        <Text style={styles.progressLabel}>
                          {monthsToGoal} {t('emergency.months_to_goal')}
                        </Text>
                      )}
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Monthly Contribution Info */}
          {emergencyFund.monthlyContribution > 0 && (
            <View style={styles.contribInfo}>
              <Text style={styles.contribIcon}>📅</Text>
              <View>
                <Text style={styles.contribTitle}>{t('emergency.planned_monthly')}</Text>
                <Text style={styles.contribAmount}>
                  {formatCurrency(emergencyFund.monthlyContribution, user.currency)}{' '}
                  {t('common.per_month')}
                </Text>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowContribute(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <LinearGradient colors={Colors.gradient.success} style={styles.actionGrad}>
                <Text style={styles.actionIcon}>➕</Text>
                <Text style={styles.actionLabel}>{t('common.add')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowWithdraw(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <LinearGradient colors={Colors.gradient.warning} style={styles.actionGrad}>
                <Text style={styles.actionIcon}>➖</Text>
                <Text style={styles.actionLabel}>{t('emergency.action_withdraw')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowSetTarget(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <View style={[styles.actionGrad, { backgroundColor: Colors.bg.elevated }]}>
                <Text style={styles.actionIcon}>🎯</Text>
                <Text style={styles.actionLabel}>{t('emergency.action_target')}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Why Emergency Fund */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🤔 {t('emergency.why_emergency')}</Text>
            <Text style={styles.infoText}>{t('emergency.why_text')}</Text>
            <View style={styles.infoTargets}>
              {TARGET_TYPES.filter((type) => type.value !== 'custom').map((type) => (
                <View
                  key={type.value}
                  style={[
                    styles.infoTarget,
                    emergencyFund.targetType === type.value && styles.infoTargetActive,
                  ]}
                >
                  <Text style={styles.infoTargetMonths}>{type.label}</Text>
                  <Text style={styles.infoTargetLabel}>{type.sublabel}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Transaction History */}
          {emergencyFund.transactions.length > 0 && (
            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>📜 {t('emergency.history')}</Text>
              {emergencyFund.transactions.slice(0, 10).map((tx) => (
                <View key={tx.id} style={styles.historyRow}>
                  <View
                    style={[
                      styles.historyIcon,
                      {
                        backgroundColor:
                          tx.type === 'contribution' ? Colors.successBg : Colors.dangerBg,
                      },
                    ]}
                  >
                    <Text>{tx.type === 'contribution' ? '↑' : '↓'}</Text>
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyDesc}>
                      {tx.type === 'contribution'
                        ? t('emergency.contribution_label')
                        : t('emergency.withdrawal_label')}
                      {tx.note ? ` · ${tx.note}` : ''}
                    </Text>
                    <Text style={styles.historyDate}>
                      {formatShortDate(tx.date, user.language)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.historyAmount,
                      { color: tx.type === 'contribution' ? Colors.success : Colors.danger },
                    ]}
                  >
                    {tx.type === 'contribution' ? '+' : '-'}
                    {formatCurrency(tx.amount, user.currency)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Set Target Sheet */}
      <BottomSheet
        visible={showSetTarget}
        onClose={() => setShowSetTarget(false)}
        title={t('emergency.set_target')}
        snapPoint={0.8}
      >
        <Text style={styles.sheetLabel}>{t('emergency.target_type')}</Text>
        <View style={styles.targetTypes}>
          {TARGET_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setTargetType(type.value)}
              style={[
                styles.targetTypeBtn,
                targetType === type.value && styles.targetTypeBtnSelected,
              ]}
            >
              <Text
                style={[
                  styles.targetTypeMain,
                  targetType === type.value && { color: Colors.white },
                ]}
              >
                {type.label}
              </Text>
              <Text
                style={[
                  styles.targetTypeSub,
                  targetType === type.value && { color: 'rgba(255,255,255,0.8)' },
                ]}
              >
                {type.sublabel}
              </Text>
              {targetType === type.value && (
                <LinearGradient
                  colors={Colors.gradient.emergency}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {targetType !== 'custom' ? (
          <AmountInput
            label={t('emergency.monthly_expenses')}
            value={monthlyExpenses}
            onChangeText={setMonthlyExpenses}
            currency={user.currency}
          />
        ) : (
          <AmountInput
            label={t('emergency.custom_amount')}
            value={customTarget}
            onChangeText={setCustomTarget}
            currency={user.currency}
          />
        )}

        <AmountInput
          label={t('emergency.planned_monthly')}
          value={monthlyContrib}
          onChangeText={setMonthlyContrib}
          currency={user.currency}
        />

        {targetType !== 'custom' && Number.parseFloat(monthlyExpenses) > 0 && (
          <View style={styles.calcResult}>
            <Text style={styles.calcLabel}>{t('emergency.calculated_target')} :</Text>
            <Text style={styles.calcValue}>
              {formatCurrency(
                Number.parseFloat(monthlyExpenses) *
                  (TARGET_TYPES.find((type) => type.value === targetType)?.multiplier ?? 0),
                user.currency
              )}
            </Text>
          </View>
        )}

        <Button
          title={t('emergency.save_target')}
          onPress={handleSetTarget}
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.md }}
        />
      </BottomSheet>

      {/* Contribute Sheet */}
      <BottomSheet
        visible={showContribute}
        onClose={() => setShowContribute(false)}
        title={t('emergency.add_contribution')}
        snapPoint={0.55}
      >
        <AmountInput
          label={t('emergency.contribution_amount')}
          value={contributionAmount}
          onChangeText={setContributionAmount}
          currency={user.currency}
          large
        />
        <Input
          label={`${t('emergency.contribution_note')} (${t('common.optional')})`}
          value={contributionNote}
          onChangeText={setContributionNote}
          placeholder="Ex: Économie du mois..."
        />
        <Button title={t('common.confirm')} onPress={handleContribute} fullWidth size="lg" />
      </BottomSheet>

      {/* Withdraw Sheet */}
      <BottomSheet
        visible={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        title={t('emergency.withdraw')}
        snapPoint={0.55}
      >
        <View style={styles.withdrawWarning}>
          <Text style={styles.withdrawWarningText}>⚠️ {t('emergency.withdraw_warning')}</Text>
        </View>
        <AmountInput
          label={t('emergency.withdraw_amount')}
          value={withdrawAmount}
          onChangeText={setWithdrawAmount}
          currency={user.currency}
          large
        />
        <Input
          label={t('emergency.withdraw_reason')}
          value={withdrawReason}
          onChangeText={setWithdrawReason}
          placeholder="Ex: Réparation voiture urgente..."
        />
        <Button
          title={t('common.confirm')}
          onPress={handleWithdraw}
          variant="danger"
          fullWidth
          size="lg"
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  container: { flex: 1 },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing['2xl'],
    paddingHorizontal: Spacing.xl,
  },
  headerTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: Typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.base,
  },
  mainCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  goalReached: { alignItems: 'center', paddingVertical: Spacing.md },
  goalReachedIcon: { fontSize: 48, marginBottom: Spacing.sm },
  goalReachedTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  goalReachedDesc: {
    fontSize: Typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  currentLabel: { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  currentAmount: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  targetInfo: { alignItems: 'flex-end' },
  targetAmount: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: 'rgba(255,255,255,0.9)',
  },
  progressBar: { marginBottom: 8 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.8)' },
  body: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  contribInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  contribIcon: { fontSize: 24 },
  contribTitle: { fontSize: Typography.size.xs, color: Colors.text.secondary },
  contribAmount: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.success,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionCard: { flex: 1, borderRadius: Radius.xl, overflow: 'hidden' },
  actionGrad: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xl,
    gap: 4,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.white,
  },
  infoCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  infoTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  infoTargets: { flexDirection: 'row', gap: Spacing.sm },
  infoTarget: {
    flex: 1,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  infoTargetActive: { borderColor: Colors.warning, backgroundColor: Colors.warningBg },
  infoTargetMonths: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  infoTargetLabel: { fontSize: 10, color: Colors.text.tertiary, marginTop: 2 },
  historyCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  historyTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: { flex: 1 },
  historyDesc: {
    fontSize: Typography.size.sm,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
  historyDate: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },
  historyAmount: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold },
  sheetLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.sm,
  },
  targetTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  targetTypeBtn: {
    width: '47%',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
  },
  targetTypeBtnSelected: { borderColor: Colors.warning },
  targetTypeMain: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  targetTypeSub: { fontSize: Typography.size.xs, color: Colors.text.secondary, marginTop: 2 },
  calcResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.warningBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  calcLabel: { fontSize: Typography.size.sm, color: Colors.warning },
  calcValue: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.warning,
  },
  withdrawWarning: {
    backgroundColor: Colors.dangerBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  withdrawWarningText: {
    fontSize: Typography.size.sm,
    color: Colors.danger,
    fontWeight: Typography.weight.medium,
  },
});
