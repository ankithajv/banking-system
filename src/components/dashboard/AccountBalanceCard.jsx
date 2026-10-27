import { useState } from 'react';
import { Eye, EyeOff, IndianRupee, Info, Copy, Check } from 'lucide-react';
import { accountHolder } from '../../data/mockData';
import { getSavingsAccountHolderName } from '../../utils/user';
import savingsIllustration from '../../assets/savings-3d-illustration.png';

/**
 * Transaction account card showing holder info, masked account number and balance.
 * Redesigned with soft lavender aesthetic, rounded corners, thin top purple gradient strip,
 * and 3D savings illustration on the right matching reference design.
 */
export default function AccountBalanceCard() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const holderName = getSavingsAccountHolderName();

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(accountHolder.balance);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(accountHolder.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
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
              onClick={handleCopy}
              title="Copy account number"
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 inline-flex items-center"
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

        {/* Existing Rupee Icon in subtle circular badge at top right */}
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
              className="rounded-lg p-1 text-slate-400 hover:text-brand-600 transition-colors"
              aria-label={visible ? 'Hide balance' : 'Show balance'}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Existing Account Details Link */}
        <button className="mt-3.5 flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors w-fit">
          <Info size={14} className="text-brand-600" />
          Account Details
        </button>
      </div>
    </div>
  );
}
