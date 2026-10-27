import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/common/Logo';
import SignupForm from '../components/signup/SignupForm';

export default function SignupPage() {
  const location = useLocation();
  const isSignup = location.pathname === '/signup';

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      {/* ── Top header ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4 sm:px-10">
        <Logo size="md" linkTo="/signup" />

        <nav className="flex gap-1">
          <Link
            to="/signup"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors
              ${isSignup
                ? 'bg-brand-50 text-brand-600'
                : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              }`}
          >
            Sign Up
          </Link>
          <Link
            to="/signup"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-colors"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* ── Hero + form ────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-text-primary sm:text-4xl">
            Welcome to <span className="text-brand-500">UNIQUE</span> Bank!
          </h1>
          <p className="mt-2 text-text-secondary">
            Your trusted partner for modern digital banking.
          </p>
        </div>

        <SignupForm />
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-surface py-4 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} UNIQUE Bank · Demo Frontend — Not a real banking service.
      </footer>
    </div>
  );
}
