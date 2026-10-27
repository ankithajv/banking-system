import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import InputField from '../common/InputField';
import Button from '../common/Button';

const initialForm = {
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

function validate(form) {
  const errors = {};

  if (!form.username.trim()) {
    errors.username = 'Username is required.';
  } else if (form.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^\d{10}$/.test(form.phone.trim())) {
    errors.phone = 'Enter a valid 10-digit phone number.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

/**
 * Signup form with client-side validation.
 * NOTE: This is a frontend demo — no data is persisted or sent to a server.
 */
export default function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Persist registered user to localStorage so they can login next time
    try {
      const storedUsers = JSON.parse(localStorage.getItem('unique_bank_users') || '[]');
      const newUser = {
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      };
      const updated = [
        ...storedUsers.filter(
          (u) =>
            u.username.toLowerCase() !== newUser.username.toLowerCase() &&
            u.email.toLowerCase() !== newUser.email.toLowerCase()
        ),
        newUser,
      ];
      localStorage.setItem('unique_bank_users', JSON.stringify(updated));
      localStorage.setItem('unique_bank_current_user', JSON.stringify(newUser));
    } catch {
      // ignore storage errors
    }

    // Simulate API call
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);

    // Navigate to dashboard after brief success message
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card mx-auto w-full max-w-md p-8 sm:p-10"
    >
      <h2 className="mb-1 text-center text-xl font-bold text-text-primary">
        Set up your account
      </h2>
      <p className="mb-6 text-center text-sm text-text-secondary">
        Enter your details to get started
      </p>

      {success && (
        <div className="mb-5 rounded-lg bg-success-50 px-4 py-3 text-center text-sm font-medium text-success-700">
          Account created successfully! Redirecting to dashboard…
        </div>
      )}

      <div className="flex flex-col gap-4">
        <InputField
          id="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          placeholder="e.g. johndoe"
          error={errors.username}
          required
          autoComplete="username"
        />

        <InputField
          id="email"
          label="Email ID"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
          error={errors.email}
          required
          autoComplete="email"
        />

        <InputField
          id="phone"
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="9876543210"
          error={errors.phone}
          required
          maxLength={10}
          inputMode="numeric"
          autoComplete="tel"
        />

        <InputField
          id="password"
          label="Set Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Min. 8 characters"
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <InputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />
      </div>

      <div className="mt-7">
        <Button
          type="submit"
          variant="success"
          loading={loading}
          disabled={success}
        >
          <UserPlus size={18} />
          Sign Up
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Log in
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-text-muted">
        This is a frontend demonstration only. No data is stored or transmitted.
      </p>
    </form>
  );
}
