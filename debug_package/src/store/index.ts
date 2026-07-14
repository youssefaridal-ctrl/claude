import { eq, isNull } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { getDb } from '../database/client';
import * as schema from '../database/schema';
import i18n from '../i18n';
import { Colors } from '../theme/colors';
import type {
  BudgetCategory,
  Credit,
  Currency,
  EmergencyFund,
  Goal,
  IncomeSource,
  Language,
  Transaction,
  UserProfile,
} from './types';

// ─── Defaults ─────────────────────────────────────────────────────────────────

function getDefaultCategories(): Omit<BudgetCategory, 'amount'>[] {
  return [
    {
      id: 'housing',
      name: i18n.t('salary.categories.housing'),
      percentage: 30,
      color: Colors.categories.housing,
      icon: '🏠',
      spent: 0,
    },
    {
      id: 'food',
      name: i18n.t('salary.categories.food'),
      percentage: 15,
      color: Colors.categories.food,
      icon: '🛒',
      spent: 0,
    },
    {
      id: 'transport',
      name: i18n.t('salary.categories.transport'),
      percentage: 10,
      color: Colors.categories.transport,
      icon: '🚗',
      spent: 0,
    },
    {
      id: 'health',
      name: i18n.t('salary.categories.health'),
      percentage: 5,
      color: Colors.categories.health,
      icon: '❤️',
      spent: 0,
    },
    {
      id: 'leisure',
      name: i18n.t('salary.categories.leisure'),
      percentage: 10,
      color: Colors.categories.leisure,
      icon: '🎮',
      spent: 0,
    },
    {
      id: 'savings',
      name: i18n.t('salary.categories.savings'),
      percentage: 20,
      color: Colors.categories.savings,
      icon: '💰',
      spent: 0,
    },
    {
      id: 'utilities',
      name: i18n.t('salary.categories.utilities'),
      percentage: 10,
      color: Colors.categories.utilities,
      icon: '⚡',
      spent: 0,
    },
  ];
}

const DEFAULT_EMERGENCY_FUND: EmergencyFund = {
  currentAmount: 0,
  targetAmount: 0,
  monthlyContribution: 0,
  targetType: '6_months',
  monthlyExpenses: 0,
  transactions: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateId = () => Crypto.randomUUID();
const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

const recalcCategoryAmounts = (
  categories: BudgetCategory[],
  totalIncome: number
): BudgetCategory[] =>
  categories.map((c) => ({ ...c, amount: Math.round((c.percentage / 100) * totalIncome) }));

// ─── DB mappers ───────────────────────────────────────────────────────────────

function dbRowToCategory(row: schema.DbBudgetCategory): BudgetCategory {
  return {
    id: row.id,
    name: row.name,
    percentage: row.percentage,
    amount: row.amount,
    color: row.color,
    icon: row.icon,
    spent: 0,
  };
}

function dbRowToIncomeSource(row: schema.DbIncomeSource): IncomeSource {
  return { id: row.id, name: row.name, amount: row.amount, type: row.type };
}

function dbRowToTransaction(row: schema.DbTransaction): Transaction {
  return {
    id: row.id,
    description: row.description,
    amount: row.amount,
    categoryId: row.categoryId,
    date: row.date,
    type: row.type,
    month: row.month,
  };
}

function dbRowToCredit(row: schema.DbCredit): Credit {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    totalAmount: row.totalAmount,
    remainingAmount: row.remainingAmount,
    monthlyPayment: row.monthlyPayment,
    interestRate: row.interestRate,
    startDate: row.startDate,
    endDate: row.endDate,
    bank: row.bank,
    color: row.color,
  };
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface AppState {
  isLoading: boolean;
  isInitialized: boolean;
  initError: string | null;

  user: UserProfile;
  salary: number;
  categories: BudgetCategory[];
  incomeSources: IncomeSource[];
  transactions: Transaction[];
  credits: Credit[];
  emergencyFund: EmergencyFund;
  goals: Goal[];

  initializeApp: () => Promise<void>;
  updateUser: (user: Partial<UserProfile>) => Promise<void>;
  setSalary: (amount: number) => Promise<void>;
  completeOnboarding: (
    name: string,
    salary: number,
    language: Language,
    currency: Currency
  ) => Promise<void>;

  updateCategories: (categories: BudgetCategory[]) => Promise<void>;
  apply503020Rule: () => void;
  addCategory: (category: Omit<BudgetCategory, 'id' | 'spent'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addIncomeSource: (source: Omit<IncomeSource, 'id'>) => Promise<void>;
  deleteIncomeSource: (id: string) => Promise<void>;

  addTransaction: (tx: Omit<Transaction, 'id' | 'month'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getMonthTransactions: (month: string) => Transaction[];
  getCurrentMonthSpentByCategory: () => Record<string, number>;

  addCredit: (credit: Omit<Credit, 'id'>) => Promise<void>;
  updateCredit: (id: string, credit: Partial<Credit>) => Promise<void>;
  deleteCredit: (id: string) => Promise<void>;

  updateEmergencyFund: (fund: Partial<EmergencyFund>) => Promise<void>;
  addEmergencyContribution: (amount: number, note: string) => Promise<void>;
  withdrawFromEmergency: (amount: number, reason: string) => Promise<void>;

  addGoal: (goal: Omit<Goal, 'id' | 'contributions' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addGoalContribution: (goalId: string, amount: number) => Promise<void>;

  getTotalIncome: () => number;
  getTotalMonthlyPayments: () => number;
  getBudgetHealth: () => number;
  getDebtRatio: () => number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: true,
  isInitialized: false,
  initError: null,

  user: {
    name: '',
    language: 'fr',
    currency: 'MAD',
    salaryPaymentDay: 1,
    onboardingCompleted: false,
  },
  salary: 0,
  categories: getDefaultCategories().map((c) => ({ ...c, amount: 0 })),
  incomeSources: [],
  transactions: [],
  credits: [],
  emergencyFund: DEFAULT_EMERGENCY_FUND,
  goals: [],

  // ── Init ──────────────────────────────────────────────────────────────────
  initializeApp: async () => {
    try {
      const db = getDb();

      const [
        userRows,
        categoryRows,
        incomeRows,
        txRows,
        creditRows,
        efRows,
        efTxRows,
        goalRows,
        contribRows,
      ] = await Promise.all([
        db.select().from(schema.users).where(eq(schema.users.id, 1)),
        db.select().from(schema.budgetCategories).where(isNull(schema.budgetCategories.deletedAt)),
        db.select().from(schema.incomeSources).where(isNull(schema.incomeSources.deletedAt)),
        db.select().from(schema.transactions).where(isNull(schema.transactions.deletedAt)),
        db.select().from(schema.credits).where(isNull(schema.credits.deletedAt)),
        db.select().from(schema.emergencyFund).where(eq(schema.emergencyFund.id, 1)),
        db
          .select()
          .from(schema.emergencyTransactions)
          .where(isNull(schema.emergencyTransactions.deletedAt)),
        db.select().from(schema.goals).where(isNull(schema.goals.deletedAt)),
        db
          .select()
          .from(schema.goalContributions)
          .where(isNull(schema.goalContributions.deletedAt)),
      ]);

      const userRow = userRows[0];
      const salary = userRow?.salary ?? 0;

      const parsedIncomeSources = incomeRows.map(dbRowToIncomeSource);
      const totalIncome = salary + parsedIncomeSources.reduce((a, s) => a + s.amount, 0);

      // Seed default categories if none exist
      let parsedCategories: BudgetCategory[];
      if (categoryRows.length === 0) {
        const defaults = getDefaultCategories().map((c, i) => ({
          ...c,
          amount: Math.round((c.percentage / 100) * totalIncome),
          sortOrder: i,
        }));
        await db.insert(schema.budgetCategories).values(
          defaults.map((c) => ({
            id: c.id,
            name: c.name,
            percentage: c.percentage,
            amount: c.amount,
            color: c.color,
            icon: c.icon,
            sortOrder: c.sortOrder,
          }))
        );
        parsedCategories = defaults.map((c) => ({ ...c, spent: 0 }));
      } else {
        parsedCategories = recalcCategoryAmounts(categoryRows.map(dbRowToCategory), totalIncome);
      }

      const ef = efRows[0];
      const emergencyFund: EmergencyFund = ef
        ? {
            currentAmount: ef.currentAmount,
            targetAmount: ef.targetAmount,
            monthlyContribution: ef.monthlyContribution,
            targetType: ef.targetType,
            monthlyExpenses: ef.monthlyExpenses,
            transactions: efTxRows
              .filter((t) => !t.deletedAt)
              .map((t) => ({
                id: t.id,
                type: t.type,
                amount: t.amount,
                date: t.date,
                note: t.note,
              })),
          }
        : DEFAULT_EMERGENCY_FUND;

      const parsedGoals: Goal[] = goalRows.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        type: g.type,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        targetDate: g.targetDate,
        priority: g.priority,
        color: g.color,
        icon: g.icon,
        createdAt: g.createdAt,
        contributions: contribRows
          .filter((c) => c.goalId === g.id && !c.deletedAt)
          .map((c) => ({ id: c.id, amount: c.amount, date: c.date })),
      }));

      set({
        user: userRow
          ? {
              name: userRow.name,
              language: userRow.language,
              currency: userRow.currency,
              salaryPaymentDay: userRow.salaryPaymentDay,
              onboardingCompleted: userRow.onboardingCompleted,
            }
          : get().user,
        salary,
        categories: parsedCategories,
        incomeSources: parsedIncomeSources,
        transactions: txRows.map(dbRowToTransaction),
        credits: creditRows.map(dbRowToCredit),
        emergencyFund,
        goals: parsedGoals,
        isLoading: false,
        isInitialized: true,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Database initialization failed';
      set({ isLoading: false, isInitialized: false, initError: msg });
    }
  },

  // ── User ──────────────────────────────────────────────────────────────────
  updateUser: async (userUpdate) => {
    const updated = { ...get().user, ...userUpdate };
    set({ user: updated });
    await getDb()
      .update(schema.users)
      .set({
        name: updated.name,
        language: updated.language,
        currency: updated.currency,
        salaryPaymentDay: updated.salaryPaymentDay,
        onboardingCompleted: updated.onboardingCompleted,
        updatedAt: now(),
      })
      .where(eq(schema.users.id, 1));
  },

  setSalary: async (amount) => {
    const totalIncome = amount + get().incomeSources.reduce((a, s) => a + s.amount, 0);
    const updated = recalcCategoryAmounts(get().categories, totalIncome);
    set({ salary: amount, categories: updated });
    const db = getDb();
    await db
      .update(schema.users)
      .set({ salary: amount, updatedAt: now() })
      .where(eq(schema.users.id, 1));
    await Promise.all(
      updated.map((c) =>
        db
          .update(schema.budgetCategories)
          .set({ amount: c.amount })
          .where(eq(schema.budgetCategories.id, c.id))
      )
    );
  },

  completeOnboarding: async (name, salary, language, currency) => {
    const totalIncome = salary + get().incomeSources.reduce((a, s) => a + s.amount, 0);
    const updated = recalcCategoryAmounts(get().categories, totalIncome);
    const user: UserProfile = {
      ...get().user,
      name,
      language,
      currency,
      onboardingCompleted: true,
    };
    set({ user, salary, categories: updated });
    const db = getDb();
    await db
      .update(schema.users)
      .set({ name, salary, language, currency, onboardingCompleted: true, updatedAt: now() })
      .where(eq(schema.users.id, 1));
    await Promise.all(
      updated.map((c) =>
        db
          .update(schema.budgetCategories)
          .set({ amount: c.amount })
          .where(eq(schema.budgetCategories.id, c.id))
      )
    );
  },

  // ── Categories ────────────────────────────────────────────────────────────
  updateCategories: async (categories) => {
    set({ categories });
    const db = getDb();
    await Promise.all(
      categories.map((c) =>
        db
          .update(schema.budgetCategories)
          .set({
            name: c.name,
            percentage: c.percentage,
            amount: c.amount,
            color: c.color,
            icon: c.icon,
          })
          .where(eq(schema.budgetCategories.id, c.id))
      )
    );
  },

  apply503020Rule: () => {
    const totalIncome = get().getTotalIncome();
    const preset: BudgetCategory[] = [
      {
        id: 'needs',
        name: i18n.t('salary.needs'),
        percentage: 50,
        amount: Math.round(totalIncome * 0.5),
        color: Colors.primary,
        icon: '🏠',
        spent: 0,
      },
      {
        id: 'wants',
        name: i18n.t('salary.wants'),
        percentage: 30,
        amount: Math.round(totalIncome * 0.3),
        color: Colors.secondary,
        icon: '🎮',
        spent: 0,
      },
      {
        id: 'savings',
        name: i18n.t('salary.savings'),
        percentage: 20,
        amount: Math.round(totalIncome * 0.2),
        color: Colors.success,
        icon: '💰',
        spent: 0,
      },
    ];
    get().updateCategories(preset);
  },

  addCategory: async (cat) => {
    const totalIncome = get().getTotalIncome();
    const newCat: BudgetCategory = {
      ...cat,
      id: generateId(),
      amount: Math.round((cat.percentage / 100) * totalIncome),
      spent: 0,
    };
    const sortOrder = get().categories.length;
    const updated = [...get().categories, newCat];
    set({ categories: updated });
    await getDb().insert(schema.budgetCategories).values({
      id: newCat.id,
      name: newCat.name,
      percentage: newCat.percentage,
      amount: newCat.amount,
      color: newCat.color,
      icon: newCat.icon,
      sortOrder,
    });
  },

  deleteCategory: async (id) => {
    const updated = get().categories.filter((c) => c.id !== id);
    set({ categories: updated });
    await getDb()
      .update(schema.budgetCategories)
      .set({ deletedAt: now() })
      .where(eq(schema.budgetCategories.id, id));
  },

  // ── Income Sources ────────────────────────────────────────────────────────
  addIncomeSource: async (source) => {
    const newSource: IncomeSource = { ...source, id: generateId() };
    const updated = [...get().incomeSources, newSource];
    const totalIncome = get().salary + updated.reduce((a, s) => a + s.amount, 0);
    const updatedCats = recalcCategoryAmounts(get().categories, totalIncome);
    set({ incomeSources: updated, categories: updatedCats });
    const db = getDb();
    await db.insert(schema.incomeSources).values({
      id: newSource.id,
      name: newSource.name,
      amount: newSource.amount,
      type: newSource.type,
    });
    await Promise.all(
      updatedCats.map((c) =>
        db
          .update(schema.budgetCategories)
          .set({ amount: c.amount })
          .where(eq(schema.budgetCategories.id, c.id))
      )
    );
  },

  deleteIncomeSource: async (id) => {
    const updated = get().incomeSources.filter((s) => s.id !== id);
    const totalIncome = get().salary + updated.reduce((a, s) => a + s.amount, 0);
    const updatedCats = recalcCategoryAmounts(get().categories, totalIncome);
    set({ incomeSources: updated, categories: updatedCats });
    const db = getDb();
    await db
      .update(schema.incomeSources)
      .set({ deletedAt: now() })
      .where(eq(schema.incomeSources.id, id));
    await Promise.all(
      updatedCats.map((c) =>
        db
          .update(schema.budgetCategories)
          .set({ amount: c.amount })
          .where(eq(schema.budgetCategories.id, c.id))
      )
    );
  },

  // ── Transactions ──────────────────────────────────────────────────────────
  addTransaction: async (tx) => {
    const newTx: Transaction = { ...tx, id: generateId(), month: tx.date.slice(0, 7) };
    const updated = [newTx, ...get().transactions];
    set({ transactions: updated });
    await getDb().insert(schema.transactions).values({
      id: newTx.id,
      description: newTx.description,
      amount: newTx.amount,
      categoryId: newTx.categoryId,
      date: newTx.date,
      month: newTx.month,
      type: newTx.type,
    });
  },

  deleteTransaction: async (id) => {
    const updated = get().transactions.filter((t) => t.id !== id);
    set({ transactions: updated });
    await getDb()
      .update(schema.transactions)
      .set({ deletedAt: now() })
      .where(eq(schema.transactions.id, id));
  },

  getMonthTransactions: (month) => get().transactions.filter((t) => t.month === month),

  getCurrentMonthSpentByCategory: () => {
    const month = getCurrentMonth();
    const txs = get().transactions.filter((t) => t.month === month && t.type === 'expense');
    return txs.reduce<Record<string, number>>((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {});
  },

  // ── Credits ───────────────────────────────────────────────────────────────
  addCredit: async (credit) => {
    const newCredit: Credit = { ...credit, id: generateId() };
    const updated = [...get().credits, newCredit];
    set({ credits: updated });
    await getDb().insert(schema.credits).values({
      id: newCredit.id,
      name: newCredit.name,
      type: newCredit.type,
      totalAmount: newCredit.totalAmount,
      remainingAmount: newCredit.remainingAmount,
      monthlyPayment: newCredit.monthlyPayment,
      interestRate: newCredit.interestRate,
      startDate: newCredit.startDate,
      endDate: newCredit.endDate,
      bank: newCredit.bank,
      color: newCredit.color,
    });
  },

  updateCredit: async (id, creditUpdate) => {
    const updated = get().credits.map((c) => (c.id === id ? { ...c, ...creditUpdate } : c));
    set({ credits: updated });
    const credit = updated.find((c) => c.id === id);
    if (credit) {
      await getDb()
        .update(schema.credits)
        .set({
          name: credit.name,
          type: credit.type,
          totalAmount: credit.totalAmount,
          remainingAmount: credit.remainingAmount,
          monthlyPayment: credit.monthlyPayment,
          interestRate: credit.interestRate,
          startDate: credit.startDate,
          endDate: credit.endDate,
          bank: credit.bank,
          color: credit.color,
        })
        .where(eq(schema.credits.id, id));
    }
  },

  deleteCredit: async (id) => {
    const updated = get().credits.filter((c) => c.id !== id);
    set({ credits: updated });
    await getDb().update(schema.credits).set({ deletedAt: now() }).where(eq(schema.credits.id, id));
  },

  // ── Emergency Fund ────────────────────────────────────────────────────────
  updateEmergencyFund: async (fund) => {
    const updated = { ...get().emergencyFund, ...fund };
    set({ emergencyFund: updated });
    await getDb()
      .update(schema.emergencyFund)
      .set({
        currentAmount: updated.currentAmount,
        targetAmount: updated.targetAmount,
        monthlyContribution: updated.monthlyContribution,
        targetType: updated.targetType,
        monthlyExpenses: updated.monthlyExpenses,
        updatedAt: now(),
      })
      .where(eq(schema.emergencyFund.id, 1));
  },

  addEmergencyContribution: async (amount, note) => {
    const txId = generateId();
    const tx = { id: txId, type: 'contribution' as const, amount, date: today(), note };
    const updated = {
      ...get().emergencyFund,
      currentAmount: get().emergencyFund.currentAmount + amount,
      transactions: [tx, ...get().emergencyFund.transactions],
    };
    set({ emergencyFund: updated });
    const db = getDb();
    await db
      .insert(schema.emergencyTransactions)
      .values({ id: txId, type: 'contribution', amount, date: tx.date, note });
    await db
      .update(schema.emergencyFund)
      .set({ currentAmount: updated.currentAmount, updatedAt: now() })
      .where(eq(schema.emergencyFund.id, 1));
  },

  withdrawFromEmergency: async (amount, reason) => {
    const txId = generateId();
    const tx = { id: txId, type: 'withdrawal' as const, amount, date: today(), note: reason };
    const updated = {
      ...get().emergencyFund,
      currentAmount: Math.max(0, get().emergencyFund.currentAmount - amount),
      transactions: [tx, ...get().emergencyFund.transactions],
    };
    set({ emergencyFund: updated });
    const db = getDb();
    await db
      .insert(schema.emergencyTransactions)
      .values({ id: txId, type: 'withdrawal', amount, date: tx.date, note: reason });
    await db
      .update(schema.emergencyFund)
      .set({ currentAmount: updated.currentAmount, updatedAt: now() })
      .where(eq(schema.emergencyFund.id, 1));
  },

  // ── Goals ─────────────────────────────────────────────────────────────────
  addGoal: async (goal) => {
    const newGoal: Goal = { ...goal, id: generateId(), contributions: [], createdAt: now() };
    const updated = [...get().goals, newGoal];
    set({ goals: updated });
    await getDb().insert(schema.goals).values({
      id: newGoal.id,
      name: newGoal.name,
      description: newGoal.description,
      type: newGoal.type,
      targetAmount: newGoal.targetAmount,
      currentAmount: newGoal.currentAmount,
      targetDate: newGoal.targetDate,
      priority: newGoal.priority,
      color: newGoal.color,
      icon: newGoal.icon,
      createdAt: newGoal.createdAt,
    });
  },

  updateGoal: async (id, goalUpdate) => {
    const updated = get().goals.map((g) => (g.id === id ? { ...g, ...goalUpdate } : g));
    set({ goals: updated });
    const goal = updated.find((g) => g.id === id);
    if (goal) {
      await getDb()
        .update(schema.goals)
        .set({
          name: goal.name,
          description: goal.description,
          type: goal.type,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate,
          priority: goal.priority,
          color: goal.color,
          icon: goal.icon,
        })
        .where(eq(schema.goals.id, id));
    }
  },

  deleteGoal: async (id) => {
    const updated = get().goals.filter((g) => g.id !== id);
    set({ goals: updated });
    await getDb().update(schema.goals).set({ deletedAt: now() }).where(eq(schema.goals.id, id));
  },

  addGoalContribution: async (goalId, amount) => {
    const contribId = generateId();
    const contribution = { id: contribId, amount, date: today() };
    const updated = get().goals.map((g) =>
      g.id === goalId
        ? {
            ...g,
            currentAmount: g.currentAmount + amount,
            contributions: [contribution, ...g.contributions],
          }
        : g
    );
    set({ goals: updated });
    const db = getDb();
    await db
      .insert(schema.goalContributions)
      .values({ id: contribId, goalId, amount, date: contribution.date });
    const goal = updated.find((g) => g.id === goalId);
    if (!goal) return;
    await db
      .update(schema.goals)
      .set({ currentAmount: goal.currentAmount })
      .where(eq(schema.goals.id, goalId));
  },

  // ── Computed ──────────────────────────────────────────────────────────────
  getTotalIncome: () => get().salary + get().incomeSources.reduce((a, s) => a + s.amount, 0),

  getTotalMonthlyPayments: () => get().credits.reduce((a, c) => a + c.monthlyPayment, 0),

  getBudgetHealth: () => {
    const total = get().getTotalIncome();
    if (total === 0) return 100;
    const month = getCurrentMonth();
    const spent = get()
      .transactions.filter((t) => t.month === month && t.type === 'expense')
      .reduce((a, t) => a + t.amount, 0);
    return Math.max(0, Math.round(((total - spent) / total) * 100));
  },

  getDebtRatio: () => {
    const totalIncome = get().getTotalIncome();
    if (totalIncome === 0) return 0;
    return Math.round((get().getTotalMonthlyPayments() / totalIncome) * 100);
  },
}));
