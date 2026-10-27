import { useState } from 'react';
import { Target, Plus, Laptop, ShieldCheck, Plane, CheckCircle2, X } from 'lucide-react';
import { savingsGoals } from '../../data/mockData';

const goalIcons = {
  Tech: Laptop,
  Safety: ShieldCheck,
  Travel: Plane,
};

export default function SavingsGoals() {
  const [goals, setGoals] = useState(savingsGoals);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newTarget, setNewTarget] = useState('50000');

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalName) return;

    const target = parseFloat(newTarget) || 50000;
    const newEntry = {
      id: `goal-${Date.now()}`,
      name: newGoalName,
      category: 'Tech',
      targetAmount: target,
      savedAmount: 0,
      percentage: 0,
      color: '#7043C6',
    };

    setGoals([newEntry, ...goals]);
    setNewGoalName('');
    setIsAddOpen(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-brand-600">
            <Target size={16} />
          </span>
          <h3 className="text-sm font-bold text-text-primary">Savings Goals</h3>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          <Plus size={14} />
          New Goal
        </button>
      </div>

      {/* Goal Items */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const Icon = goalIcons[goal.category] || Target;

          return (
            <div
              key={goal.id}
              className="group rounded-xl border border-border/70 p-3.5 transition-all hover:border-brand-200 hover:bg-slate-50/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: goal.color }}
                  >
                    <Icon size={16} />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                      {goal.name}
                    </h4>
                    <span className="text-[11px] text-text-muted">
                      Target: ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-bold text-brand-600">
                    ₹{goal.savedAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] font-semibold text-text-muted">
                    {goal.percentage}% completed
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${goal.percentage}%`,
                    backgroundColor: goal.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-white/80">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
            >
              <X size={18} />
            </button>

            <h4 className="text-base font-bold text-text-primary mb-1">Add Savings Goal</h4>
            <p className="text-xs text-text-muted mb-4">
              Set a new savings target (demonstration purpose).
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Scooter, Wedding"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2 text-xs font-semibold text-text-primary outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Target Amount (INR)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2 text-xs font-semibold text-text-primary outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white shadow-sm"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
