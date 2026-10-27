import { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, Delete } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

/**
 * Reusable PIN Verification Modal for all payment and transaction flows.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback when user cancels or closes modal
 * @param {function} onSuccess - Callback when correct PIN (1234 or configured UPI PIN) is entered
 * @param {number|string} amount - Optional amount being authorized
 * @param {string} recipient - Optional payee or transaction description
 * @param {string} title - Optional title (defaults to "Enter Transaction PIN")
 */
export default function PinVerificationModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  recipient,
  title = 'Enter Transaction PIN',
}) {
  const { upiPin } = useBanking();
  const expectedPin = upiPin || '1234';

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Clear PIN and error on open/close
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setSubmitting(false);
    } else {
      setPin('');
      setError('');
    }
  }, [isOpen]);

  // Handle keyboard typing (0-9, Backspace, Enter, Escape)
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (submitting) return;

      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          setError('');
          setPin((prev) => (prev.length < 4 ? prev + e.key : prev));
        }
      } else if (e.key === 'Backspace') {
        setError('');
        setPin((prev) => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        if (pin.length === 4) {
          handleVerify(pin);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin, submitting]);

  const handleKeypadPress = (val) => {
    if (submitting) return;
    setError('');
    if (val === 'backspace') {
      setPin((prev) => prev.slice(0, -1));
    } else if (typeof val === 'number') {
      if (pin.length < 4) {
        const nextPin = pin + val;
        setPin(nextPin);
        if (nextPin.length === 4) {
          // Auto submit or let user review
        }
      }
    }
  };

  const handleVerify = (codeToVerify) => {
    const code = codeToVerify || pin;
    if (code.length < 4) {
      setError('Please enter your complete 4-digit PIN.');
      return;
    }

    setSubmitting(true);
    setError('');

    // Frontend validation with brief realistic verification delay
    setTimeout(() => {
      if (code === expectedPin || code === '1234') {
        setPin('');
        setSubmitting(false);
        onSuccess();
      } else {
        setSubmitting(false);
        setError('Incorrect PIN. Please try again.');
        setPin('');
      }
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Lock size={16} />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-text-primary">{title}</h3>
              <p className="text-[11px] text-text-muted">Security Authorization</p>
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Cancel verification"
          >
            <X size={18} />
          </button>
        </div>

        {/* Transaction Summary (if available) */}
        {(amount !== undefined || recipient) && (
          <div className="mt-4 rounded-xl bg-surface-alt p-3 border border-border/60 text-xs">
            {amount !== undefined && (
              <p className="font-extrabold text-xl text-text-primary tracking-tight">
                ₹ {Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            )}
            {recipient && (
              <p className="text-text-secondary mt-0.5 text-xs truncate">
                Paying: <span className="font-semibold text-text-primary">{recipient}</span>
              </p>
            )}
          </div>
        )}

        {/* Instruction Message */}
        <p className="mt-4 text-xs text-text-secondary">
          Enter your 4-digit PIN to authorize this transfer.
        </p>

        {/* PIN Masked Digit Indicators */}
        <div className="mt-4 flex items-center justify-center gap-3">
          {[0, 1, 2, 3].map((index) => {
            const hasDigit = pin.length > index;
            return (
              <div
                key={index}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl font-bold transition-all ${
                  hasDigit
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 scale-105 shadow-2xs'
                    : 'border-border bg-white text-text-muted'
                }`}
              >
                {hasDigit ? '●' : ''}
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {error ? (
          <p className="mt-2 text-xs font-semibold text-red-600 animate-in fade-in">
            {error}
          </p>
        ) : (
          <p className="mt-2 text-[11px] text-text-muted">
            (For testing, use PIN: <strong className="font-mono text-text-secondary">{expectedPin}</strong>)
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="mt-4 grid grid-cols-3 gap-2 max-w-[240px] mx-auto select-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              disabled={submitting}
              onClick={() => handleKeypadPress(num)}
              className="flex h-10 items-center justify-center rounded-xl bg-gray-50 text-base font-semibold text-text-primary hover:bg-brand-50 hover:text-brand-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            disabled={submitting}
            onClick={() => setPin('')}
            className="flex h-10 items-center justify-center rounded-xl bg-gray-50 text-xs font-semibold text-text-muted hover:bg-gray-100 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleKeypadPress(0)}
            className="flex h-10 items-center justify-center rounded-xl bg-gray-50 text-base font-semibold text-text-primary hover:bg-brand-50 hover:text-brand-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            0
          </button>
          <button
            type="button"
            disabled={submitting || pin.length === 0}
            onClick={() => handleKeypadPress('backspace')}
            className="flex h-10 items-center justify-center rounded-xl bg-gray-50 text-text-muted hover:bg-gray-100 hover:text-red-600 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            aria-label="Delete last digit"
          >
            <Delete size={17} />
          </button>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-border">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="w-1/2 rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={submitting || pin.length < 4}
            onClick={() => handleVerify(pin)}
            className="w-1/2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Verifying…</span>
              </>
            ) : (
              <>
                <span>Confirm</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
