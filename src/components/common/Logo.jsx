import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

/**
 * UNIQUE Bank brand logo — used on both pages for visual consistency.
 * @param {{ size?: 'sm' | 'md' | 'lg', linkTo?: string }} props
 */
export default function Logo({ size = 'md', linkTo }) {
  const heights = {
    sm: 'h-20',
    md: 'h-25',
    lg: 'h-28',
  };

  const h = heights[size] || heights.md;

  const content = (
    <span className="inline-flex items-center select-none">
      <img src={logoImg} alt="UNIQUE Bank" className={`${h} w-auto object-contain`} />
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
