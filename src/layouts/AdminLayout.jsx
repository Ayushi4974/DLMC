import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { 
  LayoutDashboard, Users, Wallet, ArrowLeftRight, TrendingUp,
  Award, ShieldAlert, Settings, HelpCircle, Bell, BarChart3,
  Sliders, Menu, X, ArrowLeft, LogOut
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const AdminLayout = () => {
  const { logout } = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


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

  return (
    <div className="dashboard-container">
      {/* Header Bar */}
      <header className="dashboard-header flex-between" style={{ borderBottom: '1px solid rgba(224, 160, 30, 0.2)' }}>
        <div className="header-left">
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo-section" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoImg} alt="Vertex Capital Logo" style={{ height: '65px', width: 'auto' }} />
          </div>
        </div>

        <div className="header-right">
          <button 
            className="btn btn-secondary flex-between admin-back-btn"
            onClick={() => navigate('/dashboard/overview')}
            style={{ borderColor: 'var(--gold-primary)', color: '#FFFFFF' }}
          >
            <ArrowLeft size={14} />
            <span className="admin-back-btn-text">Back to User Portal</span>
          </button>

          <button className="icon-btn logout-btn" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Navigation Sidebar */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {navItem('/admin/overview', 'Overview', LayoutDashboard)}
            {navItem('/admin/users', 'Users Directory', Users)}
            {navItem('/admin/cms', 'CMS Settings', Sliders)}
            {navItem('/admin/tickets', 'Support tickets', HelpCircle)}
            {navItem('/admin/governance', 'Governance Proposals', ShieldAlert)}
            {navItem('/admin/ranks', 'Rank Salaries Payouts', Award)}
          </nav>
        </aside>

        {/* Content Viewer Grid */}
        <main className="dashboard-content">
          <div className="content-scroller">
            <React.Suspense fallback={<div style={{ color: 'var(--text-secondary)' }}>Loading console...</div>}>
              <Outlet />
            </React.Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
