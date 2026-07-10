import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../src/store';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing, Radius } from '../../src/theme/spacing';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { AmountInput } from '../../src/components/ui/AmountInput';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import { formatCurrency } from '../../src/utils/currency';
import { formatDate, monthsUntilDate } from '../../src/utils/date';
import { Goal, GoalType, GoalPriority } from '../../src/store/types';

const GOAL_TYPES: { value: GoalType; label: string; icon: string; color: string }[] = [
  { value: 'travel', label: 'Voyage', icon: '✈️', color: Colors.accent },
  { value: 'car', label: 'Voiture', icon: '🚗', color: Colors.primary },
  { value: 'home', label: 'Maison', icon: '🏠', color: Colors.info },
  { value: 'education', label: 'Éducation', icon: '🎓', color: Colors.secondary },
  { value: 'wedding', label: 'Mariage', icon: '💍', color: Colors.danger },
  { value: 'gadget', label: 'Gadget', icon: '📱', color: Colors.warning },
  { value: 'business', label: 'Business', icon: '💼', color: Colors.success },
  { value: 'retirement', label: 'Retraite', icon: '🌴', color: Colors.successLight },
  { value: 'emergency', label: 'Urgences', icon: '🛡️', color: Colors.warningLight },
  { value: 'other', label: 'Autre', icon: '🎯', color: Colors.text.secondary },
];

const PRIORITIES: { value: GoalPriority; label: string; color: string }[] = [
  { value: 'high', label: 'Haute', color: Colors.danger },
  { value: 'medium', label: 'Moyenne', color: Colors.warning },
  { value: 'low', label: 'Basse', color: Colors.success },
];

export default function GoalsScreen() {
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

  const totalSaved = goals.reduce((a, g) => a + g.currentAmount, 0);
  const totalTargets = goals.reduce((a, g) => a + g.targetAmount, 0);
  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

  const handleAddGoal = async () => {
    const target = parseFloat(goalTarget.replace(',', '.'));
    if (!goalName.trim() || isNaN(target) || target <= 0) {
      Alert.alert('', 'Veuillez remplir le nom et le montant cible.');
      return;
    }
    const typeInfo = GOAL_TYPES.find((t) => t.value === goalType);
    await addGoal({
      name: goalName.trim(),
      description: goalDesc,
      type: goalType,
      targetAmount: target,
      currentAmount: parseFloat(goalCurrent) || 0,
      targetDate: goalDate,
      priority: goalPriority,
      color: typeInfo?.color || Colors.primary,
      icon: typeInfo?.icon || '🎯',
    });
    setGoalName('');
    setGoalDesc('');
    setGoalTarget('');
    setGoalCurrent('');
    setGoalDate('');
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (goal: Goal) => {
    Alert.alert('Supprimer', `Supprimer l'objectif "${goal.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => { deleteGoal(goal.id); setShowDetail(null); } },
    ]);
  };

  const handleContribute = async () => {
    if (!showContribute) return;
    const amount = parseFloat(contribAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('', 'Veuillez entrer un montant valide.');
      return;
    }
    await addGoalContribution(showContribute.id, amount);
    setContribAmount('');
    setShowContribute(null);
  };

  const getGoalStatus = (goal: Goal): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' } => {
    const progress = goal.currentAmount / goal.targetAmount;
    if (progress >= 1) return { label: '✅ Atteint', variant: 'success' };
    if (!goal.targetDate) return { label: '⏳ En cours', variant: 'info' };
    const monthsLeft = monthsUntilDate(goal.targetDate);
    const needed = (goal.targetAmount - goal.currentAmount) / (monthsLeft || 1);
    const onTrack = monthsLeft > 0;
    if (onTrack) return { label: '✓ En bonne voie', variant: 'success' };
    return { label: '⚠️ En retard', variant: 'warning' };
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient.goals} style={styles.header}>
          <Text style={styles.headerTitle}>🎯 Mes Objectifs</Text>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.sumItem}>
                <Text style={styles.sumLabel}>Total épargné</Text>
                <Text style={styles.sumValue}>{formatCurrency(totalSaved, user.currency)}</Text>
              </View>
              <View style={styles.sumDivider} />
              <View style={styles.sumItem}>
                <Text style={styles.sumLabel}>Total objectifs</Text>
                <Text style={styles.sumValue}>{formatCurrency(totalTargets, user.currency)}</Text>
              </View>
              <View style={styles.sumDivider} />
              <View style={styles.sumItem}>
                <Text style={styles.sumLabel}>Atteints</Text>
                <Text style={[styles.sumValue, { color: Colors.successLight }]}>{completedGoals}/{goals.length}</Text>
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
                  {Math.round((totalSaved / totalTargets) * 100)}% de l'objectif global
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Add Goal Button */}
          <TouchableOpacity onPress={() => setShowAddGoal(true)} style={styles.addBtn} activeOpacity={0.85}>
            <LinearGradient colors={Colors.gradient.goals} style={styles.addBtnGrad}>
              <Text style={styles.addBtnIcon}>✨</Text>
              <Text style={styles.addBtnText}>Créer un objectif</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Goals List */}
          {goals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>Aucun objectif</Text>
              <Text style={styles.emptyDesc}>Définissez vos projets financiers et suivez votre progression.</Text>
            </View>
          ) : (
            <>
              {/* Active Goals */}
              {goals.filter((g) => g.currentAmount < g.targetAmount).length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>En cours</Text>
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
                      const monthlyNeeded = monthsLeft && monthsLeft > 0
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
                                    <Badge label={PRIORITIES.find((p) => p.value === goal.priority)?.label || ''} variant={goal.priority === 'high' ? 'danger' : goal.priority === 'medium' ? 'warning' : 'success'} />
                                  </View>
                                </View>
                                <Badge label={status.label} variant={status.variant} />
                              </View>

                              <View style={styles.goalAmounts}>
                                <View>
                                  <Text style={styles.goalAmountLabel}>Épargné</Text>
                                  <Text style={[styles.goalAmountValue, { color: goal.color }]}>
                                    {formatCurrency(goal.currentAmount, user.currency)}
                                  </Text>
                                </View>
                                <View>
                                  <Text style={styles.goalAmountLabel}>Objectif</Text>
                                  <Text style={styles.goalAmountTotal}>
                                    {formatCurrency(goal.targetAmount, user.currency)}
                                  </Text>
                                </View>
                                {monthlyNeeded && (
                                  <View>
                                    <Text style={styles.goalAmountLabel}>/ mois</Text>
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
                                  <Text style={styles.goalTimeLeft}>{monthsLeft} mois restants</Text>
                                )}
                                <TouchableOpacity
                                  onPress={() => setShowContribute(goal)}
                                  style={[styles.contributeBtn, { backgroundColor: `${goal.color}22`, borderColor: goal.color }]}
                                >
                                  <Text style={[styles.contributeBtnText, { color: goal.color }]}>Ajouter</Text>
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
                  <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>🏆 Atteints</Text>
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
                            <Badge label="✅ Atteint" variant="success" />
                          </View>
                          <Text style={styles.completedAmount}>
                            {formatCurrency(goal.currentAmount, user.currency)} /
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
        title="Nouvel objectif"
        snapPoint={0.95}
      >
        <Input
          label="Nom de l'objectif *"
          value={goalName}
          onChangeText={setGoalName}
          placeholder="Ex: Vacances en Espagne"
        />

        <Text style={styles.formLabel}>Type d'objectif</Text>
        <View style={styles.typeGrid}>
          {GOAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setGoalType(type.value)}
              style={[styles.typeBtn, goalType === type.value && { borderColor: type.color, backgroundColor: `${type.color}18` }]}
            >
              <Text style={styles.typeBtnIcon}>{type.icon}</Text>
              <Text style={[styles.typeBtnLabel, goalType === type.value && { color: type.color }]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AmountInput
          label="Montant cible *"
          value={goalTarget}
          onChangeText={setGoalTarget}
          currency={user.currency}
          large
        />
        <AmountInput
          label="Montant déjà épargné"
          value={goalCurrent}
          onChangeText={setGoalCurrent}
          currency={user.currency}
        />
        <Input
          label="Date cible (AAAA-MM-JJ)"
          value={goalDate}
          onChangeText={setGoalDate}
          placeholder="2025-12-31"
        />

        <Text style={styles.formLabel}>Priorité</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p.value}
              onPress={() => setGoalPriority(p.value)}
              style={[
                styles.priorityBtn,
                goalPriority === p.value && { backgroundColor: `${p.color}22`, borderColor: p.color },
              ]}
            >
              <Text style={[styles.priorityLabel, goalPriority === p.value && { color: p.color }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Description (optionnel)"
          value={goalDesc}
          onChangeText={setGoalDesc}
          placeholder="Détails de votre objectif..."
          multiline
          numberOfLines={2}
        />

        <Button
          title="Créer l'objectif"
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
                label={GOAL_TYPES.find((t) => t.value === showDetail.type)?.label || ''}
                variant="primary"
              />
            </View>
          </View>

          {showDetail.description && (
            <Text style={styles.detailDesc}>{showDetail.description}</Text>
          )}

          <View style={styles.detailGrid}>
            {[
              { label: 'Épargné', value: formatCurrency(showDetail.currentAmount, user.currency) },
              { label: 'Objectif', value: formatCurrency(showDetail.targetAmount, user.currency) },
              { label: 'Restant', value: formatCurrency(showDetail.targetAmount - showDetail.currentAmount, user.currency) },
              { label: 'Progression', value: `${Math.round((showDetail.currentAmount / showDetail.targetAmount) * 100)}%` },
              ...(showDetail.targetDate ? [{ label: 'Date cible', value: formatDate(showDetail.targetDate, user.language) }, { label: 'Mois restants', value: `${monthsUntilDate(showDetail.targetDate)} mois` }] : []),
            ].map((item) => (
              <View key={item.label} style={styles.detailItem}>
                <Text style={styles.detailItemLabel}>{item.label}</Text>
                <Text style={styles.detailItemValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.detailActions}>
            <Button
              title="Ajouter"
              onPress={() => { setShowDetail(null); setShowContribute(showDetail); }}
              style={{ flex: 1 }}
            />
            <Button
              title="Supprimer"
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
          title={`Ajouter à "${showContribute.name}"`}
          snapPoint={0.45}
        >
          <AmountInput
            label="Montant"
            value={contribAmount}
            onChangeText={setContribAmount}
            currency={user.currency}
            large
          />
          <Button title="Confirmer" onPress={handleContribute} fullWidth size="lg" />
        </BottomSheet>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  container: { flex: 1 },
  header: { paddingTop: Spacing.md, paddingBottom: Spacing['2xl'], paddingHorizontal: Spacing.xl },
  headerTitle: { fontSize: Typography.size.xl, fontWeight: Typography.weight.bold, color: Colors.white, marginBottom: Spacing.base },
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
  sumValue: { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, color: Colors.white, marginTop: 4 },
  sumDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  globalProgress: {},
  globalProgressLabel: { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.7)', marginTop: 6, textAlign: 'right' },
  body: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  addBtn: { marginTop: Spacing.lg, marginBottom: Spacing.lg, borderRadius: Radius.lg, overflow: 'hidden' },
  addBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  addBtnIcon: { fontSize: 22 },
  addBtnText: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.white },
  emptyState: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: Typography.size.lg, fontWeight: Typography.weight.semibold, color: Colors.text.primary },
  emptyDesc: { fontSize: Typography.size.sm, color: Colors.text.secondary, marginTop: Spacing.sm, textAlign: 'center', lineHeight: 20 },
  sectionTitle: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.text.primary, marginBottom: Spacing.md },
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
  goalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  goalLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  goalTitleArea: { flex: 1, gap: 4 },
  goalIcon: { fontSize: 28 },
  goalName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.text.primary },
  goalAmounts: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.md },
  goalAmountLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary },
  goalAmountValue: { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, marginTop: 2 },
  goalAmountTotal: { fontSize: Typography.size.sm, fontWeight: Typography.weight.medium, color: Colors.text.secondary, marginTop: 2 },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  goalProgress: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.text.secondary },
  goalTimeLeft: { fontSize: Typography.size.xs, color: Colors.text.tertiary },
  contributeBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  contributeBtnText: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold },
  completedAmount: { fontSize: Typography.size.sm, color: Colors.success, fontWeight: Typography.weight.medium },
  formLabel: { fontSize: Typography.size.sm, color: Colors.text.secondary, fontWeight: Typography.weight.medium, marginBottom: Spacing.sm },
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
  priorityLabel: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.text.secondary },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  detailIcon: { fontSize: 40 },
  detailDesc: { fontSize: Typography.size.sm, color: Colors.text.secondary, marginBottom: Spacing.md, lineHeight: 20 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  detailItem: { width: '47%', backgroundColor: Colors.bg.elevated, borderRadius: Radius.md, padding: Spacing.md },
  detailItemLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginBottom: 4 },
  detailItemValue: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.text.primary },
  detailActions: { flexDirection: 'row', gap: Spacing.md },
});
