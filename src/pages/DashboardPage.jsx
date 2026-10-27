import { useState } from 'react';
import { Menu, PlusCircle } from 'lucide-react';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import AccountBalanceCard from '../components/dashboard/AccountBalanceCard';
import CurrencyConverter from '../components/dashboard/CurrencyConverter';
import QuickActions from '../components/dashboard/QuickActions';
import SpendingOverview from '../components/dashboard/SpendingOverview';
import UpcomingPayments from '../components/dashboard/UpcomingPayments';
import SavingsGoals from '../components/dashboard/SavingsGoals';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import PlansBannerCarousel from '../components/dashboard/PlansBannerCarousel';
import QuickActionsModal from '../components/dashboard/QuickActionsModal';

import { getUserGreetingName } from '../utils/user';

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('investments');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickModalOpen, setQuickModalOpen] = useState(false);

  const displayName = getUserGreetingName();

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
                className="rounded-xl p-2 text-text-secondary hover:bg-slate-100 lg:hidden"
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

            <button
              onClick={() => setQuickModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-brand-500/25 transition-all hover:shadow-md active:scale-98"
            >
              <PlusCircle size={18} />
              New Transaction
            </button>
          </div>

          {/* ── Balanced Two-Column Grid Layout ─────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Left Column (7 cols on lg, 8 cols on xl) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* 1. Existing Redesigned Savings Account Card */}
              <AccountBalanceCard />

              {/* 2. Quick Actions (Send Money, Mobile, Credit Card, Pay Bills) */}
              <QuickActions />

              {/* 3. Spending Overview (Category Donut + Monthly Bar Comparison) */}
              <SpendingOverview />

              {/* 4. Recent Activity (Search, Filters, Working CSV Statement Export) */}
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

              {/* 4. Notifications Panel */}
              <NotificationsPanel />
            </div>
          </div>

          {/* Footer note */}
          <footer className="mt-10 border-t border-border/60 pt-6 pb-4 text-center text-xs text-text-muted">
            <p>
              UNIQUE Bank © 2026 · Demonstrative Banking Frontend Interface. All financial figures are simulated.
            </p>
          </footer>
        </main>
      </div>

      {/* Global Quick Actions Modal for 'New Transaction' button */}
      <QuickActionsModal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        initialAction="send-money"
      />
    </div>
  );
}
