import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from './context/WalletContext';
import LandingPage from './pages/LandingPage';
import LoginSignup from './pages/LoginSignup';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Individual user views
import Overview from './pages/user/Overview';
import BuyVertexCapital from './pages/user/BuyVertexCapital';
import SellVertexCapital from './pages/user/SellVertexCapital';
import StakingActive from './pages/user/StakingActive';
import DividendHistory from './pages/user/DividendHistory';
import ClaimRewards from './pages/user/ClaimRewards';
import ReferralLink from './pages/user/ReferralLink';
import TeamNetwork from './pages/user/TeamNetwork';
import DirectReferrals from './pages/user/DirectReferrals';
import LevelIncome from './pages/user/LevelIncome';
import BoosterRewards from './pages/user/BoosterRewards';
import LPDAOMembership from './pages/user/LPDAOMembership';
import Governance from './pages/user/Governance';
import GovernanceProposals from './pages/user/GovernanceProposals';
import VotingHistory from './pages/user/VotingHistory';
import CurrentRank from './pages/user/CurrentRank';
import SalaryHistory from './pages/user/SalaryHistory';
import Milestones from './pages/user/Milestones';
import Transactions from './pages/user/Transactions';
import Analytics from './pages/user/Analytics';
import Notifications from './pages/user/Notifications';
import Support from './pages/user/Support';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';

// Individual admin views
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCMS from './pages/admin/AdminCMS';
import AdminTickets from './pages/admin/AdminTickets';
import AdminGovernance from './pages/admin/AdminGovernance';
import AdminRanks from './pages/admin/AdminRanks';

import './App.css';

// Protected Route components
const RequireAuth = ({ children }) => {
  const { isConnected } = useWallet();
  // Also allow if a token exists in localStorage (e.g. bypass session)
  const hasToken = !!localStorage.getItem('dlmc_token');
  return (isConnected || hasToken) ? children : <Navigate to="/" replace />;
};

const RequireAdmin = ({ children }) => {
  const { isConnected, user } = useWallet();
  return isConnected && user?.role === 'admin' ? children : <Navigate to="/dashboard/overview" replace />;
};

function App() {
  const { isConnected, loading } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  // Capture and save referrer from query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let ref = urlParams.get('ref');

    if (!ref && window.location.hash) {
      const hashParts = window.location.hash.split('?');
      if (hashParts[1]) {
        const hashParams = new URLSearchParams(hashParts[1]);
        ref = hashParams.get('ref');
      }
    }

    if (ref) {
      console.log('Referrer captured and stored:', ref);
      localStorage.setItem('dlmc_referrer', ref);
    }
  }, []);

  // Redirect logic based on auth status
  useEffect(() => {
    if (!loading) {
      const hasToken = !!localStorage.getItem('dlmc_token');
      if (isConnected || hasToken) {
        if (location.pathname === '/' || location.pathname === '/login') {
          navigate('/dashboard/overview', { replace: true });
        }
      } else {
        if (location.pathname !== '/' && location.pathname !== '/login') {
          navigate('/', { replace: true });
        }
      }
    }
  }, [isConnected, loading, location.pathname]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', color: 'var(--gold-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 className="glow-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Vertex Capital</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Securing Web3 session keys...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginSignup onBack={() => navigate('/')} onAuthSuccess={() => { localStorage.setItem('dlmc_token', 'bypass_' + Date.now()); navigate('/dashboard/overview'); }} />} />
      
      {/* Nested User Dashboard Layout */}
      <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="buy" element={<BuyVertexCapital />} />
        <Route path="sell" element={<SellVertexCapital />} />
        <Route path="staking/active" element={<StakingActive />} />
        <Route path="staking/dividends" element={<DividendHistory />} />
        <Route path="staking/claim" element={<ClaimRewards />} />
        <Route path="referrals/link" element={<ReferralLink />} />
        <Route path="referrals/network" element={<TeamNetwork />} />
        <Route path="referrals/directs" element={<DirectReferrals />} />
        <Route path="referrals/level-income" element={<LevelIncome />} />
        <Route path="referrals/booster" element={<BoosterRewards />} />
        <Route path="lpdao/membership" element={<LPDAOMembership />} />
        <Route path="lpdao/governance" element={<Governance />} />
        <Route path="lpdao/proposals" element={<GovernanceProposals />} />
        <Route path="lpdao/history" element={<VotingHistory />} />
        <Route path="rank/current" element={<CurrentRank />} />
        <Route path="rank/salary" element={<SalaryHistory />} />
        <Route path="rank/milestones" element={<Milestones />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="support" element={<Support />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Nested Admin Layout */}
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="cms" element={<AdminCMS />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="governance" element={<AdminGovernance />} />
        <Route path="ranks" element={<AdminRanks />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
