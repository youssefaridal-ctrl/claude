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
import { BudgetCategory } from '../../src/store/types';

const CATEGORY_ICONS = ['🏠', '🛒', '🚗', '❤️', '🎮', '💰', '⚡', '📚', '🎓', '💸', '✈️', '👕', '📱', '🍕', '🏋️'];
const CATEGORY_COLORS = [
  Colors.categories.housing, Colors.categories.food, Colors.categories.transport,
  Colors.categories.health, Colors.categories.leisure, Colors.categories.savings,
  Colors.categories.utilities, Colors.categories.education, Colors.primary,
  Colors.secondary, Colors.accent, Colors.warning, Colors.danger, Colors.success, Colors.info,
];

export default function SalaryScreen() {
  const {
    user, salary, categories, incomeSources,
    setSalary, apply503020Rule, addCategory, deleteCategory,
    addIncomeSource, deleteIncomeSource,
    getTotalIncome, getCurrentMonthSpentByCategory,
  } = useAppStore();

  const [showEditSalary, setShowEditSalary] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);

  const [newSalaryStr, setNewSalaryStr] = useState(salary.toString());
  const [newCatName, setNewCatName] = useState('');
  const [newCatPct, setNewCatPct] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('💸');
  const [newCatColor, setNewCatColor] = useState(CATEGORY_COLORS[0]);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceAmount, setNewSourceAmount] = useState('');
  const [newSourceType, setNewSourceType] = useState<'fixed' | 'variable'>('fixed');

  const totalIncome = getTotalIncome();
  const spentByCategory = getCurrentMonthSpentByCategory();
  const totalAllocated = categories.reduce((a, c) => a + c.percentage, 0);
  const unallocated = Math.max(0, 100 - totalAllocated);

  const handleUpdateSalary = async () => {
    const amount = parseFloat(newSalaryStr.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('', 'Veuillez entrer un montant valide.');
      return;
    }
    await setSalary(amount);
    setShowEditSalary(false);
  };

  const handleAddCategory = async () => {
    const pct = parseFloat(newCatPct.replace(',', '.'));
    if (!newCatName.trim() || isNaN(pct) || pct <= 0) {
      Alert.alert('', 'Veuillez remplir le nom et le pourcentage.');
      return;
    }
    if (totalAllocated + pct > 100) {
      Alert.alert('', `Vous ne pouvez allouer que ${unallocated}% supplémentaires.`);
      return;
    }
    await addCategory({ name: newCatName.trim(), percentage: pct, color: newCatColor, icon: newCatIcon, amount: 0 });
    setNewCatName('');
    setNewCatPct('');
    setShowAddCategory(false);
  };

  const handleAddSource = async () => {
    const amount = parseFloat(newSourceAmount.replace(',', '.'));
    if (!newSourceName.trim() || isNaN(amount) || amount <= 0) {
      Alert.alert('', 'Veuillez remplir tous les champs.');
      return;
    }
    await addIncomeSource({ name: newSourceName.trim(), amount, type: newSourceType });
    setNewSourceName('');
    setNewSourceAmount('');
    setShowAddSource(false);
  };

  const handleDeleteCategory = (cat: BudgetCategory) => {
    Alert.alert('Supprimer', `Supprimer la catégorie "${cat.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteCategory(cat.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient.salary} style={styles.header}>
          <Text style={styles.headerTitle}>💰 Mon Salaire</Text>

          <View style={styles.salaryCard}>
            <Text style={styles.salaryLabel}>Revenu total mensuel</Text>
            <Text style={styles.salaryAmount}>{formatCurrency(totalIncome, user.currency)}</Text>
            <View style={styles.incomeBreakdown}>
              <View style={styles.incomeItem}>
                <Text style={styles.incomeLabel}>Salaire</Text>
                <Text style={styles.incomeValue}>{formatCurrency(salary, user.currency)}</Text>
              </View>
              {incomeSources.length > 0 && (
                <View style={styles.incomeItem}>
                  <Text style={styles.incomeLabel}>Autres revenus</Text>
                  <Text style={styles.incomeValue}>
                    {formatCurrency(incomeSources.reduce((a, s) => a + s.amount, 0), user.currency)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => { setNewSalaryStr(salary.toString()); setShowEditSalary(true); }}
                style={styles.editBtn}
              >
                <Text style={styles.editBtnText}>✏️ Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAddSource(true)} style={styles.editBtn}>
                <Text style={styles.editBtnText}>➕ Revenu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Budget allocation summary */}
          <View style={styles.allocationSummary}>
            <View style={styles.allocationItem}>
              <Text style={styles.allocationValue}>{totalAllocated}%</Text>
              <Text style={styles.allocationLabel}>Alloué</Text>
            </View>
            <View style={styles.allocationDivider} />
            <View style={styles.allocationItem}>
              <Text style={[styles.allocationValue, { color: unallocated > 0 ? Colors.warning : Colors.success }]}>
                {unallocated}%
              </Text>
              <Text style={styles.allocationLabel}>Non alloué</Text>
            </View>
            <View style={styles.allocationDivider} />
            <View style={styles.allocationItem}>
              <Text style={styles.allocationValue}>{categories.length}</Text>
              <Text style={styles.allocationLabel}>Catégories</Text>
            </View>
          </View>

          {/* 50/30/20 Preset */}
          <TouchableOpacity onPress={apply503020Rule} style={styles.presetCard} activeOpacity={0.8}>
            <LinearGradient
              colors={['rgba(99,102,241,0.15)', 'rgba(139,92,246,0.1)']}
              style={styles.presetGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.presetLeft}>
                <Text style={styles.presetTitle}>✨ Règle 50/30/20</Text>
                <Text style={styles.presetDesc}>Besoins · Envies · Épargne</Text>
              </View>
              <View style={styles.presetPcts}>
                {[
                  { label: '50%', sub: 'Besoins', color: Colors.primary },
                  { label: '30%', sub: 'Envies', color: Colors.secondary },
                  { label: '20%', sub: 'Épargne', color: Colors.success },
                ].map((p) => (
                  <View key={p.label} style={styles.presetPctItem}>
                    <Text style={[styles.presetPct, { color: p.color }]}>{p.label}</Text>
                    <Text style={styles.presetPctSub}>{p.sub}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Répartition du budget</Text>
            <TouchableOpacity
              onPress={() => setShowAddCategory(true)}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+ Ajouter</Text>
            </TouchableOpacity>
          </View>

          {categories.map((cat) => {
            const spent = spentByCategory[cat.id] || 0;
            const remaining = Math.max(0, cat.amount - spent);
            const progress = cat.amount > 0 ? (spent / cat.amount) * 100 : 0;
            const isOver = spent > cat.amount;

            return (
              <TouchableOpacity
                key={cat.id}
                onLongPress={() => handleDeleteCategory(cat)}
                activeOpacity={0.9}
              >
                <View style={styles.catCard}>
                  <View style={styles.catTop}>
                    <View style={styles.catLeft}>
                      <View style={[styles.catIconBg, { backgroundColor: `${cat.color}22` }]}>
                        <Text style={styles.catIconText}>{cat.icon}</Text>
                      </View>
                      <View>
                        <Text style={styles.catName}>{cat.name}</Text>
                        <Text style={styles.catBudget}>{cat.percentage}% · {formatCurrency(cat.amount, user.currency)}</Text>
                      </View>
                    </View>
                    <View style={styles.catRight}>
                      {isOver ? (
                        <Badge label="Dépassé" variant="danger" />
                      ) : (
                        <Text style={styles.catRemaining}>
                          {formatCurrency(remaining, user.currency)} restant
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.catProgressRow}>
                    <ProgressBar
                      progress={progress}
                      color={isOver ? Colors.danger : cat.color}
                      height={6}
                      animated
                    />
                    <View style={styles.catProgressLabels}>
                      <Text style={styles.catSpent}>Dépensé: {formatCurrency(spent, user.currency)}</Text>
                      <Text style={[styles.catProgressPct, { color: isOver ? Colors.danger : cat.color }]}>
                        {Math.round(progress)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Income Sources */}
          {incomeSources.length > 0 && (
            <View style={styles.sourcesSection}>
              <Text style={styles.sectionTitle}>Sources de revenus</Text>
              {incomeSources.map((src) => (
                <View key={src.id} style={styles.sourceRow}>
                  <View style={styles.sourceInfo}>
                    <Text style={styles.sourceName}>{src.name}</Text>
                    <Badge
                      label={src.type === 'fixed' ? 'Fixe' : 'Variable'}
                      variant={src.type === 'fixed' ? 'success' : 'warning'}
                    />
                  </View>
                  <View style={styles.sourceRight}>
                    <Text style={styles.sourceAmount}>{formatCurrency(src.amount, user.currency)}</Text>
                    <TouchableOpacity onPress={() => deleteIncomeSource(src.id)}>
                      <Text style={styles.deleteBtn}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.tip}>💡 Maintenez une catégorie pour la supprimer</Text>
        </View>
      </ScrollView>

      {/* Edit Salary Sheet */}
      <BottomSheet
        visible={showEditSalary}
        onClose={() => setShowEditSalary(false)}
        title="Modifier le salaire"
        snapPoint={0.45}
      >
        <AmountInput
          label="Salaire mensuel net"
          value={newSalaryStr}
          onChangeText={setNewSalaryStr}
          currency={user.currency}
          large
        />
        <Button title="Mettre à jour" onPress={handleUpdateSalary} fullWidth size="lg" />
      </BottomSheet>

      {/* Add Category Sheet */}
      <BottomSheet
        visible={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        title="Nouvelle catégorie"
        snapPoint={0.8}
      >
        <Input
          label="Nom de la catégorie"
          value={newCatName}
          onChangeText={setNewCatName}
          placeholder="Ex: Vêtements"
        />
        <Input
          label={`Pourcentage (max ${unallocated}%)`}
          value={newCatPct}
          onChangeText={setNewCatPct}
          placeholder={`${unallocated}`}
          keyboardType="decimal-pad"
          suffix={<Text style={{ color: Colors.text.secondary, paddingRight: 12 }}>%</Text>}
        />
        <Text style={styles.iconLabel}>Choisir une icône</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconRow}>
          {CATEGORY_ICONS.map((icon) => (
            <TouchableOpacity
              key={icon}
              onPress={() => setNewCatIcon(icon)}
              style={[styles.iconBtn, newCatIcon === icon && styles.iconBtnSelected]}
            >
              <Text style={styles.iconBtnText}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.iconLabel}>Choisir une couleur</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
          {CATEGORY_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setNewCatColor(color)}
              style={[styles.colorBtn, { backgroundColor: color }, newCatColor === color && styles.colorBtnSelected]}
            />
          ))}
        </ScrollView>
        <Button
          title="Ajouter la catégorie"
          onPress={handleAddCategory}
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.md }}
        />
      </BottomSheet>

      {/* Add Income Source Sheet */}
      <BottomSheet
        visible={showAddSource}
        onClose={() => setShowAddSource(false)}
        title="Nouveau revenu"
        snapPoint={0.6}
      >
        <Input
          label="Nom du revenu"
          value={newSourceName}
          onChangeText={setNewSourceName}
          placeholder="Ex: Freelance, Location..."
        />
        <AmountInput
          label="Montant mensuel"
          value={newSourceAmount}
          onChangeText={setNewSourceAmount}
          currency={user.currency}
        />
        <View style={styles.typeRow}>
          {(['fixed', 'variable'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setNewSourceType(type)}
              style={[styles.typeBtn, newSourceType === type && styles.typeBtnSelected]}
            >
              <Text style={[styles.typeBtnTxt, newSourceType === type && { color: Colors.primary }]}>
                {type === 'fixed' ? '🔒 Fixe' : '📊 Variable'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title="Ajouter"
          onPress={handleAddSource}
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.md }}
        />
      </BottomSheet>
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
  salaryCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  salaryLabel: { fontSize: Typography.size.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  salaryAmount: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  incomeBreakdown: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.md },
  incomeItem: {},
  incomeLabel: { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.7)' },
  incomeValue: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.white, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: Spacing.md },
  editBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editBtnText: { fontSize: Typography.size.sm, color: Colors.white, fontWeight: Typography.weight.medium },
  body: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  allocationSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  allocationItem: { flex: 1, alignItems: 'center' },
  allocationValue: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  allocationLabel: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },
  allocationDivider: { width: 1, backgroundColor: Colors.border.default },
  presetCard: { marginBottom: Spacing.md, borderRadius: Radius.xl, overflow: 'hidden' },
  presetGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    borderRadius: Radius.xl,
  },
  presetLeft: {},
  presetTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  presetDesc: { fontSize: Typography.size.xs, color: Colors.text.secondary, marginTop: 2 },
  presetPcts: { flexDirection: 'row', gap: Spacing.md },
  presetPctItem: { alignItems: 'center' },
  presetPct: { fontSize: Typography.size.md, fontWeight: Typography.weight.bold },
  presetPctSub: { fontSize: 10, color: Colors.text.tertiary, marginTop: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  addBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border.accent,
  },
  addBtnText: { fontSize: Typography.size.sm, color: Colors.primary, fontWeight: Typography.weight.semibold },
  catCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  catTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  catIconBg: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  catIconText: { fontSize: 22 },
  catName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.text.primary },
  catBudget: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },
  catRight: {},
  catRemaining: { fontSize: Typography.size.sm, color: Colors.success, fontWeight: Typography.weight.medium },
  catProgressRow: { gap: 6 },
  catProgressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  catSpent: { fontSize: Typography.size.xs, color: Colors.text.tertiary },
  catProgressPct: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold },
  sourcesSection: { marginTop: Spacing.xl },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  sourceInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  sourceName: { fontSize: Typography.size.sm, fontWeight: Typography.weight.medium, color: Colors.text.primary },
  sourceRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  sourceAmount: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.success },
  deleteBtn: { fontSize: 18 },
  tip: {
    textAlign: 'center',
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  iconLabel: { fontSize: Typography.size.sm, color: Colors.text.secondary, fontWeight: Typography.weight.medium, marginBottom: Spacing.sm },
  iconRow: { marginBottom: Spacing.base },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  iconBtnSelected: { borderColor: Colors.primary, borderWidth: 2 },
  iconBtnText: { fontSize: 22 },
  colorRow: { marginBottom: Spacing.base },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorBtnSelected: { borderWidth: 3, borderColor: Colors.white },
  typeRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  typeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  typeBtnSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(99,102,241,0.1)' },
  typeBtnTxt: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.text.secondary },
});
