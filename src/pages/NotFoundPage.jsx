import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-alt px-4 text-center">
      <Logo size="lg" />
      <h1 className="mt-8 text-6xl font-extrabold text-brand-500">404</h1>
      <p className="mt-3 text-lg text-text-secondary">
        Oops — we couldn't find the page you're looking for.
      </p>
      <div className="mt-6 w-48">
        <Button onClick={() => navigate('/signup')}>
          <Home size={18} />
          Go Home
        </Button>
      </div>
    </div>
  );
}
