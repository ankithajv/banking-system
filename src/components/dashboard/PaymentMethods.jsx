import { useState } from 'react';
import { Smartphone, Hash, CreditCard, Globe, Check } from 'lucide-react';

const methods = [
  {
    key: 'upi',
    title: 'UPI',
    description: 'Pay using UPI ID or QR',
    icon: Smartphone,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    key: 'mobile',
    title: 'Mobile Number',
    description: 'Send to a mobile number',
    icon: Hash,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    key: 'credit-card',
    title: 'Credit Card',
    description: 'Pay with your card',
    icon: CreditCard,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    key: 'net-banking',
    title: 'Net Banking',
    description: 'Bank-to-bank transfer',
    icon: Globe,
    color: 'text-emerald-600 bg-emerald-50',
  },
];

/**
 * Four clickable payment method cards arranged in a responsive grid.
 */
export default function PaymentMethods() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-text-primary">Payment Methods</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {methods.map((m) => {
          const Icon = m.icon;
          const isActive = selected === m.key;

          return (
            <button
              key={m.key}
              onClick={() => setSelected(isActive ? null : m.key)}
              className={`card group relative flex flex-col items-center gap-2 px-3 py-5 text-center transition-all
                hover:shadow-md hover:-translate-y-0.5
                ${isActive ? 'ring-2 ring-brand-500 border-brand-400' : ''}
              `}
            >
              {isActive && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}

              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.color} transition-transform group-hover:scale-110`}>
                <Icon size={20} />
              </span>
              <span className="text-sm font-semibold text-text-primary">{m.title}</span>
              <span className="text-[11px] leading-tight text-text-muted">{m.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
