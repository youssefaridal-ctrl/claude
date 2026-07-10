import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  BudgetCategory,
  IncomeSource,
  Transaction,
  Credit,
  EmergencyFund,
  Goal,
  Currency,
  Language,
} from './types';
import { Colors } from '../theme/colors';

const STORAGE_KEYS = {
  USER: 'fb_user',
  SALARY: 'fb_salary',
  CATEGORIES: 'fb_categories',
  INCOME_SOURCES: 'fb_income_sources',
  TRANSACTIONS: 'fb_transactions',
  CREDITS: 'fb_credits',
  EMERGENCY: 'fb_emergency',
  GOALS: 'fb_goals',
};

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: 'housing', name: 'Logement', percentage: 30, amount: 0, color: Colors.categories.housing, icon: '🏠', spent: 0 },
  { id: 'food', name: 'Alimentation', percentage: 15, amount: 0, color: Colors.categories.food, icon: '🛒', spent: 0 },
  { id: 'transport', name: 'Transport', percentage: 10, amount: 0, color: Colors.categories.transport, icon: '🚗', spent: 0 },
  { id: 'health', name: 'Santé', percentage: 5, amount: 0, color: Colors.categories.health, icon: '❤️', spent: 0 },
  { id: 'leisure', name: 'Loisirs', percentage: 10, amount: 0, color: Colors.categories.leisure, icon: '🎮', spent: 0 },
  { id: 'savings', name: 'Épargne', percentage: 20, amount: 0, color: Colors.categories.savings, icon: '💰', spent: 0 },
  { id: 'utilities', name: 'Factures', percentage: 10, amount: 0, color: Colors.categories.utilities, icon: '⚡', spent: 0 },
];

const DEFAULT_EMERGENCY_FUND: EmergencyFund = {
  currentAmount: 0,
  targetAmount: 0,
  monthlyContribution: 0,
  targetType: '6_months',
  monthlyExpenses: 0,
  transactions: [],
};

interface AppState {
  // App state
  isLoading: boolean;
  isInitialized: boolean;

  // User
  user: UserProfile;
  salary: number;
  categories: BudgetCategory[];
  incomeSources: IncomeSource[];
  transactions: Transaction[];

  // Credits
  credits: Credit[];

  // Emergency
  emergencyFund: EmergencyFund;

  // Goals
  goals: Goal[];

  // Actions - User
  initializeApp: () => Promise<void>;
  updateUser: (user: Partial<UserProfile>) => Promise<void>;
  setSalary: (amount: number) => Promise<void>;
  completeOnboarding: (name: string, salary: number, language: Language, currency: Currency) => Promise<void>;

  // Actions - Categories
  updateCategories: (categories: BudgetCategory[]) => Promise<void>;
  apply503020Rule: () => void;
  addCategory: (category: Omit<BudgetCategory, 'id' | 'spent'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Actions - Income Sources
  addIncomeSource: (source: Omit<IncomeSource, 'id'>) => Promise<void>;
  deleteIncomeSource: (id: string) => Promise<void>;

  // Actions - Transactions
  addTransaction: (tx: Omit<Transaction, 'id' | 'month'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getMonthTransactions: (month: string) => Transaction[];
  getCurrentMonthSpentByCategory: () => Record<string, number>;

  // Actions - Credits
  addCredit: (credit: Omit<Credit, 'id'>) => Promise<void>;
  updateCredit: (id: string, credit: Partial<Credit>) => Promise<void>;
  deleteCredit: (id: string) => Promise<void>;

  // Actions - Emergency Fund
  updateEmergencyFund: (fund: Partial<EmergencyFund>) => Promise<void>;
  addEmergencyContribution: (amount: number, note: string) => Promise<void>;
  withdrawFromEmergency: (amount: number, reason: string) => Promise<void>;

  // Actions - Goals
  addGoal: (goal: Omit<Goal, 'id' | 'contributions' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addGoalContribution: (goalId: string, amount: number) => Promise<void>;

  // Computed
  getTotalIncome: () => number;
  getTotalMonthlyPayments: () => number;
  getBudgetHealth: () => number;
  getDebtRatio: () => number;
}

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const recalcCategoryAmounts = (categories: BudgetCategory[], totalIncome: number): BudgetCategory[] =>
  categories.map((c) => ({ ...c, amount: Math.round((c.percentage / 100) * totalIncome) }));

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: true,
  isInitialized: false,

  user: {
    name: '',
    language: 'fr',
    currency: 'MAD',
    salaryPaymentDay: 1,
    onboardingCompleted: false,
  },
  salary: 0,
  categories: DEFAULT_CATEGORIES,
  incomeSources: [],
  transactions: [],
  credits: [],
  emergencyFund: DEFAULT_EMERGENCY_FUND,
  goals: [],

  initializeApp: async () => {
    try {
      const [user, salary, categories, incomeSources, transactions, credits, emergency, goals] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.SALARY),
          AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES),
          AsyncStorage.getItem(STORAGE_KEYS.INCOME_SOURCES),
          AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS),
          AsyncStorage.getItem(STORAGE_KEYS.CREDITS),
          AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY),
          AsyncStorage.getItem(STORAGE_KEYS.GOALS),
        ]);

      const parsedSalary = salary ? parseFloat(salary) : 0;
      const parsedCategories = categories ? JSON.parse(categories) : DEFAULT_CATEGORIES;
      const parsedIncomeSources = incomeSources ? JSON.parse(incomeSources) : [];
      const updatedCategories = recalcCategoryAmounts(parsedCategories, parsedSalary + parsedIncomeSources.reduce((a: number, s: IncomeSource) => a + s.amount, 0));

      set({
        user: user ? JSON.parse(user) : get().user,
        salary: parsedSalary,
        categories: updatedCategories,
        incomeSources: parsedIncomeSources,
        transactions: transactions ? JSON.parse(transactions) : [],
        credits: credits ? JSON.parse(credits) : [],
        emergencyFund: emergency ? JSON.parse(emergency) : DEFAULT_EMERGENCY_FUND,
        goals: goals ? JSON.parse(goals) : [],
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      set({ isLoading: false, isInitialized: true });
    }
  },

  updateUser: async (userUpdate) => {
    const updated = { ...get().user, ...userUpdate };
    set({ user: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  },

  setSalary: async (amount) => {
    const totalIncome = amount + get().incomeSources.reduce((a, s) => a + s.amount, 0);
    const updated = recalcCategoryAmounts(get().categories, totalIncome);
    set({ salary: amount, categories: updated });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.SALARY, amount.toString()),
      AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated)),
    ]);
  },

  completeOnboarding: async (name, salary, language, currency) => {
    const totalIncome = salary + get().incomeSources.reduce((a, s) => a + s.amount, 0);
    const updated = recalcCategoryAmounts(get().categories, totalIncome);
    const user: UserProfile = { ...get().user, name, language, currency, onboardingCompleted: true };
    set({ user, salary, categories: updated });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      AsyncStorage.setItem(STORAGE_KEYS.SALARY, salary.toString()),
      AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated)),
    ]);
  },

  updateCategories: async (categories) => {
    set({ categories });
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  apply503020Rule: () => {
    const totalIncome = get().getTotalIncome();
    const preset: BudgetCategory[] = [
      { id: 'needs', name: 'Besoins', percentage: 50, amount: totalIncome * 0.5, color: Colors.primary, icon: '🏠', spent: 0 },
      { id: 'wants', name: 'Envies', percentage: 30, amount: totalIncome * 0.3, color: Colors.secondary, icon: '🎮', spent: 0 },
      { id: 'savings', name: 'Épargne', percentage: 20, amount: totalIncome * 0.2, color: Colors.success, icon: '💰', spent: 0 },
    ];
    get().updateCategories(preset);
  },

  addCategory: async (cat) => {
    const totalIncome = get().getTotalIncome();
    const newCat: BudgetCategory = {
      ...cat,
      id: generateId(),
      amount: (cat.percentage / 100) * totalIncome,
      spent: 0,
    };
    const updated = [...get().categories, newCat];
    set({ categories: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
  },

  deleteCategory: async (id) => {
    const updated = get().categories.filter((c) => c.id !== id);
    set({ categories: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
  },

  addIncomeSource: async (source) => {
    const newSource: IncomeSource = { ...source, id: generateId() };
    const updated = [...get().incomeSources, newSource];
    const totalIncome = get().salary + updated.reduce((a, s) => a + s.amount, 0);
    const updatedCats = recalcCategoryAmounts(get().categories, totalIncome);
    set({ incomeSources: updated, categories: updatedCats });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.INCOME_SOURCES, JSON.stringify(updated)),
      AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCats)),
    ]);
  },

  deleteIncomeSource: async (id) => {
    const updated = get().incomeSources.filter((s) => s.id !== id);
    const totalIncome = get().salary + updated.reduce((a, s) => a + s.amount, 0);
    const updatedCats = recalcCategoryAmounts(get().categories, totalIncome);
    set({ incomeSources: updated, categories: updatedCats });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.INCOME_SOURCES, JSON.stringify(updated)),
      AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCats)),
    ]);
  },

  addTransaction: async (tx) => {
    const newTx: Transaction = { ...tx, id: generateId(), month: tx.date.slice(0, 7) };
    const updated = [newTx, ...get().transactions];
    set({ transactions: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  },

  deleteTransaction: async (id) => {
    const updated = get().transactions.filter((t) => t.id !== id);
    set({ transactions: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
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

  addCredit: async (credit) => {
    const newCredit: Credit = { ...credit, id: generateId() };
    const updated = [...get().credits, newCredit];
    set({ credits: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(updated));
  },

  updateCredit: async (id, creditUpdate) => {
    const updated = get().credits.map((c) => (c.id === id ? { ...c, ...creditUpdate } : c));
    set({ credits: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(updated));
  },

  deleteCredit: async (id) => {
    const updated = get().credits.filter((c) => c.id !== id);
    set({ credits: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(updated));
  },

  updateEmergencyFund: async (fund) => {
    const updated = { ...get().emergencyFund, ...fund };
    set({ emergencyFund: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(updated));
  },

  addEmergencyContribution: async (amount, note) => {
    const tx = { id: generateId(), type: 'contribution' as const, amount, date: new Date().toISOString(), note };
    const updated = {
      ...get().emergencyFund,
      currentAmount: get().emergencyFund.currentAmount + amount,
      transactions: [tx, ...get().emergencyFund.transactions],
    };
    set({ emergencyFund: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(updated));
  },

  withdrawFromEmergency: async (amount, reason) => {
    const tx = { id: generateId(), type: 'withdrawal' as const, amount, date: new Date().toISOString(), note: reason };
    const updated = {
      ...get().emergencyFund,
      currentAmount: Math.max(0, get().emergencyFund.currentAmount - amount),
      transactions: [tx, ...get().emergencyFund.transactions],
    };
    set({ emergencyFund: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(updated));
  },

  addGoal: async (goal) => {
    const newGoal: Goal = { ...goal, id: generateId(), contributions: [], createdAt: new Date().toISOString() };
    const updated = [...get().goals, newGoal];
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
  },

  updateGoal: async (id, goalUpdate) => {
    const updated = get().goals.map((g) => (g.id === id ? { ...g, ...goalUpdate } : g));
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
  },

  deleteGoal: async (id) => {
    const updated = get().goals.filter((g) => g.id !== id);
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
  },

  addGoalContribution: async (goalId, amount) => {
    const contribution = { id: generateId(), amount, date: new Date().toISOString() };
    const updated = get().goals.map((g) =>
      g.id === goalId
        ? { ...g, currentAmount: g.currentAmount + amount, contributions: [contribution, ...g.contributions] }
        : g
    );
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
  },

  getTotalIncome: () => {
    return get().salary + get().incomeSources.reduce((a, s) => a + s.amount, 0);
  },

  getTotalMonthlyPayments: () => {
    return get().credits.reduce((a, c) => a + c.monthlyPayment, 0);
  },

  getBudgetHealth: () => {
    const total = get().getTotalIncome();
    if (total === 0) return 100;
    const month = getCurrentMonth();
    const spent = get().transactions
      .filter((t) => t.month === month && t.type === 'expense')
      .reduce((a, t) => a + t.amount, 0);
    return Math.max(0, Math.round(((total - spent) / total) * 100));
  },

  getDebtRatio: () => {
    const totalIncome = get().getTotalIncome();
    if (totalIncome === 0) return 0;
    return Math.round((get().getTotalMonthlyPayments() / totalIncome) * 100);
  },
}));
