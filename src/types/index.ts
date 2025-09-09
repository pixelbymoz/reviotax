export interface UserProfile {
  id: string;
  name: string;
  maritalStatus: 'single' | 'married' | 'married_with_dependents';
  dependentsCount: number;
  ptkp: number;
}

export interface IncomeSource {
  id: string;
  type: 'adsense' | 'tiktok' | 'instagram' | 'sponsor' | 'freelance' | 'other';
  name: string;
  amount: number;
  frequency: 'monthly' | 'annual';
}

export interface OperationalCost {
  id: string;
  type: 'internet' | 'software' | 'equipment' | 'transportation' | 'other';
  name: string;
  amount: number;
  frequency: 'monthly' | 'annual';
}

export interface TaxCalculation {
  grossIncome: number;
  operationalCosts: number;
  netIncome: number;
  ptkp: number;
  taxableIncome: number;
  progressiveTax: number;
  finalTax: number;
  recommendedOption: 'progressive' | 'final';
  monthlyTax: number;
  taxBreakdown: TaxBracket[];
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  amount: number;
}

export type NavigationPage = 'dashboard' | 'onboarding' | 'income' | 'reports' | 'simulation' | 'reminders' | 'about' | 'whats-new';
export type NavigationPage = 'dashboard' | 'onboarding' | 'income' | 'reports' | 'simulation' | 'reminders' | 'about' | 'whats-new' | 'feedback';

export interface UpdateItem {
  id: string;
  version: string;
  date: string;
  status: 'new' | 'updated' | 'fixed';
  title: string;
  description: string;
  features: string[];
}