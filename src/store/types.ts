export type Language = 'fr' | 'ar' | 'en';
export type Currency = 'MAD' | 'EUR' | 'USD' | 'GBP' | 'TND' | 'DZD' | 'SAR' | 'AED';

export interface UserProfile {
  name: string;
  language: Language;
  currency: Currency;
  salaryPaymentDay: number;
  onboardingCompleted: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
  icon: string;
  spent: number;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string;
  type: 'expense' | 'income';
  month: string; // YYYY-MM
}

export interface Credit {
  id: string;
  name: string;
  type: 'mortgage' | 'car_loan' | 'personal_loan' | 'consumer_credit' | 'student_loan' | 'credit_card' | 'other';
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  bank: string;
  color: string;
}

export interface EmergencyFundTransaction {
  id: string;
  type: 'contribution' | 'withdrawal';
  amount: number;
  date: string;
  note: string;
}

export interface EmergencyFund {
  currentAmount: number;
  targetAmount: number;
  monthlyContribution: number;
  targetType: '3_months' | '6_months' | '12_months' | 'custom';
  monthlyExpenses: number;
  transactions: EmergencyFundTransaction[];
}

export type GoalPriority = 'high' | 'medium' | 'low';
export type GoalType = 'travel' | 'car' | 'home' | 'education' | 'emergency' | 'retirement' | 'wedding' | 'gadget' | 'business' | 'other';

export interface GoalContribution {
  id: string;
  amount: number;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: GoalPriority;
  color: string;
  icon: string;
  contributions: GoalContribution[];
  createdAt: string;
}
