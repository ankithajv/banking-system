import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Wallet,
  CreditCard,
  Bell,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Laptop,
  AlertCircle,
  Download,
  Save,
  LogOut,
  Sliders,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import Header from '../components/dashboard/Header';
import { accountHolder } from '../data/mockData';
import { formatPersonName, getSavingsAccountHolderName } from '../utils/user';

export default function AccountPage() {
  const navigate = useNavigate();

  // Load current user from localStorage or fall back to defaults
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('unique_bank_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const derivedName = formatPersonName(parsed.fullName || parsed.firstName || parsed.username || parsed.email);
        const nameParts = derivedName.split(' ');
        const first = parsed.firstName || nameParts[0] || 'Yashaswini';
        const last = parsed.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
        return {
          firstName: first,
          lastName: last,
          username: parsed.username || first.toLowerCase(),
          email: parsed.email || 'yashaswinimullalli4@gmail.com',
          phone: parsed.phone || '+91 98765 43210',
          dob: '1996-08-14',
          address: 'Flat 402, Green Glen Heights, Outer Ring Road',
          city: 'Bengaluru, Karnataka',
          pincode: '560103',
        };
      }
    } catch {
      // fallback
    }
    const savingsName = getSavingsAccountHolderName();
    const parts = savingsName.split(' ');
    return {
      firstName: parts[0] || 'Yashaswini',
      lastName: parts.length > 1 ? parts.slice(1).join(' ') : '',
      username: (parts[0] || 'yashaswini').toLowerCase(),
      email: 'yashaswinimullalli4@gmail.com',
      phone: '+91 98765 43210',
      dob: '1996-08-14',
      address: '24 Elm Street, Indiranagar',
      city: 'Bengaluru, Karnataka',
      pincode: '560038',
    };
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [copiedField, setCopiedField] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cardFrozen, setCardFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [internationalTxn, setInternationalTxn] = useState(false);
  const [onlineTxn, setOnlineTxn] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(100000);

  // Form edit state
  const [formData, setFormData] = useState(user);

  // Password change state
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setUser(formData);
    try {
      const existing = JSON.parse(localStorage.getItem('unique_bank_current_user') || '{}');
      const updated = { ...existing, ...formData };
      localStorage.setItem('unique_bank_current_user', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPassMsg({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }
    if (passwords.newPass.length < 8) {
      setPassMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPassMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    setPassMsg({ type: 'success', text: 'Password successfully updated!' });
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPassMsg({ type: '', text: '' }), 4000);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('unique_bank_current_user');
    } catch {
      // ignore
    }
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'banking', label: 'Banking & Account', icon: Wallet },
    { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
    { id: 'cards', label: 'Cards & Limits', icon: CreditCard },
    { id: 'notifications', label: 'Preferences', icon: Bell },
  ];

  const initialLetter = (user.firstName?.charAt(0) || user.username?.charAt(0) || 'U').toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      {/* ── Glassmorphism Top Navigation Header ── */}
      <Header />

      {/* ── Main Responsive Content Area ── */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Quick back link */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
            <span className="text-text-muted">/</span>
            <span className="font-medium text-text-secondary">My Account</span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all shadow-2xs"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* ── User Profile Hero Overview Card ── */}
        <div className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Avatar & Details */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 text-2xl sm:text-3xl font-extrabold text-white shadow-md shadow-brand-500/25">
                  {initialLetter}
                </div>
                <span
                  title="KYC Verified"
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white shadow-xs"
                >
                  <CheckCircle2 size={14} />
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                    {user.firstName} {user.lastName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Verified Member
                  </span>
                </div>

                <p className="mt-1 text-xs sm:text-sm text-text-secondary flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <Mail size={13} className="text-text-muted" />
                    {user.email}
                  </span>
                  <span className="hidden sm:inline text-text-muted">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Phone size={13} className="text-text-muted" />
                    {user.phone}
                  </span>
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md bg-brand-50 px-2.5 py-1 font-semibold text-brand-700 border border-brand-200/50">
                    Savings Account
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 font-medium text-text-secondary">
                    Customer ID: <strong className="text-text-primary">UB-948201</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Balance / Account Number summary strip */}
            <div className="flex flex-wrap items-center gap-4 border-t border-border/60 pt-4 md:border-t-0 md:pt-0">
              <div className="rounded-xl bg-surface-alt/80 p-3.5 border border-border/60 min-w-[170px] flex-1 sm:flex-none">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Account Number
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-text-primary">
                    1024 8839 4523
                  </span>
                  <button
                    onClick={() => copyToClipboard('102488394523', 'accNum')}
                    title="Copy Account Number"
                    className="rounded p-1 text-text-muted hover:bg-white hover:text-brand-600 transition-colors"
                  >
                    {copiedField === 'accNum' ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-brand-50/70 p-3.5 border border-brand-200/50 min-w-[170px] flex-1 sm:flex-none">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                  Total Available Balance
                </p>
                <p className="mt-1 text-lg font-extrabold text-brand-700 tracking-tight">
                  ₹ 2,48,350.75
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Responsive Tabs Navigation Bar ── */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/25'
                  : 'bg-white/80 text-text-secondary hover:bg-white hover:text-text-primary border border-border/70 shadow-2xs'
                  }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content Panels ── */}
        <div className="space-y-6">
          {/* TAB 1: PERSONAL PROFILE */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Form Column (2/3 on lg) */}
              <div className="lg:col-span-2 rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">Personal Details</h2>
                    <p className="text-xs text-text-secondary">
                      Update your contact information and registered residential address.
                    </p>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Your personal profile information has been saved successfully!</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Permanent Address
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        City & State
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/25"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Side KYC / Status Column */}
              <div className="space-y-5">
                {/* KYC Card */}
                <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-white p-5 shadow-sm">
                  <div className="flex items-center gap-2.5 text-emerald-800">
                    <ShieldCheck size={22} className="text-emerald-600" />
                    <h3 className="font-bold text-sm">KYC Status: Fully Verified</h3>
                  </div>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    Your identity has been authenticated via Aadhaar OTP and PAN verification. All banking limits are active.
                  </p>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-emerald-100">
                      <span className="text-text-muted">PAN Card</span>
                      <span className="font-mono font-semibold text-text-primary">••••••839M</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-emerald-100">
                      <span className="text-text-muted">Aadhaar Card</span>
                      <span className="font-mono font-semibold text-text-primary">•••• •••• 9102</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-text-muted">Verification Date</span>
                      <span className="font-semibold text-text-primary">12 Oct 2026</span>
                    </div>
                  </div>
                </div>

                {/* Account Manager Card */}
                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-md">
                  <h3 className="text-sm font-bold text-text-primary">Dedicated Relationship Manager</h3>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600 font-bold text-sm">
                      RM
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">Rohit Sharma</p>
                      <p className="text-[11px] text-text-muted">Priority Banking Specialist</p>
                      <a
                        href="mailto:support@uniquebank.com"
                        className="text-[11px] font-semibold text-brand-600 hover:underline"
                      >
                        rohit.s@uniquebank.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: BANKING & ACCOUNT DETAILS */}
          {activeTab === 'banking' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Account Spec Sheet */}
              <div className="rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text-primary">Account Specifications</h2>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    Active
                  </span>
                </div>

                <div className="divide-y divide-border/60 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-muted">Account Holder Name</span>
                    <span className="font-semibold text-text-primary">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-muted">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-text-primary">1024 8839 4523</span>
                      <button
                        onClick={() => copyToClipboard('102488394523', 'accNum2')}
                        className="text-text-muted hover:text-brand-600"
                        title="Copy"
                      >
                        {copiedField === 'accNum2' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-muted">IFSC Code</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-text-primary">UNIQ0004523</span>
                      <button
                        onClick={() => copyToClipboard('UNIQ0004523', 'ifsc')}
                        className="text-text-muted hover:text-brand-600"
                        title="Copy"
                      >
                        {copiedField === 'ifsc' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-muted">Account Type</span>
                    <span className="font-semibold text-text-primary">Digital Savings Account</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-muted">MICR Code</span>
                    <span className="font-mono text-text-primary">560249012</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-muted">Branch Name</span>
                    <span className="font-semibold text-text-primary">Koramangala Tech Hub Branch</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-muted">Registered UPI ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-brand-600">
                        {user.username || 'yashaswini'}@uniquebank
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${user.username || 'yashaswini'}@uniquebank`, 'upi')}
                        className="text-text-muted hover:text-brand-600"
                        title="Copy"
                      >
                        {copiedField === 'upi' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Limits and Statements */}
              <div className="space-y-6">
                {/* Transfer Limits */}
                <div className="rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md">
                  <h3 className="text-base font-bold text-text-primary mb-4">Transfer & Payment Limits</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-text-secondary">Daily UPI Limit</span>
                        <span className="text-text-primary font-bold">₹ 1,00,000 / day</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500 w-[25%]"></div>
                      </div>
                      <p className="mt-1 text-[11px] text-text-muted">₹ 25,000 utilized today</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-text-secondary">IMPS / NEFT Daily Limit</span>
                        <span className="text-text-primary font-bold">₹ 5,00,000 / day</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-brand-500 w-[0%]"></div>
                      </div>
                      <p className="mt-1 text-[11px] text-text-muted">₹ 0 utilized today</p>
                    </div>
                  </div>
                </div>

                {/* Account Statements */}
                <div className="rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md">
                  <h3 className="text-base font-bold text-text-primary mb-2">Account Statements</h3>
                  <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                    Download official stamp-verified account statements for tax filing or visa applications.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => alert('Downloading official statement (PDF)...')}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs font-semibold text-text-primary hover:bg-gray-50 transition-colors shadow-2xs"
                    >
                      <Download size={15} className="text-brand-600" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      onClick={() => alert('Downloading spreadsheet statement (Excel)...')}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs font-semibold text-text-primary hover:bg-gray-50 transition-colors shadow-2xs"
                    >
                      <Download size={15} className="text-emerald-600" />
                      <span>Download Excel</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: SECURITY & 2FA */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Change Password Card */}
              <div className="rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2 text-text-primary mb-2">
                  <Lock size={18} className="text-brand-600" />
                  <h2 className="text-base font-bold">Update Password</h2>
                </div>
                <p className="text-xs text-text-secondary mb-5">
                  Keep your digital banking account safe by choosing a strong, unique password.
                </p>

                {passMsg.text && (
                  <div
                    className={`mb-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${passMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                  >
                    {passMsg.type === 'success' ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    <span>{passMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="Enter existing password"
                      className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      New Password (min. 8 characters)
                    </label>
                    <input
                      type="password"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                      placeholder="Enter new strong password"
                      className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Re-enter new password"
                      className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/25"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* 2FA & Session Management */}
              <div className="space-y-6">
                {/* 2FA & Biometric toggles */}
                <div className="rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md">
                  <h3 className="text-base font-bold text-text-primary mb-4">Security Safeguards</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <p className="text-xs sm:text-sm font-semibold text-text-primary">
                          Two-Factor Authentication (2FA)
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Requires an SMS OTP or Authenticator prompt whenever logging in from a new device.
                        </p>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFactorEnabled ? 'bg-brand-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-4">
                      <div className="pr-4">
                        <p className="text-xs sm:text-sm font-semibold text-text-primary">
                          Biometric & Face ID Login
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Fast biometric verification on supported mobile and tablet browsers.
                        </p>
                      </div>
                      <button
                        onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${biometricsEnabled ? 'bg-brand-600' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-text-primary">Active Login Sessions</h3>
                    <button
                      onClick={() => alert('All other sessions terminated.')}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Sign Out All Others
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-surface-alt/70 p-3">
                      <div className="flex items-center gap-3">
                        <Laptop size={18} className="text-brand-600" />
                        <div>
                          <p className="text-xs font-bold text-text-primary">
                            Windows PC · Chrome
                          </p>
                          <p className="text-[11px] text-emerald-600 font-semibold">
                            Current Active Session
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-text-muted">Bengaluru, IN</span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-surface-alt/70 p-3">
                      <div className="flex items-center gap-3">
                        <Smartphone size={18} className="text-text-muted" />
                        <div>
                          <p className="text-xs font-bold text-text-primary">
                            iPhone 15 Pro · Safari
                          </p>
                          <p className="text-[11px] text-text-muted">
                            Active 3 hours ago
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-text-muted">Bengaluru, IN</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: CARDS & LIMITS */}
          {activeTab === 'cards' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
            >
              {/* Virtual Card Showcase */}
              <div className="rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-text-primary">Virtual Debit Card</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    <Sparkles size={12} />
                    Platinum Member
                  </span>
                </div>

                {/* Visual Debit Card */}
                <div
                  className={`relative mx-auto w-full max-w-sm rounded-2xl p-6 text-white shadow-xl transition-all duration-300 ${cardFrozen
                    ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-70'
                    : 'bg-gradient-to-tr from-[#1E1B4B] via-[#312E81] to-[#4338CA]'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-base">
                      UNIQUE <span className="text-brand-300">Bank</span>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Debit
                    </span>
                  </div>

                  {/* Chip & Contactless */}
                  <div className="mt-8 flex items-center justify-between">
                    <div className="h-8 w-11 rounded-md bg-amber-400/80 border border-amber-300 shadow-inner"></div>
                    <span className="text-lg">📡</span>
                  </div>

                  {/* Card Number */}
                  <div className="mt-6 flex items-center justify-between">
                    <p className="font-mono text-base sm:text-lg tracking-widest text-white/95">
                      {showCardNumber ? '4532 8912 0482 4523' : '•••• •••• •••• 4523'}
                    </p>
                    <button
                      onClick={() => setShowCardNumber(!showCardNumber)}
                      className="text-white/70 hover:text-white transition-colors"
                      title={showCardNumber ? 'Mask card number' : 'Show card number'}
                    >
                      {showCardNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Card Holder & Expiry */}
                  <div className="mt-6 flex items-end justify-between text-xs">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/60">Card Holder</p>
                      <p className="font-semibold tracking-wide uppercase text-white mt-0.5">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-white/60">Expires</p>
                      <p className="font-mono font-semibold text-white mt-0.5">08/29</p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-white/60">CVV</p>
                      <div className="flex items-center gap-1 font-mono font-bold text-white mt-0.5">
                        <span>{showCvv ? '842' : '•••'}</span>
                        <button
                          onClick={() => setShowCvv(!showCvv)}
                          className="text-white/60 hover:text-white"
                        >
                          {showCvv ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Freeze Card Button */}
                <div className="mt-6 flex items-center justify-between rounded-xl bg-surface-alt/80 p-3.5 border border-border/60">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-text-primary">
                      {cardFrozen ? 'Card is Frozen / Locked' : 'Card is Active'}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Temporarily freeze all online & ATM transactions.
                    </p>
                  </div>
                  <button
                    onClick={() => setCardFrozen(!cardFrozen)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs ${cardFrozen
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                      }`}
                  >
                    {cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}
                  </button>
                </div>
              </div>

              {/* Card Controls & Sliders */}
              <div className="rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-5">
                <h3 className="text-base font-bold text-text-primary">Usage Controls</h3>

                <div className="space-y-4 divide-y divide-border/60 text-xs sm:text-sm">
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="font-semibold text-text-primary">Online / E-Commerce Payments</p>
                      <p className="text-[11px] text-text-muted">Enable card for Amazon, Swiggy, etc.</p>
                    </div>
                    <button
                      onClick={() => setOnlineTxn(!onlineTxn)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${onlineTxn ? 'bg-brand-600' : 'bg-gray-200'
                        }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${onlineTxn ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="font-semibold text-text-primary">International Transactions</p>
                      <p className="text-[11px] text-text-muted">Allow spending in USD, EUR, etc.</p>
                    </div>
                    <button
                      onClick={() => setInternationalTxn(!internationalTxn)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${internationalTxn ? 'bg-brand-600' : 'bg-gray-200'
                        }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${internationalTxn ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Limit Slider */}
                  <div className="pt-4">
                    <div className="flex justify-between font-semibold mb-2">
                      <span className="text-text-primary">Daily POS / Online Limit</span>
                      <span className="text-brand-600">₹ {dailyLimit.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="200000"
                      step="5000"
                      value={dailyLimit}
                      onChange={(e) => setDailyLimit(Number(e.target.value))}
                      className="w-full accent-brand-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-text-muted mt-1">
                      <span>Min: ₹ 10,000</span>
                      <span>Max: ₹ 2,00,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: PREFERENCES & NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl rounded-2xl border border-white/60 bg-white/85 p-5 sm:p-7 shadow-sm backdrop-blur-md"
            >
              <h2 className="text-base font-bold text-text-primary mb-1">Communication & Alert Preferences</h2>
              <p className="text-xs text-text-secondary mb-5">
                Manage how UNIQUE Bank notifies you about debits, credits, and security events.
              </p>

              <div className="space-y-4 divide-y divide-border/60 text-xs sm:text-sm">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="font-semibold text-text-primary">SMS Instant Transaction Alerts</p>
                    <p className="text-[11px] text-text-muted">Receive OTPs and debit alerts via SMS.</p>
                  </div>
                  <button
                    onClick={() => setSmsAlerts(!smsAlerts)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${smsAlerts ? 'bg-brand-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${smsAlerts ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="font-semibold text-text-primary">Monthly E-Statements via Email</p>
                    <p className="text-[11px] text-text-muted">Password-protected PDF sent on the 1st of every month.</p>
                  </div>
                  <button
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailAlerts ? 'bg-brand-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailAlerts ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-12 border-t border-white/60 bg-white/70 backdrop-blur-md px-4 py-4 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} UNIQUE Bank · Demo Frontend — Not a real banking service.
      </footer>
    </div>
  );
}
