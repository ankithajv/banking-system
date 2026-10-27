import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, IndianRupee, Info, X, Copy, Check, ExternalLink } from 'lucide-react';
import { accountHolder } from '../../data/mockData';
import { useBanking } from '../../context/BankingContext';
import { getSavingsAccountHolderName } from '../../utils/user';

/**
 * Transaction account card showing holder info, masked account number and balance.
 */
export default function AccountBalanceCard() {
  const [visible, setVisible] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const { balance } = useBanking();
  const holderName = getSavingsAccountHolderName();

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(balance);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <>
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
              className="mt-3 rounded-lg p-2 text-text-muted hover:bg-gray-100 hover:text-text-primary transition-colors cursor-pointer"
              aria-label={visible ? 'Hide balance' : 'Show balance'}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            onClick={() => setDetailsOpen(true)}
            className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-700 transition-colors cursor-pointer"
          >
            <Info size={14} />
            Account Details
          </button>
        </div>
      </div>

      {/* Account Details Modal */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setDetailsOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Info size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-base text-text-primary">Account Details</h3>
                  <p className="text-xs text-text-muted">Digital Savings Account</p>
                </div>
              </div>

              <button
                onClick={() => setDetailsOpen(false)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm divide-y divide-border/60">
              <div className="flex items-center justify-between py-2">
                <span className="text-text-muted">Account Holder</span>
                <span className="font-semibold text-text-primary">{holderName}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-text-muted">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-text-primary">1024 8839 4523</span>
                  <button
                    onClick={() => copyToClipboard('102488394523', 'accNum')}
                    className="p-1 text-text-muted hover:text-brand-600"
                    title="Copy"
                  >
                    {copiedField === 'accNum' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-text-muted">IFSC Code</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-text-primary">UNIQ0004523</span>
                  <button
                    onClick={() => copyToClipboard('UNIQ0004523', 'ifsc')}
                    className="p-1 text-text-muted hover:text-brand-600"
                    title="Copy"
                  >
                    {copiedField === 'ifsc' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-text-muted">Branch</span>
                <span className="font-medium text-text-primary">Koramangala Tech Hub, Bengaluru</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-text-muted">UPI ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-brand-600">unique.user@uniquebank</span>
                  <button
                    onClick={() => copyToClipboard('unique.user@uniquebank', 'upi')}
                    className="p-1 text-text-muted hover:text-brand-600"
                    title="Copy"
                  >
                    {copiedField === 'upi' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-text-muted">MICR Code</span>
                <span className="font-mono text-text-primary">560249012</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-3 border-t border-border">
              <Link
                to="/account?tab=banking"
                onClick={() => setDetailsOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                <span>Full Account Profile</span>
                <ExternalLink size={13} />
              </Link>

              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
