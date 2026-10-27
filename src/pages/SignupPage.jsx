import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/common/Logo';
import SignupForm from '../components/signup/SignupForm';
import LoginForm from '../components/login/LoginForm';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function SignupPage() {
  const location = useLocation();
  const isSignup = location.pathname !== '/login';

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface-alt">
      {/* ── Background Looping Motion Animation Video ─────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4"
      />

      {/* Translucent overlay for clean visual contrast & high readability */}
      <div className="absolute inset-0 z-0 bg-white/25 backdrop-blur-[1px]" />

      {/* ── Glassmorphism Navigation Bar ──────────────────────────────────── */}
      <header className="relative z-20 px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between rounded-2xl border border-white/60 bg-white/45 px-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl backdrop-saturate-150 transition-all sm:px-7">
          {/* Bank logo */}
          <Logo size="md" linkTo="/login" />

          {/* Glass pill navigation controls */}
          <nav className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/50 p-1 shadow-inner backdrop-blur-md">
            <Link
              to="/signup"
              aria-current={isSignup ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 sm:px-5 ${isSignup
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-text-secondary hover:bg-white/60 hover:text-text-primary'
                }`}
            >
              Sign Up
            </Link>

            <Link
              to="/login"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 sm:px-5 ${!isSignup
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-text-secondary hover:bg-white/60 hover:text-text-primary'
                }`}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Welcome section and signup/login form with Framer Motion ────────── */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-5 sm:py-6">
        <motion.section
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-5 text-center"
        >
          <h1 className="text-2xl font-extrabold leading-tight text-text-primary sm:text-3xl">
            {isSignup ? (
              <>
                Welcome to <span className="text-brand-500">UNIQUE</span> Bank!
              </>
            ) : (
              <>
                Login to <span className="text-brand-500">UNIQUE</span> Bank
              </>
            )}
          </h1>

          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {isSignup
              ? 'Your trusted partner for modern digital banking.'
              : 'Welcome back! Please enter your details to access your account.'}
          </p>
        </motion.section>

        {/* Dynamic form with smooth transition */}
        <motion.div
          key={isSignup ? 'signup' : 'login'}
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="w-full"
        >
          {isSignup ? <SignupForm /> : <LoginForm />}
        </motion.div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 shrink-0 border-t border-white/50 bg-white/40 backdrop-blur-md px-4 py-3 text-center text-xs text-text-secondary font-medium">
        © {new Date().getFullYear()} UNIQUE Bank · Demo Frontend — Not a real banking service.
      </footer>
    </div>
  );
}
