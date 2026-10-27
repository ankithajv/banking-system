import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import Logo from '../common/Logo';

const navLinks = [
  { label: 'Banking', href: '/dashboard' },
  { label: 'Lifestyle', href: '/dashboard' },
  { label: 'Plans', href: '/dashboard' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo size="md" linkTo="/dashboard" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary
                hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Profile + mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5
              text-sm font-medium text-text-primary hover:bg-gray-50 transition-colors md:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <User size={16} />
            </span>
            My Account
            <ChevronDown size={14} className="text-text-muted" />
          </button>

          <button
            className="rounded-lg p-2 text-text-secondary hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-text-secondary
                  hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-border pt-3">
            <button className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-gray-50">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <User size={16} />
              </span>
              My Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
