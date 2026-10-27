import {
  TrendingUp,
  HandCoins,
  PiggyBank,
  ShieldCheck,
  CreditCard,
  Wrench,
  X,
} from 'lucide-react';
import { sidebarItems } from '../../data/mockData';

const iconMap = {
  investments: TrendingUp,
  loans: HandCoins,
  deposits: PiggyBank,
  insurance: ShieldCheck,
  cards: CreditCard,
  services: Wrench,
};

/**
 * Dashboard sidebar with active-state highlighting.
 * On mobile it renders as an overlay drawer controlled by the parent.
 */
export default function Sidebar({ activeItem, onItemClick, mobileOpen, onMobileClose }) {
  const navContent = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        Services
      </p>
      {sidebarItems.map((item) => {
        const Icon = iconMap[item.key] || Wrench;
        const isActive = activeItem === item.key;
        return (
          <button
            key={item.key}
            onClick={() => {
              onItemClick(item.key);
              onMobileClose?.();
            }}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
              ${isActive
                ? 'bg-brand-50 text-brand-600'
                : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              }`}
          >
            <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-surface lg:block">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-surface shadow-xl lg:hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold text-text-primary">Menu</span>
              <button
                onClick={onMobileClose}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}
