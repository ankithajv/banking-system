import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Zap,
  TrendingUp,
  X,
  Check,
  ChevronRight,
} from 'lucide-react';
import Header from '../components/dashboard/Header';
import PinVerificationModal from '../components/common/PinVerificationModal';
import { useBanking } from '../context/BankingContext';

import everydayBankingImg from '../assets/plans/everyday-banking.png';
import premiumBankingImg from '../assets/plans/premium-banking.jpg';
import smartSavingsImg from '../assets/plans/smart-savings.jpg';
import studentBankingImg from '../assets/plans/student-banking.jpg';

const plansData = [
  {
    id: 'everyday',
    title: 'Everyday Banking',
    tagline: 'Simple. Secure. Always with you.',
    badge: 'Popular',
    image: everydayBankingImg,
    monthlyFee: '₹ 0',
    feeAmount: 0,
    minBalance: '₹ 0 (Zero Balance)',
    interestRate: '3.5% p.a.',
    features: [
      'Zero Minimum Balance requirement',
      'Free Contactless Virtual & Physical Debit Card',
      'Unlimited free UPI & IMPS transactions',
      'Instant SMS alerts & Monthly E-Statements',
      '24/7 in-app customer support',
    ],
    recommendedFor: 'Individuals seeking straightforward daily personal banking with no fees.',
  },
  {
    id: 'premium',
    title: 'Premium Banking',
    tagline: 'VISA Infinite experience for your next level.',
    badge: 'Exclusive',
    image: premiumBankingImg,
    monthlyFee: '₹ 499 / mo',
    feeAmount: 499,
    minBalance: '₹ 1,00,000 MAB',
    interestRate: '5.25% p.a.',
    features: [
      'Metal VISA Infinite Debit Card with lounge access',
      'Complimentary airport lounge access across India & international hubs',
      'Dedicated Priority Relationship Manager (RM)',
      '5% cashback on dining, travel, and international shopping',
      'Zero forex markup fee on foreign exchange transactions',
      'High daily transfer limit up to ₹ 10,00,000',
    ],
    recommendedFor: 'High net-worth professionals, frequent flyers, and global executives.',
  },
  {
    id: 'smart-savings',
    title: 'Smart Savings Plan',
    tagline: 'A simple, automated way to grow your money.',
    badge: 'High Yield',
    image: smartSavingsImg,
    monthlyFee: '₹ 0',
    feeAmount: 0,
    minBalance: '₹ 10,000 MAB',
    interestRate: 'Up to 7.5% p.a.',
    features: [
      'Auto-sweep excess balance into high-yield Fixed Deposits',
      'Earn up to 7.5% interest with zero lock-in penalty',
      'Smart Round-Up: rounds spare change into automatic investments',
      'Free health and cyber insurance coverage up to ₹ 5,00,000',
      'Discounted locker rental charges by 50%',
    ],
    recommendedFor: 'Savers and investors aiming for maximum interest yield without locking liquidity.',
  },
  {
    id: 'student',
    title: 'Student Banking Plan',
    tagline: 'Learn, grow and achieve more with zero fees.',
    badge: 'Campus Special',
    image: studentBankingImg,
    monthlyFee: '₹ 0',
    feeAmount: 0,
    minBalance: '₹ 0 (Zero Balance)',
    interestRate: '4.0% p.a.',
    features: [
      '100% Zero Fee account until graduation',
      'Free International Student Identity Card (ISIC)',
      '10% cashback on textbooks, Coursera, Udemy, and exam fees',
      'Zero international transaction fees for study-abroad applications',
      'Financial literacy webinars & student credit score builder',
    ],
    recommendedFor: 'Undergraduate and postgraduate students under 26 years of age.',
  },
];

export default function PlansPage() {
  const [searchParams] = useSearchParams();
  const initialPlanId = searchParams.get('plan') || null;

  const { showToast, addTransaction } = useBanking();
  const [selectedPlan, setSelectedPlan] = useState(() => {
    return plansData.find((p) => p.id === initialPlanId) || null;
  });

  const [activePlanId, setActivePlanId] = useState(() => {
    try {
      return localStorage.getItem('unique_bank_enrolled_plan') || 'everyday';
    } catch {
      return 'everyday';
    }
  });

  const [applying, setApplying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleConfirmEnrollment = () => {
    if (!selectedPlan) return;
    if (selectedPlan.feeAmount > 0) {
      // Require demo PIN verification for paid plan upgrade
      setPinModalOpen(true);
    } else {
      finalizeEnrollment();
    }
  };

  const finalizeEnrollment = () => {
    if (!selectedPlan) return;
    setApplying(true);

    setTimeout(() => {
      setApplying(false);
      setActivePlanId(selectedPlan.id);
      try {
        localStorage.setItem('unique_bank_enrolled_plan', selectedPlan.id);
      } catch {
        // ignore
      }

      if (selectedPlan.feeAmount > 0) {
        addTransaction({
          description: `Plan Upgrade Fee — ${selectedPlan.title}`,
          amount: selectedPlan.feeAmount,
          type: 'debit',
          category: 'shopping',
          paymentMethod: 'Account Auto-Debit',
          recipient: 'UNIQUE Bank Premium Division',
        });
      }

      setModalOpen(false);
      showToast(`Successfully enrolled in ${selectedPlan.title}!`, 'success');
    }, 600);
  };

  const handlePinSuccess = () => {
    setPinModalOpen(false);
    finalizeEnrollment();
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      <Header />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <span className="text-text-muted">/</span>
          <span className="font-medium text-text-secondary">Banking Plans & Tiers</span>
        </div>

        {/* Page Hero Header */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 border border-brand-200/50 mb-3">
            <Sparkles size={14} />
            Tailored Banking Experiences
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Choose the Perfect Plan for Your Financial Journey
          </h1>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            From everyday digital checking with zero balance to executive VISA Infinite privileges,
            switch or activate your plan anytime with immediate effect.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plansData.map((plan) => {
            const isCurrent = activePlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={`card relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isCurrent ? 'ring-2 ring-brand-500 border-brand-400' : ''
                }`}
              >
                {/* Active Plan Ribbon */}
                {isCurrent && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                    <Check size={12} strokeWidth={3} />
                    Current Plan
                  </div>
                )}

                {/* Plan Banner Header Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="inline-block rounded-md bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider mb-1">
                      {plan.badge}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight">{plan.title}</h3>
                  </div>
                </div>

                {/* Plan Pricing & Overview */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between border-b border-border/70 pb-3">
                      <div>
                        <p className="text-[11px] text-text-muted">Fee</p>
                        <p className="text-lg font-extrabold text-brand-600">{plan.monthlyFee}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-text-muted">Interest</p>
                        <p className="text-sm font-bold text-emerald-600">{plan.interestRate}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-text-secondary leading-snug italic">
                      "{plan.tagline}"
                    </p>

                    {/* Features list */}
                    <div className="mt-4 space-y-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Included Benefits
                      </p>
                      {plan.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-text-primary">
                          <CheckCircle2
                            size={14}
                            className="text-emerald-500 shrink-0 mt-0.5"
                          />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-3 border-t border-border/60">
                    <button
                      onClick={() => handleOpenModal(plan)}
                      className={`w-full rounded-xl py-2.5 px-4 text-xs sm:text-sm font-bold transition-all shadow-sm ${
                        isCurrent
                          ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
                          : 'bg-brand-600 text-white hover:bg-brand-700'
                      }`}
                    >
                      {isCurrent ? 'Active Plan Details' : 'Upgrade to Plan'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table Section */}
        <div className="mt-12 rounded-2xl border border-white/60 bg-white/85 p-6 sm:p-8 shadow-sm backdrop-blur-md">
          <h2 className="text-lg font-bold text-text-primary mb-1">Detailed Tier Comparison</h2>
          <p className="text-xs text-text-secondary mb-6">
            Compare all UNIQUE Bank plan specifications side-by-side.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold">Features & Privileges</th>
                  <th className="py-3 px-4 font-semibold">Everyday</th>
                  <th className="py-3 px-4 font-semibold">Premium</th>
                  <th className="py-3 px-4 font-semibold">Smart Savings</th>
                  <th className="py-3 px-4 font-semibold">Student</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="py-3 px-4 font-medium text-text-primary">Monthly Fee</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Free (₹0)</td>
                  <td className="py-3 px-4 text-text-primary">₹499</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Free (₹0)</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Free (₹0)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-text-primary">Minimum Balance</td>
                  <td className="py-3 px-4 text-text-secondary">₹0</td>
                  <td className="py-3 px-4 text-text-secondary">₹1,00,000</td>
                  <td className="py-3 px-4 text-text-secondary">₹10,000</td>
                  <td className="py-3 px-4 text-text-secondary">₹0</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-text-primary">Debit Card Type</td>
                  <td className="py-3 px-4 text-text-secondary">Classic Contactless</td>
                  <td className="py-3 px-4 text-brand-600 font-bold">VISA Infinite Metal</td>
                  <td className="py-3 px-4 text-text-secondary">Platinum Virtual/Physical</td>
                  <td className="py-3 px-4 text-text-secondary">ISIC Student Card</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-text-primary">Airport Lounge Access</td>
                  <td className="py-3 px-4 text-text-muted">—</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Unlimited Free</td>
                  <td className="py-3 px-4 text-text-muted">—</td>
                  <td className="py-3 px-4 text-text-muted">Discounted</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-text-primary">Savings Interest Rate</td>
                  <td className="py-3 px-4 text-text-secondary">3.50%</td>
                  <td className="py-3 px-4 text-text-secondary">5.25%</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">7.50% (Auto-sweep)</td>
                  <td className="py-3 px-4 text-text-secondary">4.00%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-text-primary">Dedicated Relationship Mgr</td>
                  <td className="py-3 px-4 text-text-muted">—</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Included</td>
                  <td className="py-3 px-4 text-text-muted">—</td>
                  <td className="py-3 px-4 text-text-muted">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Plan Details & Enrollment Modal */}
      <AnimatePresence>
        {modalOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-brand-50 p-2 text-brand-600">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-text-primary">
                      {selectedPlan.title}
                    </h3>
                    <p className="text-xs text-text-muted">{selectedPlan.badge} Tier</p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:text-sm">
                <div className="rounded-xl bg-surface-alt p-3.5 border border-border/70 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-text-muted">Subscription Fee</p>
                    <p className="text-base font-extrabold text-brand-600">
                      {selectedPlan.monthlyFee}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Min. Balance Requirement</p>
                    <p className="font-semibold text-text-primary">
                      {selectedPlan.minBalance}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">
                    Key Entitlements:
                  </h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-secondary text-xs">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="rounded-lg bg-brand-50/60 p-2.5 text-[11px] text-brand-800">
                  <strong>Recommendation:</strong> {selectedPlan.recommendedFor}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={applying || activePlanId === selectedPlan.id}
                  onClick={handleConfirmEnrollment}
                  className="rounded-xl bg-brand-600 px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  {applying
                    ? 'Activating Plan…'
                    : activePlanId === selectedPlan.id
                    ? 'Currently Subscribed'
                    : `Activate ${selectedPlan.title}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PIN Verification Modal for Paid Plan Upgrades */}
      <PinVerificationModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        amount={selectedPlan?.feeAmount}
        recipient={`UNIQUE Bank — ${selectedPlan?.title || 'Plan'}`}
        title="Authorize Plan Subscription"
      />

      <footer className="mt-12 border-t border-white/60 bg-white/70 backdrop-blur-md px-4 py-4 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} UNIQUE Bank · Demo Frontend — Not a real banking service.
      </footer>
    </div>
  );
}
