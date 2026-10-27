import { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { accountHolder, recentTransactions as defaultTransactions } from '../data/mockData';

const BankingContext = createContext(null);

const STORAGE_KEY_BALANCE = 'unique_bank_balance';
const STORAGE_KEY_TRANSACTIONS = 'unique_bank_transactions';
const STORAGE_KEY_DEPOSITS = 'unique_bank_deposits';
const STORAGE_KEY_UPI_ID = 'unique_bank_upi_id';
const STORAGE_KEY_UPI_PIN = 'unique_bank_upi_pin';

const defaultDeposits = [
  {
    id: 'DEP-84910',
    type: 'Fixed Deposit',
    principal: 50000,
    interestRate: 7.25,
    tenureMonths: 12,
    maturityAmount: 53725,
    startDate: '2026-06-15',
    maturityDate: '2027-06-15',
    status: 'Active',
  },
];

export function BankingProvider({ children }) {
  // UPI ID State: null for first-time users, or configured handle (e.g. 'yashaswini@uniquebank')
  const [upiId, setUpiId] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_UPI_ID);
      return stored !== null ? stored : 'yashaswini@uniquebank';
    } catch {
      return 'yashaswini@uniquebank';
    }
  });

  // UPI PIN State: default '1234'
  const [upiPin, setUpiPin] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_UPI_PIN) || '1234';
    } catch {
      return '1234';
    }
  });
  // Load persisted balance or fallback to default
  const [balance, setBalance] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BALANCE);
      if (stored !== null) {
        const parsed = parseFloat(stored);
        if (!isNaN(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return accountHolder.balance;
  });

  // Load persisted transactions or fallback to mockData
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return defaultTransactions;
  });

  // Load user deposits
  const [deposits, setDeposits] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DEPOSITS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return defaultDeposits;
  });

  // Active toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync balance to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BALANCE, balance.toString());
    } catch {
      // ignore
    }
  }, [balance]);

  // Sync transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  // Sync deposits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DEPOSITS, JSON.stringify(deposits));
    } catch {
      // ignore
    }
  }, [deposits]);

  // Sync UPI ID to localStorage
  useEffect(() => {
    try {
      if (upiId) {
        localStorage.setItem(STORAGE_KEY_UPI_ID, upiId);
      } else {
        localStorage.removeItem(STORAGE_KEY_UPI_ID);
      }
    } catch {
      // ignore
    }
  }, [upiId]);

  // Sync UPI PIN to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_UPI_PIN, upiPin);
    } catch {
      // ignore
    }
  }, [upiPin]);

  /**
   * Set up UPI ID and transaction PIN for first time users
   */
  const setupUpi = ({ handle, pin }) => {
    const clean = (handle || '').trim().toLowerCase().replace(/@uniquebank$/, '');
    if (!clean) {
      showToast('Please enter a valid UPI ID handle.', 'error');
      return false;
    }
    const fullId = `${clean}@uniquebank`;
    setUpiId(fullId);
    if (pin && pin.length === 4) {
      setUpiPin(pin);
    }
    showToast(`UPI ID "${fullId}" activated successfully!`, 'success');
    return true;
  };

  /**
   * Change existing UPI ID handle
   */
  const changeUpiId = (newHandle) => {
    const clean = (newHandle || '').trim().toLowerCase().replace(/@uniquebank$/, '');
    if (!clean) {
      showToast('Please enter a valid new UPI handle.', 'error');
      return false;
    }
    const fullId = `${clean}@uniquebank`;
    setUpiId(fullId);
    showToast(`UPI ID changed to "${fullId}"!`, 'success');
    return true;
  };

  /**
   * Change UPI security transaction PIN
   */
  const changeUpiPin = (newPin) => {
    if (!newPin || newPin.length !== 4) {
      showToast('Please enter a valid 4-digit PIN.', 'error');
      return false;
    }
    setUpiPin(newPin);
    showToast('UPI transaction PIN changed successfully!', 'success');
    return true;
  };

  /**
   * Add a new transaction (credit or debit)
   */
  const addTransaction = ({
    description,
    amount,
    type = 'debit',
    category = 'transfer',
    paymentMethod = 'UPI',
    recipient = '',
  }) => {
    const numAmount = Math.abs(parseFloat(amount) || 0);
    if (numAmount <= 0) return false;

    // Check balance for debits
    if (type === 'debit' && numAmount > balance) {
      showToast('Insufficient balance for this transaction.', 'error');
      return false;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newTx = {
      id: Date.now(),
      refId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
      description: description || `Transfer to ${recipient || 'Account'}`,
      date: dateStr,
      time: timeStr,
      amount: type === 'debit' ? -numAmount : numAmount,
      type,
      category,
      paymentMethod,
      recipient,
    };

    setTransactions((prev) => [newTx, ...prev]);

    setBalance((prev) => {
      const nextBal = type === 'debit' ? prev - numAmount : prev + numAmount;
      return Math.round(nextBal * 100) / 100;
    });

    showToast(
      `${type === 'debit' ? 'Debited' : 'Credited'} ₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} successfully!`,
      'success'
    );
    return newTx;
  };

  /**
   * Open a new fixed deposit
   */
  const addDeposit = ({ principal, tenureMonths, interestRate }) => {
    const numAmount = parseFloat(principal);
    if (numAmount > balance) {
      showToast('Insufficient balance to create this Fixed Deposit.', 'error');
      return false;
    }

    const interest = (numAmount * interestRate * (tenureMonths / 12)) / 100;
    const maturityAmount = Math.round((numAmount + interest) * 100) / 100;

    const startDate = new Date();
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + tenureMonths);

    const newDep = {
      id: `DEP-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Fixed Deposit',
      principal: numAmount,
      interestRate,
      tenureMonths,
      maturityAmount,
      startDate: startDate.toISOString().split('T')[0],
      maturityDate: maturityDate.toISOString().split('T')[0],
      status: 'Active',
    };

    setDeposits((prev) => [newDep, ...prev]);

    // Debit principal from savings
    addTransaction({
      description: `Fixed Deposit Creation — ${newDep.id}`,
      amount: numAmount,
      type: 'debit',
      category: 'transfer',
      paymentMethod: 'Net Banking',
      recipient: 'UNIQUE Bank FD Account',
    });

    showToast(`Fixed Deposit of ₹${numAmount.toLocaleString('en-IN')} opened successfully!`, 'success');
    return newDep;
  };

  return (
    <BankingContext.Provider
      value={{
        balance,
        transactions,
        deposits,
        addTransaction,
        addDeposit,
        upiId,
        upiPin,
        setupUpi,
        changeUpiId,
        changeUpiPin,
        toast,
        showToast,
      }}
    >
      {children}

      {/* Floating In-App Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={16} className="text-white" />
            ) : (
              <CheckCircle2 size={16} className="text-white" />
            )}
          </span>
          <div>
            <p className="text-xs font-bold text-text-primary">
              {toast.type === 'error' ? 'Transaction Alert' : 'Success'}
            </p>
            <p className="text-xs text-text-secondary">{toast.message}</p>
          </div>
        </div>
      )}
    </BankingContext.Provider>
  );
}

export function useBanking() {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
}
