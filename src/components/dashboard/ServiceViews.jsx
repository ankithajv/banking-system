import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  HandCoins,
  PiggyBank,
  ShieldCheck,
  CreditCard,
  Wrench,
  Sparkles,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sliders,
  X,
  FileCheck,
  Calculator,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { getSavingsAccountHolderName } from '../../utils/user';
import PinVerificationModal from '../common/PinVerificationModal';

export default function ServiceViews({ activeNav, onBackToOverview }) {
  const { balance, deposits, addDeposit, addTransaction, showToast } = useBanking();
  const holderName = getSavingsAccountHolderName();

  // ── Investments State ──────────────────────────────────────
  const [sipModalOpen, setSipModalOpen] = useState(false);
  const [sipFund, setSipFund] = useState('UNIQUE Nifty 50 Index Fund');
  const [sipAmount, setSipAmount] = useState('5000');
  const [pinAction, setPinAction] = useState(null);

  // ── Loans State (EMI Calculator) ───────────────────────────
  const [loanAmount, setLoanAmount] = useState(300000);
  const [loanTenureMonths, setLoanTenureMonths] = useState(36);
  const loanInterestRate = 10.5; // 10.5% p.a.
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [loanPurpose, setLoanPurpose] = useState('Home Renovation');

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = loanInterestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths)) /
      (Math.pow(1 + monthlyRate, loanTenureMonths) - 1)
  );
  const totalLoanRepayment = emi * loanTenureMonths;
  const totalLoanInterest = totalLoanRepayment - loanAmount;

  // ── Deposits State ─────────────────────────────────────────
  const [fdModalOpen, setFdModalOpen] = useState(false);
  const [fdPrincipal, setFdPrincipal] = useState('25000');
  const [fdTenure, setFdTenure] = useState(12);
  const fdRate = fdTenure >= 24 ? 7.65 : 7.25;

  // ── Cards State ────────────────────────────────────────────
  const [cardFrozen, setCardFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [onlineTxn, setOnlineTxn] = useState(true);
  const [intlTxn, setIntlTxn] = useState(false);
  const [cardLimit, setCardLimit] = useState(75000);

  // ── Insurance State ────────────────────────────────────────
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Comprehensive Health Shield (₹10 Lakh Cover)');
  const [nomineeName, setNomineeName] = useState('');

  // ── Services State ─────────────────────────────────────────
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Cheque Book Request (25 Leaves)');
  const [serviceTicket, setServiceTicket] = useState(null);

  // ── Handlers ───────────────────────────────────────────────
  const handleStartSip = (e) => {
    e.preventDefault();
    const num = parseFloat(sipAmount);
    if (isNaN(num) || num <= 0) return;
    if (num > balance) {
      showToast('Insufficient balance for initial SIP investment.', 'error');
      return;
    }

    // Require PIN verification
    setPinAction({
      type: 'sip',
      amount: num,
      recipient: sipFund,
      title: 'Authorize Monthly SIP',
    });
  };

  const handleDisburseLoan = (e) => {
    e.preventDefault();
    addTransaction({
      description: `Personal Loan Disbursal — ${loanPurpose}`,
      amount: loanAmount,
      type: 'credit',
      category: 'income',
      paymentMethod: 'Instant Loan Disbursal',
      recipient: 'UNIQUE Bank Loan Division',
    });

    setLoanModalOpen(false);
    showToast(`₹${loanAmount.toLocaleString('en-IN')} disbursed into your Savings Account!`, 'success');
  };

  const handleCreateFd = (e) => {
    e.preventDefault();
    const num = parseFloat(fdPrincipal);
    if (isNaN(num) || num <= 0) return;
    if (num > balance) {
      showToast('Insufficient balance to open Fixed Deposit.', 'error');
      return;
    }

    // Require PIN verification
    setPinAction({
      type: 'fd',
      amount: num,
      recipient: 'UNIQUE Bank FD Account',
      title: 'Authorize Fixed Deposit',
    });
  };

  const handlePinSuccess = () => {
    if (!pinAction) return;

    if (pinAction.type === 'sip') {
      addTransaction({
        description: `SIP Investment — ${sipFund}`,
        amount: pinAction.amount,
        type: 'debit',
        category: 'transfer',
        paymentMethod: 'Auto Debit SIP',
        recipient: sipFund,
      });
      setSipModalOpen(false);
      showToast(`Monthly SIP of ₹${pinAction.amount.toLocaleString('en-IN')} started successfully!`, 'success');
    } else if (pinAction.type === 'fd') {
      const res = addDeposit({
        principal: pinAction.amount,
        tenureMonths: parseInt(fdTenure, 10),
        interestRate: fdRate,
      });
      if (res) {
        setFdModalOpen(false);
      }
    }

    setPinAction(null);
  };

  const handleApplyInsurance = (e) => {
    e.preventDefault();
    if (!nomineeName.trim()) {
      showToast('Please enter a valid nominee name.', 'error');
      return;
    }
    setInsuranceModalOpen(false);
    showToast(`Policy for "${selectedPlan}" issued! Certificate sent to registered email.`, 'success');
  };

  const handleCreateServiceRequest = (e) => {
    e.preventDefault();
    const ticketId = `SR-${Math.floor(100000 + Math.random() * 900000)}`;
    setServiceTicket(ticketId);
    showToast(`Request submitted! Reference ID: ${ticketId}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Back to Overview Header Strip */}
      <div className="flex items-center justify-between rounded-xl bg-white/70 p-3.5 border border-border/80">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-bold">
            {activeNav.charAt(0).toUpperCase()}
          </span>
          <div>
            <h2 className="text-sm font-bold text-text-primary capitalize">{activeNav} Hub</h2>
            <p className="text-xs text-text-muted">Manage your tailored financial solutions</p>
          </div>
        </div>

        <button
          onClick={onBackToOverview}
          className="rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer"
        >
          ← Back to Dashboard Overview
        </button>
      </div>

      {/* ────────────────── 1. INVESTMENTS VIEW ────────────────── */}
      {activeNav === 'investments' && (
        <div className="space-y-6">
          {/* Portfolio Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5">
              <p className="text-xs text-text-muted uppercase font-semibold">Total Portfolio Value</p>
              <p className="mt-1 text-2xl font-extrabold text-brand-600">₹ 2,48,350.00</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                +14.8% Overall Returns
              </span>
            </div>

            <div className="card p-5">
              <p className="text-xs text-text-muted uppercase font-semibold">Active Monthly SIPs</p>
              <p className="mt-1 text-2xl font-extrabold text-text-primary">₹ 15,000 / mo</p>
              <p className="mt-2 text-xs text-text-muted">Next deduction: 5th Nov 2026</p>
            </div>

            <div className="card p-5 flex flex-col justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold">Ready to Invest?</p>
                <p className="text-xs text-text-secondary mt-1">Start a disciplined wealth creator.</p>
              </div>
              <button
                onClick={() => setSipModalOpen(true)}
                className="mt-3 w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white py-2 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                + Start New SIP
              </button>
            </div>
          </div>

          {/* Recommended Mutual Funds */}
          <div className="card p-6">
            <h3 className="font-bold text-sm text-text-primary mb-4">Top Rated Mutual Funds</h3>
            <div className="space-y-3">
              {[
                { name: 'UNIQUE Bluechip Large Cap Fund', type: 'Equity - Large Cap', return3y: '16.4% p.a.', risk: 'Moderate' },
                { name: 'UNIQUE Midcap Opportunities Fund', type: 'Equity - Mid Cap', return3y: '21.8% p.a.', risk: 'High' },
                { name: 'UNIQUE Sovereign Gold & Hybrid Fund', type: 'Hybrid', return3y: '12.1% p.a.', risk: 'Low to Medium' },
              ].map((fund, idx) => (
                <div key={idx} className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-alt border border-border/60">
                  <div>
                    <p className="font-bold text-sm text-text-primary">{fund.name}</p>
                    <p className="text-xs text-text-muted">{fund.type} · Risk: {fund.risk}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[11px] text-text-muted">3Y Annualized</p>
                      <p className="font-bold text-sm text-emerald-600">{fund.return3y}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSipFund(fund.name);
                        setSipModalOpen(true);
                      }}
                      className="rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 px-3 py-1.5 text-xs font-bold"
                    >
                      Invest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── 2. LOANS VIEW (WITH EMI CALCULATOR) ── */}
      {activeNav === 'loans' && (
        <div className="space-y-6">
          {/* Pre-Approved Banner */}
          <div className="card p-6 border-brand-200 bg-gradient-to-r from-brand-50 to-white">
            <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold mb-2">
              Pre-Approved Offer
            </span>
            <h3 className="text-lg font-bold text-text-primary">Instant Personal Loan up to ₹5,00,000</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-xl">
              Zero physical paperwork, flat 10.5% interest rate, and instant disbursal directly into your savings account.
            </p>
            <button
              onClick={() => setLoanModalOpen(true)}
              className="mt-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 text-xs font-bold shadow-sm cursor-pointer"
            >
              Claim & Disburse Loan Now →
            </button>
          </div>

          {/* Interactive EMI Calculator */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={18} className="text-brand-600" />
              <h3 className="font-bold text-sm text-text-primary">Interactive EMI Calculator</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                {/* Loan Amount Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-text-secondary">Loan Amount</span>
                    <span className="font-bold text-brand-600">₹ {loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-text-muted mt-1">
                    <span>₹50,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>

                {/* Loan Tenure Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-text-secondary">Tenure (Months)</span>
                    <span className="font-bold text-brand-600">{loanTenureMonths} Months ({loanTenureMonths / 12} Years)</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="60"
                    step="6"
                    value={loanTenureMonths}
                    onChange={(e) => setLoanTenureMonths(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-text-muted mt-1">
                    <span>12 Months</span>
                    <span>60 Months</span>
                  </div>
                </div>
              </div>

              {/* Calculated EMI Display Box */}
              <div className="rounded-2xl bg-surface-alt p-6 border border-border/80 text-center space-y-3">
                <p className="text-xs font-semibold uppercase text-text-muted tracking-wider">Estimated Monthly EMI</p>
                <p className="text-3xl font-extrabold text-brand-600">₹ {emi.toLocaleString('en-IN')}</p>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/60 text-xs">
                  <div>
                    <p className="text-text-muted">Total Interest</p>
                    <p className="font-bold text-text-primary">₹ {totalLoanInterest.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Total Payable</p>
                    <p className="font-bold text-text-primary">₹ {totalLoanRepayment.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── 3. DEPOSITS VIEW (FD/RD) ───────────── */}
      {activeNav === 'deposits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-text-primary">Fixed & Recurring Deposits</h3>
              <p className="text-xs text-text-secondary">Guaranteed returns up to 7.65% per annum</p>
            </div>
            <button
              onClick={() => setFdModalOpen(true)}
              className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-xs font-bold shadow-sm cursor-pointer"
            >
              + Open New Fixed Deposit
            </button>
          </div>

          {/* Active Deposits Table */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-border font-bold text-xs text-text-primary">
              Your Active Fixed Deposits ({deposits.length})
            </div>
            <div className="divide-y divide-border/60">
              {deposits.map((dep) => (
                <div key={dep.id} className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary">{dep.type}</span>
                      <span className="rounded bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 text-[10px]">
                        {dep.interestRate}% p.a.
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      Account: {dep.id} · Maturity: {dep.maturityDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-text-muted">Maturity Value</p>
                    <p className="font-extrabold text-emerald-600 text-base">
                      ₹ {dep.maturityAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── 4. INSURANCE VIEW ──────────────────── */}
      {activeNav === 'insurance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'Comprehensive Health Shield',
                cover: '₹ 10,00,000 Cover',
                premium: '₹ 499 / mo',
                desc: 'Cashless hospitalization across 6,500+ network hospitals.',
              },
              {
                title: 'Term Life Protection Plan',
                cover: '₹ 1,00,00,000 Cover',
                premium: '₹ 650 / mo',
                desc: 'Financial security and lump sum benefit for your loved ones.',
              },
              {
                title: 'Cyber Fraud & Account Shield',
                cover: '₹ 2,00,000 Cover',
                premium: '₹ 99 / mo',
                desc: '100% protection against phishing, online scams, and unauthorized card misuse.',
              },
            ].map((ins, idx) => (
              <div key={idx} className="card p-5 flex flex-col justify-between">
                <div>
                  <span className="rounded-full bg-brand-50 text-brand-700 font-bold px-2.5 py-0.5 text-[11px]">
                    {ins.cover}
                  </span>
                  <h4 className="font-bold text-sm text-text-primary mt-2">{ins.title}</h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{ins.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-bold text-sm text-brand-600">{ins.premium}</span>
                  <button
                    onClick={() => {
                      setSelectedPlan(ins.title);
                      setInsuranceModalOpen(true);
                    }}
                    className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 text-xs font-bold"
                  >
                    Get Policy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────── 5. CARDS VIEW ──────────────────────── */}
      {activeNav === 'cards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Visual Card */}
            <div className="card p-6">
              <h3 className="font-bold text-sm text-text-primary mb-4">Your Primary Debit Card</h3>

              <div
                className={`rounded-2xl p-6 text-white shadow-xl transition-all ${
                  cardFrozen
                    ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-70'
                    : 'bg-gradient-to-tr from-[#1E1B4B] via-[#312E81] to-[#4338CA]'
                }`}
              >
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>UNIQUE Bank</span>
                  <span className="uppercase text-xs text-white/70">Platinum Debit</span>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="h-7 w-10 rounded bg-amber-400/80"></div>
                  <svg className="h-6 w-6 text-white/80 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-label="Contactless card">
                    <path d="M4 19a16 16 0 0 1 16-16" />
                    <path d="M4 14a11 11 0 0 1 11-11" />
                    <path d="M4 9a6 6 0 0 1 6-6" />
                  </svg>
                </div>

                <div className="mt-6 flex items-center justify-between font-mono text-base tracking-widest">
                  <span>{showCardNumber ? '4532 8912 0482 4523' : '•••• •••• •••• 4523'}</span>
                  <button onClick={() => setShowCardNumber(!showCardNumber)} className="cursor-pointer">
                    {showCardNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="mt-6 flex justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase">Card Holder</p>
                    <p className="font-semibold uppercase">{holderName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 uppercase">CVV</p>
                    <div className="flex items-center gap-1 font-bold">
                      <span>{showCvv ? '842' : '•••'}</span>
                      <button onClick={() => setShowCvv(!showCvv)}>
                        {showCvv ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Freeze Toggle */}
              <div className="mt-5 flex items-center justify-between rounded-xl bg-surface-alt p-3 border border-border/60">
                <div>
                  <p className="font-semibold text-xs text-text-primary">
                    {cardFrozen ? 'Card Frozen' : 'Card Active'}
                  </p>
                  <p className="text-[11px] text-text-muted">Instant freeze for safety</p>
                </div>
                <button
                  onClick={() => setCardFrozen(!cardFrozen)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    cardFrozen
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  }`}
                >
                  {cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}
                </button>
              </div>
            </div>

            {/* Quick Limit Controls */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-sm text-text-primary">Card Usage Controls</h3>

              <div className="flex justify-between items-center py-2 border-b border-border/60 text-xs sm:text-sm">
                <div>
                  <p className="font-semibold text-text-primary">Online E-Commerce Payments</p>
                  <p className="text-[11px] text-text-muted">Amazon, Flipkart, Swiggy, etc.</p>
                </div>
                <button
                  onClick={() => setOnlineTxn(!onlineTxn)}
                  className={`h-6 w-11 rounded-full border-2 border-transparent transition-colors ${
                    onlineTxn ? 'bg-brand-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                      onlineTxn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60 text-xs sm:text-sm">
                <div>
                  <p className="font-semibold text-text-primary">International Transactions</p>
                  <p className="text-[11px] text-text-muted">Allow spending in USD, EUR, etc.</p>
                </div>
                <button
                  onClick={() => setIntlTxn(!intlTxn)}
                  className={`h-6 w-11 rounded-full border-2 border-transparent transition-colors ${
                    intlTxn ? 'bg-brand-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                      intlTxn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-text-primary">Daily Spending Limit</span>
                  <span className="text-brand-600">₹ {cardLimit.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={cardLimit}
                  onChange={(e) => setCardLimit(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 text-right">
                <Link
                  to="/account?tab=cards"
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Manage Full Card Settings →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── 6. SERVICES VIEW ───────────────────── */}
      {activeNav === 'services' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Cheque Book Request', desc: 'Request a fresh personalized 25/50 leaves cheque book.' },
              { title: 'Locker Allocation', desc: 'Book secure bank safe deposit locker at your branch.' },
              { title: 'Forex Multi-Currency Card', desc: 'Order a multi-currency card loaded with USD/EUR.' },
              { title: 'Stop Cheque Payment', desc: 'Instantly revoke issued cheque by cheque number.' },
              { title: 'Update Communication Address', desc: 'Submit proof of new residential address online.' },
              { title: '24x7 Priority Support Ticket', desc: 'Direct escalation to senior branch manager.' },
            ].map((srv, idx) => (
              <div key={idx} className="card p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{srv.title}</h4>
                  <p className="text-xs text-text-secondary mt-1">{srv.desc}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedService(srv.title);
                    setServiceModalOpen(true);
                  }}
                  className="mt-4 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 py-2 text-xs font-bold transition-colors"
                >
                  Request Service
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────── MODALS ────────────────── */}

      {/* SIP Investment Modal */}
      {sipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSipModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 border border-border">
            <h3 className="font-bold text-base text-text-primary">Start Monthly SIP</h3>
            <form onSubmit={handleStartSip} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">Fund</label>
                <input
                  type="text"
                  value={sipFund}
                  readOnly
                  className="w-full rounded-xl border border-border bg-gray-50 px-3 py-2 text-text-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-text-secondary mb-1">Monthly SIP Amount (INR)</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-text-primary font-bold focus:border-brand-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSipModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 font-bold"
                >
                  Confirm & Start SIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loan Disbursal Modal */}
      {loanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setLoanModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 border border-border">
            <h3 className="font-bold text-base text-text-primary">Disburse Pre-Approved Loan</h3>
            <form onSubmit={handleDisburseLoan} className="mt-4 space-y-3 text-xs sm:text-sm">
              <div className="rounded-xl bg-brand-50 p-3 text-brand-900">
                <p className="text-xs">Approved Amount: <strong>₹ {loanAmount.toLocaleString('en-IN')}</strong></p>
                <p className="text-xs">Calculated Monthly EMI: <strong>₹ {emi.toLocaleString('en-IN')}</strong> ({loanTenureMonths} mo)</p>
              </div>
              <div>
                <label className="block font-semibold text-text-secondary mb-1">Loan Purpose</label>
                <select
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-text-primary"
                >
                  <option value="Home Renovation">Home Renovation</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Higher Education">Higher Education</option>
                  <option value="Travel & Vacation">Travel & Vacation</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setLoanModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 font-bold"
                >
                  Disburse to Savings A/C
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Open FD Modal */}
      {fdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setFdModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 border border-border">
            <h3 className="font-bold text-base text-text-primary">Open New Fixed Deposit</h3>
            <form onSubmit={handleCreateFd} className="mt-4 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">Deposit Amount (INR)</label>
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  value={fdPrincipal}
                  onChange={(e) => setFdPrincipal(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 font-bold text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-text-secondary mb-1">Tenure</label>
                <select
                  value={fdTenure}
                  onChange={(e) => setFdTenure(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-text-primary"
                >
                  <option value="12">12 Months (7.25% p.a.)</option>
                  <option value="24">24 Months (7.65% p.a.)</option>
                  <option value="36">36 Months (7.65% p.a.)</option>
                  <option value="60">60 Months (7.40% p.a.)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setFdModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 font-bold"
                >
                  Confirm & Open FD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Insurance Modal */}
      {insuranceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setInsuranceModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 border border-border">
            <h3 className="font-bold text-base text-text-primary">Enroll in Insurance</h3>
            <form onSubmit={handleApplyInsurance} className="mt-4 space-y-3 text-xs sm:text-sm">
              <p className="font-bold text-brand-600 text-xs">{selectedPlan}</p>
              <div>
                <label className="block font-semibold text-text-secondary mb-1">Nominee Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Doe"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-text-primary"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setInsuranceModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 font-bold"
                >
                  Confirm Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Request Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setServiceModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 border border-border">
            <h3 className="font-bold text-base text-text-primary">{selectedService}</h3>
            {serviceTicket ? (
              <div className="py-4 text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
                <p className="font-bold text-sm text-text-primary">Service Request Registered</p>
                <p className="text-xs text-text-secondary">
                  Your ticket number is <span className="font-mono font-bold text-brand-600">{serviceTicket}</span>.
                  You will receive SMS updates within 2 business days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setServiceModalOpen(false);
                    setServiceTicket(null);
                  }}
                  className="w-full rounded-xl bg-brand-600 py-2 text-xs font-bold text-white hover:bg-brand-700 mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateServiceRequest} className="mt-4 space-y-3 text-xs sm:text-sm">
                <p className="text-xs text-text-secondary">
                  Please verify your registered address: Indiranagar, Bengaluru, 560038.
                </p>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    className="rounded-xl px-4 py-2 font-semibold text-text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 font-bold"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PIN Verification Modal */}
      <PinVerificationModal
        isOpen={Boolean(pinAction)}
        onClose={() => setPinAction(null)}
        onSuccess={handlePinSuccess}
        amount={pinAction?.amount}
        recipient={pinAction?.recipient}
        title={pinAction?.title || 'Authorize Payment'}
      />
    </div>
  );
}
