import { Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * UNIQUE Bank brand logo — used on both pages for visual consistency.
 * @param {{ size?: 'sm' | 'md' | 'lg', linkTo?: string }} props
 */
export default function Logo({ size = 'md', linkTo }) {
  const sizes = {
    sm: { icon: 20, text: 'text-base' },
    md: { icon: 24, text: 'text-xl' },
    lg: { icon: 28, text: 'text-2xl' },
  };

  const s = sizes[size] || sizes.md;

  const content = (
    <span className="flex items-center gap-2 select-none">
      <span className="flex items-center justify-center rounded-lg bg-brand-500 p-1.5 text-white">
        <Landmark size={s.icon} strokeWidth={2.2} />
      </span>
      <span className={`${s.text} font-extrabold tracking-tight text-brand-600`}>
        UNIQUE <span className="font-semibold text-text-secondary">Bank</span>
      </span>
    </span>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
