import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addBudgetCategory } from '../../src/application/salary/add-budget-category.usecase';
import { addIncomeSource } from '../../src/application/salary/add-income-source.usecase';
import { addTransaction } from '../../src/application/salary/add-transaction.usecase';
import { apply503020 } from '../../src/application/salary/apply-503020.usecase';
import { deleteBudgetCategory } from '../../src/application/salary/delete-budget-category.usecase';
import { deleteIncomeSource } from '../../src/application/salary/delete-income-source.usecase';
import { deleteTransaction } from '../../src/application/salary/delete-transaction.usecase';
import { updateSalary } from '../../src/application/salary/update-salary.usecase';
import { AmountInput } from '../../src/components/ui/AmountInput';
import { Badge } from '../../src/components/ui/Badge';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { useAppStore } from '../../src/store';
import type { BudgetCategory } from '../../src/store/types';
import { Colors } from '../../src/theme/colors';
import { Radius, Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { formatCurrency } from '../../src/utils/currency';
import { addMonths, formatShortDate, getCurrentMonth, getMonthName } from '../../src/utils/date';

const CATEGORY_ICONS = [
  '🏠',
  '🛒',
  '🚗',
  '❤️',
  '🎮',
  '💰',
  '⚡',
  '📚',
  '🎓',
  '💸',
  '✈️',
  '👕',
  '📱',
  '🍕',
  '🏋️',
];
const CATEGORY_COLORS = [
  Colors.categories.housing,
  Colors.categories.food,
  Colors.categories.transport,
  Colors.categories.health,
  Colors.categories.leisure,
  Colors.categories.savings,
  Colors.categories.utilities,
  Colors.categories.education,
  Colors.primary,
  Colors.secondary,
  Colors.accent,
  Colors.warning,
  Colors.danger,
  Colors.success,
  Colors.info,
];

export default function SalaryScreen() {
  const { t } = useTranslation();
  const { user, salary, categories, incomeSources, transactions, getTotalIncome } = useAppStore();

  const [showEditSalary, setShowEditSalary] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);

  const [newSalaryStr, setNewSalaryStr] = useState(salary.toString());
  const [newCatName, setNewCatName] = useState('');
  const [newCatPct, setNewCatPct] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('💸');
  const [newCatColor, setNewCatColor] = useState(CATEGORY_COLORS[0]);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceAmount, setNewSourceAmount] = useState('');
  const [newSourceType, setNewSourceType] = useState<'fixed' | 'variable'>('fixed');

  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txCategoryId, setTxCategoryId] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 10));

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const totalIncome = getTotalIncome();
  const totalAllocated = categories.reduce((a, c) => a + c.percentage, 0);
  const unallocated = Math.max(0, 100 - totalAllocated);

  const spentByCategory = useMemo(() => {
    return transactions
      .filter((tx) => tx.month === selectedMonth && tx.type === 'expense')
      .reduce<Record<string, number>>((acc, tx) => {
        acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
        return acc;
      }, {});
  }, [transactions, selectedMonth]);

  const monthTransactions = useMemo(
    () => transactions.filter((tx) => tx.month === selectedMonth),
    [transactions, selectedMonth]
  );

  const goToPrevMonth = () => {
    const d = new Date(`${selectedMonth}-01T12:00:00`);
    setSelectedMonth(addMonths(d, -1).toISOString().slice(0, 7));
  };

  const goToNextMonth = () => {
    const d = new Date(`${selectedMonth}-01T12:00:00`);
    const next = addMonths(d, 1).toISOString().slice(0, 7);
    if (next <= getCurrentMonth()) setSelectedMonth(next);
  };

  const handleUpdateSalary = async () => {
    const amount = Number.parseFloat(newSalaryStr.replace(/,/g, '.'));
    if (Number.isNaN(amount) || amount < 0) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }
    const result = await updateSalary(amount);
    if (!result.ok) {
      Alert.alert(t('common.error'), result.error.message);
      return;
    }
    setShowEditSalary(false);
  };

  const handleApply503020 = () => {
    Alert.alert(t('salary.rule_5030_20'), t('salary.preset_5030_20'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.confirm'),
        onPress: async () => {
          const result = await apply503020({
            needsName: t('salary.needs'),
            wantsName: t('salary.wants'),
            savingsName: t('salary.savings'),
          });
          if (!result.ok) Alert.alert(t('common.error'), result.error.message);
        },
      },
    ]);
  };

  const handleAddCategory = async () => {
    const pct = Number.parseFloat(newCatPct.replace(/,/g, '.'));
    const result = await addBudgetCategory({
      name: newCatName,
      percentage: Number.isNaN(pct) ? 0 : pct,
      color: newCatColor,
      icon: newCatIcon,
    });
    if (!result.ok) {
      Alert.alert(t('common.error'), result.error.message);
      return;
    }
    setNewCatName('');
    setNewCatPct('');
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (cat: BudgetCategory) => {
    Alert.alert(t('common.delete'), `"${cat.name}"?`, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          const result = await deleteBudgetCategory(cat.id);
          if (!result.ok) Alert.alert(t('common.error'), result.error.message);
        },
      },
    ]);
  };

  const handleAddSource = async () => {
    const amount = Number.parseFloat(newSourceAmount.replace(/,/g, '.'));
    const result = await addIncomeSource({
      name: newSourceName,
      amount: Number.isNaN(amount) ? 0 : amount,
      type: newSourceType,
    });
    if (!result.ok) {
      Alert.alert(t('common.error'), result.error.message);
      return;
    }
    setNewSourceName('');
    setNewSourceAmount('');
    setShowAddSource(false);
  };

  const handleDeleteSource = (id: string) => {
    Alert.alert(t('common.delete'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          const result = await deleteIncomeSource(id);
          if (!result.ok) Alert.alert(t('common.error'), result.error.message);
        },
      },
    ]);
  };

  const handleAddTransaction = async () => {
    const amount = Number.parseFloat(txAmount.replace(/,/g, '.'));
    if (!txDesc.trim() || !amount || amount <= 0) {
      Alert.alert('', t('common.required'));
      return;
    }
    const result = await addTransaction({
      description: txDesc,
      amount,
      categoryId: txCategoryId || (categories[0]?.id ?? ''),
      date: txDate,
      type: txType,
    });
    if (!result.ok) {
      Alert.alert(t('common.error'), result.error.message);
      return;
    }
    setTxDesc('');
    setTxAmount('');
    setTxDate(new Date().toISOString().slice(0, 10));
    setShowAddTx(false);
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(t('common.delete'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          const result = await deleteTransaction(id);
          if (!result.ok) Alert.alert(t('common.error'), result.error.message);
        },
      },
    ]);
  };

  const isNextMonthAvailable =
    addMonths(new Date(`${selectedMonth}-01T12:00:00`), 1)
      .toISOString()
      .slice(0, 7) <= getCurrentMonth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient.salary} style={styles.header}>
          <Text style={styles.headerTitle}>💰 {t('salary.title')}</Text>

          <View style={styles.salaryCard}>
            <Text style={styles.salaryLabel}>{t('salary.total_income')}</Text>
            <Text style={styles.salaryAmount}>
              {formatCurrency(totalIncome, user.currency, user.language)}
            </Text>

            <View style={styles.incomeBreakdown}>
              <View style={styles.incomeItem}>
                <Text style={styles.incomeLabel}>{t('salary.net_salary')}</Text>
                <Text style={styles.incomeValue}>
                  {formatCurrency(salary, user.currency, user.language)}
                </Text>
              </View>
              {incomeSources.length > 0 && (
                <View style={styles.incomeItem}>
                  <Text style={styles.incomeLabel}>{t('salary.other_income')}</Text>
                  <Text style={styles.incomeValue}>
                    {formatCurrency(
                      incomeSources.reduce((a, s) => a + s.amount, 0),
                      user.currency,
                      user.language
                    )}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => {
                  setNewSalaryStr(salary.toString());
                  setShowEditSalary(true);
                }}
                style={styles.editBtn}
              >
                <Text style={styles.editBtnText}>✏️ {t('salary.edit_salary')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAddSource(true)} style={styles.editBtn}>
                <Text style={styles.editBtnText}>➕ {t('salary.add_income_source')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Allocation summary */}
          <View style={styles.allocationSummary}>
            <View style={styles.allocationItem}>
              <Text style={styles.allocationValue}>{totalAllocated}%</Text>
              <Text style={styles.allocationLabel}>{t('salary.allocated')}</Text>
            </View>
            <View style={styles.allocationDivider} />
            <View style={styles.allocationItem}>
              <Text
                style={[
                  styles.allocationValue,
                  {
                    color:
                      totalAllocated > 100
                        ? Colors.danger
                        : unallocated > 0
                          ? Colors.warning
                          : Colors.success,
                  },
                ]}
              >
                {unallocated}%
              </Text>
              <Text style={styles.allocationLabel}>{t('salary.unallocated')}</Text>
            </View>
            <View style={styles.allocationDivider} />
            <View style={styles.allocationItem}>
              <Text style={styles.allocationValue}>{categories.length}</Text>
              <Text style={styles.allocationLabel}>{t('salary.distribution')}</Text>
            </View>
          </View>

          {/* 50/30/20 Preset */}
          <TouchableOpacity
            onPress={handleApply503020}
            style={styles.presetCard}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(99,102,241,0.15)', 'rgba(139,92,246,0.1)']}
              style={styles.presetGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.presetLeft}>
                <Text style={styles.presetTitle}>✨ {t('salary.rule_5030_20')}</Text>
                <Text style={styles.presetDesc}>
                  {t('salary.needs')} · {t('salary.wants')} · {t('salary.savings')}
                </Text>
              </View>
              <View style={styles.presetPcts}>
                {[
                  { label: '50%', sub: t('salary.needs'), color: Colors.primary },
                  { label: '30%', sub: t('salary.wants'), color: Colors.secondary },
                  { label: '20%', sub: t('salary.savings'), color: Colors.success },
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
            <Text style={styles.sectionTitle}>{t('salary.distribution')}</Text>
            <TouchableOpacity onPress={() => setShowAddCategory(true)} style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ {t('salary.add_category')}</Text>
            </TouchableOpacity>
          </View>

          {categories.map((cat) => {
            const spent = spentByCategory[cat.id] || 0;
            const remaining = Math.max(0, cat.amount - spent);
            const progress = cat.amount > 0 ? (spent / cat.amount) * 100 : 0;
            const isOver = spent > cat.amount && cat.amount > 0;

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
                        <Text style={styles.catBudget}>
                          {cat.percentage}% ·{' '}
                          {formatCurrency(cat.amount, user.currency, user.language)}
                        </Text>
                      </View>
                    </View>
                    <View>
                      {isOver ? (
                        <Badge label={t('salary.over_budget')} variant="danger" />
                      ) : (
                        <Text style={styles.catRemaining}>
                          {formatCurrency(remaining, user.currency, user.language)}
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
                      <Text style={styles.catSpent}>
                        {t('salary.spent')}: {formatCurrency(spent, user.currency, user.language)}
                      </Text>
                      <Text
                        style={[
                          styles.catProgressPct,
                          { color: isOver ? Colors.danger : cat.color },
                        ]}
                      >
                        {Math.round(progress)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Transactions */}
          <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
            <Text style={styles.sectionTitle}>{t('salary.transactions')}</Text>
            <TouchableOpacity
              onPress={() => {
                setTxCategoryId(categories[0]?.id ?? '');
                setShowAddTx(true);
              }}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+ {t('salary.add_transaction')}</Text>
            </TouchableOpacity>
          </View>

          {/* Month navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={goToPrevMonth} style={styles.monthArrow}>
              <Text style={styles.monthArrowText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{getMonthName(selectedMonth, user.language)}</Text>
            <TouchableOpacity
              onPress={goToNextMonth}
              style={[styles.monthArrow, !isNextMonthAvailable && styles.monthArrowDisabled]}
              disabled={!isNextMonthAvailable}
            >
              <Text
                style={[
                  styles.monthArrowText,
                  !isNextMonthAvailable && styles.monthArrowTextDisabled,
                ]}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>

          {monthTransactions.length === 0 ? (
            <View style={styles.emptyTx}>
              <Text style={styles.emptyTxText}>{t('salary.no_transactions')}</Text>
            </View>
          ) : (
            monthTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              return (
                <TouchableOpacity
                  key={tx.id}
                  onLongPress={() => handleDeleteTransaction(tx.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.txRow}>
                    <View
                      style={[
                        styles.txIconBg,
                        { backgroundColor: `${cat?.color ?? Colors.primary}22` },
                      ]}
                    >
                      <Text style={styles.txIcon}>{cat?.icon ?? '💸'}</Text>
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txDesc}>{tx.description}</Text>
                      <Text style={styles.txMeta}>
                        {cat?.name ?? ''} · {formatShortDate(tx.date, user.language)}
                      </Text>
                    </View>
                    <View style={styles.txAmountCol}>
                      <Text
                        style={[
                          styles.txAmount,
                          { color: tx.type === 'income' ? Colors.success : Colors.text.primary },
                        ]}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amount, user.currency, user.language)}
                      </Text>
                      <Badge
                        label={
                          tx.type === 'income' ? t('salary.type_income') : t('salary.type_expense')
                        }
                        variant={tx.type === 'income' ? 'success' : 'neutral'}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {/* Income Sources */}
          {incomeSources.length > 0 && (
            <View style={styles.sourcesSection}>
              <Text style={[styles.sectionTitle, { marginBottom: Spacing.md }]}>
                {t('salary.income_sources')}
              </Text>
              {incomeSources.map((src) => (
                <View key={src.id} style={styles.sourceRow}>
                  <View style={styles.sourceInfo}>
                    <Text style={styles.sourceName}>{src.name}</Text>
                    <Badge
                      label={src.type === 'fixed' ? t('salary.fixed') : t('salary.variable')}
                      variant={src.type === 'fixed' ? 'success' : 'warning'}
                    />
                  </View>
                  <View style={styles.sourceRight}>
                    <Text style={styles.sourceAmount}>
                      {formatCurrency(src.amount, user.currency, user.language)}
                    </Text>
                    <TouchableOpacity onPress={() => handleDeleteSource(src.id)}>
                      <Text style={styles.deleteBtn}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.tip}>💡 {t('dashboard.tip_50_30_20')}</Text>
        </View>
      </ScrollView>

      {/* Edit Salary Sheet */}
      <BottomSheet
        visible={showEditSalary}
        onClose={() => setShowEditSalary(false)}
        title={t('salary.edit_salary')}
        snapPoint={0.45}
      >
        <AmountInput
          label={t('salary.monthly_salary')}
          value={newSalaryStr}
          onChangeText={setNewSalaryStr}
          currency={user.currency}
          large
        />
        <Button
          title={t('salary.update_salary')}
          onPress={handleUpdateSalary}
          fullWidth
          size="lg"
        />
      </BottomSheet>

      {/* Add Category Sheet */}
      <BottomSheet
        visible={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        title={t('salary.add_category')}
        snapPoint={0.8}
      >
        <Input
          label={t('salary.category_name')}
          value={newCatName}
          onChangeText={setNewCatName}
          placeholder={t('salary.category_name_placeholder')}
        />
        <Input
          label={`${t('salary.category_percentage')} (max ${unallocated}%)`}
          value={newCatPct}
          onChangeText={setNewCatPct}
          placeholder={`${unallocated}`}
          keyboardType="decimal-pad"
          suffix={<Text style={styles.inputSuffix}>%</Text>}
        />
        <Text style={styles.iconLabel}>{t('salary.category_icon')}</Text>
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
        <Text style={styles.iconLabel}>{t('salary.category_color')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
          {CATEGORY_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setNewCatColor(color)}
              style={[
                styles.colorBtn,
                { backgroundColor: color },
                newCatColor === color && styles.colorBtnSelected,
              ]}
            />
          ))}
        </ScrollView>
        <Button
          title={t('salary.add_category')}
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
        title={t('salary.add_income_source')}
        snapPoint={0.6}
      >
        <Input
          label={t('salary.income_name')}
          value={newSourceName}
          onChangeText={setNewSourceName}
          placeholder={t('salary.income_source_placeholder')}
        />
        <AmountInput
          label={t('salary.income_amount')}
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
              <Text
                style={[styles.typeBtnTxt, newSourceType === type && { color: Colors.primary }]}
              >
                {type === 'fixed' ? `🔒 ${t('salary.fixed')}` : `📊 ${t('salary.variable')}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={t('common.add')}
          onPress={handleAddSource}
          fullWidth
          size="lg"
          style={{ marginTop: Spacing.md }}
        />
      </BottomSheet>

      {/* Add Transaction Sheet */}
      <BottomSheet
        visible={showAddTx}
        onClose={() => setShowAddTx(false)}
        title={t('salary.add_transaction')}
        snapPoint={0.85}
      >
        <Input
          label={t('salary.transaction_name')}
          value={txDesc}
          onChangeText={setTxDesc}
          placeholder={t('salary.transaction_name_placeholder')}
        />
        <AmountInput
          label={t('salary.transaction_amount')}
          value={txAmount}
          onChangeText={setTxAmount}
          currency={user.currency}
        />

        {/* Type toggle */}
        <View style={styles.typeRow}>
          {(['expense', 'income'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setTxType(type)}
              style={[styles.typeBtn, txType === type && styles.typeBtnSelected]}
            >
              <Text style={[styles.typeBtnTxt, txType === type && { color: Colors.primary }]}>
                {type === 'expense'
                  ? `💸 ${t('salary.type_expense')}`
                  : `💵 ${t('salary.type_income')}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category picker */}
        <Text style={styles.iconLabel}>{t('salary.transaction_category')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catPickerRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setTxCategoryId(cat.id)}
              style={[
                styles.catPickerItem,
                txCategoryId === cat.id && {
                  borderColor: cat.color,
                  backgroundColor: `${cat.color}22`,
                },
              ]}
            >
              <Text style={styles.catPickerIcon}>{cat.icon}</Text>
              <Text style={styles.catPickerName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Input
          label={t('salary.transaction_date')}
          value={txDate}
          onChangeText={setTxDate}
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
        />
        <Button
          title={t('common.add')}
          onPress={handleAddTransaction}
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
  incomeValue: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.white,
    marginTop: 2,
  },
  headerActions: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' },
  editBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editBtnText: {
    fontSize: Typography.size.sm,
    color: Colors.white,
    fontWeight: Typography.weight.medium,
  },
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
  addBtnText: {
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
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
  catIconBg: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconText: { fontSize: 22 },
  catName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  catBudget: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },
  catRemaining: {
    fontSize: Typography.size.sm,
    color: Colors.success,
    fontWeight: Typography.weight.medium,
  },
  catProgressRow: { gap: 6 },
  catProgressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  catSpent: { fontSize: Typography.size.xs, color: Colors.text.tertiary },
  catProgressPct: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  monthArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthArrowDisabled: { opacity: 0.3 },
  monthArrowText: { fontSize: 22, color: Colors.text.primary, lineHeight: 28 },
  monthArrowTextDisabled: { color: Colors.text.tertiary },
  monthLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  emptyTx: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
    marginBottom: Spacing.md,
  },
  emptyTxText: { fontSize: Typography.size.sm, color: Colors.text.tertiary },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.default,
    gap: Spacing.md,
  },
  txIconBg: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIcon: { fontSize: 20 },
  txInfo: { flex: 1 },
  txDesc: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  txMeta: { fontSize: Typography.size.xs, color: Colors.text.tertiary, marginTop: 2 },
  txAmountCol: { alignItems: 'flex-end', gap: 4 },
  txAmount: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
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
  sourceName: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  sourceRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  sourceAmount: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.success,
  },
  deleteBtn: { fontSize: 18 },
  tip: {
    textAlign: 'center',
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  iconLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.sm,
  },
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
    borderColor: Colors.transparent,
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
  typeBtnTxt: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
  },
  catPickerRow: { marginBottom: Spacing.base },
  catPickerItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
    marginRight: Spacing.sm,
    minWidth: 72,
  },
  catPickerIcon: { fontSize: 22, marginBottom: 4 },
  catPickerName: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  inputSuffix: { color: Colors.text.secondary, paddingRight: 12 },
});
