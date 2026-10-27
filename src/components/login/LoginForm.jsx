import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import InputField from '../common/InputField';
import Button from '../common/Button';

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if there are any signed-up users in localStorage
  const getRegisteredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('unique_bank_users') || '[]');
    } catch {
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const handleFillLastUser = () => {
    const users = getRegisteredUsers();
    if (users.length > 0) {
      const lastUser = users[users.length - 1];
      setForm({ identifier: lastUser.username || lastUser.email, password: lastUser.password });
      setErrors({});
    } else {
      setForm({ identifier: 'john@example.com', password: 'Password@123' });
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.identifier.trim()) {
      newErrors.identifier = 'Please enter your username or email.';
    }
    if (!form.password) {
      newErrors.password = 'Please enter your password.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const inputId = form.identifier.trim().toLowerCase();
    const users = getRegisteredUsers();

    // Find user in registered list or default demo
    const matchedUser = users.find(
      (u) =>
        u.username.toLowerCase() === inputId ||
        u.email.toLowerCase() === inputId
    );

    const isDemoUser =
      inputId === 'johndoe' || inputId === 'john@example.com' || inputId === 'demo';

    if (!matchedUser && !isDemoUser) {
      setErrors({
        general: 'No account found with this username or email. Please sign up first.',
      });
      return;
    }

    if (matchedUser && matchedUser.password !== form.password) {
      setErrors({
        password: 'Incorrect password. Please try again.',
      });
      return;
    }

    // Login successful
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);

    // Save active session
    const activeUser = matchedUser || {
      username: 'John Doe',
      email: 'john@example.com',
      firstName: 'John',
    };
    try {
      localStorage.setItem('unique_bank_current_user', JSON.stringify(activeUser));
    } catch {
      // ignore storage errors
    }

    setTimeout(() => {
      navigate('/dashboard');
    }, 900);
  };

  const registeredUsers = getRegisteredUsers();

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card mx-auto w-full max-w-md p-8 sm:p-10"
    >
      <h2 className="mb-1 text-center text-xl font-bold text-text-primary">
        Login to your account
      </h2>
      <p className="mb-6 text-center text-sm text-text-secondary">
        Enter your credentials to access your banking dashboard
      </p>

      {/* Helpful shortcut if someone already signed up */}
      {registeredUsers.length > 0 && (
        <div className="mb-5 rounded-lg border border-brand-200 bg-brand-50/60 p-3 text-xs text-brand-800 flex items-center justify-between">
          <span>Found {registeredUsers.length} signed-up account(s).</span>
          <button
            type="button"
            onClick={handleFillLastUser}
            className="font-bold underline text-brand-700 hover:text-brand-900"
          >
            Auto-fill credentials
          </button>
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg bg-success-50 px-4 py-3 text-center text-sm font-medium text-success-700 border border-success-200">
          ✓ Login successful! Redirecting to your account…
        </div>
      )}

      {errors.general && (
        <div className="mb-5 rounded-lg bg-danger-50 px-4 py-3 text-center text-sm font-medium text-danger-600 border border-danger-200">
          {errors.general}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <InputField
          id="identifier"
          label="Username or Email"
          value={form.identifier}
          onChange={handleChange}
          placeholder="Enter your registered username or email"
          error={errors.identifier}
          required
          autoComplete="username"
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          required
          autoComplete="current-password"
        />
      </div>

      <div className="mt-7">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={success}
        >
          <LogIn size={18} />
          Login
        </Button>
      </div>

      <p className="mt-5 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Sign Up
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-text-muted">
        This is a frontend demonstration only. No data is stored or transmitted.
      </p>
    </form>
  );
}
