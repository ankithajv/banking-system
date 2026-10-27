import { useState } from 'react';
import { Eye, EyeOff, IndianRupee, Info } from 'lucide-react';
import { accountHolder } from '../../data/mockData';
import { getSavingsAccountHolderName } from '../../utils/user';

/**
 * Transaction account card showing holder info, masked account number and balance.
 */
export default function AccountBalanceCard() {
  const [visible, setVisible] = useState(false);
  const holderName = getSavingsAccountHolderName();

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(accountHolder.balance);

  return (
    <div className="card overflow-hidden">
      {/* Gradient header strip */}
      <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-400" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {accountHolder.accountType}
            </p>
            <h3 className="mt-1 text-lg font-bold text-text-primary">
              {holderName}
            </h3>
            <p className="mt-0.5 text-sm text-text-secondary">
              A/C: {accountHolder.accountNumber}
            </p>
          </div>

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <IndianRupee size={20} />
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div>
            <p className="text-xs text-text-muted">Available Balance</p>
            <p className="mt-0.5 text-2xl font-extrabold text-text-primary tracking-tight">
              {visible ? formattedBalance : '₹ •••••••'}
            </p>
          </div>

          <button
            onClick={() => setVisible((v) => !v)}
            className="mt-3 rounded-lg p-2 text-text-muted hover:bg-gray-100 hover:text-text-primary transition-colors"
            aria-label={visible ? 'Hide balance' : 'Show balance'}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-700 transition-colors">
          <Info size={14} />
          Account Details
        </button>
      </div>
    </div>
  );
}
