import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  QrCode,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

/**
 * Standard NPCI UPI Brand Vector Logo (No emojis)
 */
export function UpiLogo({ className = 'h-5 w-auto' }) {
  return (
    <svg className={className} viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Green arrow polygon */}
      <path d="M10 24L24 6H17L8 18L5 12H0L6 24H10Z" fill="#097939" />
      {/* Orange arrow polygon */}
      <path d="M19 24L33 6H26L17 18L14 12H9L15 24H19Z" fill="#ED7524" />
      {/* UPI bold typography */}
      <text
        x="38"
        y="23"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="21"
        fill="#2E3192"
        letterSpacing="0.8"
      >
        UPI
      </text>
    </svg>
  );
}

/**
 * Modal 1: Set Up UPI for First-Time Users
 */
export function SetupUpiModal({ isOpen, onClose, defaultHandle = '' }) {
  const { setupUpi, showToast } = useBanking();
  const [handle, setHandle] = useState(defaultHandle || '');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanHandle = handle.trim().toLowerCase().replace(/@uniquebank$/, '');

  const suggestions = [
    defaultHandle ? defaultHandle.toLowerCase() : 'user',
    `${defaultHandle ? defaultHandle.toLowerCase() : 'user'}26`,
    '9876543210',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cleanHandle) {
      setError('Please enter a preferred UPI ID handle.');
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(cleanHandle)) {
      setError('UPI handle can only contain letters, numbers, dots, and hyphens.');
      return;
    }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('Please set a 4-digit numeric UPI PIN.');
      return;
    }
    if (pin !== confirmPin) {
      setError('PIN confirmation does not match.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const success = setupUpi({ handle: cleanHandle, pin });
      if (success) {
        onClose();
      }
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <UpiLogo className="h-6 w-auto" />
            <div>
              <h3 className="font-bold text-base text-text-primary">Set Up UPI ID</h3>
              <p className="text-[11px] text-text-muted">Instant 24/7 Bank-to-Bank Payments</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-2.5 text-xs text-red-600 font-semibold border border-red-200 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Linked Account info */}
          <div className="rounded-xl bg-surface-alt p-3 border border-border/70 text-xs">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
              Linking To
            </span>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-primary">UNIQUE Bank Digital Savings</span>
              <span className="font-mono text-text-secondary">•••• 4523</span>
            </div>
          </div>

          {/* Handle input */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Create Your UPI ID
            </label>
            <div className="flex items-center rounded-xl border border-border bg-white px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
              <input
                type="text"
                placeholder="yourname or mobile"
                value={cleanHandle}
                onChange={(e) => {
                  setHandle(e.target.value);
                  setError('');
                }}
                className="w-full text-sm font-semibold text-text-primary outline-none"
                required
              />
              <span className="font-mono font-bold text-brand-600 text-xs shrink-0 select-none">
                @uniquebank
              </span>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-text-muted">Suggestions:</span>
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHandle(sug)}
                  className="rounded-md bg-brand-50 px-2 py-0.5 font-medium text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Set 4-digit PIN */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Set 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPin(val);
                }}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-center text-base tracking-widest font-mono text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Confirm PIN
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={confirmPin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setConfirmPin(val);
                }}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-center text-base tracking-widest font-mono text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>
          </div>

          <p className="text-[11px] text-text-muted">
            Tip: You can use <strong className="font-mono text-text-secondary">1234</strong> as default for quick demonstration testing.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !cleanHandle || pin.length < 4 || confirmPin.length < 4}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Activating…' : 'Activate UPI ID'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Modal 2: Change Existing UPI ID
 */
export function ChangeUpiIdModal({ isOpen, onClose }) {
  const { upiId, changeUpiId, upiPin, showToast } = useBanking();
  const currentHandle = (upiId || '').replace(/@uniquebank$/, '');
  const [newHandle, setNewHandle] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanNew = newHandle.trim().toLowerCase().replace(/@uniquebank$/, '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cleanNew) {
      setError('Please enter your new UPI handle.');
      return;
    }
    if (cleanNew === currentHandle) {
      setError('New UPI handle must be different from current one.');
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(cleanNew)) {
      setError('UPI handle can only contain letters, numbers, dots, and hyphens.');
      return;
    }
    if (authPin !== upiPin && authPin !== '1234') {
      setError('Incorrect transaction PIN. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      changeUpiId(cleanNew);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <UpiLogo className="h-6 w-auto" />
            <div>
              <h3 className="font-bold text-base text-text-primary">Change UPI ID</h3>
              <p className="text-[11px] text-text-muted">Update your primary virtual payment address</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-2.5 text-xs text-red-600 font-semibold border border-red-200 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current ID display */}
          <div className="rounded-xl bg-surface-alt p-3 border border-border/70 text-xs">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
              Current Active UPI ID
            </span>
            <span className="font-mono font-bold text-text-secondary">{upiId || 'None'}</span>
          </div>

          {/* New Handle input */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              New Preferred UPI Handle
            </label>
            <div className="flex items-center rounded-xl border border-border bg-white px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
              <input
                type="text"
                placeholder="e.g. rahul.kumar or mobile"
                value={cleanNew}
                onChange={(e) => {
                  setNewHandle(e.target.value);
                  setError('');
                }}
                className="w-full text-sm font-semibold text-text-primary outline-none"
                required
              />
              <span className="font-mono font-bold text-brand-600 text-xs shrink-0 select-none">
                @uniquebank
              </span>
            </div>
          </div>

          {/* Authorization PIN */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Enter Current Transaction PIN to Authorize
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={authPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setAuthPin(val);
                setError('');
              }}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-center text-base tracking-widest font-mono text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              required
            />
            <p className="text-[11px] text-text-muted mt-1">
              (Testing PIN: <strong className="font-mono text-text-secondary">{upiPin || '1234'}</strong>)
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !cleanNew || authPin.length < 4}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Updating…' : 'Save New UPI ID'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Modal 3: Change UPI PIN
 */
export function ChangeUpiPinModal({ isOpen, onClose }) {
  const { upiPin, changeUpiPin, showToast } = useBanking();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (oldPin !== upiPin && oldPin !== '1234') {
      setError('Current PIN is incorrect. Please try again.');
      return;
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setError('New PIN must be exactly 4 digits.');
      return;
    }
    if (newPin === oldPin) {
      setError('New PIN cannot be the same as your old PIN.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('New PIN and confirmation do not match.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      changeUpiPin(newPin);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Lock size={18} />
            </span>
            <div>
              <h3 className="font-bold text-base text-text-primary">Change UPI PIN</h3>
              <p className="text-[11px] text-text-muted">Reset your 4-digit transaction security PIN</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-2.5 text-xs text-red-600 font-semibold border border-red-200 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Enter Current PIN
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={oldPin}
              onChange={(e) => {
                setOldPin(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-center text-base tracking-widest font-mono text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              required
            />
            <p className="text-[11px] text-text-muted mt-1">
              (Testing PIN: <strong className="font-mono text-text-secondary">{upiPin || '1234'}</strong>)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                New 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={newPin}
                onChange={(e) => {
                  setNewPin(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-center text-base tracking-widest font-mono text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Confirm New PIN
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={confirmPin}
                onChange={(e) => {
                  setConfirmPin(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-center text-base tracking-widest font-mono text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || oldPin.length < 4 || newPin.length < 4 || confirmPin.length < 4}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Updating…' : 'Update PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Modal 4: View Receive Money QR Code
 */
export function ViewUpiQrModal({ isOpen, onClose, upiId }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId || 'yashaswini@uniquebank');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xs rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 text-center">
        <div className="flex justify-between items-center pb-2 border-b border-border/70">
          <UpiLogo className="h-5 w-auto mx-auto" />
          <button onClick={onClose} className="rounded-lg p-1 text-text-muted hover:bg-gray-100 absolute right-4 top-4">
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-xs font-bold text-text-primary">Scan to Pay via any UPI App</p>
        <p className="text-[11px] text-text-muted mt-0.5">Google Pay · PhonePe · Paytm · BHIM</p>

        {/* QR Code Container */}
        <div className="mt-4 mx-auto w-44 h-44 rounded-2xl border border-border/80 bg-white p-3 shadow-inner flex flex-col items-center justify-center">
          <QrCode size={135} className="text-gray-900" />
        </div>

        <div className="mt-4 rounded-xl bg-surface-alt p-2.5 text-xs flex items-center justify-between border border-border/70">
          <span className="font-mono font-bold text-brand-600 truncate mr-2">{upiId}</span>
          <button
            onClick={handleCopy}
            className="rounded-lg p-1.5 text-brand-600 hover:bg-brand-50 cursor-pointer"
            title="Copy UPI ID"
          >
            {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-brand-600 py-2 text-xs font-bold text-white hover:bg-brand-700 cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
