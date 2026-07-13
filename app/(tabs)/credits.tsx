import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmountInput } from '../../src/components/ui/AmountInput';
import { Badge } from '../../src/components/ui/Badge';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { useAppStore } from '../../src/store';
import type { Credit } from '../../src/store/types';
import { Colors } from '../../src/theme/colors';
import { Radius, Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { formatCurrency } from '../../src/utils/currency';
import { formatDate, monthsUntilDate } from '../../src/utils/date';

const CREDIT_TYPE_ICONS: Record<Credit['type'], string> = {
  mortgage: '🏠',
  car_loan: '🚗',
  personal_loan: '👤',
  consumer_credit: '🛒',
  student_loan: '🎓',
  credit_card: '💳',
  other: '📋',
};

const CREDIT_COLORS = [
  Colors.danger,
  Colors.warning,
  Colors.primary,
  Colors.secondary,
  Colors.info,
  Colors.success,
  Colors.accent,
];

export default function CreditsScreen() {
  const { t } = useTranslation();
  const {
    user,
    credits,
    addCredit,
    deleteCredit,
    getTotalIncome,
    getTotalMonthlyPayments,
    getDebtRatio,
  } = useAppStore();

  const [showAddCredit, setShowAddCredit] = useState(false);
  const [showDetail, setShowDetail] = useState<Credit | null>(null);

  const [creditName, setCreditName] = useState('');
  const [creditTotal, setCreditTotal] = useState('');
  const [creditRemaining, setCreditRemaining] = useState('');
  const [creditMonthly, setCreditMonthly] = useState('');
  const [creditRate, setCreditRate] = useState('');
  const [creditBank, setCreditBank] = useState('');
  const [creditType, setCreditType] = useState<Credit['type']>('personal_loan');
  const [creditEndDate, setCreditEndDate] = useState('');
  const [creditColor, setCreditColor] = useState(CREDIT_COLORS[0]);

  const CREDIT_TYPES = useMemo(
    () =>
      (
        [
          'mortgage',
          'car_loan',
          'personal_loan',
          'consumer_credit',
          'student_loan',
          'credit_card',
          'other',
        ] as const
      ).map((value) => ({
        value,
        icon: CREDIT_TYPE_ICONS[value],
        label: `${CREDIT_TYPE_ICONS[value]} ${t(`credits.${value}`)}`,
      })),
    [t]
  );

  const totalDebt = credits.reduce((a, c) => a + c.remainingAmount, 0);
  const totalMonthly = getTotalMonthlyPayments();
  const totalIncome = getTotalIncome();
  const debtRatio = getDebtRatio();

  const latestDebtFreeDate =
    credits.length > 0
      ? credits.reduce((latest, c) => {
          if (!c.endDate) return latest;
          return !latest || new Date(c.endDate) > new Date(latest) ? c.endDate : latest;
        }, '')
      : null;

  const handleAddCredit = async () => {
    const total = Number.parseFloat(creditTotal.replace(/,/g, '.'));
    const remaining = Number.parseFloat(creditRemaining.replace(/,/g, '.'));
    const monthly = Number.parseFloat(creditMonthly.replace(/,/g, '.'));

    if (
      !creditName.trim() ||
      Number.isNaN(total) ||
      Number.isNaN(remaining) ||
      Number.isNaN(monthly)
    ) {
      Alert.alert('', t('common.required'));
      return;
    }
    if (remaining > total) {
      Alert.alert('', t('common.error'));
      return;
    }
    if (
      !creditEndDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(creditEndDate) ||
      new Date(creditEndDate) < new Date()
    ) {
      Alert.alert('', t('common.required'));
      return;
    }

    await addCredit({
      name: creditName.trim(),
      type: creditType,
      totalAmount: total,
      remainingAmount: remaining,
      monthlyPayment: monthly,
      interestRate: Number.parseFloat(creditRate) || 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: creditEndDate,
      bank: creditBank,
      color: creditColor,
    });

    setCreditName('');
    setCreditTotal('');
    setCreditRemaining('');
    setCreditMonthly('');
    setCreditRate('');
    setCreditBank('');
    setCreditEndDate('');
    setShowAddCredit(false);
  };

  const handleDeleteCredit = (credit: Credit) => {
    Alert.alert(t('common.delete'), `${t('common.delete')} "${credit.name}" ?`, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => deleteCredit(credit.id),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient.credits} style={styles.header}>
          <Text style={styles.headerTitle}>💳 {t('credits.title')}</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <View>
                <Text style={styles.summaryLabel}>{t('credits.total_debt')}</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(totalDebt, user.currency)}</Text>
              </View>
              <View style={styles.debtBadge}>
                <Badge
                  label={debtRatio <= 33 ? `${debtRatio}% ✓` : `${debtRatio}% ⚠️`}
                  variant={debtRatio <= 33 ? 'success' : 'danger'}
                  size="md"
                />
                <Text style={styles.debtRatioLabel}>{t('credits.debt_ratio')}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.sumItemLabel}>{t('credits.monthly_payments')}</Text>
                <Text style={styles.sumItemValue}>
                  {formatCurrency(totalMonthly, user.currency)}/{t('common.per_month')}
                </Text>
              </View>
              {latestDebtFreeDate && (
                <View style={styles.summaryItem}>
                  <Text style={styles.sumItemLabel}>{t('credits.debt_free_date')}</Text>
                  <Text style={styles.sumItemValue}>
                    {formatDate(latestDebtFreeDate, user.language)}
                  </Text>
                </View>
              )}
            </View>

            {totalIncome > 0 && (
              <View style={styles.debtProgress}>
                <ProgressBar
                  progress={Math.min(100, (totalMonthly / totalIncome) * 100)}
                  color={debtRatio > 33 ? Colors.danger : Colors.warning}
                  backgroundColor="rgba(255,255,255,0.2)"
                  height={6}
                  animated
                />
                <Text style={styles.debtProgressLabel}>
                  {Math.round((totalMonthly / totalIncome) * 100)}% {t('credits.income_pct')}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Debt Ratio Info */}
          <View
            style={[
              styles.ratioCard,
              { borderColor: debtRatio > 33 ? Colors.danger : Colors.success },
            ]}
          >
            <Text style={styles.ratioIcon}>{debtRatio > 33 ? '⚠️' : '✅'}</Text>
            <View style={styles.ratioInfo}>
              <Text style={styles.ratioTitle}>
                {debtRatio > 33 ? t('credits.critical_ratio') : t('credits.healthy_ratio')}
              </Text>
              <Text style={styles.ratioDesc}>
                {debtRatio > 33
                  ? t('credits.critical_ratio_desc')
                  : t('credits.healthy_ratio_desc')}
              </Text>
            </View>
          </View>

          {/* Add Credit Button */}
          <TouchableOpacity
            onPress={() => setShowAddCredit(true)}
            style={styles.addCreditBtn}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('credits.add_credit')}
          >
            <LinearGradient colors={Colors.gradient.danger} style={styles.addCreditGrad}>
              <Text style={styles.addCreditIcon}>+</Text>
              <Text style={styles.addCreditText}>{t('credits.add_credit')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Credits List */}
          {credits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Text style={styles.emptyTitle}>{t('credits.no_credits')}</Text>
              <Text style={styles.emptyDesc}>{t('credits.no_credits_desc')}</Text>
            </View>
          ) : (
            credits.map((credit) => {
              const progress =
                credit.totalAmount > 0
                  ? ((credit.totalAmount - credit.remainingAmount) / credit.totalAmount) * 100
                  : 0;
              const monthsLeft = credit.endDate ? monthsUntilDate(credit.endDate) : null;
              const typeInfo = CREDIT_TYPES.find((tp) => tp.value === credit.type);

              return (
                <TouchableOpacity
                  key={credit.id}
                  onPress={() => setShowDetail(credit)}
                  onLongPress={() => handleDeleteCredit(credit)}
                  activeOpacity={0.9}
                >
                  <View style={styles.creditCard}>
                    <View style={[styles.creditColorBar, { backgroundColor: credit.color }]} />
                    <View style={styles.creditContent}>
                      <View style={styles.creditTop}>
                        <View style={styles.creditLeft}>
                          <Text style={styles.creditTypeIcon}>{typeInfo?.icon ?? '📋'}</Text>
                          <View>
                            <Text style={styles.creditName}>{credit.name}</Text>
                            {credit.bank && <Text style={styles.creditBank}>{credit.bank}</Text>}
                          </View>
                        </View>
                        <View style={styles.creditRight}>
                          <Text style={styles.creditMonthly}>
                            {formatCurrency(credit.monthlyPayment, user.currency)}/m
                          </Text>
                          {credit.interestRate > 0 && (
                            <Badge label={`${credit.interestRate}%`} variant="warning" />
                          )}
                        </View>
                      </View>

                      <View style={styles.creditAmounts}>
                        <View>
                          <Text style={styles.creditAmountLabel}>
                            {t('credits.remaining_amount')}
                          </Text>
                          <Text style={[styles.creditAmountValue, { color: credit.color }]}>
                            {formatCurrency(credit.remainingAmount, user.currency)}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.creditAmountLabel}>{t('credits.credit_amount')}</Text>
                          <Text style={styles.creditAmountTotal}>
                            {formatCurrency(credit.totalAmount, user.currency)}
                          </Text>
                        </View>
                        {monthsLeft !== null && (
                          <View>
                            <Text style={styles.creditAmountLabel}>{t('credits.duration')}</Text>
                            <Text style={styles.creditAmountTotal}>
                              {monthsLeft} {t('common.months')}
                            </Text>
                          </View>
                        )}
                      </View>

                      <ProgressBar progress={progress} color={credit.color} height={6} animated />
                      <Text style={styles.creditProgressLabel}>
                        {Math.round(progress)}% {t('credits.repaid')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {credits.length > 0 && <Text style={styles.tip}>💡 {t('credits.long_press_tip')}</Text>}

          {/* Payoff Strategy */}
          {credits.length >= 2 && (
            <View style={styles.strategyCard}>
              <Text style={styles.strategyTitle}>📋 {t('credits.payoff_strategies')}</Text>
              <View style={styles.strategyRow}>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyName}>❄️ {t('credits.snowball')}</Text>
                  <Text style={styles.strategyDesc}>{t('credits.snowball_desc')}</Text>
                </View>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyName}>🌊 {t('credits.avalanche')}</Text>
                  <Text style={styles.strategyDesc}>{t('credits.avalanche_desc')}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Credit Sheet */}
      <BottomSheet
        visible={showAddCredit}
        onClose={() => setShowAddCredit(false)}
        title={t('credits.add_credit')}
        snapPoint={0.92}
      >
        <Input
          label={`${t('credits.credit_name')} *`}
          value={creditName}
          onChangeText={setCreditName}
          placeholder={t('credits.credit_name_placeholder')}
        />

        <Text style={styles.formLabel}>{t('credits.credit_type')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
          {CREDIT_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setCreditType(type.value)}
              style={[styles.typeChip, creditType === type.value && styles.typeChipSelected]}
            >
              <Text
                style={[styles.typeChipText, creditType === type.value && { color: Colors.white }]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <AmountInput
          label={`${t('credits.credit_amount')} *`}
          value={creditTotal}
          onChangeText={setCreditTotal}
          currency={user.currency}
        />
        <AmountInput
          label={`${t('credits.remaining_amount')} *`}
          value={creditRemaining}
          onChangeText={setCreditRemaining}
          currency={user.currency}
        />
        <AmountInput
          label={`${t('credits.monthly_payment')} *`}
          value={creditMonthly}
          onChangeText={setCreditMonthly}
          currency={user.currency}
        />
        <Input
          label={t('credits.interest_rate')}
          value={creditRate}
          onChangeText={setCreditRate}
          placeholder="Ex: 5.5"
          keyboardType="decimal-pad"
        />
        <Input
          label={t('credits.bank')}
          value={creditBank}
          onChangeText={setCreditBank}
          placeholder="Ex: CIH Bank"
        />
        <Input
          label={t('credits.end_date')}
          value={creditEndDate}
          onChangeText={setCreditEndDate}
          placeholder="2027-12-31"
        />

        <Text style={styles.formLabel}>{t('salary.category_color')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
          {CREDIT_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setCreditColor(color)}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                creditColor === color && styles.colorDotSelected,
              ]}
            />
          ))}
        </ScrollView>

        <Button
          title={t('common.add')}
          onPress={handleAddCredit}
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.md }}
        />
      </BottomSheet>

      {/* Credit Detail Sheet */}
      {showDetail && (
        <BottomSheet
          visible={!!showDetail}
          onClose={() => setShowDetail(null)}
          title={showDetail.name}
          snapPoint={0.6}
        >
          <View style={styles.detailGrid}>
            {[
              {
                label: t('credits.credit_amount'),
                value: formatCurrency(showDetail.totalAmount, user.currency),
              },
              {
                label: t('credits.remaining_amount'),
                value: formatCurrency(showDetail.remainingAmount, user.currency),
              },
              {
                label: t('credits.monthly_payment'),
                value: `${formatCurrency(showDetail.monthlyPayment, user.currency)}/${t('common.months')}`,
              },
              {
                label: t('credits.rate'),
                value: showDetail.interestRate > 0 ? `${showDetail.interestRate}%` : 'N/A',
              },
              { label: t('credits.bank'), value: showDetail.bank || 'N/A' },
              {
                label: t('credits.end_date'),
                value: showDetail.endDate ? formatDate(showDetail.endDate, user.language) : 'N/A',
              },
            ].map((item) => (
              <View key={item.label} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          <ProgressBar
            progress={
              showDetail.totalAmount > 0
                ? ((showDetail.totalAmount - showDetail.remainingAmount) / showDetail.totalAmount) *
                  100
                : 0
            }
            color={showDetail.color}
            label={t('credits.repaid')}
            showLabel
            height={10}
            animated
            style={{ marginTop: Spacing.lg }}
          />
          <Button
            title={t('common.delete')}
            onPress={() => {
              handleDeleteCredit(showDetail);
              setShowDetail(null);
            }}
            variant="danger"
            fullWidth
            style={{ marginTop: Spacing.xl }}
          />
        </BottomSheet>
      )}
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
    marginBottom: Spacing.base,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    fontSize: Typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  debtBadge: { alignItems: 'flex-end' },
  debtRatioLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  summaryRow: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.md },
  summaryItem: {},
  sumItemLabel: { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.7)' },
  sumItemValue: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.white,
    marginTop: 2,
  },
  debtProgress: {},
  debtProgressLabel: {
    fontSize: Typography.size.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    textAlign: 'right',
  },
  body: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  ratioCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  ratioIcon: { fontSize: 24 },
  ratioInfo: { flex: 1 },
  ratioTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  ratioDesc: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginTop: 2,
  },
  addCreditBtn: { marginBottom: Spacing.lg, borderRadius: Radius.lg, overflow: 'hidden' },
  addCreditGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  addCreditIcon: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: Typography.weight.bold,
  },
  addCreditText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.white,
  },
  emptyState: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  emptyDesc: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  creditCard: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  creditColorBar: { width: 4 },
  creditContent: { flex: 1, padding: Spacing.base },
  creditTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  creditLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  creditTypeIcon: { fontSize: 28 },
  creditName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  creditBank: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },
  creditRight: { alignItems: 'flex-end', gap: 4 },
  creditMonthly: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.danger,
  },
  creditAmounts: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.md },
  creditAmountLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary },
  creditAmountValue: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    marginTop: 2,
  },
  creditAmountTotal: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  creditProgressLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    marginTop: 6,
    textAlign: 'right',
  },
  tip: {
    textAlign: 'center',
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    marginTop: Spacing.sm,
  },
  strategyCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  strategyTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  strategyRow: { flexDirection: 'row', gap: Spacing.md },
  strategyItem: {
    flex: 1,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  strategyName: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  strategyDesc: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  formLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.sm,
  },
  typeScroll: { marginBottom: Spacing.md },
  typeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg.elevated,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  typeChipSelected: { backgroundColor: Colors.danger, borderColor: Colors.danger },
  typeChipText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.secondary,
  },
  colorScroll: { marginBottom: Spacing.base },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorDotSelected: { borderWidth: 3, borderColor: Colors.white },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  detailItem: {
    width: '46%',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  detailLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginBottom: 4 },
  detailValue: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
});
