import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { 
  LayoutDashboard, Wallet, TrendingUp, Users, Award, 
  ArrowLeftRight, BarChart3, Bell, HelpCircle, User, Settings,
  LogOut, ShieldAlert, ChevronDown, ChevronRight, Menu, X, Clock,
  Link2
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const DashboardLayout = () => {
  const { walletAddress, user, logout, connectWallet } = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [walletLinked, setWalletLinked] = useState(false);

  // Detect a "real" wallet: MetaMask addresses are 42-char hex starting with 0x
  // Generated mock wallets from username/password registration also start with 0x
  // We flag ones that are obviously mock by checking if the user object has an email
  // (wallet-only logins don't have email). A simpler heuristic: show button when
  // user signed up via credentials (has email or username, not wallet-origin).
  const isCredentialUser = user && (user.email || user.username);
  const showConnectWallet = isCredentialUser && !walletLinked;

  const handleLinkWallet = async () => {
    setWalletConnecting(true);
    try {
      await connectWallet();
      setWalletLinked(true);
    } catch (e) {
      console.error('Wallet link failed:', e);
    } finally {
      setWalletConnecting(false);
    }
  };
  
  // Expand/collapse states for folders
  const [folders, setFolders] = useState({
    staking: true,
    referrals: false,
    lpdao: false,
    rankSalary: false,
    transactions: false
  });

  const toggleFolder = (folder) => {
    setFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const navItem = (path, label, icon) => {
    const Icon = icon;
    const isActive = location.pathname === path;
    return (
      <Link
        key={path}
        to={path}
        className={`nav-btn ${isActive ? 'active' : ''}`}
        onClick={() => {
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }}
      >
        <Icon size={18} className="nav-icon" />
        <span>{label}</span>
      </Link>
    );
  };

  const folderHeader = (key, label, icon) => {
    const Icon = icon;
    const isOpen = folders[key];
    return (
      <button className="folder-hdr" onClick={() => toggleFolder(key)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={18} className="nav-icon" />
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Header Bar */}
      <header className="dashboard-header flex-between">
        <div className="header-left">
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo-section" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoImg} alt="Vertex Capital Logo" style={{ height: '65px', width: 'auto' }} />
          </div>
        </div>

        <div className="header-right">
          {/* Connect Wallet CTA — shown for credential-registered users */}
          {showConnectWallet ? (
            <button
              className="btn btn-secondary connect-wallet-btn-responsive"
              onClick={handleLinkWallet}
              disabled={walletConnecting}
              title="Connect Web3 Wallet (MetaMask / Trust Wallet)"
              style={{
                border: '1px solid rgba(224,160,30,0.5)',
                color: 'var(--gold-light)',
                display: 'flex', alignItems: 'center', gap: '6px',
                animation: 'pulse-wallet 2.5s ease-in-out infinite'
              }}
            >
              <Link2 size={14} />
              <span className="connect-wallet-btn-text">
                {walletConnecting ? (
                  'Linking…'
                ) : (
                  <>
                    <span className="desktop-text">Connect Wallet</span>
                    <span className="mobile-text">Connect</span>
                  </>
                )}
              </span>
            </button>
          ) : (
            <div className="wallet-badge flex-between" title={`Connected Wallet: ${walletAddress || 'Disconnected'}`}>
              <Wallet size={16} className="text-gold" />
              <span className="wallet-addr">
                {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : 'Disconnected'}
              </span>
            </div>
          )}

          <button className="icon-btn header-notif" onClick={() => navigate('/dashboard/notifications')}>
            <Bell size={20} />
            <span className="notif-badge"></span>
          </button>

          <button className="icon-btn logout-btn" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar backdrop for mobile — tap to close */}
        {isSidebarOpen && window.innerWidth < 1024 && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 190,
              backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* Navigation Sidebar */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {navItem('/dashboard/overview', 'Overview', LayoutDashboard)}
            {navItem('/dashboard/buy', 'Buy DLMC', Wallet)}
            {navItem('/dashboard/sell', 'Sell DLMC', ArrowLeftRight)}

            {/* Folder: Staking */}
            <div className="folder-container">
              {folderHeader('staking', 'Staking', TrendingUp)}
              {folders.staking && (
                <div className="folder-children">
                  {navItem('/dashboard/staking/active', 'Active Stakes', Clock)}
                  {navItem('/dashboard/staking/dividends', 'Dividend History', Clock)}
                  {navItem('/dashboard/staking/claim', 'Claim Rewards', Clock)}
                </div>
              )}
            </div>

            {/* Folder: Referrals */}
            <div className="folder-container">
              {folderHeader('referrals', 'Referrals', Users)}
              {folders.referrals && (
                <div className="folder-children">
                  {navItem('/dashboard/referrals/link', 'My Referral Link', Users)}
                  {navItem('/dashboard/referrals/network', 'Team Network', Users)}
                  {navItem('/dashboard/referrals/directs', 'Direct Referrals', Users)}
                  {navItem('/dashboard/referrals/level-income', 'Level Income', Users)}
                  {navItem('/dashboard/referrals/booster', 'Booster Rewards', Users)}
                </div>
              )}
            </div>

            {/* Folder: LPDAO */}
            <div className="folder-container">
              {folderHeader('lpdao', 'LPDAO', ShieldAlert)}
              {folders.lpdao && (
                <div className="folder-children">
                  {navItem('/dashboard/lpdao/membership', 'Membership', ShieldAlert)}
                  {navItem('/dashboard/lpdao/governance', 'Governance', ShieldAlert)}
                  {navItem('/dashboard/lpdao/proposals', 'Active Proposals', ShieldAlert)}
                  {navItem('/dashboard/lpdao/history', 'Voting History', ShieldAlert)}
                </div>
              )}
            </div>

            {/* Folder: Rank & Salary */}
            <div className="folder-container">
              {folderHeader('rankSalary', 'Rank & Salary', Award)}
              {folders.rankSalary && (
                <div className="folder-children">
                  {navItem('/dashboard/rank/current', 'Current Rank', Award)}
                  {navItem('/dashboard/rank/salary', 'Salary History', Award)}
                  {navItem('/dashboard/rank/milestones', 'Milestones', Award)}
                </div>
              )}
            </div>

            {/* Folder: Transactions */}
            <div className="folder-container">
              {folderHeader('transactions', 'Transactions', ArrowLeftRight)}
              {folders.transactions && (
                <div className="folder-children">
                  {navItem('/dashboard/transactions', 'History Lists', ArrowLeftRight)}
                </div>
              )}
            </div>

            {navItem('/dashboard/analytics', 'Analytics', BarChart3)}
            {navItem('/dashboard/notifications', 'Notifications', Bell)}
            {navItem('/dashboard/support', 'Support', HelpCircle)}
            {navItem('/dashboard/profile', 'Profile', User)}
            {navItem('/dashboard/settings', 'Settings', Settings)}
          </nav>
        </aside>

        {/* Content Viewer Grid */}
        <main className="dashboard-content">
          <div className="content-scroller">
            {/* Nested routing child components load here */}
            <React.Suspense fallback={<div style={{ color: 'var(--text-secondary)' }}>Loading section...</div>}>
              <Outlet />
            </React.Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
