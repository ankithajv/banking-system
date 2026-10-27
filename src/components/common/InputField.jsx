import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Reusable form input with label, validation message, and optional password toggle.
 */
export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  autoComplete,
  maxLength,
  inputMode,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
        {required && <span className="ml-0.5 text-danger-500">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text-primary
            placeholder:text-text-muted outline-none transition-colors
            ${error
              ? 'border-danger-500 focus:ring-2 focus:ring-danger-500/20'
              : 'border-border focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20'
            }
            ${isPassword ? 'pr-11' : ''}
          `}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger-500">
          {error}
        </p>
      )}
    </div>
  );
}
