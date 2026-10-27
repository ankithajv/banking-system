import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Zap,
  SendHorizontal,
  Gift,
  Briefcase,
} from 'lucide-react';
import { recentTransactions } from '../../data/mockData';

const categoryIcon = {
  income: Briefcase,
  shopping: ShoppingBag,
  utilities: Zap,
  transfer: SendHorizontal,
  rewards: Gift,
};

/**
 * Recent transactions list with category icons and signed amounts.
 */
export default function RecentTransactions() {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-text-primary">Recent Activity</h3>

      <div className="card divide-y divide-border overflow-hidden">
        {recentTransactions.map((tx) => {
          const Icon = categoryIcon[tx.category] || SendHorizontal;
          const isCredit = tx.type === 'credit';

          return (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-gray-50/60 sm:px-5"
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
        })}
      </div>
    </div>
  );
}
