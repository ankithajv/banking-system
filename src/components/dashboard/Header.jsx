import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Wallet,
  CreditCard,
  Settings,
  Bell,
  Check,
  ArrowDownLeft,
  AlertCircle,
} from 'lucide-react';
import Logo from '../common/Logo';
import { accountHolder, initialNotifications } from '../../data/mockData';
import { useBanking } from '../../context/BankingContext';
import { getSavingsAccountHolderName } from '../../utils/user';

const navLinks = [
  { label: 'Banking', href: '/dashboard' },
  { label: 'Lifestyle', href: '/lifestyle' },
  { label: 'Plans', href: '/plans' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { balance } = useBanking();

  // Retrieve current user info
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('unique_bank_current_user') || 'null');
    } catch {
      return null;
    }
  })();

  const displayName = getSavingsAccountHolderName();
  const displayEmail = currentUser?.email || 'yashaswinimullalli4@gmail.com';
  const initial = (displayName.charAt(0) || 'U').toUpperCase();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        setNotifOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('unique_bank_current_user');
    } catch (err) {
      console.error(err);
    }
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8 bg-transparent transition-all">
      <div className="flex h-16 w-full items-center justify-between rounded-2xl border border-white/60 bg-white/60 px-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl backdrop-saturate-150 transition-all sm:px-7">
        {/* Logo */}
        <Logo size="md" linkTo="/dashboard" />

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`rounded-xl px-4 py-2 text-sm transition-all ${
                  isActive
                    ? 'bg-white/80 text-brand-600 font-bold shadow-2xs'
                    : 'font-medium text-text-secondary hover:bg-white/60 hover:text-brand-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls: Notification Bell + My Account + Mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell with unread count */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen((prev) => !prev);
                setAccountOpen(false);
              }}
              aria-label="Notifications"
              aria-expanded={notifOpen}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                notifOpen
                  ? 'border-brand-500 bg-brand-50/70 text-brand-600 shadow-sm'
                  : 'border-white/60 bg-white/50 text-text-secondary hover:border-brand-300 hover:bg-white/70 shadow-2xs'
              }`}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border/70">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-text-primary">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-purple-100 px-2 py-0.2 text-[10px] font-bold text-brand-700">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
                      >
                        <Check size={12} /> Mark read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-border/60 max-h-72 overflow-y-auto mt-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`py-2.5 px-1.5 flex items-start gap-2.5 rounded-lg transition-colors ${
                          n.unread ? 'bg-purple-50/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <Bell size={13} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-text-primary truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-text-muted mt-0.5 block">
                            {n.timestamp}
                          </span>
                        </div>
                        {n.unread && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-1 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2.5 border-t border-border/70 text-center">
                    <Link
                      to="/dashboard"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      View All in Dashboard Panel →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Responsive "My Account" container */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                setAccountOpen((prev) => !prev);
                setNotifOpen(false);
              }}
              aria-expanded={accountOpen}
              aria-haspopup="true"
              className={`flex items-center gap-2 rounded-full sm:rounded-xl border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                accountOpen
                  ? 'border-brand-500 bg-brand-50/70 text-brand-600 shadow-sm'
                  : 'border-white/60 bg-white/50 text-text-primary hover:border-brand-300 hover:bg-white/70 shadow-2xs'
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-600 font-bold text-xs ring-2 ring-brand-500/20">
                {initial}
              </span>

              {/* Label: visible on small screens and up */}
              <span className="hidden sm:inline font-medium text-xs sm:text-sm">
                My Account
              </span>

              <ChevronDown
                size={14}
                className={`text-text-muted transition-transform duration-200 ${
                  accountOpen ? 'rotate-180 text-brand-600' : ''
                }`}
              />
            </button>

            {/* Responsive Account Dropdown Menu */}
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 z-50 overflow-hidden"
                >
                  {/* Account profile header -> links to /account */}
                  <Link
                    to="/account?tab=profile"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-start gap-3 rounded-xl bg-surface-alt/70 p-3 border border-border/50 hover:bg-surface-alt transition-colors group"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold text-base shadow-sm">
                      {initial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-text-primary group-hover:text-brand-600 transition-colors">
                          {displayName}
                        </p>
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      </div>
                      <p className="truncate text-xs text-text-muted">
                        {displayEmail}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active Account
                      </span>
                    </div>
                  </Link>

                  {/* Account overview snippet with dynamic balance */}
                  <div className="mt-2.5 rounded-xl border border-brand-100/80 bg-brand-50/40 p-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted flex items-center gap-1">
                        <Wallet size={12} className="text-brand-500" />
                        Savings A/C
                      </span>
                      <span className="font-semibold text-text-primary">
                        {accountHolder.accountNumber}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-text-muted">Balance</span>
                      <span className="font-extrabold text-brand-600">
                        ₹ {balance ? balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '2,48,350.75'}
                      </span>
                    </div>
                  </div>

                  {/* Profile & Security Options */}
                  <div className="mt-2.5 space-y-0.5 text-xs sm:text-sm">
                    <Link
                      to="/account?tab=profile"
                      onClick={() => setAccountOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-text-secondary hover:bg-brand-50 hover:text-brand-600 transition-colors text-left font-medium"
                    >
                      <User size={15} className="text-brand-600" />
                      <span>Account Settings</span>
                    </Link>

                    <Link
                      to="/account?tab=security"
                      onClick={() => setAccountOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-text-secondary hover:bg-brand-50 hover:text-brand-600 transition-colors text-left font-medium"
                    >
                      <ShieldCheck size={15} className="text-emerald-500" />
                      <span>Security & 2FA</span>
                    </Link>

                    <Link
                      to="/account?tab=cards"
                      onClick={() => setAccountOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-text-secondary hover:bg-brand-50 hover:text-brand-600 transition-colors text-left font-medium"
                    >
                      <CreditCard size={15} className="text-purple-500" />
                      <span>Cards & Limits</span>
                    </Link>

                    <Link
                      to="/account?tab=banking"
                      onClick={() => setAccountOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-text-secondary hover:bg-brand-50 hover:text-brand-600 transition-colors text-left font-medium"
                    >
                      <FileText size={15} className="text-blue-500" />
                      <span>Statements & Documents</span>
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="mt-2 pt-2 border-t border-border/70">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            className="rounded-lg p-2 text-text-secondary hover:bg-gray-100 md:hidden transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/50 bg-white/95 backdrop-blur-xl px-4 pb-4 pt-2 md:hidden overflow-hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
