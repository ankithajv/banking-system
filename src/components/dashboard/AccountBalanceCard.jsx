import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, IndianRupee, Info, X, Copy, Check, ExternalLink } from 'lucide-react';
import { accountHolder } from '../../data/mockData';
import { useBanking } from '../../context/BankingContext';
import { getSavingsAccountHolderName } from '../../utils/user';
import savingsIllustration from '../../assets/savings-3d-illustration.png';

/**
 * Transaction account card showing holder info, masked account number and dynamic balance.
 * Redesigned with soft lavender aesthetic, rounded corners, thin top purple gradient strip,
 * and 3D savings illustration on the right matching reference design.
 */
export default function AccountBalanceCard() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const { balance } = useBanking();
  const holderName = getSavingsAccountHolderName();

  const currentBalance = balance ?? accountHolder.balance ?? 248350.75;
  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(currentBalance);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAccNumber = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(accountHolder.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-[18px] border border-purple-100/90 bg-gradient-to-r from-white via-[#fcfbff] to-[#f4effe] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
        {/* Thin purple gradient strip across the top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500" />

        {/* Decorative 3D Banking Card & Podium Illustration on the right (~40-45% width) */}
        <div className="pointer-events-none absolute right-0 bottom-0 top-1 w-[46%] sm:w-[44%] lg:w-[46%] max-w-[360px] select-none overflow-hidden hidden sm:flex items-end justify-end">
          <img
            src={savingsIllustration}
            alt=""
            aria-hidden="true"
            className="h-[102%] w-full object-contain object-right-bottom drop-shadow-xs"
          />
        </div>

        <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between min-h-[205px]">
          {/* Top Header: Account Info */}
          <div className="max-w-[70%] sm:max-w-[55%]">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {accountHolder.accountType}
            </p>
            <h3 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {holderName}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 font-medium">
              <span>A/C: {accountHolder.accountNumber}</span>
              <button
                onClick={handleCopyAccNumber}
                title="Copy account number"
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 inline-flex items-center cursor-pointer"
                aria-label="Copy account number"
              >
                {copied ? (
                  <Check size={13} className="text-emerald-500" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
          </div>

          {/* Rupee Icon in subtle circular badge at top right */}
          <span className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1ebff] text-brand-600 font-bold shadow-2xs ring-1 ring-purple-200/50">
            <IndianRupee size={17} strokeWidth={2.4} />
          </span>

          {/* Balance Section */}
          <div className="mt-4 max-w-[70%] sm:max-w-[60%]">
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Available Balance
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight font-sans">
                {visible ? formattedBalance : '₹ •••••••'}
              </p>

              <button
                onClick={() => setVisible((v) => !v)}
                className="rounded-lg p-1 text-slate-400 hover:text-brand-600 transition-colors cursor-pointer"
                aria-label={visible ? 'Hide balance' : 'Show balance'}
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Account Details Link */}
          <button
            onClick={() => setDetailsOpen(true)}
            className="mt-3.5 flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors w-fit cursor-pointer"
          >
            <Info size={14} className="text-brand-600" />
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
                className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 cursor-pointer"
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
                    className="p-1 text-text-muted hover:text-brand-600 cursor-pointer"
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
                    className="p-1 text-text-muted hover:text-brand-600 cursor-pointer"
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
                    className="p-1 text-text-muted hover:text-brand-600 cursor-pointer"
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
                className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 cursor-pointer"
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
