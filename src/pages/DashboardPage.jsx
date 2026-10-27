import { useState } from 'react';
import { Menu, PlusCircle, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import AccountBalanceCard from '../components/dashboard/AccountBalanceCard';
import CurrencyConverter from '../components/dashboard/CurrencyConverter';
import QuickActions from '../components/dashboard/QuickActions';
import SpendingOverview from '../components/dashboard/SpendingOverview';
import UpcomingPayments from '../components/dashboard/UpcomingPayments';
import SavingsGoals from '../components/dashboard/SavingsGoals';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import PlansBannerCarousel from '../components/dashboard/PlansBannerCarousel';
import ServiceViews from '../components/dashboard/ServiceViews';
import PinVerificationModal from '../components/common/PinVerificationModal';
import { useBanking } from '../context/BankingContext';
import { getUserGreetingName } from '../utils/user';

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newTxModalOpen, setNewTxModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successTx, setSuccessTx] = useState(null);

  // Form states for New Transaction
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('transfer');
  const [method, setMethod] = useState('UPI Transfer');
  const [note, setNote] = useState('');

  const { balance, addTransaction } = useBanking();
  const displayName = getUserGreetingName();

  const handleOpenNewTx = () => {
    setError('');
    setRecipient('');
    setAmount('');
    setNote('');
    setSuccessTx(null);
    setNewTxModalOpen(true);
  };

  const handleCloseNewTx = () => {
    setNewTxModalOpen(false);
    setSuccessTx(null);
    setRecipient('');
    setAmount('');
    setNote('');
    setError('');
  };

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);

    if (!recipient.trim()) {
      setError('Please enter a recipient name or account.');
      return;
    }
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }
    if (num > (balance ?? 248350.75)) {
      setError(`Insufficient balance. Current available: ₹${(balance ?? 248350.75).toLocaleString('en-IN')}`);
      return;
    }

    setError('');
    // Open PIN verification modal before completing transaction
    setPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setPinModalOpen(false);
    setLoading(true);
    const num = parseFloat(amount);

    setTimeout(() => {
      setLoading(false);
      const tx = addTransaction({
        description: `${recipient.trim()}${note ? ` — ${note.trim()}` : ''}`,
        amount: num,
        type: 'debit',
        category,
        paymentMethod: method,
        recipient: recipient.trim(),
      });

      if (tx) {
        setSuccessTx(tx);
      } else {
        handleCloseNewTx();
      }
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      {/* Top Navbar */}
      <Header />

      <div className="flex flex-1">
        {/* Collapsible Sidebar */}
        <Sidebar
          activeItem={activeNav}
          onItemClick={setActiveNav}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />

        {/* Main Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {/* Featured Plans Carousel strip */}
          <PlansBannerCarousel />

          {/* Greeting Header & Quick New Transaction Action */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl p-2 text-text-secondary hover:bg-slate-100 lg:hidden cursor-pointer"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar menu"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
                  Hello, {displayName}!
                </h1>
                <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                  Welcome back — here is your financial overview and daily activity.
                </p>
              </div>
            </div>
          </div>

          {/* Content Switching based on Sidebar Navigation */}
          {activeNav === 'overview' ? (
            /* ── Balanced Two-Column Grid Layout matching Reference Design ── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Left Column (7 cols on lg, 8 cols on xl) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                {/* 1. Existing Redesigned Savings Account Card */}
                <AccountBalanceCard />

                {/* 2. Quick Actions (Send Money, Mobile, Credit Card, Pay Bills) */}
                <QuickActions />

                {/* 3. Spending Overview (Category Donut + Monthly Bar Comparison) */}
                <SpendingOverview />

                {/* 4. Recent Activity (Search, Category Filters, CSV Export & Receipts) */}
                <RecentTransactions />
              </div>

              {/* Right Side Column (5 cols on lg, 4 cols on xl) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                {/* 1. Currency Converter */}
                <CurrencyConverter />

                {/* 2. Upcoming Payments (BESCOM, Airtel, JioFiber with Demo Pay) */}
                <UpcomingPayments />

                {/* 3. Savings Goals (Target progress, percentages) */}
                <SavingsGoals />
              </div>
            </div>
          ) : (
            <ServiceViews
              activeNav={activeNav}
              onBackToOverview={() => setActiveNav('overview')}
            />
          )}

          {/* Footer note */}
          <footer className="mt-10 border-t border-border/60 pt-6 pb-4 text-center text-xs text-text-muted">
            <p>
              UNIQUE Bank © 2026 · Demonstrative Banking Frontend Interface. All financial figures are simulated.
            </p>
          </footer>
        </main>
      </div>

      {/* New Transaction Modal */}
      {newTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={handleCloseNewTx}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <PlusCircle size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-base text-text-primary">New Transaction</h3>
                  <p className="text-xs text-text-muted">Instant transfer from Savings Account</p>
                </div>
              </div>

              <button
                onClick={handleCloseNewTx}
                className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {successTx ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-2xs">
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

                <div className="rounded-xl bg-surface-alt p-3.5 text-xs text-left space-y-2 border border-border/60">
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
                  onClick={handleCloseNewTx}
                  className="w-full rounded-xl bg-brand-600 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-brand-700 transition-all shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateTransaction} className="mt-4 space-y-4">
                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold border border-red-200">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Recipient Name / Payee
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar or Swiggy"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Channel
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs sm:text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="UPI Transfer">UPI Transfer</option>
                      <option value="IMPS / NEFT">IMPS / NEFT</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Net Banking">Net Banking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs sm:text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="transfer">Transfer</option>
                      <option value="shopping">Shopping</option>
                      <option value="utilities">Bills & Utilities</option>
                      <option value="income">Income</option>
                      <option value="rewards">Rewards</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-text-secondary">
                      Amount (INR)
                    </label>
                    <span className="text-[11px] text-text-muted">
                      Available: ₹{(balance ?? 248350.75).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
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

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Note / Purpose (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Month end settlement"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setNewTxModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Processing…</span>
                      </>
                    ) : (
                      <>
                        <span>Send Payment</span>
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
        title="Authorize Transfer"
      />
    </div>
  );
}
