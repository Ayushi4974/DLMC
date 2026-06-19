import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, TrendingUp, Users, Award,
  ShieldCheck, Zap, ShoppingCart, Layers,
  Gift, Link2, ArrowUpRight, ArrowDownRight,
  Sparkles, CircleDollarSign, Star, Activity,
  RefreshCw, ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';
import DailyEarningsChart from '../../components/DailyEarningsChart';
import PriceIndexChart from '../../components/PriceIndexChart';

/* ─── Animated Counter hook ─── */
function useCountUp(target, duration = 1200, decimals = 2) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);

  useEffect(() => {
    if (target === 0 || isNaN(target)) { setValue(0); return; }
    startRef.current = null;
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals]);

  return value;
}

/* ─── Stat Card inner content ─── */
const StatCardContent = ({ title, rawValue, unit, label, icon: Icon, accent, trend, index }) => {
  const numericVal  = parseFloat(rawValue) || 0;
  const decimals    = numericVal < 10 ? 4 : 2;
  const animated    = useCountUp(numericVal, 900 + index * 100, decimals);
  const isString    = typeof rawValue === 'string' && isNaN(parseFloat(rawValue));
  const displayVal  = isString
    ? rawValue
    : `${animated.toLocaleString(undefined, {
        minimumFractionDigits:  decimals,
        maximumFractionDigits:  decimals,
      })} ${unit}`.trim();

  return (
    <>
      {/* Card header */}
      <div className="ov-card-header">
        <span className="ov-card-title">{title}</span>
        <div className="ov-card-icon-wrap" style={{ '--accent': accent }}>
          <Icon size={15} />
        </div>
      </div>

      {/* Animated value */}
      <motion.div
        className="ov-card-value"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4, ease: LUXURY_EASE }}
      >
        {displayVal}
      </motion.div>

      {/* Label + trend */}
      <div className="ov-card-footer">
        <span className="ov-card-label">{label}</span>
        {trend !== undefined && trend !== null && (
          <motion.span
            className={`ov-trend ${trend >= 0 ? 'pos' : 'neg'}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            transition={{ delay: index * 0.07 + 0.2, duration: 0.35, ease: LUXURY_EASE }}
          >
            {trend >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(trend)}%
          </motion.span>
        )}
      </div>
    </>
  );
};

/* ─── Preset button ─── */
const PresetBtn = ({ val, active, onClick }) => (
  <motion.button
    className={`ov-preset-btn ${active ? 'active' : ''}`}
    onClick={() => onClick(String(val))}
    whileHover={{ scale: 1.08, y: -2 }}
    whileTap={{ scale: 0.96 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  >
    ${val.toLocaleString()}
  </motion.button>
);

/* ─── Quick-action row button ─── */
const QuickBtn = ({ label, icon: Ico, path, color, navigate, index }) => (
  <motion.button
    className="ov-quick-btn"
    style={{ '--qa-color': color }}
    onClick={() => navigate(path)}
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1,  x: 0   }}
    transition={{ delay: 0.05 * index, duration: 0.4, ease: LUXURY_EASE }}
    whileHover={{ x: 6, backgroundColor: `color-mix(in srgb, ${color} 10%, rgba(22,27,34,0.85))` }}
    whileTap={{ scale: 0.98 }}
  >
    <motion.div
      className="ov-quick-icon"
      whileHover={{ scale: 1.15, rotate: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    >
      <Ico size={19} />
    </motion.div>
    <span>{label}</span>
    <ChevronRight size={14} className="ov-quick-arrow" style={{ marginLeft: 'auto' }} />
  </motion.button>
);

/* ─── Custom Recharts tooltip ─── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(5,7,10,0.96)',
      border: '1px solid rgba(212,160,23,0.2)',
      borderRadius: 10,
      padding: '10px 16px',
      fontSize: '0.8rem',
    }}>
      <p style={{ color: '#F8D954', fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{Number(p.value).toFixed(2)}</strong>
        </p>
      ))}
    </div>
  );
};

/* ─── Stagger container variants ─── */
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show:   {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: LUXURY_EASE },
  },
};

/* ════════════════════════════════════════════
   MAIN OVERVIEW COMPONENT
════════════════════════════════════════════ */
export const Overview = () => {
  const { authFetch }    = useWallet();
  const navigate         = useNavigate();
  const [data,          setData]          = useState(null);
  const [charts,        setCharts]        = useState(null);
  const [amount,        setAmount]        = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [depositOK,     setDepositOK]     = useState(false);
  const [refreshing,    setRefreshing]    = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const [r1, r2] = await Promise.all([
        authFetch('http://localhost:5000/api/dashboard/summary'),
        authFetch('http://localhost:5000/api/dashboard/charts'),
      ]);
      const [summary, chartData] = await Promise.all([r1.json(), r2.json()]);
      setData(summary);
      setCharts(chartData);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;
    setActionLoading(true);
    try {
      const res = await authFetch('http://localhost:5000/api/dashboard/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount) }),
      });
      if (res.ok) {
        setDepositOK(true);
        setAmount('');
        setTimeout(() => { setDepositOK(false); load(); }, 2200);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Loading state ── */
  if (!data) return (
    <div className="ov-loader">
      <motion.div
        className="ov-loader-ring"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Initializing financial data...
      </motion.span>
    </div>
  );

  const { summary, cms } = data;

  /* ── Card definitions ── */
  const cards = [
    { title: 'Wallet Balance',      rawValue: summary.usdtBalance,       unit: 'USDT', label: 'Available to stake',                   icon: Wallet,           accent: '#D4A017', trend: 12.5 },
    { title: 'DLMC Balance',        rawValue: summary.dlmcBalance,        unit: 'DLMC', label: `Token Price: $${(cms?.tokenPrice||1.25).toFixed(2)}`, icon: CircleDollarSign, accent: '#3B82F6', trend: 2.5  },
    { title: 'Total Staked',        rawValue: summary.totalStaked,        unit: 'USDT', label: `${summary.activeStakesCount} Active stakes`, icon: Layers,      accent: '#22C55E', trend: 0    },
    { title: 'Available Dividends', rawValue: summary.availableDividends, unit: 'USDT', label: 'Claim anytime',                        icon: Sparkles,         accent: '#A855F7', trend: 8.3  },
    { title: 'Total Claimed',       rawValue: summary.totalClaimed,       unit: 'USDT', label: 'Deducted fees applied',                icon: Gift,             accent: '#14B8A6', trend: null },
    { title: 'Referral Income',     rawValue: summary.referralEarnings,   unit: 'USDT', label: 'Direct sponsorships',                  icon: Link2,            accent: '#F97316', trend: null },
    { title: 'Rank Salary',         rawValue: summary.salaryEarnings,     unit: 'USDT', label: `Current Rank: ${summary.currentRank}`, icon: Award,            accent: '#EC4899', trend: null },
    {
      title: 'LPDAO Status',
      rawValue: summary.lpdaoStatus === 'member' ? 'Member' : 'Non-Member',
      unit: '',
      label: 'Governance access',
      icon: ShieldCheck,
      accent: '#6366F1',
      trend: null,
    },
  ];

  const quickActions = [
    { label: 'Buy DLMC',       icon: ShoppingCart, path: '/dashboard/buy',            color: '#D4A017' },
    { label: 'Stake Now',      icon: Layers,       path: '/dashboard/staking/active',  color: '#22C55E' },
    { label: 'Claim Rewards',  icon: Gift,         path: '/dashboard/staking/claim',   color: '#A855F7' },
    { label: 'Invite Friends', icon: Users,        path: '/dashboard/referrals/link',  color: '#3B82F6' },
  ];

  return (
    <motion.div
      className="ov-root"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0  }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
    >

      {/* ════ Page Header ════ */}
      <div className="ov-page-header">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1,  x: 0   }}
          transition={{ duration: 0.5, ease: LUXURY_EASE }}
        >
          <div className="ov-live-badge">
            <span className="ov-pulse-dot" />
            LIVE DATA
          </div>
          <h2 className="ov-page-title">Financial Command Center</h2>
          <p className="ov-page-sub">
            Real-time snapshot of your decentralized assets, yields, and network activity.
          </p>
        </motion.div>

        <motion.button
          className={`ov-refresh-btn ${refreshing ? 'spinning' : ''}`}
          onClick={load}
          disabled={refreshing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={15} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </motion.button>
      </div>

      {/* ════ Anti-Gravity Stats Grid ════ */}
      <motion.div
        className="ov-stats-grid"
        variants={gridVariants}
        initial="hidden"
        animate="show"
      >
        {cards.map((c, i) => (
          <motion.div key={i} variants={cardVariants}>
            <AntiGravityCard
              accent={c.accent}
              depth={8}
              tilt={true}
              glow={true}
              className="ov-ag-stat"
              style={{ '--accent': c.accent }}
            >
              <StatCardContent {...c} index={i} />
            </AntiGravityCard>
          </motion.div>
        ))}
      </motion.div>

      {/* ════ Quick Deposit + Jump to Features ════ */}
      <motion.div
        className="ov-actions-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1,  y: 0   }}
        transition={{ delay: 0.35, duration: 0.5, ease: LUXURY_EASE }}
      >
        {/* Deposit Card */}
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} className="ov-deposit-card" style={{ gap: 0, padding: 0 }}>
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <h3 className="ov-section-title">
                <Zap size={17} style={{ color: '#D4A017', marginRight: 8 }} />
                Quick Deposit
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: 5 }}>
                Simulate USDT deposit to test flows and rewards.
              </p>
            </div>

            <div className="ov-presets">
              {[50, 100, 500, 1000].map(v => (
                <PresetBtn key={v} val={v} active={amount === String(v)} onClick={setAmount} />
              ))}
            </div>

            <div className="ov-deposit-row">
              <div className="ov-input-wrap">
                <span className="ov-input-prefix">$</span>
                <input
                  type="number"
                  className="ov-amount-input"
                  placeholder="Custom amount…"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <motion.button
                className={`ov-deposit-btn ${depositOK ? 'success' : ''}`}
                onClick={handleDeposit}
                disabled={actionLoading || depositOK}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 340, damping: 20 }}
              >
                {depositOK ? '✓ Done!' : actionLoading ? 'Processing…' : 'Deposit'}
              </motion.button>
            </div>

            {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
              <motion.div
                className="ov-returns-hint"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: LUXURY_EASE }}
              >
                <Activity size={13} />
                Estimated 250% return →{' '}
                <strong>${(Number(amount) * 2.5).toLocaleString()} USDT</strong>
              </motion.div>
            )}
          </div>
        </AntiGravityCard>

        {/* Jump to Features */}
        <AntiGravityCard accent="#6366F1" depth={6} tilt={false} glow={true} className="ov-jump-card" style={{ padding: 0 }}>
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 className="ov-section-title">
              <Star size={17} style={{ color: '#D4A017', marginRight: 8 }} />
              Jump to Features
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: 5, marginBottom: 20 }}>
              Direct links to essential exchange, networking, and governance.
            </p>
            <div className="ov-quick-actions">
              {quickActions.map((qa, i) => (
                <QuickBtn key={i} {...qa} navigate={navigate} index={i} />
              ))}
            </div>
          </div>
        </AntiGravityCard>
      </motion.div>

      {/* ════ Charts ════ */}
      {charts && (
        <motion.div
          className="ov-charts-row"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1,  y: 0   }}
          transition={{ delay: 0.5, duration: 0.5, ease: LUXURY_EASE }}
        >
          {/* ── Daily Earnings — Premium Standalone Chart ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease: LUXURY_EASE }}
          >
            <DailyEarningsChart data={charts.dailyEarnings} />
          </motion.div>

          {/* ── DLMC Price Index — Premium Standalone Chart ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: LUXURY_EASE }}
          >
            <PriceIndexChart data={charts.priceChart} change24h={2.5} />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Overview;
