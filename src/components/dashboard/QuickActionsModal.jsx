import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Smartphone, CreditCard, Receipt, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QuickActionsModal({ isOpen, onClose, initialAction }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1000');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const getActionConfig = () => {
    switch (initialAction) {
      case 'send-money':
        return {
          title: 'Send Money',
          subtitle: 'Send instantly via UPI ID or Account Number',
          icon: Send,
          color: 'bg-purple-100 text-purple-600',
          inputLabel: 'UPI ID or Account Number',
          placeholder: 'e.g. user@okhdfcbank or 1024 8839 4523',
        };
      case 'mobile-number':
        return {
          title: 'Pay to Mobile',
          subtitle: 'Send money to any registered mobile number',
          icon: Smartphone,
          color: 'bg-blue-100 text-blue-600',
          inputLabel: 'Mobile Number',
          placeholder: '+91 98765 43210',
        };
      case 'credit-card':
        return {
          title: 'Credit Card Payment',
          subtitle: 'Pay your credit card outstanding balance',
          icon: CreditCard,
          color: 'bg-amber-100 text-amber-600',
          inputLabel: 'Card Number',
          placeholder: '4532 •••• •••• 8921',
        };
      case 'pay-bills':
      default:
        return {
          title: 'Pay Bills & Utilities',
          subtitle: 'Electricity, Mobile Recharge, Water & DTH',
          icon: Receipt,
          color: 'bg-emerald-100 text-emerald-600',
          inputLabel: 'Consumer / Biller ID',
          placeholder: 'e.g. BESCOM Consumer No. or Phone Number',
        };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setRecipient('');
    setAmount('1000');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-text-muted hover:bg-slate-100 hover:text-text-primary transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {!submitted ? (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.color}`}>
                  <Icon size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{config.title}</h3>
                  <p className="text-xs text-text-muted">{config.subtitle}</p>
                </div>
              </div>

              <div className="mb-4 rounded-xl bg-purple-50/70 p-3 border border-purple-100 flex items-start gap-2.5">
                <AlertCircle size={16} className="text-brand-600 shrink-0 mt-0.5" />
                <p className="text-xs text-brand-700 leading-relaxed">
                  <strong>Frontend Demo Action:</strong> This is a simulation for UI testing. No real money will be transferred or debited.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    {config.inputLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder={config.placeholder}
                    className="w-full rounded-xl border border-border bg-surface-alt px-3.5 py-2.5 text-sm font-medium text-text-primary outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-text-muted">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1000"
                      className="w-full rounded-xl border border-border bg-surface-alt pl-8 pr-4 py-2.5 text-sm font-bold text-text-primary outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-text-secondary hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-brand-600 hover:bg-brand-700 py-2.5 text-xs font-semibold text-white shadow-sm shadow-brand-500/30 transition-all active:scale-98"
                  >
                    Proceed (Demo)
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-4 text-center">
              <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <CheckCircle2 size={30} />
              </span>
              <h3 className="text-lg font-bold text-text-primary">Demo Transaction Recorded</h3>
              <p className="mt-1 text-xs text-text-muted">
                Simulated {config.title} of <strong className="text-text-primary">₹{parseFloat(amount || '0').toLocaleString('en-IN')}</strong> to{' '}
                <strong className="text-text-primary">{recipient || 'Recipient'}</strong>
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-left text-xs border border-border/60">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-text-muted">Status</span>
                  <span className="font-semibold text-emerald-600">Demo Success</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-text-muted">Reference ID</span>
                  <span className="font-mono text-text-primary">UB-DEMO-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Source Account</span>
                  <span className="text-text-primary">Savings Account (XXXX 4523)</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-5 w-full rounded-xl bg-brand-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
