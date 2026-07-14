import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
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
import type { Goal, GoalPriority, GoalType } from '../../src/store/types';
import { Colors } from '../../src/theme/colors';
import { Radius, Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { formatCurrency } from '../../src/utils/currency';
import { formatDate, monthsUntilDate } from '../../src/utils/date';

export default function GoalsScreen() {
  const { t } = useTranslation();
  const { user, goals, addGoal, deleteGoal, addGoalContribution } = useAppStore();

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showDetail, setShowDetail] = useState<Goal | null>(null);
  const [showContribute, setShowContribute] = useState<Goal | null>(null);

  const [goalName, setGoalName] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('other');
  const [goalPriority, setGoalPriority] = useState<GoalPriority>('medium');
  const [contribAmount, setContribAmount] = useState('');

  const GOAL_TYPES = useMemo(
    () => [
      {
        value: 'travel' as GoalType,
        label: t('goals.goal_types.travel'),
        icon: '✈️',
        color: Colors.accent,
      },
      {
        value: 'car' as GoalType,
        label: t('goals.goal_types.car'),
        icon: '🚗',
        color: Colors.primary,
      },
      {
        value: 'home' as GoalType,
        label: t('goals.goal_types.home'),
        icon: '🏠',
        color: Colors.info,
      },
      {
        value: 'education' as GoalType,
        label: t('goals.goal_types.education'),
        icon: '🎓',
        color: Colors.secondary,
      },
      {
        value: 'wedding' as GoalType,
        label: t('goals.goal_types.wedding'),
        icon: '💍',
        color: Colors.danger,
      },
      {
        value: 'gadget' as GoalType,
        label: t('goals.goal_types.gadget'),
        icon: '📱',
        color: Colors.warning,
      },
      {
        value: 'business' as GoalType,
        label: t('goals.goal_types.business'),
        icon: '💼',
        color: Colors.success,
      },
      {
        value: 'retirement' as GoalType,
        label: t('goals.goal_types.retirement'),
        icon: '🌴',
        color: Colors.successLight,
      },
      {
        value: 'emergency' as GoalType,
        label: t('goals.goal_types.emergency'),
        icon: '🛡️',
        color: Colors.warningLight,
      },
      {
        value: 'other' as GoalType,
        label: t('goals.goal_types.other'),
        icon: '🎯',
        color: Colors.text.secondary,
      },
    ],
    [t]
  );

  const PRIORITIES = useMemo(
    () => [
      { value: 'high' as GoalPriority, label: t('goals.high'), color: Colors.danger },
      { value: 'medium' as GoalPriority, label: t('goals.medium'), color: Colors.warning },
      { value: 'low' as GoalPriority, label: t('goals.low'), color: Colors.success },
    ],
    [t]
  );

  const totalSaved = goals.reduce((a, g) => a + g.currentAmount, 0);
  const totalTargets = goals.reduce((a, g) => a + g.targetAmount, 0);
  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

  const getGoalStatus = (
    goal: Goal
  ): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' } => {
    const progress = goal.currentAmount / goal.targetAmount;
    if (progress >= 1) return { label: `✅ ${t('goals.completed')}`, variant: 'success' };
    if (!goal.targetDate) return { label: `⏳ ${t('goals.in_progress')}`, variant: 'info' };
    const monthsLeft = monthsUntilDate(goal.targetDate);
    const onTrack = monthsLeft >= 0;
    if (onTrack) return { label: `✓ ${t('goals.on_track')}`, variant: 'success' };
    return { label: `⚠️ ${t('goals.behind')}`, variant: 'warning' };
  };

  const handleAddGoal = useCallback(async () => {
    const target = Number.parseFloat(goalTarget.replace(/,/g, '.'));
    if (!goalName.trim() || Number.isNaN(target) || target <= 0) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }
    const typeInfo = GOAL_TYPES.find((type) => type.value === goalType);
    await addGoal({
      name: goalName.trim(),
      description: goalDesc,
      type: goalType,
      targetAmount: target,
      currentAmount: Number.parseFloat(goalCurrent.replace(/,/g, '.')) || 0,
      targetDate: goalDate,
      priority: goalPriority,
      color: typeInfo?.color ?? Colors.primary,
      icon: typeInfo?.icon ?? '🎯',
    });
    setGoalName('');
    setGoalDesc('');
    setGoalTarget('');
    setGoalCurrent('');
    setGoalDate('');
    setShowAddGoal(false);
  }, [
    goalName,
    goalDesc,
    goalTarget,
    goalCurrent,
    goalDate,
    goalType,
    goalPriority,
    t,
    GOAL_TYPES,
    addGoal,
  ]);

  const handleDeleteGoal = useCallback(
    (goal: Goal) => {
      Alert.alert(t('common.delete'), `${t('common.delete')} "${goal.name}" ?`, [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteGoal(goal.id);
            setShowDetail(null);
          },
        },
      ]);
    },
    [t, deleteGoal]
  );

  const handleContribute = useCallback(async () => {
    if (!showContribute) return;
    const amount = Number.parseFloat(contribAmount.replace(/,/g, '.'));
    if (Number.isNaN(amount) || amount <= 0) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }
    await addGoalContribution(showContribute.id, amount);
    setContribAmount('');
    setShowContribute(null);
  }, [showContribute, contribAmount, t, addGoalContribution]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient.goals} style={styles.header}>
          <Text style={styles.headerTitle}>🎯 {t('goals.title')}</Text>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.sumItem}>
                <Text style={styles.sumLabel}>{t('goals.total_saved')}</Text>
                <Text style={styles.sumValue}>{formatCurrency(totalSaved, user.currency)}</Text>
              </View>
              <View style={styles.sumDivider} />
              <View style={styles.sumItem}>
                <Text style={styles.sumLabel}>{t('goals.total_targets')}</Text>
                <Text style={styles.sumValue}>{formatCurrency(totalTargets, user.currency)}</Text>
              </View>
              <View style={styles.sumDivider} />
              <View style={styles.sumItem}>
                <Text style={styles.sumLabel}>{t('goals.achieved')}</Text>
                <Text style={[styles.sumValue, { color: Colors.successLight }]}>
                  {completedGoals}/{goals.length}
                </Text>
              </View>
            </View>
            {totalTargets > 0 && (
              <View style={styles.globalProgress}>
                <ProgressBar
                  progress={(totalSaved / totalTargets) * 100}
                  color="rgba(255,255,255,0.9)"
                  backgroundColor="rgba(255,255,255,0.2)"
                  height={6}
                  animated
                />
                <Text style={styles.globalProgressLabel}>
                  {Math.round((totalSaved / totalTargets) * 100)}% {t('goals.of_goal')}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Add Goal Button */}
          <TouchableOpacity
            onPress={() => setShowAddGoal(true)}
            style={styles.addBtn}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <LinearGradient colors={Colors.gradient.goals} style={styles.addBtnGrad}>
              <Text style={styles.addBtnIcon}>✨</Text>
              <Text style={styles.addBtnText}>{t('goals.add_goal')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Goals List */}
          {goals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>{t('goals.no_goals')}</Text>
              <Text style={styles.emptyDesc}>{t('goals.no_goals_desc')}</Text>
            </View>
          ) : (
            <>
              {/* Active Goals */}
              {goals.filter((g) => g.currentAmount < g.targetAmount).length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>{t('goals.in_progress')}</Text>
                  {goals
                    .filter((g) => g.currentAmount < g.targetAmount)
                    .sort((a, b) => {
                      const order = { high: 0, medium: 1, low: 2 };
                      return order[a.priority] - order[b.priority];
                    })
                    .map((goal) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      const monthsLeft = goal.targetDate ? monthsUntilDate(goal.targetDate) : null;
                      const status = getGoalStatus(goal);
                      const monthlyNeeded =
                        monthsLeft && monthsLeft > 0
                          ? (goal.targetAmount - goal.currentAmount) / monthsLeft
                          : null;

                      return (
                        <TouchableOpacity
                          key={goal.id}
                          onPress={() => setShowDetail(goal)}
                          activeOpacity={0.9}
                        >
                          <View style={styles.goalCard}>
                            <View style={[styles.goalColorBar, { backgroundColor: goal.color }]} />
                            <View style={styles.goalContent}>
                              <View style={styles.goalTop}>
                                <View style={styles.goalLeft}>
                                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                                  <View style={styles.goalTitleArea}>
                                    <Text style={styles.goalName}>{goal.name}</Text>
                                    <Badge
                                      label={
                                        PRIORITIES.find((p) => p.value === goal.priority)?.label ??
                                        ''
                                      }
                                      variant={
                                        goal.priority === 'high'
                                          ? 'danger'
                                          : goal.priority === 'medium'
                                            ? 'warning'
                                            : 'success'
                                      }
                                    />
                                  </View>
                                </View>
                                <Badge label={status.label} variant={status.variant} />
                              </View>

                              <View style={styles.goalAmounts}>
                                <View>
                                  <Text style={styles.goalAmountLabel}>
                                    {t('goals.current_savings')}
                                  </Text>
                                  <Text style={[styles.goalAmountValue, { color: goal.color }]}>
                                    {formatCurrency(goal.currentAmount, user.currency)}
                                  </Text>
                                </View>
                                <View>
                                  <Text style={styles.goalAmountLabel}>
                                    {t('goals.target_amount')}
                                  </Text>
                                  <Text style={styles.goalAmountTotal}>
                                    {formatCurrency(goal.targetAmount, user.currency)}
                                  </Text>
                                </View>
                                {monthlyNeeded && (
                                  <View>
                                    <Text style={styles.goalAmountLabel}>
                                      {t('common.per_month')}
                                    </Text>
                                    <Text style={styles.goalAmountTotal}>
                                      {formatCurrency(monthlyNeeded, user.currency)}
                                    </Text>
                                  </View>
                                )}
                              </View>

                              <ProgressBar
                                progress={progress}
                                color={goal.color}
                                height={8}
                                animated
                              />
                              <View style={styles.goalFooter}>
                                <Text style={styles.goalProgress}>{Math.round(progress)}%</Text>
                                {monthsLeft !== null && (
                                  <Text style={styles.goalTimeLeft}>
                                    {monthsLeft} {t('goals.months_left')}
                                  </Text>
                                )}
                                <TouchableOpacity
                                  onPress={() => setShowContribute(goal)}
                                  style={[
                                    styles.contributeBtn,
                                    {
                                      backgroundColor: `${goal.color}22`,
                                      borderColor: goal.color,
                                    },
                                  ]}
                                >
                                  <Text style={[styles.contributeBtnText, { color: goal.color }]}>
                                    {t('goals.add_contribution')}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </>
              )}

              {/* Completed Goals */}
              {goals.filter((g) => g.currentAmount >= g.targetAmount).length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
                    🏆 {t('goals.achieved')}
                  </Text>
                  {goals
                    .filter((g) => g.currentAmount >= g.targetAmount)
                    .map((goal) => (
                      <View key={goal.id} style={[styles.goalCard, styles.goalCardCompleted]}>
                        <View style={[styles.goalColorBar, { backgroundColor: Colors.success }]} />
                        <View style={styles.goalContent}>
                          <View style={styles.goalTop}>
                            <View style={styles.goalLeft}>
                              <Text style={styles.goalIcon}>{goal.icon}</Text>
                              <Text style={styles.goalName}>{goal.name}</Text>
                            </View>
                            <Badge label={`✅ ${t('goals.completed')}`} variant="success" />
                          </View>
                          <Text style={styles.completedAmount}>
                            {formatCurrency(goal.currentAmount, user.currency)} /{' '}
                            {formatCurrency(goal.targetAmount, user.currency)}
                          </Text>
                        </View>
                      </View>
                    ))}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Add Goal Sheet */}
      <BottomSheet
        visible={showAddGoal}
        onClose={() => setShowAddGoal(false)}
        title={t('goals.add_goal')}
        snapPoint={0.95}
      >
        <Input
          label={`${t('goals.goal_name')} *`}
          value={goalName}
          onChangeText={setGoalName}
          placeholder={t('goals.goal_name_placeholder')}
        />

        <Text style={styles.formLabel}>{t('goals.goal_type')}</Text>
        <View style={styles.typeGrid}>
          {GOAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setGoalType(type.value)}
              style={[
                styles.typeBtn,
                goalType === type.value && {
                  borderColor: type.color,
                  backgroundColor: `${type.color}18`,
                },
              ]}
            >
              <Text style={styles.typeBtnIcon}>{type.icon}</Text>
              <Text style={[styles.typeBtnLabel, goalType === type.value && { color: type.color }]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AmountInput
          label={`${t('goals.target_amount')} *`}
          value={goalTarget}
          onChangeText={setGoalTarget}
          currency={user.currency}
          large
        />
        <AmountInput
          label={t('goals.current_amount')}
          value={goalCurrent}
          onChangeText={setGoalCurrent}
          currency={user.currency}
        />
        <Input
          label={t('goals.target_date')}
          value={goalDate}
          onChangeText={setGoalDate}
          placeholder="2025-12-31"
        />

        <Text style={styles.formLabel}>{t('goals.priority')}</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p.value}
              onPress={() => setGoalPriority(p.value)}
              style={[
                styles.priorityBtn,
                goalPriority === p.value && {
                  backgroundColor: `${p.color}22`,
                  borderColor: p.color,
                },
              ]}
            >
              <Text style={[styles.priorityLabel, goalPriority === p.value && { color: p.color }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label={`${t('goals.goal_description')} (${t('common.optional')})`}
          value={goalDesc}
          onChangeText={setGoalDesc}
          placeholder={t('goals.goal_description_placeholder')}
          multiline
          numberOfLines={2}
        />

        <Button
          title={t('goals.add_goal')}
          onPress={handleAddGoal}
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.sm }}
        />
      </BottomSheet>

      {/* Goal Detail Sheet */}
      {showDetail && (
        <BottomSheet
          visible={!!showDetail}
          onClose={() => setShowDetail(null)}
          title={showDetail.name}
          snapPoint={0.65}
        >
          <View style={styles.detailHeader}>
            <Text style={styles.detailIcon}>{showDetail.icon}</Text>
            <View>
              <Badge
                label={GOAL_TYPES.find((type) => type.value === showDetail.type)?.label ?? ''}
                variant="primary"
              />
            </View>
          </View>

          {showDetail.description && (
            <Text style={styles.detailDesc}>{showDetail.description}</Text>
          )}

          <View style={styles.detailGrid}>
            {[
              {
                label: t('goals.current_savings'),
                value: formatCurrency(showDetail.currentAmount, user.currency),
              },
              {
                label: t('goals.target_amount'),
                value: formatCurrency(showDetail.targetAmount, user.currency),
              },
              {
                label: t('salary.remaining'),
                value: formatCurrency(
                  Math.max(0, showDetail.targetAmount - showDetail.currentAmount),
                  user.currency
                ),
              },
              {
                label: t('goals.progress'),
                value: `${showDetail.targetAmount > 0 ? Math.round((showDetail.currentAmount / showDetail.targetAmount) * 100) : 0}%`,
              },
              ...(showDetail.targetDate
                ? [
                    {
                      label: t('goals.target_date'),
                      value: formatDate(showDetail.targetDate, user.language),
                    },
                    {
                      label: t('goals.months_left'),
                      value: `${monthsUntilDate(showDetail.targetDate)} ${t('common.months')}`,
                    },
                  ]
                : []),
            ].map((item) => (
              <View key={item.label} style={styles.detailItem}>
                <Text style={styles.detailItemLabel}>{item.label}</Text>
                <Text style={styles.detailItemValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.detailActions}>
            <Button
              title={t('goals.add_contribution')}
              onPress={() => {
                setShowDetail(null);
                setShowContribute(showDetail);
              }}
              style={{ flex: 1 }}
            />
            <Button
              title={t('common.delete')}
              onPress={() => handleDeleteGoal(showDetail)}
              variant="danger"
              style={{ flex: 1 }}
            />
          </View>
        </BottomSheet>
      )}

      {/* Contribute Sheet */}
      {showContribute && (
        <BottomSheet
          visible={!!showContribute}
          onClose={() => setShowContribute(null)}
          title={`${t('goals.add_contribution')} "${showContribute.name}"`}
          snapPoint={0.45}
        >
          <AmountInput
            label={t('goals.contribution_amount')}
            value={contribAmount}
            onChangeText={setContribAmount}
            currency={user.currency}
            large
          />
          <Button title={t('common.confirm')} onPress={handleContribute} fullWidth size="lg" />
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
  summaryRow: { flexDirection: 'row', marginBottom: Spacing.md },
  sumItem: { flex: 1, alignItems: 'center' },
  sumLabel: { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.7)' },
  sumValue: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
    marginTop: 4,
  },
  sumDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  globalProgress: {},
  globalProgressLabel: {
    fontSize: Typography.size.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    textAlign: 'right',
  },
  body: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  addBtn: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  addBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  addBtnIcon: { fontSize: 22 },
  addBtnText: {
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
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  goalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  goalCardCompleted: { opacity: 0.8 },
  goalColorBar: { width: 4 },
  goalContent: { flex: 1, padding: Spacing.base },
  goalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  goalLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  goalTitleArea: { flex: 1, gap: 4 },
  goalIcon: { fontSize: 28 },
  goalName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  goalAmounts: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.md },
  goalAmountLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary },
  goalAmountValue: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    marginTop: 2,
  },
  goalAmountTotal: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  goalProgress: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
  },
  goalTimeLeft: { fontSize: Typography.size.xs, color: Colors.text.tertiary },
  contributeBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  contributeBtnText: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold },
  completedAmount: {
    fontSize: Typography.size.sm,
    color: Colors.success,
    fontWeight: Typography.weight.medium,
  },
  formLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.sm,
  },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  typeBtn: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
    gap: 2,
  },
  typeBtnIcon: { fontSize: 22 },
  typeBtnLabel: { fontSize: 9, color: Colors.text.tertiary, textAlign: 'center' },
  priorityRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  priorityBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  priorityLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailIcon: { fontSize: 40 },
  detailDesc: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  detailItem: {
    width: '47%',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  detailItemLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginBottom: 4 },
  detailItemValue: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  detailActions: { flexDirection: 'row', gap: Spacing.md },
});
