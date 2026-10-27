import { useState } from 'react';
import { Smartphone, Hash, CreditCard, Globe, Check, X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import PinVerificationModal from '../common/PinVerificationModal';
import { UpiLogo, SetupUpiModal, ChangeUpiIdModal } from '../common/UpiModals';

const methods = [
  {
    key: 'upi',
    title: 'UPI',
    description: 'Pay using UPI ID or QR',
    icon: Smartphone,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    key: 'mobile',
    title: 'Mobile Number',
    description: 'Send to a mobile number',
    icon: Hash,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    key: 'credit-card',
    title: 'Credit Card',
    description: 'Pay with your card',
    icon: CreditCard,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    key: 'net-banking',
    title: 'Net Banking',
    description: 'Bank-to-bank transfer',
    icon: Globe,
    color: 'text-emerald-600 bg-emerald-50',
  },
];

/**
 * Four clickable payment method cards arranged in a responsive grid.
 */
export default function PaymentMethods() {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successTx, setSuccessTx] = useState(null);
  const [setupUpiModalOpen, setSetupUpiModalOpen] = useState(false);
  const [changeUpiIdModalOpen, setChangeUpiIdModalOpen] = useState(false);
  const { balance, addTransaction, upiId } = useBanking();

  // Form states
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [error, setError] = useState('');

  const handleCardClick = (key) => {
    setSelected(key);
    setError('');
    setRecipient('');
    setAmount('');
    setNote('');
    setSuccessTx(null);
    setPinModalOpen(false);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setPinModalOpen(false);
    setSelected(null);
    setSuccessTx(null);
    setError('');
  };

  // Called when user clicks "Pay Now" on the form -> opens PIN modal
  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (selected === 'upi' && !upiId) {
      setError('Please set up your UNIQUE Bank UPI ID first before making UPI transfers.');
      return;
    }
    if (!recipient.trim()) {
      setError('Please enter valid recipient details.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }
    if (numAmount > balance) {
      setError(`Insufficient balance. Available: ₹${balance.toLocaleString('en-IN')}`);
      return;
    }

    setError('');
    // Trigger PIN verification modal
    setPinModalOpen(true);
  };

  // Called after successful PIN verification
  const handlePinSuccess = () => {
    setPinModalOpen(false);
    setLoading(true);

    const numAmount = parseFloat(amount);
    const activeMethodObj = methods.find((m) => m.key === selected);
    const methodName = activeMethodObj ? activeMethodObj.title : 'Transfer';

    setTimeout(() => {
      setLoading(false);
      const tx = addTransaction({
        description: `${methodName} — ${recipient.trim()}`,
        amount: numAmount,
        type: 'debit',
        category: 'transfer',
        paymentMethod: methodName,
        recipient: recipient.trim(),
      });

      if (tx) {
        setSuccessTx(tx);
      }
    }, 400);
  };

  const activeMethod = methods.find((m) => m.key === selected);

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-text-primary">Payment Methods</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {methods.map((m) => {
          const Icon = m.icon;
          const isActive = selected === m.key;

          return (
            <button
              key={m.key}
              onClick={() => handleCardClick(m.key)}
              className={`card group relative flex flex-col items-center gap-2 px-3 py-5 text-center transition-all cursor-pointer
                hover:shadow-md hover:-translate-y-0.5
                ${isActive ? 'ring-2 ring-brand-500 border-brand-400' : ''}
              `}
            >
              {isActive && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}

              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.color} transition-transform group-hover:scale-110`}>
                <Icon size={20} />
              </span>
              <span className="text-sm font-semibold text-text-primary">{m.title}</span>
              <span className="text-[11px] leading-tight text-text-muted">{m.description}</span>
            </button>
          );
        })}
      </div>

      {/* Payment Modal */}
      {modalOpen && activeMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={handleClose}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeMethod.color}`}>
                  <activeMethod.icon size={20} />
                </span>
                <div>
                  <h3 className="font-bold text-base text-text-primary">
                    Pay via {activeMethod.title}
                  </h3>
                  <p className="text-xs text-text-muted">Instant zero-fee transfer</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            {successTx ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-primary">Payment Successful!</h4>
                  <p className="text-xs text-text-secondary mt-1">
                    ₹{Math.abs(successTx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} has been debited.
                  </p>
                  <span className="mt-1.5 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/50">
                    Simulated Demo Transaction
                  </span>
                </div>

                <div className="rounded-xl bg-surface-alt p-3 text-xs text-left space-y-1.5 border border-border/60">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Ref ID</span>
                    <span className="font-mono font-bold text-text-primary">{successTx.refId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Paid to</span>
                    <span className="font-semibold text-text-primary">{successTx.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Method</span>
                    <span className="text-text-primary">{successTx.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Date & Time</span>
                    <span className="text-text-primary">{successTx.date} · {successTx.time}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full rounded-xl bg-brand-600 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-brand-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold border border-red-200">
                    {error}
                  </div>
                )}

                {/* Specific Fields depending on method */}
                {selected === 'upi' && (
                  <div className="space-y-3">
                    {upiId ? (
                      <div className="rounded-xl bg-surface-alt p-3 border border-border/70 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                            Paying From UPI ID
                          </span>
                          <span className="font-mono font-bold text-brand-600">{upiId}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setChangeUpiIdModalOpen(true)}
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline cursor-pointer"
                        >
                          Change UPI ID
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-center justify-between">
                        <div>
                          <p className="font-bold">First Time Using UPI?</p>
                          <p className="text-[11px] text-amber-800 mt-0.5">Set up your UNIQUE Bank UPI handle now.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSetupUpiModalOpen(true)}
                          className="rounded-lg bg-amber-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-amber-700 cursor-pointer shadow-2xs"
                        >
                          Set Up UPI
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Recipient UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. merchant@upi or rahul@okhdfc"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        required
                      />
                    </div>
                  </div>
                )}

                {selected === 'mobile' && (
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Recipient Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      required
                    />
                  </div>
                )}

                {selected === 'credit-card' && (
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Select Card / Bill
                    </label>
                    <select
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      required
                    >
                      <option value="">Select a Card</option>
                      <option value="UNIQUE Visa Platinum (•••• 4523)">UNIQUE Visa Platinum (•••• 4523)</option>
                      <option value="Axis Bank Flipkart Card (•••• 8912)">Axis Bank Flipkart Card (•••• 8912)</option>
                      <option value="HDFC Regalia Card (•••• 1024)">HDFC Regalia Card (•••• 1024)</option>
                    </select>
                  </div>
                )}

                {selected === 'net-banking' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Recipient Bank
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Beneficiary Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter account number"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-text-secondary">
                      Amount (INR)
                    </label>
                    <span className="text-[11px] text-text-muted">
                      Bal: ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white pl-8 pr-4 py-2 text-sm font-bold text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Purpose Note */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Note / Purpose (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dinner share, rent, utilities"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Processing…</span>
                      </>
                    ) : (
                      <>
                        <span>Pay Now</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PIN Verification Modal */}
      <PinVerificationModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        amount={amount}
        recipient={recipient}
        title={`Authorize ${activeMethod?.title || 'Payment'}`}
      />

      {/* Set Up UPI Modal */}
      <SetupUpiModal
        isOpen={setupUpiModalOpen}
        onClose={() => setSetupUpiModalOpen(false)}
        defaultHandle="user"
      />

      {/* Change UPI ID Modal */}
      <ChangeUpiIdModal
        isOpen={changeUpiIdModalOpen}
        onClose={() => setChangeUpiIdModalOpen(false)}
      />
    </div>
  );
}

