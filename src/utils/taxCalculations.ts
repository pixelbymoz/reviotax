import { UserProfile, IncomeSource, OperationalCost, TaxCalculation, TaxBracket } from '../types';

// PTKP amounts for 2024 (in IDR)
const PTKP_RATES = {
  single: 54000000,
  married: 58500000,
  married_with_dependents: (dependents: number) => 58500000 + (dependents * 4500000)
};

// Progressive tax rates
const TAX_BRACKETS: { min: number; max: number | null; rate: number }[] = [
  { min: 0, max: 60000000, rate: 0.05 },
  { min: 60000000, max: 250000000, rate: 0.15 },
  { min: 250000000, max: 500000000, rate: 0.25 },
  { min: 500000000, max: 5000000000, rate: 0.30 },
  { min: 5000000000, max: null, rate: 0.35 }
];

export function calculatePTKP(profile: UserProfile): number {
  switch (profile.maritalStatus) {
    case 'single':
      return PTKP_RATES.single;
    case 'married':
      return PTKP_RATES.married;
    case 'married_with_dependents':
      return PTKP_RATES.married_with_dependents(profile.dependentsCount);
    default:
      return PTKP_RATES.single;
  }
}

export function calculateAnnualAmount(amount: number, frequency: 'monthly' | 'annual'): number {
  return frequency === 'monthly' ? amount * 12 : amount;
}

export function calculateProgressiveTax(taxableIncome: number): { total: number; breakdown: TaxBracket[] } {
  if (taxableIncome <= 0) {
    return { total: 0, breakdown: [] };
  }

  let totalTax = 0;
  const breakdown: TaxBracket[] = [];
  let remainingIncome = taxableIncome;

  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const min = bracket.min;
    const max = bracket.max;
    const rate = bracket.rate;

    const bracketBase = Math.max(0, remainingIncome + min - taxableIncome);
    const bracketTop = max ? Math.min(remainingIncome, max - min) : remainingIncome;
    const bracketIncome = Math.max(0, bracketTop - bracketBase);

    if (bracketIncome > 0) {
      const bracketTax = bracketIncome * rate;
      totalTax += bracketTax;
      
      breakdown.push({
        min,
        max,
        rate,
        amount: bracketTax
      });

      remainingIncome -= bracketIncome;
    }
  }

  return { total: totalTax, breakdown };
}

export function calculateFinalTax(grossIncome: number): number {
  // PPh Final UMKM 0.5% for turnover < 4.8B
  const maxUMKMTurnover = 4800000000; // 4.8 billion IDR
  
  if (grossIncome <= maxUMKMTurnover) {
    return grossIncome * 0.005; // 0.5%
  }
  
  return 0; // Not eligible for PPh Final
}

export function calculateTax(
  profile: UserProfile,
  incomeSources: IncomeSource[],
  operationalCosts: OperationalCost[]
): TaxCalculation {
  // Calculate total annual income
  const grossIncome = incomeSources.reduce((total, source) => {
    return total + calculateAnnualAmount(source.amount, source.frequency);
  }, 0);

  // Calculate total annual operational costs
  const totalOperationalCosts = operationalCosts.reduce((total, cost) => {
    return total + calculateAnnualAmount(cost.amount, cost.frequency);
  }, 0);

  // Calculate net income
  const netIncome = Math.max(0, grossIncome - totalOperationalCosts);

  // Calculate PTKP
  const ptkp = calculatePTKP(profile);

  // Calculate taxable income (PKP)
  const taxableIncome = Math.max(0, netIncome - ptkp);

  // Calculate progressive tax
  const { total: progressiveTax, breakdown: taxBreakdown } = calculateProgressiveTax(taxableIncome);

  // Calculate final tax (0.5%)
  const finalTax = calculateFinalTax(grossIncome);

  // Determine recommended option
  const recommendedOption = finalTax > 0 && finalTax < progressiveTax ? 'final' : 'progressive';

  // Calculate monthly tax
  const monthlyTax = (recommendedOption === 'final' ? finalTax : progressiveTax) / 12;

  return {
    grossIncome,
    operationalCosts: totalOperationalCosts,
    netIncome,
    ptkp,
    taxableIncome,
    progressiveTax,
    finalTax,
    recommendedOption,
    monthlyTax,
    taxBreakdown
  };
}