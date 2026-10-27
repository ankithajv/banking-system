import { useState } from 'react';
import { Send, Smartphone, CreditCard, Receipt } from 'lucide-react';
import QuickActionsModal from './QuickActionsModal';

const actions = [
  {
    key: 'send-money',
    title: 'Send Money',
    description: 'Send to bank or UPI',
    icon: Send,
    iconBg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
  },
  {
    key: 'mobile-number',
    title: 'Mobile Number',
    description: 'Send to a mobile number',
    icon: Smartphone,
    iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
  },
  {
    key: 'credit-card',
    title: 'Credit Card',
    description: 'Pay with your card',
    icon: CreditCard,
    iconBg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
  },
  {
    key: 'pay-bills',
    title: 'Pay Bills',
    description: 'Electricity, mobile, DTH',
    icon: Receipt,
    iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
  },
];

export default function QuickActions() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const handleActionClick = (key) => {
    setActiveAction(key);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary">Quick Actions</h3>
        <span className="text-xs text-text-muted">Instant transfers & bill payments</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {actions.map((act) => {
          const Icon = act.icon;

          return (
            <button
              key={act.key}
              type="button"
              onClick={() => handleActionClick(act.key)}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-4 sm:p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 active:scale-98"
            >
              <span
                className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${act.iconBg}`}
              >
                <Icon size={20} />
              </span>

              <span className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-600 transition-colors">
                {act.title}
              </span>
              <span className="mt-1 text-[11px] leading-tight text-text-muted">
                {act.description}
              </span>
            </button>
          );
        })}
      </div>

      <QuickActionsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialAction={activeAction}
      />
    </div>
  );
}
