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
import { formatShortDate } from '../../src/utils/date';

const TARGET_TYPES = [
  { value: '3_months', label: '3 mois', sublabel: 'Minimum', multiplier: 3 },
  { value: '6_months', label: '6 mois', sublabel: 'Recommandé', multiplier: 6 },
  { value: '12_months', label: '12 mois', sublabel: 'Optimal', multiplier: 12 },
  { value: 'custom', label: 'Personnalisé', sublabel: 'Montant libre', multiplier: 0 },
] as const;

export default function EmergencyScreen() {
  const { user, emergencyFund, updateEmergencyFund, addEmergencyContribution, withdrawFromEmergency } = useAppStore();

  const [showSetTarget, setShowSetTarget] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const [targetType, setTargetType] = useState<typeof emergencyFund.targetType>(emergencyFund.targetType);
  const [monthlyExpenses, setMonthlyExpenses] = useState(emergencyFund.monthlyExpenses.toString());
  const [customTarget, setCustomTarget] = useState(emergencyFund.targetAmount.toString());
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('');
  const [monthlyContrib, setMonthlyContrib] = useState(emergencyFund.monthlyContribution.toString());

  const progress = emergencyFund.targetAmount > 0
    ? (emergencyFund.currentAmount / emergencyFund.targetAmount) * 100
    : 0;

  const monthsToGoal = emergencyFund.monthlyContribution > 0 && emergencyFund.targetAmount > 0
    ? Math.ceil((emergencyFund.targetAmount - emergencyFund.currentAmount) / emergencyFund.monthlyContribution)
    : null;

  const isGoalReached = emergencyFund.currentAmount >= emergencyFund.targetAmount && emergencyFund.targetAmount > 0;

  const handleSetTarget = async () => {
    let target = 0;
    const expenses = parseFloat(monthlyExpenses.replace(',', '.')) || 0;

    if (targetType === 'custom') {
      target = parseFloat(customTarget.replace(',', '.')) || 0;
    } else {
      const multiplier = TARGET_TYPES.find((t) => t.value === targetType)?.multiplier || 0;
      target = expenses * multiplier;
    }

    if (target <= 0) {
      Alert.alert('', 'Veuillez définir un montant cible valide.');
      return;
    }

    await updateEmergencyFund({
      targetAmount: target,
      targetType,
      monthlyExpenses: expenses,
      monthlyContribution: parseFloat(monthlyContrib) || 0,
    });
    setShowSetTarget(false);
  };

  const handleContribute = async () => {
    const amount = parseFloat(contributionAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('', 'Veuillez entrer un montant valide.');
      return;
    }
    await addEmergencyContribution(amount, contributionNote);
    setContributionAmount('');
    setContributionNote('');
    setShowContribute(false);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('', 'Veuillez entrer un montant valide.');
      return;
    }
    if (amount > emergencyFund.currentAmount) {
      Alert.alert('', 'Montant insuffisant dans le fonds.');
      return;
    }
    await withdrawFromEmergency(amount, withdrawReason);
    setWithdrawAmount('');
    setWithdrawReason('');
    setShowWithdraw(false);
  };

  const progressColor = progress >= 100 ? Colors.success : progress >= 60 ? Colors.warning : Colors.danger;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient.emergency} style={styles.header}>
          <Text style={styles.headerTitle}>🛡️ Fonds d'Urgence</Text>
          <Text style={styles.headerSub}>Votre filet de sécurité financière</Text>

          {/* Main Card */}
          <View style={styles.mainCard}>
            {isGoalReached ? (
              <View style={styles.goalReached}>
                <Text style={styles.goalReachedIcon}>🎉</Text>
                <Text style={styles.goalReachedTitle}>Objectif atteint !</Text>
                <Text style={styles.goalReachedDesc}>Félicitations ! Vous avez constitué votre fonds d'urgence.</Text>
              </View>
            ) : (
              <>
                <View style={styles.amountsRow}>
                  <View>
                    <Text style={styles.currentLabel}>Montant actuel</Text>
                    <Text style={[styles.currentAmount, { color: progressColor === Colors.danger ? '#FF6B6B' : Colors.white }]}>
                      {formatCurrency(emergencyFund.currentAmount, user.currency)}
                    </Text>
                  </View>
                  <View style={styles.targetInfo}>
                    <Text style={styles.currentLabel}>Objectif</Text>
                    <Text style={styles.targetAmount}>
                      {emergencyFund.targetAmount > 0
                        ? formatCurrency(emergencyFund.targetAmount, user.currency)
                        : 'Non défini'}
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
                      <Text style={styles.progressLabel}>{Math.round(progress)}% de l'objectif</Text>
                      {monthsToGoal !== null && monthsToGoal > 0 && (
                        <Text style={styles.progressLabel}>{monthsToGoal} mois restants</Text>
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
                <Text style={styles.contribTitle}>Contribution mensuelle prévue</Text>
                <Text style={styles.contribAmount}>
                  {formatCurrency(emergencyFund.monthlyContribution, user.currency)} / mois
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
            >
              <LinearGradient colors={Colors.gradient.success} style={styles.actionGrad}>
                <Text style={styles.actionIcon}>➕</Text>
                <Text style={styles.actionLabel}>Ajouter</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowWithdraw(true)}
              activeOpacity={0.85}
            >
              <LinearGradient colors={Colors.gradient.warning} style={styles.actionGrad}>
                <Text style={styles.actionIcon}>➖</Text>
                <Text style={styles.actionLabel}>Retirer</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowSetTarget(true)}
              activeOpacity={0.85}
            >
              <View style={[styles.actionGrad, { backgroundColor: Colors.bg.elevated }]}>
                <Text style={styles.actionIcon}>🎯</Text>
                <Text style={styles.actionLabel}>Objectif</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Why Emergency Fund */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🤔 Pourquoi un fonds d'urgence ?</Text>
            <Text style={styles.infoText}>
              Un fonds d'urgence vous protège contre les imprévus : perte d'emploi, maladie, réparations urgentes.
              Il vous évite de recourir aux crédits en cas de coup dur.
            </Text>
            <View style={styles.infoTargets}>
              {TARGET_TYPES.filter((t) => t.value !== 'custom').map((t) => (
                <View
                  key={t.value}
                  style={[
                    styles.infoTarget,
                    emergencyFund.targetType === t.value && styles.infoTargetActive,
                  ]}
                >
                  <Text style={styles.infoTargetMonths}>{t.label}</Text>
                  <Text style={styles.infoTargetLabel}>{t.sublabel}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Transaction History */}
          {emergencyFund.transactions.length > 0 && (
            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>📜 Historique</Text>
              {emergencyFund.transactions.slice(0, 10).map((tx) => (
                <View key={tx.id} style={styles.historyRow}>
                  <View style={[
                    styles.historyIcon,
                    { backgroundColor: tx.type === 'contribution' ? Colors.successBg : Colors.dangerBg },
                  ]}>
                    <Text>{tx.type === 'contribution' ? '↑' : '↓'}</Text>
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyDesc}>
                      {tx.type === 'contribution' ? 'Contribution' : 'Retrait'}
                      {tx.note ? ` · ${tx.note}` : ''}
                    </Text>
                    <Text style={styles.historyDate}>{formatShortDate(tx.date, user.language)}</Text>
                  </View>
                  <Text style={[
                    styles.historyAmount,
                    { color: tx.type === 'contribution' ? Colors.success : Colors.danger },
                  ]}>
                    {tx.type === 'contribution' ? '+' : '-'}{formatCurrency(tx.amount, user.currency)}
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
        title="Définir l'objectif"
        snapPoint={0.8}
      >
        <Text style={styles.sheetLabel}>Type d'objectif</Text>
        <View style={styles.targetTypes}>
          {TARGET_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setTargetType(type.value)}
              style={[styles.targetTypeBtn, targetType === type.value && styles.targetTypeBtnSelected]}
            >
              <Text style={[styles.targetTypeMain, targetType === type.value && { color: Colors.white }]}>
                {type.label}
              </Text>
              <Text style={[styles.targetTypeSub, targetType === type.value && { color: 'rgba(255,255,255,0.8)' }]}>
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
            label="Dépenses mensuelles estimées"
            value={monthlyExpenses}
            onChangeText={setMonthlyExpenses}
            currency={user.currency}
          />
        ) : (
          <AmountInput
            label="Montant cible personnalisé"
            value={customTarget}
            onChangeText={setCustomTarget}
            currency={user.currency}
          />
        )}

        <AmountInput
          label="Contribution mensuelle prévue"
          value={monthlyContrib}
          onChangeText={setMonthlyContrib}
          currency={user.currency}
        />

        {targetType !== 'custom' && parseFloat(monthlyExpenses) > 0 && (
          <View style={styles.calcResult}>
            <Text style={styles.calcLabel}>Objectif calculé :</Text>
            <Text style={styles.calcValue}>
              {formatCurrency(
                parseFloat(monthlyExpenses) * (TARGET_TYPES.find((t) => t.value === targetType)?.multiplier || 0),
                user.currency
              )}
            </Text>
          </View>
        )}

        <Button
          title="Enregistrer l'objectif"
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
        title="Ajouter une contribution"
        snapPoint={0.55}
      >
        <AmountInput
          label="Montant"
          value={contributionAmount}
          onChangeText={setContributionAmount}
          currency={user.currency}
          large
        />
        <Input
          label="Note (optionnel)"
          value={contributionNote}
          onChangeText={setContributionNote}
          placeholder="Ex: Économie du mois..."
        />
        <Button title="Confirmer" onPress={handleContribute} fullWidth size="lg" />
      </BottomSheet>

      {/* Withdraw Sheet */}
      <BottomSheet
        visible={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        title="Retrait d'urgence"
        snapPoint={0.55}
      >
        <View style={styles.withdrawWarning}>
          <Text style={styles.withdrawWarningText}>
            ⚠️ Utilisez ce fonds uniquement pour de vraies urgences.
          </Text>
        </View>
        <AmountInput
          label="Montant retiré"
          value={withdrawAmount}
          onChangeText={setWithdrawAmount}
          currency={user.currency}
          large
        />
        <Input
          label="Raison"
          value={withdrawReason}
          onChangeText={setWithdrawReason}
          placeholder="Ex: Réparation voiture urgente..."
        />
        <Button title="Confirmer le retrait" onPress={handleWithdraw} variant="danger" fullWidth size="lg" />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  container: { flex: 1 },
  header: { paddingTop: Spacing.md, paddingBottom: Spacing['2xl'], paddingHorizontal: Spacing.xl },
  headerTitle: { fontSize: Typography.size.xl, fontWeight: Typography.weight.bold, color: Colors.white, marginBottom: 4 },
  headerSub: { fontSize: Typography.size.sm, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.base },
  mainCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  goalReached: { alignItems: 'center', paddingVertical: Spacing.md },
  goalReachedIcon: { fontSize: 48, marginBottom: Spacing.sm },
  goalReachedTitle: { fontSize: Typography.size.xl, fontWeight: Typography.weight.bold, color: Colors.white },
  goalReachedDesc: { fontSize: Typography.size.sm, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4 },
  amountsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.base },
  currentLabel: { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  currentAmount: { fontSize: Typography.size['2xl'], fontWeight: Typography.weight.bold, color: Colors.white },
  targetInfo: { alignItems: 'flex-end' },
  targetAmount: { fontSize: Typography.size.lg, fontWeight: Typography.weight.semibold, color: 'rgba(255,255,255,0.9)' },
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
  contribAmount: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.success, marginTop: 2 },
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
  actionLabel: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold, color: Colors.white },
  infoCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  infoTitle: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.text.primary, marginBottom: Spacing.sm },
  infoText: { fontSize: Typography.size.sm, color: Colors.text.secondary, lineHeight: 20, marginBottom: Spacing.md },
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
  infoTargetMonths: { fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, color: Colors.text.primary },
  infoTargetLabel: { fontSize: 10, color: Colors.text.tertiary, marginTop: 2 },
  historyCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  historyTitle: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.text.primary, marginBottom: Spacing.md },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  historyIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  historyInfo: { flex: 1 },
  historyDesc: { fontSize: Typography.size.sm, color: Colors.text.primary, fontWeight: Typography.weight.medium },
  historyDate: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },
  historyAmount: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold },
  sheetLabel: { fontSize: Typography.size.sm, color: Colors.text.secondary, fontWeight: Typography.weight.medium, marginBottom: Spacing.sm },
  targetTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
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
  targetTypeMain: { fontSize: Typography.size.base, fontWeight: Typography.weight.bold, color: Colors.text.primary },
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
  calcValue: { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, color: Colors.warning },
  withdrawWarning: {
    backgroundColor: Colors.dangerBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  withdrawWarningText: { fontSize: Typography.size.sm, color: Colors.danger, fontWeight: Typography.weight.medium },
});
