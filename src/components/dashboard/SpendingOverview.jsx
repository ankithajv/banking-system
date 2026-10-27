import { useState, useMemo } from 'react';
import { PieChart, BarChart3, TrendingUp, Calendar, Info } from 'lucide-react';
import { monthlySpendingHistory, spendingCategories } from '../../data/mockData';

export default function SpendingOverview() {
  const [selectedRange, setSelectedRange] = useState('6m');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Total monthly spending from breakdown
  const totalSpending = useMemo(() => {
    return spendingCategories.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);

  // Compute Donut SVG segment offsets
  // Circumference = 2 * PI * r (with r=58 => C = ~364.42)
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const donutSegments = spendingCategories.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += cat.percentage;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Bar chart max scale (find highest income/expense to scale bars)
  const maxBarValue = Math.max(
    ...monthlySpendingHistory.map((m) => Math.max(m.income, m.expense))
  );

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
      {/* Header with Title and Range Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-brand-600">
              <PieChart size={16} />
            </span>
            <h3 className="text-base font-bold text-text-primary">Spending Overview</h3>
          </div>
          <p className="mt-0.5 text-xs text-text-muted">
            Monthly analytics & category breakdown
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-border bg-surface-alt p-1 text-xs">
          <Calendar size={13} className="text-text-muted ml-1.5" />
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-transparent font-semibold text-text-primary outline-none pr-2 cursor-pointer"
            aria-label="Select date range"
          >
            <option value="6m">Last 6 Months</option>
            <option value="3m">Last 3 Months</option>
            <option value="1y">This Year</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Donut Breakdown, Right Monthly Bar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Left: Category Breakdown Donut (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              By Category
            </span>
            <span className="text-xs font-semibold text-brand-600">
              ₹{totalSpending.toLocaleString('en-IN')} total
            </span>
          </div>

          {/* Donut Chart Visual */}
          <div className="relative flex items-center justify-center my-3">
            <svg
              className="h-44 w-44 -rotate-90 transform"
              viewBox="0 0 160 160"
            >
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="18"
                fill="none"
              />

              {/* Category Segments */}
              {donutSegments.map((seg) => {
                const isHovered = hoveredCategory?.name === seg.name;

                return (
                  <circle
                    key={seg.name}
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={seg.color}
                    strokeWidth={isHovered ? '22' : '18'}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    strokeLinecap="butt"
                    fill="none"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredCategory(seg)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-semibold text-text-muted truncate max-w-[90px]">
                {hoveredCategory ? hoveredCategory.name : 'October'}
              </span>
              <span className="text-base font-extrabold text-text-primary tracking-tight">
                {hoveredCategory
                  ? `₹${hoveredCategory.amount.toLocaleString('en-IN')}`
                  : `₹${totalSpending.toLocaleString('en-IN')}`}
              </span>
              <span className="text-[10px] font-bold text-brand-600">
                {hoveredCategory ? `${hoveredCategory.percentage}%` : 'Expenses'}
              </span>
            </div>
          </div>

          {/* Category Legend list */}
          <div className="space-y-1.5 pt-1">
            {spendingCategories.map((cat) => {
              const isHovered = hoveredCategory?.name === cat.name;

              return (
                <div
                  key={cat.name}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between rounded-lg px-2 py-1 text-xs transition-colors cursor-pointer ${
                    isHovered ? 'bg-purple-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium text-text-primary">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted">{cat.percentage}%</span>
                    <span className="font-semibold text-text-primary w-16 text-right">
                      ₹{cat.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Monthly Income vs Expenses Bar Chart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border/70 pt-5 lg:pt-0 lg:pl-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Income vs Expenses
            </span>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#07865B]" />
                <span className="text-text-secondary font-medium">Income</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#7043C6]" />
                <span className="text-text-secondary font-medium">Expenses</span>
              </span>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="relative pt-6 pb-2">
            {/* Tooltip display */}
            <div className="h-6 mb-2 text-center">
              {hoveredBar ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-0.5 text-[11px] font-medium text-white shadow-md animate-fade-in">
                  <span>{hoveredBar.month}:</span>
                  <span className="text-emerald-300">
                    +₹{hoveredBar.income.toLocaleString('en-IN')}
                  </span>
                  <span>/</span>
                  <span className="text-purple-300">
                    -₹{hoveredBar.expense.toLocaleString('en-IN')}
                  </span>
                </span>
              ) : (
                <span className="text-[11px] text-text-muted flex items-center justify-center gap-1">
                  <TrendingUp size={12} className="text-emerald-600" />
                  Average Monthly Savings: <strong className="text-text-primary">₹43,500</strong>
                </span>
              )}
            </div>

            {/* Chart Area */}
            <div className="flex h-44 items-end justify-between gap-2 sm:gap-4 border-b border-border/70 px-2 pb-1">
              {monthlySpendingHistory.map((m) => {
                const incomeHeight = Math.max(12, Math.round((m.income / maxBarValue) * 100));
                const expenseHeight = Math.max(12, Math.round((m.expense / maxBarValue) * 100));
                const isHovered = hoveredBar?.month === m.month;

                return (
                  <div
                    key={m.month}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                    onMouseEnter={() => setHoveredBar(m)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Paired Bars Container */}
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      {/* Income Bar (Green) */}
                      <div
                        style={{ height: `${incomeHeight}%` }}
                        className={`w-3 sm:w-4 rounded-t-md bg-[#07865B] transition-all duration-200 ${
                          isHovered ? 'brightness-110 shadow-sm' : 'opacity-90'
                        }`}
                        title={`${m.month} Income: ₹${m.income.toLocaleString('en-IN')}`}
                      />

                      {/* Expense Bar (Purple) */}
                      <div
                        style={{ height: `${expenseHeight}%` }}
                        className={`w-3 sm:w-4 rounded-t-md bg-[#7043C6] transition-all duration-200 ${
                          isHovered ? 'brightness-110 shadow-sm' : 'opacity-90'
                        }`}
                        title={`${m.month} Expense: ₹${m.expense.toLocaleString('en-IN')}`}
                      />
                    </div>

                    {/* Month Label */}
                    <span
                      className={`text-[11px] font-semibold transition-colors ${
                        isHovered ? 'text-brand-600' : 'text-text-muted'
                      }`}
                    >
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supporting Insight Strip */}
          <div className="mt-3 flex items-center justify-between text-xs text-text-muted bg-surface-alt/70 p-2.5 rounded-xl border border-border/50">
            <span className="flex items-center gap-1.5">
              <Info size={13} className="text-brand-600" />
              Highest savings recorded in <strong className="text-text-primary">October (+₹58,500)</strong>
            </span>
            <span className="font-semibold text-emerald-600">+18.4% vs Sep</span>
          </div>
        </div>
      </div>
    </div>
  );
}
