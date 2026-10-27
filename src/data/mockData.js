/**
 * Mock data for UNIQUE Bank frontend demonstration.
 *
 * NOTE: All data here is fictional and used solely for UI demonstration.
 *     Nothing represents real financial information or live exchange rates.
 */

export const accountHolder = {
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  accountNumber: 'XXXX XXXX 4523',
  balance: 248350.75,
  accountType: 'Savings Account',
};

/**
 * Illustrative exchange rates relative to 1 INR.
 * These are NOT live market rates.
 */
export const exchangeRates = {
  USD: { rate: 0.012, symbol: '$', name: 'US Dollar' },
  EUR: { rate: 0.011, symbol: '€', name: 'Euro' },
  GBP: { rate: 0.0095, symbol: '£', name: 'British Pound' },
  JPY: { rate: 1.78, symbol: '¥', name: 'Japanese Yen' },
  AED: { rate: 0.044, symbol: 'AED', name: 'UAE Dirham' },
  CAD: { rate: 0.016, symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { rate: 0.018, symbol: 'A$', name: 'Australian Dollar' },
  SGD: { rate: 0.016, symbol: 'S$', name: 'Singapore Dollar' },
};

export const recentTransactions = [
  {
    id: 1,
    description: 'Salary Credit — October 2026',
    date: '2026-10-25',
    time: '09:15 AM',
    amount: 85000.0,
    type: 'credit',
    category: 'income',
  },
  {
    id: 2,
    description: 'Amazon.in Purchase',
    date: '2026-10-24',
    time: '03:42 PM',
    amount: -2499.0,
    type: 'debit',
    category: 'shopping',
  },
  {
    id: 3,
    description: 'Electricity Bill — BESCOM',
    date: '2026-10-22',
    time: '11:30 AM',
    amount: -1350.0,
    type: 'debit',
    category: 'utilities',
  },
  {
    id: 4,
    description: 'UPI Transfer — Ravi Kumar',
    date: '2026-10-20',
    time: '06:18 PM',
    amount: -5000.0,
    type: 'debit',
    category: 'transfer',
  },
  {
    id: 5,
    description: 'Cashback Reward',
    date: '2026-10-18',
    time: '12:00 PM',
    amount: 200.0,
    type: 'credit',
    category: 'rewards',
  },
];

export const sidebarItems = [
  { key: 'investments', label: 'Investments' },
  { key: 'loans', label: 'Loans' },
  { key: 'deposits', label: 'Deposits' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'cards', label: 'Cards' },
  { key: 'services', label: 'Services' },
];
