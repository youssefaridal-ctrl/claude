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
import { Credit } from '../../src/store/types';

const CREDIT_TYPES = [
  { value: 'mortgage', label: '🏠 Immobilier', icon: '🏠' },
  { value: 'car_loan', label: '🚗 Auto', icon: '🚗' },
  { value: 'personal_loan', label: '👤 Personnel', icon: '👤' },
  { value: 'consumer_credit', label: '🛒 Consommation', icon: '🛒' },
  { value: 'student_loan', label: '🎓 Étudiant', icon: '🎓' },
  { value: 'credit_card', label: '💳 Carte crédit', icon: '💳' },
  { value: 'other', label: '📋 Autre', icon: '📋' },
] as const;

const CREDIT_COLORS = [
  Colors.danger, Colors.warning, Colors.primary, Colors.secondary,
  Colors.info, Colors.success, Colors.accent,
];

export default function CreditsScreen() {
  const { user, credits, addCredit, deleteCredit, updateCredit, getTotalIncome, getTotalMonthlyPayments, getDebtRatio } = useAppStore();

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

  const totalDebt = credits.reduce((a, c) => a + c.remainingAmount, 0);
  const totalMonthly = getTotalMonthlyPayments();
  const totalIncome = getTotalIncome();
  const debtRatio = getDebtRatio();

  const latestDebtFreeDate = credits.length > 0
    ? credits.reduce((latest, c) => {
        if (!c.endDate) return latest;
        return !latest || new Date(c.endDate) > new Date(latest) ? c.endDate : latest;
      }, '')
    : null;

  const handleAddCredit = async () => {
    const total = parseFloat(creditTotal.replace(',', '.'));
    const remaining = parseFloat(creditRemaining.replace(',', '.'));
    const monthly = parseFloat(creditMonthly.replace(',', '.'));

    if (!creditName.trim() || isNaN(total) || isNaN(remaining) || isNaN(monthly)) {
      Alert.alert('', 'Veuillez remplir les champs obligatoires.');
      return;
    }

    await addCredit({
      name: creditName.trim(),
      type: creditType,
      totalAmount: total,
      remainingAmount: remaining,
      monthlyPayment: monthly,
      interestRate: parseFloat(creditRate) || 0,
      startDate: new Date().toISOString(),
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
    Alert.alert('Supprimer', `Supprimer "${credit.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteCredit(credit.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient.credits} style={styles.header}>
          <Text style={styles.headerTitle}>💳 Mes Crédits</Text>

          <View style={styles.summaryCard}>
            {/* Total Debt */}
            <View style={styles.summaryTop}>
              <View>
                <Text style={styles.summaryLabel}>Dette totale</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(totalDebt, user.currency)}</Text>
              </View>
              <View style={styles.debtBadge}>
                <Badge
                  label={debtRatio <= 33 ? `${debtRatio}% ✓` : `${debtRatio}% ⚠️`}
                  variant={debtRatio <= 33 ? 'success' : 'danger'}
                  size="md"
                />
                <Text style={styles.debtRatioLabel}>taux d'endettement</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.sumItemLabel}>Mensualités</Text>
                <Text style={styles.sumItemValue}>{formatCurrency(totalMonthly, user.currency)}/mois</Text>
              </View>
              {latestDebtFreeDate && (
                <View style={styles.summaryItem}>
                  <Text style={styles.sumItemLabel}>Libération</Text>
                  <Text style={styles.sumItemValue}>{formatDate(latestDebtFreeDate, user.language)}</Text>
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
                  {Math.round((totalMonthly / totalIncome) * 100)}% du revenu en remboursements
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Debt Ratio Info */}
          <View style={[styles.ratioCard, { borderColor: debtRatio > 33 ? Colors.danger : Colors.success }]}>
            <Text style={styles.ratioIcon}>{debtRatio > 33 ? '⚠️' : '✅'}</Text>
            <View style={styles.ratioInfo}>
              <Text style={styles.ratioTitle}>
                {debtRatio > 33 ? 'Taux critique (> 33%)' : 'Taux sain (< 33%)'}
              </Text>
              <Text style={styles.ratioDesc}>
                {debtRatio > 33
                  ? 'Vos remboursements dépassent 33% de votre revenu. Cherchez à réduire vos dettes.'
                  : 'Vos remboursements sont dans une zone saine. Continuez ainsi.'}
              </Text>
            </View>
          </View>

          {/* Add Credit Button */}
          <TouchableOpacity onPress={() => setShowAddCredit(true)} style={styles.addCreditBtn} activeOpacity={0.85}>
            <LinearGradient colors={Colors.gradient.danger} style={styles.addCreditGrad}>
              <Text style={styles.addCreditIcon}>+</Text>
              <Text style={styles.addCreditText}>Ajouter un crédit</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Credits List */}
          {credits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Text style={styles.emptyTitle}>Aucun crédit en cours</Text>
              <Text style={styles.emptyDesc}>Ajoutez vos crédits pour suivre leur remboursement.</Text>
            </View>
          ) : (
            credits.map((credit) => {
              const progress = credit.totalAmount > 0
                ? ((credit.totalAmount - credit.remainingAmount) / credit.totalAmount) * 100
                : 0;
              const monthsLeft = credit.endDate ? monthsUntilDate(credit.endDate) : null;
              const typeInfo = CREDIT_TYPES.find((t) => t.value === credit.type);

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
                          <Text style={styles.creditTypeIcon}>{typeInfo?.icon || '📋'}</Text>
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
                          <Text style={styles.creditAmountLabel}>Restant</Text>
                          <Text style={[styles.creditAmountValue, { color: credit.color }]}>
                            {formatCurrency(credit.remainingAmount, user.currency)}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.creditAmountLabel}>Total</Text>
                          <Text style={styles.creditAmountTotal}>
                            {formatCurrency(credit.totalAmount, user.currency)}
                          </Text>
                        </View>
                        {monthsLeft !== null && (
                          <View>
                            <Text style={styles.creditAmountLabel}>Durée</Text>
                            <Text style={styles.creditAmountTotal}>{monthsLeft} mois</Text>
                          </View>
                        )}
                      </View>

                      <ProgressBar
                        progress={progress}
                        color={credit.color}
                        height={6}
                        animated
                      />
                      <Text style={styles.creditProgressLabel}>{Math.round(progress)}% remboursé</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {credits.length > 0 && (
            <Text style={styles.tip}>💡 Maintenez un crédit pour le supprimer</Text>
          )}

          {/* Payoff Strategy */}
          {credits.length >= 2 && (
            <View style={styles.strategyCard}>
              <Text style={styles.strategyTitle}>📋 Stratégies de remboursement</Text>
              <View style={styles.strategyRow}>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyName}>❄️ Boule de neige</Text>
                  <Text style={styles.strategyDesc}>Commencez par le plus petit crédit pour gagner en motivation.</Text>
                </View>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyName}>🌊 Avalanche</Text>
                  <Text style={styles.strategyDesc}>Commencez par le taux le plus élevé pour économiser le plus.</Text>
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
        title="Nouveau crédit"
        snapPoint={0.92}
      >
        <Input
          label="Nom du crédit *"
          value={creditName}
          onChangeText={setCreditName}
          placeholder="Ex: Crédit auto Banque X"
        />

        <Text style={styles.formLabel}>Type de crédit</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
          {CREDIT_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setCreditType(type.value)}
              style={[styles.typeChip, creditType === type.value && styles.typeChipSelected]}
            >
              <Text style={[styles.typeChipText, creditType === type.value && { color: Colors.white }]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <AmountInput
          label="Montant emprunté *"
          value={creditTotal}
          onChangeText={setCreditTotal}
          currency={user.currency}
        />
        <AmountInput
          label="Montant restant *"
          value={creditRemaining}
          onChangeText={setCreditRemaining}
          currency={user.currency}
        />
        <AmountInput
          label="Mensualité *"
          value={creditMonthly}
          onChangeText={setCreditMonthly}
          currency={user.currency}
        />
        <Input
          label="Taux d'intérêt (%)"
          value={creditRate}
          onChangeText={setCreditRate}
          placeholder="Ex: 5.5"
          keyboardType="decimal-pad"
        />
        <Input
          label="Banque / Organisme"
          value={creditBank}
          onChangeText={setCreditBank}
          placeholder="Ex: CIH Bank"
        />
        <Input
          label="Date de fin (AAAA-MM-JJ)"
          value={creditEndDate}
          onChangeText={setCreditEndDate}
          placeholder="2027-12-31"
        />

        <Text style={styles.formLabel}>Couleur</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
          {CREDIT_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setCreditColor(color)}
              style={[styles.colorDot, { backgroundColor: color }, creditColor === color && styles.colorDotSelected]}
            />
          ))}
        </ScrollView>

        <Button
          title="Ajouter le crédit"
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
              { label: 'Montant total', value: formatCurrency(showDetail.totalAmount, user.currency) },
              { label: 'Restant', value: formatCurrency(showDetail.remainingAmount, user.currency) },
              { label: 'Mensualité', value: formatCurrency(showDetail.monthlyPayment, user.currency) + '/mois' },
              { label: 'Taux', value: showDetail.interestRate > 0 ? `${showDetail.interestRate}%` : 'N/A' },
              { label: 'Banque', value: showDetail.bank || 'N/A' },
              { label: 'Fin', value: showDetail.endDate ? formatDate(showDetail.endDate, user.language) : 'N/A' },
            ].map((item) => (
              <View key={item.label} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          <ProgressBar
            progress={showDetail.totalAmount > 0 ? ((showDetail.totalAmount - showDetail.remainingAmount) / showDetail.totalAmount) * 100 : 0}
            color={showDetail.color}
            label="Remboursé"
            showLabel
            height={10}
            animated
            style={{ marginTop: Spacing.lg }}
          />
          <Button
            title="Supprimer ce crédit"
            onPress={() => { handleDeleteCredit(showDetail); setShowDetail(null); }}
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
  header: { paddingTop: Spacing.md, paddingBottom: Spacing['2xl'], paddingHorizontal: Spacing.xl },
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
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  summaryLabel: { fontSize: Typography.size.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  summaryAmount: { fontSize: Typography.size['2xl'], fontWeight: Typography.weight.bold, color: Colors.white },
  debtBadge: { alignItems: 'flex-end' },
  debtRatioLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  summaryRow: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.md },
  summaryItem: {},
  sumItemLabel: { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.7)' },
  sumItemValue: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.white, marginTop: 2 },
  debtProgress: {},
  debtProgressLabel: { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.7)', marginTop: 6, textAlign: 'right' },
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
  ratioTitle: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.text.primary },
  ratioDesc: { fontSize: Typography.size.xs, color: Colors.text.secondary, lineHeight: 18, marginTop: 2 },
  addCreditBtn: { marginBottom: Spacing.lg, borderRadius: Radius.lg, overflow: 'hidden' },
  addCreditGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  addCreditIcon: { fontSize: 22, color: Colors.white, fontWeight: Typography.weight.bold },
  addCreditText: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.white },
  emptyState: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: Typography.size.lg, fontWeight: Typography.weight.semibold, color: Colors.text.primary },
  emptyDesc: { fontSize: Typography.size.sm, color: Colors.text.secondary, marginTop: Spacing.sm, textAlign: 'center' },
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
  creditTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  creditLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  creditTypeIcon: { fontSize: 28 },
  creditName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.text.primary },
  creditBank: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },
  creditRight: { alignItems: 'flex-end', gap: 4 },
  creditMonthly: { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, color: Colors.danger },
  creditAmounts: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.md },
  creditAmountLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary },
  creditAmountValue: { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, marginTop: 2 },
  creditAmountTotal: { fontSize: Typography.size.sm, fontWeight: Typography.weight.medium, color: Colors.text.secondary, marginTop: 2 },
  creditProgressLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 6, textAlign: 'right' },
  tip: { textAlign: 'center', fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: Spacing.sm },
  strategyCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  strategyTitle: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.text.primary, marginBottom: Spacing.md },
  strategyRow: { flexDirection: 'row', gap: Spacing.md },
  strategyItem: {
    flex: 1,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  strategyName: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.text.primary, marginBottom: 4 },
  strategyDesc: { fontSize: Typography.size.xs, color: Colors.text.secondary, lineHeight: 16 },
  formLabel: { fontSize: Typography.size.sm, color: Colors.text.secondary, fontWeight: Typography.weight.medium, marginBottom: Spacing.sm },
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
  typeChipText: { fontSize: Typography.size.sm, fontWeight: Typography.weight.medium, color: Colors.text.secondary },
  colorScroll: { marginBottom: Spacing.base },
  colorDot: { width: 36, height: 36, borderRadius: 18, marginRight: Spacing.sm, borderWidth: 1, borderColor: 'transparent' },
  colorDotSelected: { borderWidth: 3, borderColor: Colors.white },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  detailItem: {
    width: '46%',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  detailLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginBottom: 4 },
  detailValue: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.text.primary },
});
