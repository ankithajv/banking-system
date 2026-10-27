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
  Download,
  Filter,
  CheckCircle2,
  X,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { recentTransactions as fallbackTransactions } from '../../data/mockData';

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

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'transfer', label: 'Transfers' },
  { id: 'income', label: 'Income' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'utilities', label: 'Bills' },
  { id: 'food', label: 'Food' },
  { id: 'transport', label: 'Travel' },
  { id: 'rewards', label: 'Rewards' },
];

/**
 * Recent transactions list with category icons, live search, filter tabs,
 * CSV statement download, and clickable receipt modal.
 */
export default function RecentTransactions() {
  const { transactions: ctxTransactions } = useBanking();
  const transactions = (ctxTransactions && ctxTransactions.length > 0) ? ctxTransactions : fallbackTransactions;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'credit', 'debit'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchCat = categoryFilter === 'all' || tx.category === categoryFilter;
      const matchType = typeFilter === 'all' || tx.type === typeFilter;
      const matchSearch =
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        (tx.recipient && tx.recipient.toLowerCase().includes(search.toLowerCase())) ||
        Math.abs(tx.amount).toString().includes(search);
      return matchCat && matchType && matchSearch;
    });
  }, [transactions, search, categoryFilter, typeFilter]);

  const displayedList = filteredTransactions.slice(0, visibleCount);

  // Full CSV Statement Download
  const handleExportCSV = () => {
    const headers = ['ID', 'Reference ID', 'Description', 'Date', 'Time', 'Type', 'Category', 'Channel', 'Amount (INR)'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.refId || `TXN${tx.id}`,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.date,
      tx.time,
      tx.type,
      tx.category,
      tx.paymentMethod || 'UPI / Digital Banking',
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

  // Single Transaction Receipt Download
  const handleDownloadReceipt = (tx) => {
    const isCredit = tx.type === 'credit';
    const content = `================================================
           UNIQUE BANK - TRANSACTION RECEIPT
================================================
Reference ID  : ${tx.refId || `TXN${tx.id}`}
Date & Time   : ${tx.date} at ${tx.time}
Type          : ${isCredit ? 'CREDIT' : 'DEBIT'}
Amount        : INR ${Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Description   : ${tx.description}
Category      : ${tx.category.toUpperCase()}
Channel       : ${tx.paymentMethod || 'UPI / Core Banking'}
Status        : SUCCESSFUL / COMPLETED
Account       : XXXX XXXX 4523
================================================
Thank you for banking with UNIQUE Bank.
This is a computer-generated transaction record.
================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${tx.refId || tx.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

        {/* Action Controls: Search + Export CSV */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-52">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt py-1.5 pl-8 pr-3 text-xs text-text-primary
                outline-none transition-colors focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center rounded-xl bg-surface-alt p-0.5 border border-border text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                typeFilter === 'all' ? 'bg-white font-bold text-brand-600 shadow-2xs' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('credit')}
              className={`rounded-lg px-2 py-1 font-medium transition-colors cursor-pointer ${
                typeFilter === 'credit' ? 'bg-white font-bold text-emerald-600 shadow-2xs' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setTypeFilter('debit')}
              className={`rounded-lg px-2 py-1 font-medium transition-colors cursor-pointer ${
                typeFilter === 'debit' ? 'bg-white font-bold text-danger-500 shadow-2xs' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Spent
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            title="Download statement as CSV file"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold
              text-text-primary shadow-2xs transition-all hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 cursor-pointer"
          >
            <Download size={13} className="text-brand-600" />
            <span className="hidden sm:inline">Statement CSV</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="py-3 flex gap-1.5 overflow-x-auto scrollbar-none border-b border-border/50">
        {filterTabs.map((tab) => {
          const isActive = categoryFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-500 text-white shadow-2xs'
                  : 'bg-surface-alt text-text-muted hover:bg-slate-200/60 hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-border/60">
        {displayedList.length > 0 ? (
          displayedList.map((tx) => {
            const Icon = categoryIcon[tx.category] || SendHorizontal;
            const isCredit = tx.type === 'credit';

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="group flex items-center justify-between py-3.5 px-2 -mx-2 rounded-xl transition-colors hover:bg-slate-50 cursor-pointer"
                title="Click to view transaction receipt"
              >
                {/* Left: Icon + Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                      isCredit
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-purple-50 text-brand-600'
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
                      {tx.description}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-muted">
                      <span>{tx.date}</span>
                      <span>·</span>
                      <span>{tx.time}</span>
                      {tx.paymentMethod && (
                        <>
                          <span className="hidden sm:inline">·</span>
                          <span className="hidden sm:inline text-slate-400">{tx.paymentMethod}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount + Indicator */}
                <div className="flex items-center gap-2 pl-3 text-right shrink-0">
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isCredit ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? '+' : '−'} ₹
                      {Math.abs(tx.amount).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {tx.category}
                    </span>
                  </div>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      isCredit
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft size={13} strokeWidth={2.5} />
                    ) : (
                      <ArrowUpRight size={13} strokeWidth={2.5} />
                    )}
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
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
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

      {/* Transaction Details & Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setSelectedTx(null)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-base text-text-primary">Transaction Details</h3>
                  <p className="text-[11px] text-emerald-600 font-semibold">Payment Completed</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTx(null)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 text-center py-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">Amount</p>
              <p
                className={`mt-1 text-2xl font-extrabold ${
                  selectedTx.type === 'credit' ? 'text-emerald-600' : 'text-text-primary'
                }`}
              >
                {selectedTx.type === 'credit' ? '+' : '−'} ₹
                {Math.abs(selectedTx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-text-secondary mt-1 font-medium">{selectedTx.description}</p>
            </div>

            <div className="mt-4 space-y-2 text-xs divide-y divide-border/60 bg-surface-alt rounded-xl p-3.5 border border-border/60">
              <div className="flex justify-between py-1.5">
                <span className="text-text-muted">Reference ID</span>
                <span className="font-mono font-bold text-text-primary">
                  {selectedTx.refId || `TXN${selectedTx.id}`}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-muted">Date & Time</span>
                <span className="text-text-primary">{selectedTx.date} · {selectedTx.time}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-muted">Category</span>
                <span className="capitalize font-semibold text-text-primary">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-muted">Channel</span>
                <span className="text-text-primary">{selectedTx.paymentMethod || 'UPI / Digital Banking'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-muted">Debited / Credited A/C</span>
                <span className="text-text-primary">Savings Account (•••• 4523)</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => handleDownloadReceipt(selectedTx)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              >
                <Download size={14} className="text-brand-600" />
                <span>Download Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
