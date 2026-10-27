import { useState, useMemo } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Zap,
  SendHorizontal,
  Gift,
  Briefcase,
  Search,
  CheckCircle2,
  Download,
  X,
  FileText,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

const categoryIcon = {
  income: Briefcase,
  shopping: ShoppingBag,
  utilities: Zap,
  transfer: SendHorizontal,
  rewards: Gift,
};

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'transfer', label: 'Transfers' },
  { id: 'income', label: 'Income' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'utilities', label: 'Bills' },
  { id: 'rewards', label: 'Rewards' },
];

/**
 * Recent transactions list with category icons, search, category filters, and detail receipt modal.
 */
export default function RecentTransactions() {
  const { transactions } = useBanking();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchCat = categoryFilter === 'all' || tx.category === categoryFilter;
      const matchSearch =
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        (tx.recipient && tx.recipient.toLowerCase().includes(search.toLowerCase())) ||
        Math.abs(tx.amount).toString().includes(search);
      return matchCat && matchSearch;
    });
  }, [transactions, search, categoryFilter]);

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
    <div>
      <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-bold text-text-primary">Recent Activity</h3>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick search input */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Filter transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-border bg-white py-1.5 pl-8 pr-3 text-xs text-text-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 w-44 sm:w-48"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {filterTabs.map((tab) => {
              const isActive = categoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-2xs'
                      : 'bg-white text-text-secondary hover:text-text-primary border border-border/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card divide-y divide-border overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            No transactions matching "{search || categoryFilter}".
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const Icon = categoryIcon[tx.category] || SendHorizontal;
            const isCredit = tx.type === 'credit';

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-gray-50/80 sm:px-5 cursor-pointer"
                title="Click to view transaction receipt"
              >
                {/* Category icon */}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                    ${isCredit ? 'bg-success-50 text-success-600' : 'bg-red-50 text-danger-500'}`}
                >
                  <Icon size={17} />
                </span>

                {/* Description + date */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {tx.description}
                  </p>
                  <p className="text-xs text-text-muted">
                    {tx.date} · {tx.time}
                    {tx.paymentMethod && ` · via ${tx.paymentMethod}`}
                  </p>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-1 shrink-0">
                  {isCredit ? (
                    <ArrowDownLeft size={14} className="text-success-600" />
                  ) : (
                    <ArrowUpRight size={14} className="text-danger-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${isCredit ? 'text-success-600' : 'text-danger-500'}`}
                  >
                    {isCredit ? '+' : '−'} ₹{Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

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
                className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100"
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
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <Download size={14} className="text-brand-600" />
                <span>Download Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700"
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

