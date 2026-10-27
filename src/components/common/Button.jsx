/**
 * Reusable button component with primary and success variants.
 */
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  ...rest
}) {
  const base = variant === 'success' ? 'btn-success' : 'btn-primary';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} w-full ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Processing…
        </>
      ) : (
        children
      )}
    </button>
  );
}
