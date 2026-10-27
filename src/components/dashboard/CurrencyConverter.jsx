import { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { exchangeRates } from '../../data/mockData';

const currencies = Object.keys(exchangeRates);

/**
 * INR-to-foreign currency converter using illustrative sample rates.
 */
export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [target, setTarget] = useState('USD');

  const converted = useMemo(() => {
    const num = parseFloat(amount) || 0;
    return num * (exchangeRates[target]?.rate ?? 0);
  }, [amount, target]);

  const info = exchangeRates[target];

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
          <ArrowRightLeft size={16} />
        </span>
        <h3 className="text-sm font-bold text-text-primary">Currency Converter</h3>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {/* INR amount */}
        <div className="flex-1">
          <label htmlFor="conv-amount" className="mb-1 block text-xs font-medium text-text-secondary">
            Amount (INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">₹</span>
            <input
              id="conv-amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-8 pr-4 text-sm
                text-text-primary outline-none transition-colors
                focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Arrow indicator */}
        <span className="hidden text-text-muted sm:block">→</span>

        {/* Target currency */}
        <div className="flex-1">
          <label htmlFor="conv-currency" className="mb-1 block text-xs font-medium text-text-secondary">
            Convert to
          </label>
          <select
            id="conv-currency"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm
              text-text-primary outline-none transition-colors
              focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          >
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code} — {exchangeRates[code].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      <div className="mt-5 rounded-lg bg-surface-alt px-4 py-3">
        <p className="text-xs text-text-muted">Converted Amount</p>
        <p className="mt-0.5 text-xl font-bold text-brand-600">
          {info?.symbol} {converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="mt-1 text-[11px] text-text-muted">
          Sample rate: 1 INR ≈ {info?.rate} {target} · Illustrative only — not a live rate.
        </p>
      </div>
    </div>
  );
}
