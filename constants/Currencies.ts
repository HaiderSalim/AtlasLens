export interface CurrencyInfo {
  code: string;
  symbol: string;
  label: string;
  rateFromUSD: number; // e.g. 1 USD = 155 JPY
  minBudget: number;
  maxBudget: number;
  defaultBudget: number;
  steppers: number[];
  benchmarks: number[];
}

export const CURRENCIES: CurrencyInfo[] = [
  {
    code: 'USD',
    symbol: '$',
    label: 'US Dollar',
    rateFromUSD: 1.0,
    minBudget: 800,
    maxBudget: 7500,
    defaultBudget: 2500,
    steppers: [-500, -100, 100, 500],
    benchmarks: [1200, 2000, 2800, 3800, 5200],
  },
  {
    code: 'EUR',
    symbol: '€',
    label: 'Euro',
    rateFromUSD: 0.92,
    minBudget: 750,
    maxBudget: 7000,
    defaultBudget: 2300,
    steppers: [-500, -100, 100, 500],
    benchmarks: [1100, 1850, 2600, 3500, 4800],
  },
  {
    code: 'GBP',
    symbol: '£',
    label: 'British Pound',
    rateFromUSD: 0.79,
    minBudget: 650,
    maxBudget: 6000,
    defaultBudget: 2000,
    steppers: [-500, -100, 100, 500],
    benchmarks: [950, 1600, 2200, 3000, 4100],
  },
  {
    code: 'JPY',
    symbol: '¥',
    label: 'Japanese Yen',
    rateFromUSD: 155.0,
    minBudget: 120000,
    maxBudget: 1150000,
    defaultBudget: 380000,
    steppers: [-50000, -10000, 10000, 50000],
    benchmarks: [180000, 310000, 430000, 590000, 800000],
  },
  {
    code: 'CAD',
    symbol: 'C$',
    label: 'Canadian Dollar',
    rateFromUSD: 1.38,
    minBudget: 1100,
    maxBudget: 10000,
    defaultBudget: 3500,
    steppers: [-500, -100, 100, 500],
    benchmarks: [1650, 2750, 3850, 5200, 7200],
  },
  {
    code: 'AUD',
    symbol: 'A$',
    label: 'Australian Dollar',
    rateFromUSD: 1.52,
    minBudget: 1200,
    maxBudget: 11500,
    defaultBudget: 3800,
    steppers: [-500, -100, 100, 500],
    benchmarks: [1800, 3000, 4200, 5800, 7900],
  },
];

export function getCurrencyInfo(code?: string): CurrencyInfo {
  if (!code) return CURRENCIES[0];
  const found = CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return found || CURRENCIES[0];
}

export function convertBudget(amount: number, fromCode: string, toCode: string): number {
  if (fromCode.toUpperCase() === toCode.toUpperCase()) return amount;
  const fromInfo = getCurrencyInfo(fromCode);
  const toInfo = getCurrencyInfo(toCode);

  // Convert to USD first, then to target
  const usdAmount = amount / (fromInfo.rateFromUSD || 1);
  const targetAmount = usdAmount * toInfo.rateFromUSD;

  // Round sensibly: for JPY round to nearest 1,000; for others round to nearest 50
  if (toInfo.code === 'JPY') {
    return Math.max(toInfo.minBudget, Math.round(targetAmount / 1000) * 1000);
  }
  return Math.max(toInfo.minBudget, Math.round(targetAmount / 50) * 50);
}

export function formatCurrencyAmount(amount: number, symbolOrCode: string): string {
  const info = CURRENCIES.find(
    (c) => c.code.toUpperCase() === symbolOrCode.toUpperCase() || c.symbol === symbolOrCode
  );
  const symbol = info ? info.symbol : symbolOrCode;
  return `${symbol}${amount.toLocaleString()}`;
}

