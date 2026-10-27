import { useState } from 'react';
import { Zap, Smartphone, Wifi, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { upcomingPayments } from '../../data/mockData';

const billIcons = {
  Utilities: Zap,
  Telecom: Smartphone,
  Internet: Wifi,
};

export default function UpcomingPayments() {
  const [bills, setBills] = useState(upcomingPayments);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayClick = (bill) => {
    setSelectedBill(bill);
    setPaymentSuccess(false);
  };

  const handleConfirmPay = () => {
    setPaymentSuccess(true);
    // Mark bill as paid in local state
    setBills((prev) =>
      prev.map((b) => (b.id === selectedBill.id ? { ...b, status: 'paid' } : b))
    );
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
    setPaymentSuccess(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Zap size={16} />
          </span>
          <h3 className="text-sm font-bold text-text-primary">Upcoming Payments</h3>
        </div>
        <span className="text-xs font-semibold text-brand-600 cursor-pointer hover:underline">
          View All ({bills.length})
        </span>
      </div>

      {/* Bills list */}
      <div className="space-y-3">
        {bills.map((bill) => {
          const Icon = billIcons[bill.category] || Zap;
          const isOverdue = bill.status === 'overdue';
          const isPaid = bill.status === 'paid';

          return (
            <div
              key={bill.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-3 transition-colors hover:bg-slate-50/70"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isPaid
                      ? 'bg-emerald-50 text-emerald-600'
                      : isOverdue
                      ? 'bg-red-50 text-danger-500'
                      : 'bg-purple-50 text-brand-600'
                  }`}
                >
                  {isPaid ? <CheckCircle2 size={17} /> : <Icon size={17} />}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-xs sm:text-sm font-semibold text-text-primary">
                    {bill.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-text-muted">Due: {bill.dueDate}</span>
                    {isOverdue && !isPaid && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-1.5 py-0.2 text-[10px] font-bold text-danger-500">
                        <AlertTriangle size={10} /> Overdue
                      </span>
                    )}
                    {isPaid && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-600">
                        Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount & Action Button */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs sm:text-sm font-bold text-text-primary">
                  ₹{bill.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>

                {isPaid ? (
                  <span className="text-xs font-semibold text-emerald-600 px-2 py-1">
                    ✓ Done
                  </span>
                ) : (
                  <button
                    onClick={() => handlePayClick(bill)}
                    className="rounded-lg bg-brand-50 hover:bg-brand-600 hover:text-white px-3 py-1.5 text-xs font-bold text-brand-600 transition-colors shadow-2xs"
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Demo Payment Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-white/80">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
            >
              <X size={18} />
            </button>

            {!paymentSuccess ? (
              <div>
                <h4 className="text-base font-bold text-text-primary mb-1">
                  Pay Upcoming Bill
                </h4>
                <p className="text-xs text-text-muted mb-4">
                  Confirm demo payment for your utility service.
                </p>

                <div className="rounded-xl bg-surface-alt p-3.5 mb-4 border border-border/70 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Biller:</span>
                    <strong className="text-text-primary">{selectedBill.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Due Date:</span>
                    <span>{selectedBill.dueDate}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1.5">
                    <span className="text-text-muted font-bold">Total Payable:</span>
                    <strong className="text-sm text-brand-600">
                      ₹{selectedBill.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-text-secondary hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPay}
                    className="flex-1 rounded-xl bg-brand-600 hover:bg-brand-700 py-2 text-xs font-semibold text-white shadow-sm transition-all"
                  >
                    Confirm & Pay (Demo)
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={26} />
                </span>
                <h4 className="text-sm font-bold text-text-primary">Payment Successful (Demo)</h4>
                <p className="text-xs text-text-muted mt-1">
                  ₹{selectedBill.amount.toLocaleString('en-IN')} paid to {selectedBill.name}
                </p>
                <button
                  onClick={handleCloseModal}
                  className="mt-4 w-full rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
