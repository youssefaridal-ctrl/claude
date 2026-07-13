import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addTransaction } from '../../src/application/salary/add-transaction.usecase';
import { AmountInput } from '../../src/components/ui/AmountInput';
import { Badge } from '../../src/components/ui/Badge';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { Button } from '../../src/components/ui/Button';
import { DonutChart } from '../../src/components/ui/DonutChart';
import { Input } from '../../src/components/ui/Input';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { useAppStore } from '../../src/store';
import { Colors } from '../../src/theme/colors';
import { Radius, Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { formatCurrency } from '../../src/utils/currency';
import { formatShortDate, getCurrentMonth, getGreeting } from '../../src/utils/date';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const {
    user,
    categories,
    transactions,
    emergencyFund,
    getTotalIncome,
    getTotalMonthlyPayments,
    getBudgetHealth,
    getDebtRatio,
    getCurrentMonthSpentByCategory,
  } = useAppStore();

  const [showAddTx, setShowAddTx] = useState(false);
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState(categories[0]?.id ?? '');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [tipIndex] = useState(() => Math.floor(Math.random() * 3));

  const tips = useMemo(
    () => [t('dashboard.tip_50_30_20'), t('dashboard.tip_emergency'), t('dashboard.tip_debt')],
    [t],
  );

  const totalIncome = getTotalIncome();
  const monthlyPayments = getTotalMonthlyPayments();
  const health = getBudgetHealth();
  const debtRatio = getDebtRatio();
  const currentMonth = getCurrentMonth();
  const monthTransactions = transactions.filter((tx) => tx.month === currentMonth);
  const spentByCategory = getCurrentMonthSpentByCategory();

  const totalSpent = monthTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((a, tx) => a + tx.amount, 0);
  const remaining = totalIncome - totalSpent - monthlyPayments;

  const healthLabel =
    health >= 70
      ? t('dashboard.excellent')
      : health >= 40
        ? t('dashboard.good')
        : health >= 20
          ? t('dashboard.average')
          : t('dashboard.critical');

  const healthVariant: 'success' | 'info' | 'warning' | 'danger' =
    health >= 70 ? 'success' : health >= 40 ? 'info' : health >= 20 ? 'warning' : 'danger';

  const healthColor =
    health >= 70
      ? Colors.success
      : health >= 40
        ? Colors.info
        : health >= 20
          ? Colors.warning
          : Colors.danger;

  const healthDesc =
    health >= 70
      ? t('dashboard.health_excellent_desc')
      : health >= 40
        ? t('dashboard.health_good_desc')
        : health >= 20
          ? t('dashboard.health_average_desc')
          : t('dashboard.health_critical_desc');

  const donutSegments = categories
    .filter((c) => c.amount > 0)
    .map((c) => ({ value: c.amount, color: c.color, label: c.name }));

  const handleAddTransaction = useCallback(async () => {
    const amount = Number.parseFloat(txAmount.replace(',', '.'));
    if (!txDesc.trim() || !amount || amount <= 0) {
      Alert.alert('', t('common.required'));
      return;
    }
    const result = await addTransaction({
      description: txDesc,
      amount,
      categoryId: txCategory,
      date: new Date().toISOString().slice(0, 10),
      type: txType,
    });
    if (!result.ok) {
      Alert.alert(t('common.error'), result.error.message);
      return;
    }
    setShowAddTx(false);
    setTxDesc('');
    setTxAmount('');
  }, [txAmount, txDesc, txCategory, txType, t]);

  const recentTxs = monthTransactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient.dashboard} style={styles.heroGrad}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting(user.language)}, {user.name || 'vous'}
              </Text>
              <Text style={styles.headerSub}>{t('dashboard.overview_sub')}</Text>
            </View>
            <View style={styles.healthBadge}>
              <Badge label={healthLabel} variant={healthVariant} size="md" />
            </View>
          </View>

          {/* Main Balance Card */}
          <LinearGradient
            colors={Colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <Text style={styles.balanceLabel}>{t('dashboard.net_salary')}</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(totalIncome, user.currency)}</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>{t('dashboard.total_spent')}</Text>
                <Text style={styles.balanceItemValue}>
                  {formatCurrency(totalSpent, user.currency)}
                </Text>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>{t('dashboard.monthly_credits')}</Text>
                <Text style={styles.balanceItemValue}>
                  {formatCurrency(monthlyPayments, user.currency)}
                </Text>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>{t('dashboard.remaining')}</Text>
                <Text
                  style={[
                    styles.balanceItemValue,
                    { color: remaining >= 0 ? Colors.successLight : Colors.dangerLight },
                  ]}
                >
                  {formatCurrency(remaining, user.currency)}
                </Text>
              </View>
            </View>
            <View style={styles.budgetProgress}>
              <ProgressBar
                progress={totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0}
                color="rgba(255,255,255,0.9)"
                backgroundColor="rgba(255,255,255,0.2)"
                height={6}
                animated
              />
              <Text style={styles.budgetProgressLabel}>
                {totalIncome > 0 ? Math.round((totalSpent / totalIncome) * 100) : 0}%{' '}
                {t('dashboard.budget_used')}
              </Text>
            </View>
          </LinearGradient>
        </LinearGradient>

        <View style={styles.body}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                setTxType('expense');
                setShowAddTx(true);
              }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t('dashboard.add_expense')}
            >
              <LinearGradient colors={Colors.gradient.danger} style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>➖</Text>
              </LinearGradient>
              <Text style={styles.actionLabel}>{t('dashboard.add_expense')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                setTxType('income');
                setShowAddTx(true);
              }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t('dashboard.add_income')}
            >
              <LinearGradient colors={Colors.gradient.success} style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>➕</Text>
              </LinearGradient>
              <Text style={styles.actionLabel}>{t('dashboard.add_income')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.bg.elevated }]}>
                <Text style={styles.actionEmoji}>📈</Text>
              </View>
              <Text style={styles.actionLabel}>{t('dashboard.view_stats')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.bg.elevated }]}>
                <Text style={styles.actionEmoji}>⚙️</Text>
              </View>
              <Text style={styles.actionLabel}>{t('settings.title')}</Text>
            </TouchableOpacity>
          </View>

          {/* Budget Health */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{t('dashboard.budget_health')}</Text>
            <View style={styles.healthRow}>
              <View style={styles.healthInfo}>
                <Text style={[styles.healthScore, { color: healthColor }]}>{health}%</Text>
                <Text style={styles.healthDesc}>{healthDesc}</Text>
              </View>
              <View>
                <DonutChart
                  segments={donutSegments.slice(0, 5)}
                  size={100}
                  strokeWidth={18}
                  centerLabel={`${Math.round((totalSpent / (totalIncome || 1)) * 100)}%`}
                  centerSubLabel={t('dashboard.budget_used')}
                />
              </View>
            </View>
            {debtRatio > 0 && (
              <View style={styles.debtRow}>
                <Text style={styles.debtLabel}>{t('credits.debt_ratio')}</Text>
                <Badge label={`${debtRatio}%`} variant={debtRatio > 33 ? 'danger' : 'success'} />
              </View>
            )}
          </View>

          {/* Category Overview */}
          {categories.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('dashboard.spending_breakdown')}</Text>
              {categories.slice(0, 5).map((cat) => {
                const spent = spentByCategory[cat.id] ?? 0;
                const progress = cat.amount > 0 ? (spent / cat.amount) * 100 : 0;
                return (
                  <View key={cat.id} style={styles.catRow}>
                    <View style={styles.catLeft}>
                      <Text style={styles.catIcon}>{cat.icon}</Text>
                      <View>
                        <Text style={styles.catName}>{cat.name}</Text>
                        <Text style={styles.catSub}>
                          {formatCurrency(spent, user.currency)} /{' '}
                          {formatCurrency(cat.amount, user.currency)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.catRight}>
                      <Text
                        style={[
                          styles.catPct,
                          { color: progress > 100 ? Colors.danger : Colors.text.secondary },
                        ]}
                      >
                        {Math.round(progress)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Emergency Fund */}
          {emergencyFund.targetAmount > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>🛡️ {t('dashboard.emergency_fund')}</Text>
                <Badge
                  label={`${Math.round((emergencyFund.currentAmount / emergencyFund.targetAmount) * 100)}%`}
                  variant="warning"
                />
              </View>
              <ProgressBar
                progress={(emergencyFund.currentAmount / emergencyFund.targetAmount) * 100}
                color={Colors.warning}
                height={8}
                animated
              />
              <Text style={styles.efText}>
                {formatCurrency(emergencyFund.currentAmount, user.currency)} /{' '}
                {formatCurrency(emergencyFund.targetAmount, user.currency)}
              </Text>
            </View>
          )}

          {/* Recent Transactions */}
          <View style={styles.sectionCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>{t('dashboard.recent_transactions')}</Text>
            </View>
            {recentTxs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyText}>{t('dashboard.no_transactions')}</Text>
                <Text style={styles.emptySub}>{t('dashboard.start_tracking')}</Text>
              </View>
            ) : (
              recentTxs.map((tx) => {
                const cat = categories.find((c) => c.id === tx.categoryId);
                return (
                  <View key={tx.id} style={styles.txRow}>
                    <View
                      style={[
                        styles.txIcon,
                        { backgroundColor: `${cat?.color ?? Colors.bg.elevated}20` },
                      ]}
                    >
                      <Text style={styles.txEmoji}>{cat?.icon ?? '💸'}</Text>
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txDesc}>{tx.description}</Text>
                      <Text style={styles.txDate}>{formatShortDate(tx.date, user.language)}</Text>
                    </View>
                    <Text
                      style={[
                        styles.txAmount,
                        { color: tx.type === 'expense' ? Colors.danger : Colors.success },
                      ]}
                    >
                      {tx.type === 'expense' ? '-' : '+'}
                      {formatCurrency(tx.amount, user.currency)}
                    </Text>
                  </View>
                );
              })
            )}
          </View>

          {/* Tip */}
          <LinearGradient
            colors={['rgba(99,102,241,0.15)', 'rgba(139,92,246,0.1)']}
            style={styles.tipCard}
          >
            <Text style={styles.tipTitle}>💡 {t('dashboard.tips_title')}</Text>
            <Text style={styles.tipText}>{tips[tipIndex]}</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Add Transaction Sheet */}
      <BottomSheet
        visible={showAddTx}
        onClose={() => setShowAddTx(false)}
        title={
          txType === 'expense'
            ? t('dashboard.add_expense_title')
            : t('dashboard.add_income_title')
        }
        snapPoint={0.75}
      >
        <View style={styles.txTypeRow}>
          {(['expense', 'income'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setTxType(type)}
              style={[
                styles.txTypeBtn,
                txType === type && {
                  backgroundColor: type === 'expense' ? Colors.dangerBg : Colors.successBg,
                  borderColor: type === 'expense' ? Colors.danger : Colors.success,
                },
              ]}
            >
              <Text
                style={[
                  styles.txTypeTxt,
                  txType === type && {
                    color: type === 'expense' ? Colors.danger : Colors.success,
                  },
                ]}
              >
                {type === 'expense'
                  ? `➖ ${t('salary.type_expense')}`
                  : `➕ ${t('salary.type_income')}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AmountInput
          label={t('salary.transaction_amount')}
          value={txAmount}
          onChangeText={setTxAmount}
          currency={user.currency}
          large
        />

        <Input
          label={t('salary.transaction_name')}
          value={txDesc}
          onChangeText={setTxDesc}
          placeholder="Ex: Loyer, Supermarché..."
        />

        <Text style={styles.catSelectLabel}>{t('salary.transaction_category')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catSelect}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setTxCategory(cat.id)}
              style={[
                styles.catChip,
                txCategory === cat.id && { backgroundColor: cat.color, borderColor: cat.color },
              ]}
            >
              <Text style={styles.catChipIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.catChipLabel,
                  txCategory === cat.id && { color: Colors.white },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Button
          title={t('common.add')}
          onPress={handleAddTransaction}
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.xl }}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  container: { flex: 1 },
  heroGrad: { paddingBottom: Spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  headerSub: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  healthBadge: {},
  balanceCard: {
    marginHorizontal: Spacing.xl,
    borderRadius: Radius['2xl'],
    padding: Spacing.xl,
  },
  balanceLabel: {
    fontSize: Typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: Typography.weight.medium,
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: Typography.size['4xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
  },
  balanceItem: { flex: 1, alignItems: 'center' },
  balanceItemLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 4,
  },
  balanceItemValue: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.white,
    textAlign: 'center',
  },
  balanceDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  budgetProgress: { marginTop: Spacing.sm },
  budgetProgressLabel: {
    fontSize: Typography.size.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    textAlign: 'right',
  },
  body: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  actionBtn: { alignItems: 'center', flex: 1 },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  actionEmoji: { fontSize: 22 },
  actionLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  sectionCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  sectionTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  healthInfo: { flex: 1, paddingRight: Spacing.md },
  healthScore: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    marginBottom: 4,
  },
  healthDesc: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  debtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  debtLabel: { fontSize: Typography.size.sm, color: Colors.text.secondary },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  catIcon: { fontSize: 20, width: 30, textAlign: 'center' },
  catName: {
    fontSize: Typography.size.sm,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
  catSub: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 1 },
  catRight: { alignItems: 'flex-end' },
  catPct: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold },
  efText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'right',
  },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyIcon: { fontSize: 40, marginBottom: Spacing.md },
  emptyText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  emptySub: { fontSize: Typography.size.sm, color: Colors.text.tertiary, marginTop: 4 },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txEmoji: { fontSize: 18 },
  txInfo: { flex: 1 },
  txDesc: {
    fontSize: Typography.size.sm,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
  txDate: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },
  txAmount: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold },
  tipCard: {
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.accent,
  },
  tipTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.primaryLight,
    marginBottom: 6,
  },
  tipText: { fontSize: Typography.size.sm, color: Colors.text.secondary, lineHeight: 20 },
  txTypeRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  txTypeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  txTypeTxt: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
  },
  catSelectLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.sm,
  },
  catSelect: { marginBottom: Spacing.base },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
    marginRight: Spacing.sm,
  },
  catChipIcon: { fontSize: 16 },
  catChipLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: Colors.text.secondary,
  },
});
