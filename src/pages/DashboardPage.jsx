import { useState } from 'react';
import { Menu, PlusCircle } from 'lucide-react';
import { accountHolder } from '../data/mockData';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import AccountBalanceCard from '../components/dashboard/AccountBalanceCard';
import CurrencyConverter from '../components/dashboard/CurrencyConverter';
import PaymentMethods from '../components/dashboard/PaymentMethods';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import PlansBannerCarousel from '../components/dashboard/PlansBannerCarousel';

import { getUserGreetingName } from '../utils/user';

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('investments');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = getUserGreetingName();

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      <Header />

      <div className="flex flex-1">
        <Sidebar
          activeItem={activeNav}
          onItemClick={setActiveNav}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Featured Plans Carousel — below navigation, rotating every 2 seconds */}
          <PlansBannerCarousel />

          {/* Mobile menu toggle + greeting */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg p-2 text-text-secondary hover:bg-gray-100 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
                  Hello, {displayName}!
                </h1>
                <p className="text-sm text-text-secondary">
                  Welcome back — here's your account overview.
                </p>
              </div>
            </div>

            <button className="btn-primary hidden sm:inline-flex">
              <PlusCircle size={18} />
              New Transaction
            </button>
          </div>

          {/* Dashboard grid */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <AccountBalanceCard />
            <CurrencyConverter />
          </div>

          <div className="mt-6">
            <PaymentMethods />
          </div>

          <div className="mt-6">
            <RecentTransactions />
          </div>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-text-muted">
            This is a frontend demonstration. No real banking transactions are performed.
          </p>
        </main>
      </div>
    </div>
  );
}
