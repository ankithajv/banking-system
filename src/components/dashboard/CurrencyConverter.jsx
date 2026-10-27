import { useState, useMemo } from 'react';
import { ArrowRightLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { exchangeRates } from '../../data/mockData';

const foreignCurrencies = Object.keys(exchangeRates);

/**
 * Currency Converter with bidirectional conversion, swap button,
 * robust input validation, and clear disclosure of illustrative rates.
 */
export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [sourceCurrency, setSourceCurrency] = useState('INR');
  const [targetCurrency, setTargetCurrency] = useState('USD');

  // Swap source and target
  const handleSwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  // Safe numerical calculation
  const { converted, rateDescription, isValid } = useMemo(() => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed < 0) {
      return { converted: 0, rateDescription: '', isValid: false };
    }

    if (sourceCurrency === targetCurrency) {
      return {
        converted: parsed,
        rateDescription: `1 ${sourceCurrency} = 1 ${targetCurrency}`,
        isValid: true,
      };
    }

    let rate = 1;
    if (sourceCurrency === 'INR') {
      rate = exchangeRates[targetCurrency]?.rate ?? 1;
      const res = parsed * rate;
      return {
        converted: res,
        rateDescription: `1 INR ≈ ${rate} ${targetCurrency}`,
        isValid: true,
      };
    } else if (targetCurrency === 'INR') {
      const foreignRate = exchangeRates[sourceCurrency]?.rate ?? 1;
      rate = foreignRate > 0 ? 1 / foreignRate : 1;
      const res = parsed * rate;
      return {
        converted: res,
        rateDescription: `1 ${sourceCurrency} ≈ ${rate.toFixed(2)} INR`,
        isValid: true,
      };
    } else {
      // Cross rate via INR
      const rateToINR = 1 / (exchangeRates[sourceCurrency]?.rate ?? 1);
      const rateFromINR = exchangeRates[targetCurrency]?.rate ?? 1;
      rate = rateToINR * rateFromINR;
      const res = parsed * rate;
      return {
        converted: res,
        rateDescription: `1 ${sourceCurrency} ≈ ${rate.toFixed(4)} ${targetCurrency}`,
        isValid: true,
      };
    }
  }, [amount, sourceCurrency, targetCurrency]);

  const targetSymbol =
    targetCurrency === 'INR' ? '₹' : exchangeRates[targetCurrency]?.symbol ?? '$';
  const sourceSymbol =
    sourceCurrency === 'INR' ? '₹' : exchangeRates[sourceCurrency]?.symbol ?? '$';

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ArrowRightLeft size={16} />
          </span>
          <h3 className="text-sm font-bold text-text-primary">Currency Converter</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-text-muted">
          <RefreshCw size={11} className="text-text-muted" />
          Illustrative Rates
        </span>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-3">
        {/* Source Amount & Currency */}
        <div>
          <label htmlFor="conv-amount" className="mb-1 block text-xs font-semibold text-text-secondary">
            You Send ({sourceCurrency})
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">
                {sourceSymbol}
              </span>
              <input
                id="conv-amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-8 pr-4 text-sm font-semibold
                  text-text-primary outline-none transition-colors
                  focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <select
              value={sourceCurrency}
              onChange={(e) => setSourceCurrency(e.target.value)}
              aria-label="Source Currency"
              className="rounded-xl border border-border bg-surface-alt px-3 py-2.5 text-xs sm:text-sm font-bold
                text-text-primary outline-none transition-colors
                focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="INR">INR — Indian Rupee</option>
              {foreignCurrencies.map((c) => (
                <option key={`src-${c}`} value={c}>
                  {c} — {exchangeRates[c]?.name || c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap source and destination currencies"
            className="group flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-text-secondary shadow-xs hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 transition-all active:scale-95"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft size={13} className="transition-transform group-hover:rotate-180" />
          </button>
        </div>

        {/* Target Currency */}
        <div>
          <label htmlFor="target-currency-select" className="mb-1 block text-xs font-semibold text-text-secondary">
            Recipient Gets ({targetCurrency})
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl border border-border/80 bg-surface-alt/70 px-4 py-2.5 text-sm font-bold text-brand-600">
              {targetSymbol} {isValid ? converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </div>

            <select
              id="target-currency-select"
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              aria-label="Target Currency"
              className="rounded-xl border border-border bg-surface-alt px-3 py-2.5 text-xs sm:text-sm font-bold
                text-text-primary outline-none transition-colors
                focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="INR">INR — Indian Rupee</option>
              {foreignCurrencies.map((c) => (
                <option key={`tgt-${c}`} value={c}>
                  {c} — {exchangeRates[c]?.name || c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result / Rate Details */}
      <div className="mt-4 rounded-xl bg-surface-alt p-3.5 border border-border/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">Estimated Rate</span>
          <span className="font-semibold text-text-primary">{rateDescription}</span>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-text-muted">
          <AlertCircle size={12} className="shrink-0 text-text-muted" />
          Sample rate for UI demonstration only · Not a live forex rate.
        </p>
      </div>
    </div>
  );
}
