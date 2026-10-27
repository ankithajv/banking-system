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
    description: 'Swiggy Gourmet Order',
    date: '2026-10-21',
    time: '08:24 PM',
    amount: -890.0,
    type: 'debit',
    category: 'food',
  },
  {
    id: 5,
    description: 'UPI Transfer — Ravi Kumar',
    date: '2026-10-20',
    time: '06:18 PM',
    amount: -5000.0,
    type: 'debit',
    category: 'transfer',
  },
  {
    id: 6,
    description: 'Uber Premier Ride',
    date: '2026-10-19',
    time: '02:15 PM',
    amount: -450.0,
    type: 'debit',
    category: 'transport',
  },
  {
    id: 7,
    description: 'Cashback Reward',
    date: '2026-10-18',
    time: '12:00 PM',
    amount: 200.0,
    type: 'credit',
    category: 'rewards',
  },
  {
    id: 8,
    description: 'Zara Mall Bangalore',
    date: '2026-10-15',
    time: '05:30 PM',
    amount: -4200.0,
    type: 'debit',
    category: 'shopping',
  },
  {
    id: 9,
    description: 'Netflix Monthly Subscription',
    date: '2026-10-12',
    time: '07:00 AM',
    amount: -649.0,
    type: 'debit',
    category: 'others',
  },
  {
    id: 10,
    description: 'Freelance Design Consultation',
    date: '2026-10-10',
    time: '04:10 PM',
    amount: 25000.0,
    type: 'credit',
    category: 'income',
  },
];

/**
 * Monthly income vs expenses for historical comparison chart (last 6 months)
 */
export const monthlySpendingHistory = [
  { month: 'May', income: 85000, expense: 42000 },
  { month: 'Jun', income: 90000, expense: 48500 },
  { month: 'Jul', income: 85000, expense: 39000 },
  { month: 'Aug', income: 98000, expense: 54000 },
  { month: 'Sep', income: 85000, expense: 46200 },
  { month: 'Oct', income: 110000, expense: 51500 },
];

/**
 * Spending breakdown categories for donut chart
 */
export const spendingCategories = [
  { name: 'Shopping', amount: 18500, percentage: 36, color: '#7043C6' },
  { name: 'Bills & Utilities', amount: 12400, percentage: 24, color: '#8B5CF6' },
  { name: 'Food & Dining', amount: 8900, percentage: 17, color: '#A78BFA' },
  { name: 'Transport', amount: 6200, percentage: 12, color: '#07865B' },
  { name: 'Others', amount: 5500, percentage: 11, color: '#CBD5E1' },
];

/**
 * Notifications for user dashboard
 */
export const initialNotifications = [
  {
    id: 'notif-1',
    type: 'credit',
    title: 'Salary Credited',
    message: '+₹85,000.00 received from Employer Pvt Ltd',
    timestamp: '2 hours ago',
    unread: true,
  },
  {
    id: 'notif-2',
    type: 'payment',
    title: 'Payment Completed',
    message: 'Electricity bill payment of ₹1,350.00 successful',
    timestamp: 'Yesterday',
    unread: true,
  },
  {
    id: 'notif-3',
    type: 'reminder',
    title: 'Bill Payment Reminder',
    message: 'JioFiber Broadband bill of ₹999.00 due soon',
    timestamp: '2 days ago',
    unread: true,
  },
  {
    id: 'notif-4',
    type: 'security',
    title: 'New Login Alert',
    message: 'New login detected from Chrome on Windows',
    timestamp: '3 days ago',
    unread: false,
  },
];

/**
 * Savings goals
 */
export const savingsGoals = [
  {
    id: 'goal-1',
    name: 'New MacBook Pro',
    category: 'Tech',
    targetAmount: 150000,
    savedAmount: 105000,
    percentage: 70,
    color: '#7043C6',
  },
  {
    id: 'goal-2',
    name: 'Emergency Fund',
    category: 'Safety',
    targetAmount: 300000,
    savedAmount: 210000,
    percentage: 70,
    color: '#07865B',
  },
  {
    id: 'goal-3',
    name: 'Japan Vacation Trip',
    category: 'Travel',
    targetAmount: 120000,
    savedAmount: 54000,
    percentage: 45,
    color: '#3B82F6',
  },
];

/**
 * Upcoming recurring bills and service payments
 */
export const upcomingPayments = [
  {
    id: 'bill-1',
    name: 'Electricity Bill — BESCOM',
    category: 'Utilities',
    dueDate: '03 Nov 2026',
    amount: 1420.0,
    status: 'upcoming',
  },
  {
    id: 'bill-2',
    name: 'Mobile Recharge — Airtel 5G',
    category: 'Telecom',
    dueDate: '05 Nov 2026',
    amount: 719.0,
    status: 'upcoming',
  },
  {
    id: 'bill-3',
    name: 'Broadband — JioFiber',
    category: 'Internet',
    dueDate: '28 Oct 2026',
    amount: 999.0,
    status: 'overdue',
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
