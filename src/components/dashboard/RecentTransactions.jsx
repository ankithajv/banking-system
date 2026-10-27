import { useState, useMemo } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Zap,
  SendHorizontal,
  Gift,
  Briefcase,
  Utensils,
  Car,
  Search,
  Filter,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { recentTransactions } from '../../data/mockData';

const categoryIcon = {
  income: Briefcase,
  shopping: ShoppingBag,
  utilities: Zap,
  transfer: SendHorizontal,
  rewards: Gift,
  food: Utensils,
  transport: Car,
  others: Layers,
};

export default function RecentTransactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'credit', 'debit'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter logic
  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter((tx) => {
      // Search matching
      const matchesSearch =
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Type matching (all, income/credit, expense/debit)
      const matchesType =
        typeFilter === 'all' ? true : tx.type === typeFilter;

      // Category matching
      const matchesCategory =
        categoryFilter === 'all' ? true : tx.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchTerm, typeFilter, categoryFilter]);

  const displayedList = filteredTransactions.slice(0, visibleCount);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Description', 'Date', 'Time', 'Type', 'Category', 'Amount (INR)'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.date,
      tx.time,
      tx.type,
      tx.category,
      tx.amount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `unique_bank_statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/70">
        <div>
          <h3 className="text-base font-bold text-text-primary">Recent Activity</h3>
          <p className="text-xs text-text-muted">
            All your transaction history and payment logs
          </p>
        </div>

        {/* Action Controls: Search + Filter toggle + Export CSV */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-56">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activity..."
              className="w-full rounded-xl border border-border bg-surface-alt py-1.5 pl-8 pr-3 text-xs font-medium text-text-primary outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Toggle Filter panel */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
              showFilters || typeFilter !== 'all' || categoryFilter !== 'all'
                ? 'border-brand-400 bg-brand-50 text-brand-600'
                : 'border-border bg-white text-text-secondary hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>

          {/* Working CSV Export */}
          <button
            onClick={handleExportCSV}
            title="Download CSV statement"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300 transition-colors shadow-2xs"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span> CSV
          </button>
        </div>
      </div>

      {/* Expandable Filter Controls */}
      {showFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2 p-3 bg-surface-alt/70 rounded-xl border border-border/60 text-xs">
          {/* Type filters */}
          <span className="font-semibold text-text-muted mr-1">Type:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'credit', label: 'Income (+)' },
            { id: 'debit', label: 'Expenses (−)' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                typeFilter === t.id
                  ? 'bg-brand-600 text-white shadow-2xs'
                  : 'bg-white border border-border text-text-secondary hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}

          {/* Category Dropdown */}
          <span className="font-semibold text-text-muted ml-3 mr-1">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-white px-2.5 py-1 font-semibold text-text-secondary outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="income">Income / Salary</option>
            <option value="shopping">Shopping</option>
            <option value="utilities">Bills & Utilities</option>
            <option value="food">Food & Dining</option>
            <option value="transfer">Transfers</option>
            <option value="transport">Transport</option>
            <option value="rewards">Rewards</option>
            <option value="others">Others</option>
          </select>

          {(typeFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setTypeFilter('all');
                setCategoryFilter('all');
                setSearchTerm('');
              }}
              className="ml-auto text-[11px] font-semibold text-brand-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Transaction List */}
      <div className="divide-y divide-border/60 mt-2">
        {displayedList.length > 0 ? (
          displayedList.map((tx) => {
            const Icon = categoryIcon[tx.category] || SendHorizontal;
            const isCredit = tx.type === 'credit';

            return (
              <div
                key={tx.id}
                className="flex items-center gap-3.5 py-3 transition-colors hover:bg-slate-50/70 sm:px-2 rounded-xl"
              >
                {/* Category icon */}
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isCredit
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-danger-500'
                  }`}
                >
                  <Icon size={18} />
                </span>

                {/* Description + date */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs sm:text-sm font-semibold text-text-primary">
                    {tx.description}
                  </p>
                  <p className="text-[11px] text-text-muted flex items-center gap-1.5 mt-0.5">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span>{tx.time}</span>
                    <span className="capitalize text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md">
                      {tx.category}
                    </span>
                  </p>
                </div>

                {/* Amount with colored indicator */}
                <div className="flex items-center gap-1.5 shrink-0 text-right">
                  {isCredit ? (
                    <ArrowDownLeft size={15} className="text-emerald-600" />
                  ) : (
                    <ArrowUpRight size={15} className="text-danger-500" />
                  )}
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isCredit ? 'text-emerald-600' : 'text-danger-500'
                    }`}
                  >
                    {isCredit ? '+' : '−'} ₹
                    {Math.abs(tx.amount).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-text-muted">
            No transactions found matching your filters.
          </div>
        )}
      </div>

      {/* Footer: View All toggle */}
      {filteredTransactions.length > 6 && (
        <div className="mt-3 pt-3 border-t border-border/70 text-center">
          <button
            onClick={() =>
              setVisibleCount(
                visibleCount >= filteredTransactions.length ? 6 : filteredTransactions.length
              )
            }
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors inline-flex items-center gap-1"
          >
            {visibleCount >= filteredTransactions.length
              ? 'Show Less'
              : `View All (${filteredTransactions.length})`}
            <ChevronDown
              size={14}
              className={`transition-transform ${
                visibleCount >= filteredTransactions.length ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
