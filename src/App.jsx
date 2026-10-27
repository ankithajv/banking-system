import { Routes, Route, Navigate } from 'react-router-dom';
import { BankingProvider } from './context/BankingContext';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import PlansPage from './pages/PlansPage';
import LifestylePage from './pages/LifestylePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BankingProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/my-account" element={<Navigate to="/account" replace />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/lifestyle" element={<LifestylePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BankingProvider>
  );
}
