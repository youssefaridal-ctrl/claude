import { int, real, text, sqliteTable, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Users (singleton) ───────────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().default(''),
  language: text('language', { enum: ['fr', 'ar', 'en'] }).notNull().default('fr'),
  currency: text('currency', {
    enum: ['MAD', 'EUR', 'USD', 'GBP', 'TND', 'DZD', 'SAR', 'AED'],
  })
    .notNull()
    .default('MAD'),
  salary: real('salary').notNull().default(0),
  salaryPaymentDay: int('salary_payment_day').notNull().default(1),
  onboardingCompleted: int('onboarding_completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Income Sources ───────────────────────────────────────────────────────────
export const incomeSources = sqliteTable('income_sources', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  amount: real('amount').notNull(),
  type: text('type', { enum: ['fixed', 'variable'] }).notNull().default('fixed'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  deletedAt: text('deleted_at'),
});

// ─── Budget Categories ────────────────────────────────────────────────────────
export const budgetCategories = sqliteTable('budget_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  percentage: real('percentage').notNull().default(0),
  amount: real('amount').notNull().default(0),
  color: text('color').notNull().default('#6366F1'),
  icon: text('icon').notNull().default('💰'),
  sortOrder: int('sort_order').notNull().default(0),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  deletedAt: text('deleted_at'),
});

// ─── Transactions ─────────────────────────────────────────────────────────────
export const transactions = sqliteTable(
  'transactions',
  {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    amount: real('amount').notNull(),
    categoryId: text('category_id').notNull(),
    date: text('date').notNull(),
    month: text('month').notNull(), // YYYY-MM
    type: text('type', { enum: ['expense', 'income'] }).notNull(),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    deletedAt: text('deleted_at'),
  },
  (t) => ({
    monthIdx: index('tx_month_idx').on(t.month),
    categoryIdx: index('tx_category_idx').on(t.categoryId),
    monthCategoryIdx: index('tx_month_category_idx').on(t.month, t.categoryId),
  })
);

// ─── Credits ──────────────────────────────────────────────────────────────────
export const credits = sqliteTable('credits', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', {
    enum: [
      'mortgage',
      'car_loan',
      'personal_loan',
      'consumer_credit',
      'student_loan',
      'credit_card',
      'other',
    ],
  })
    .notNull()
    .default('other'),
  totalAmount: real('total_amount').notNull().default(0),
  remainingAmount: real('remaining_amount').notNull().default(0),
  monthlyPayment: real('monthly_payment').notNull().default(0),
  interestRate: real('interest_rate').notNull().default(0),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  bank: text('bank').notNull().default(''),
  color: text('color').notNull().default('#6366F1'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  deletedAt: text('deleted_at'),
});

// ─── Emergency Fund (singleton) ───────────────────────────────────────────────
export const emergencyFund = sqliteTable('emergency_fund', {
  id: int('id').primaryKey({ autoIncrement: true }),
  currentAmount: real('current_amount').notNull().default(0),
  targetAmount: real('target_amount').notNull().default(0),
  monthlyContribution: real('monthly_contribution').notNull().default(0),
  targetType: text('target_type', {
    enum: ['3_months', '6_months', '12_months', 'custom'],
  })
    .notNull()
    .default('6_months'),
  monthlyExpenses: real('monthly_expenses').notNull().default(0),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Emergency Transactions ───────────────────────────────────────────────────
export const emergencyTransactions = sqliteTable('emergency_transactions', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['contribution', 'withdrawal'] }).notNull(),
  amount: real('amount').notNull(),
  date: text('date').notNull(),
  note: text('note').notNull().default(''),
  deletedAt: text('deleted_at'),
});

// ─── Goals ────────────────────────────────────────────────────────────────────
export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  type: text('type', {
    enum: [
      'travel',
      'car',
      'home',
      'education',
      'emergency',
      'retirement',
      'wedding',
      'gadget',
      'business',
      'other',
    ],
  })
    .notNull()
    .default('other'),
  targetAmount: real('target_amount').notNull().default(0),
  currentAmount: real('current_amount').notNull().default(0),
  targetDate: text('target_date').notNull(),
  priority: text('priority', { enum: ['high', 'medium', 'low'] }).notNull().default('medium'),
  color: text('color').notNull().default('#6366F1'),
  icon: text('icon').notNull().default('🎯'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  deletedAt: text('deleted_at'),
});

// ─── Goal Contributions ───────────────────────────────────────────────────────
export const goalContributions = sqliteTable(
  'goal_contributions',
  {
    id: text('id').primaryKey(),
    goalId: text('goal_id').notNull(),
    amount: real('amount').notNull(),
    date: text('date').notNull(),
    deletedAt: text('deleted_at'),
  },
  (t) => ({
    goalIdx: index('gc_goal_idx').on(t.goalId),
  })
);

// ─── Type exports ─────────────────────────────────────────────────────────────
export type DbUser = typeof users.$inferSelect;
export type DbIncomeSource = typeof incomeSources.$inferSelect;
export type DbBudgetCategory = typeof budgetCategories.$inferSelect;
export type DbTransaction = typeof transactions.$inferSelect;
export type DbCredit = typeof credits.$inferSelect;
export type DbEmergencyFund = typeof emergencyFund.$inferSelect;
export type DbEmergencyTransaction = typeof emergencyTransactions.$inferSelect;
export type DbGoal = typeof goals.$inferSelect;
export type DbGoalContribution = typeof goalContributions.$inferSelect;
