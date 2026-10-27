import { useState } from 'react';
import { Bell, ArrowDownLeft, CheckCircle2, AlertCircle, ShieldAlert, Check } from 'lucide-react';
import { initialNotifications } from '../../data/mockData';

const notifIcons = {
  credit: { icon: ArrowDownLeft, color: 'bg-emerald-50 text-emerald-600' },
  payment: { icon: CheckCircle2, color: 'bg-purple-50 text-brand-600' },
  reminder: { icon: AlertCircle, color: 'bg-amber-50 text-amber-600' },
  security: { icon: ShieldAlert, color: 'bg-blue-50 text-blue-600' },
};

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-brand-600">
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </span>
          <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
        </div>

        {unreadCount > 0 ? (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <Check size={13} />
            Mark all read
          </button>
        ) : (
          <span className="text-xs text-text-muted">All caught up</span>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {notifications.map((item) => {
          const cfg = notifIcons[item.type] || notifIcons.payment;
          const Icon = cfg.icon;

          return (
            <div
              key={item.id}
              onClick={() => toggleRead(item.id)}
              className={`group relative flex items-start gap-3 rounded-xl border p-3 transition-colors cursor-pointer ${
                item.unread
                  ? 'border-purple-100 bg-purple-50/30 hover:bg-purple-50/60'
                  : 'border-border/60 bg-white hover:bg-slate-50'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${cfg.color} mt-0.5`}
              >
                <Icon size={16} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="truncate text-xs font-bold text-text-primary">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-text-muted shrink-0">
                    {item.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-text-secondary leading-snug">
                  {item.message}
                </p>
              </div>

              {/* Unread dot */}
              {item.unread && (
                <span
                  title="Unread notification"
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600"
                />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
