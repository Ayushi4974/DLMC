/**
 * StakingActive — Ultra-Premium Luxury Obsidian & Gold Staking Console
 *
 * Design spec:
 *  - 4-stat metric widgets with gold figures + slate labels
 *  - Anti-gravity LiftCard for stake form + positions table
 *  - Premium input: matte dark cell, gold focus glow
 *  - Gold gradient Confirm Stake CTA + shimmer animation
 *  - Mint green status badges on active stakes
 *  - Premium empty state with centered SVG vault icon
 *  - Framer Motion stagger entry + hardware-accelerated AOS
 *  - Per-row hover highlight on positions table
 *  - Real-time daily earnings ticker per stake
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, TrendingUp, Clock, Zap, CheckCircle2,
  AlertCircle, Info, ChevronRight, BarChart3,
  Coins, Activity, CalendarDays, Sparkles,
} from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

/* ─── Design tokens ─── */
const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const GOLD_DARK  = '#8B5E00';
const MINT       = '#00E5A8';
const OBSIDIAN   = '#050505';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";
const EASE       = LUXURY_EASE;

/* ─── Stagger variants from Overview ─── */
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

/* ─── Animated counter ─── */
const AnimNum = ({ value, prefix = '', suffix = '', decimals = 2, color = GOLD, size = '1.9rem' }) => {
  const [disp, setDisp] = useState(0);
  const raf  = useRef(null);
  const t0   = useRef(null);
  const tgt  = parseFloat(value) || 0;

  useEffect(() => {
    t0.current = null;
    cancelAnimationFrame(raf.current);
    const from = disp;
    const run = (ts) => {
      if (!t0.current) t0.current = ts;
      const p = Math.min((ts - t0.current) / 800, 1);
      setDisp(from + (tgt - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf.current = requestAnimationFrame(run);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [tgt]);

  return (
    <span style={{ color, fontSize: size, fontWeight: 800, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', fontFamily: FONT }}>
      {prefix}{disp.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
};

/* ─── Stat widget ─── */
const StatCard = ({ icon: Icon, label, value, suffix = '', prefix = '', decimals = 2, color = GOLD }) => (
  <AntiGravityCard
    accent={color === GOLD ? '#D4A017' : color}
    depth={8}
    tilt={true}
    glow={true}
    style={{
      padding: '22px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      cursor: 'default',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: FONT }}>
        {label}
      </span>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'rgba(212,160,23,0.08)',
        border: '1px solid rgba(212,160,23,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={14} color={GOLD} />
      </div>
    </div>
    <AnimNum value={value} prefix={prefix} suffix={suffix} decimals={decimals} color={color} size="1.7rem" />
  </AntiGravityCard>
);

/* ─── Empty state SVG vault ─── */
const EmptyState = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 16 }}>
    <div style={{ position: 'relative' }}>
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -12, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(212,160,23,0.12), transparent 70%)`,
        }}
      />
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="16" width="48" height="36" rx="6" stroke="rgba(212,160,23,0.35)" strokeWidth="2" fill="rgba(212,160,23,0.05)" />
        <circle cx="32" cy="34" r="10" stroke="rgba(212,160,23,0.4)" strokeWidth="2" fill="rgba(212,160,23,0.06)" />
        <circle cx="32" cy="34" r="4"  fill="rgba(212,160,23,0.25)" />
        <line x1="32" y1="16" x2="32" y2="10" stroke="rgba(212,160,23,0.3)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="10" x2="40" y2="10" stroke="rgba(212,160,23,0.3)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="34" r="3" fill="rgba(212,160,23,0.3)" />
      </svg>
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, fontFamily: FONT, marginBottom: 4 }}>
        No Active Staking Positions
      </p>
      <p style={{ color: '#3F4A5A', fontSize: '0.78rem', fontFamily: FONT }}>
        Stake USDT to begin accruing daily dividends
      </p>
    </div>
  </div>
);

/* ─── Table row ─── */
const StakeRow = ({ stake, idx }) => {
  const days = Math.max(1, Math.floor((Date.now() - new Date(stake.startDate)) / 86400000));
  const earned = (stake.dailyDividend * days).toFixed(4);
  const [hov, setHov] = useState(false);

  return (
    <motion.tr
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * idx, duration: 0.35, ease: EASE }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(212,160,23,0.04)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        transition: 'background 0.2s ease',
        cursor: 'default',
      }}
    >
      {/* Stake ID */}
      <td style={{ padding: '14px 16px' }}>
        <span style={{
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          fontSize: '0.75rem',
          color: GOLD_LIGHT,
          background: 'rgba(212,160,23,0.08)',
          border: '1px solid rgba(212,160,23,0.15)',
          borderRadius: 6,
          padding: '3px 8px',
          letterSpacing: '0.03em',
        }}>
          {stake.id}
        </span>
      </td>
      {/* Amount */}
      <td style={{ padding: '14px 16px', color: '#F8FAFC', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: '0.88rem' }}>
        {Number(stake.amount).toFixed(2)} <span style={{ color: '#52525B', fontWeight: 500 }}>USDT</span>
      </td>
      {/* Start Date */}
      <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.82rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CalendarDays size={12} color="#52525B" />
          {new Date(stake.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
        </div>
      </td>
      {/* Daily Dividend */}
      <td style={{ padding: '14px 16px' }}>
        <div>
          <div style={{ color: MINT, fontWeight: 700, fontSize: '0.88rem', fontVariantNumeric: 'tabular-nums' }}>
            +{Number(stake.dailyDividend).toFixed(4)} USDT
          </div>
          <div style={{ color: '#3F4A5A', fontSize: '0.7rem', marginTop: 2 }}>
            ≈ {earned} earned
          </div>
        </div>
      </td>
      {/* Status */}
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: MINT, flexShrink: 0 }}
          />
          <span style={{
            background: 'rgba(0,229,168,0.06)',
            border: '1px solid rgba(0,229,168,0.2)',
            color: MINT,
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: 99,
            padding: '3px 10px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {stake.status}
          </span>
        </div>
      </td>
    </motion.tr>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export const StakingActive = () => {
  const { authFetch }     = useWallet();
  const [stakes,         setStakes]         = useState([]);
  const [summary,        setSummary]        = useState(null);
  const [cms,            setCms]            = useState(null);
  const [stakeAmount,    setStakeAmount]    = useState('');
  const [actionLoading,  setActionLoading]  = useState(false);
  const [txState,        setTxState]        = useState(null);
  const [txMsg,          setTxMsg]          = useState('');
  const [focused,        setFocused]        = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [r1, r2] = await Promise.all([
        authFetch('http://localhost:5000/api/staking/stakes'),
        authFetch('http://localhost:5000/api/dashboard/summary'),
      ]);
      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
      setStakes(d1.stakes || []);
      setSummary(d2.summary);
      setCms(d2.cms);
    } catch (e) { console.error(e); }
  }, [authFetch]);

  useEffect(() => { loadData(); }, []);

  const handleStake = async () => {
    if (!stakeAmount || Number(stakeAmount) <= 0) return;
    setActionLoading(true);
    setTxState(null);
    try {
      const res  = await authFetch('http://localhost:5000/api/staking/stake', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(stakeAmount) }),
      });
      const data = await res.json();
      if (res.ok) {
        setTxState('success');
        setTxMsg(`${Number(stakeAmount).toFixed(2)} USDT staked successfully! Dividends begin accruing immediately.`);
        setStakeAmount('');
        setTimeout(() => { setTxState(null); loadData(); }, 3500);
      } else {
        setTxState('error');
        setTxMsg(data.message || 'Staking transaction failed.');
        setTimeout(() => setTxState(null), 3000);
      }
    } catch (e) {
      setTxState('error');
      setTxMsg(e.message);
      setTimeout(() => setTxState(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  /* Derived stats */
  const totalStaked   = summary?.totalStaked ?? 0;
  const dailyRoi      = cms?.stakingRoiPercent ?? 0.5;
  const activeCount   = stakes.filter(s => s.status === 'active').length;
  const totalDailyDiv = stakes.reduce((a, s) => a + (Number(s.dailyDividend) || 0), 0);
  const walletBal     = summary?.usdtBalance ?? 0;
  const minStake      = cms?.minStakeAmount ?? 100;
  const inputAmt      = Number(stakeAmount) || 0;
  const underMin      = inputAmt > 0 && inputAmt < minStake;
  const overBal       = inputAmt > walletBal && inputAmt > 0;
  const canStake      = inputAmt >= minStake && !overBal && !actionLoading;

  /* Loading */
  if (!summary) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40, fontFamily: FONT }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: GOLD }}
      />
      Loading staking console…
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0  }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{
        minHeight: '100%',
        background: 'radial-gradient(circle at top center, rgba(17,24,39,0.55) 0%, rgba(11,15,25,0.35) 40%, transparent 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        fontFamily: FONT,
      }}
    >

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1,  x: 0   }}
        transition={{ duration: 0.5, ease: LUXURY_EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.05))',
            border: '1px solid rgba(212,160,23,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Active Stakes
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Stake USDT to mint rewards and accrue daily dividends.&nbsp;
          <span style={{ color: MINT, fontWeight: 600 }}>{dailyRoi}% daily ROI</span> on all active positions.
        </p>
      </motion.div>

      {/* ── 4 Stat widgets ── */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid-cols-4"
        style={{ gap: 16 }}
      >
        <motion.div variants={cardVariants}>
          <StatCard icon={Coins}     label="Total Staked"    value={totalStaked}   prefix="$" suffix=" USDT" color={GOLD} />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard icon={BarChart3} label="Active Stakes"   value={activeCount}   suffix=" Positions" decimals={0} color={GOLD} />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard icon={TrendingUp} label="Daily ROI"      value={dailyRoi}      suffix="%" decimals={2} color={MINT} />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard icon={Clock}     label="Next Dividend"   value={24}            suffix=" Hours" decimals={0} color={GOLD_LIGHT} />
        </motion.div>
      </motion.div>

      {/* ── Daily earnings summary ── */}
      {totalDailyDiv > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: EASE }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            background: 'rgba(0,229,168,0.05)',
            border: '1px solid rgba(0,229,168,0.15)',
            borderRadius: 12, padding: '12px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={15} color={MINT} />
            <span style={{ fontSize: '0.83rem', color: '#64748B' }}>Total portfolio daily earnings</span>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: MINT, fontVariantNumeric: 'tabular-nums' }}>
            +{totalDailyDiv.toFixed(4)} USDT / day
          </span>
        </motion.div>
      )}

      {/* ── Lower 2-column grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1,  y: 0   }}
        transition={{ delay: 0.25, duration: 0.5, ease: LUXURY_EASE }}
        className="staking-active-grid"
      >

        {/* ── Stake Form ── */}
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 26 }}>
          {/* Panel title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
            <Sparkles size={16} color={GOLD} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: GOLD_LIGHT, letterSpacing: '-0.01em' }}>
              Stake Assets
            </h3>
          </div>

          {/* USDT balance pill */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.1)',
            borderRadius: 10, padding: '9px 14px', marginBottom: 18,
          }}>
            <span style={{ fontSize: '0.72rem', color: '#52525B', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Available
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: GOLD, fontVariantNumeric: 'tabular-nums' }}>
              {walletBal.toFixed(2)} USDT
            </span>
          </div>

          {/* Input label */}
          <label style={{
            display: 'block', fontSize: '0.68rem', color: '#64748B',
            textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 10,
          }}>
            Stake Amount (USDT)
          </label>

          {/* Input cell */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(5,5,5,0.6)',
            border: `1px solid ${focused ? 'rgba(244,208,111,0.5)' : overBal ? 'rgba(248,113,113,0.4)' : 'rgba(212,160,23,0.15)'}`,
            borderRadius: 12,
            boxShadow: focused ? '0 0 15px rgba(244,208,111,0.12)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            overflow: 'hidden',
            marginBottom: 10,
          }}>
            <span style={{ padding: '0 13px', fontSize: '0.88rem', color: '#52525B', fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.06)', userSelect: 'none' }}>
              USDT
            </span>
            <input
              type="number" min="0"
              placeholder={`Min ${minStake} USDT`}
              value={stakeAmount}
              onChange={e => setStakeAmount(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#FFFFFF', fontSize: '1rem', fontWeight: 700,
                padding: '13px 12px', fontFamily: FONT, fontVariantNumeric: 'tabular-nums',
                '::placeholder': { color: 'rgba(255,255,255,0.2)' },
              }}
            />
            <motion.button
              onClick={() => setStakeAmount(String(walletBal))}
              whileHover={{ color: GOLD_LIGHT }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent', border: 'none', color: '#94A3B8',
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                padding: '0 14px', cursor: 'pointer', fontFamily: FONT,
                borderLeft: '1px solid rgba(255,255,255,0.06)', minHeight: 46,
                transition: 'color 0.2s',
              }}
            >
              MAX
            </motion.button>
          </div>

          {/* Validation messages */}
          <AnimatePresence>
            {(underMin || overBal) && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, color: '#F87171', fontSize: '0.76rem' }}
              >
                <AlertCircle size={12} />
                {underMin ? `Minimum stake is ${minStake} USDT` : `Exceeds wallet balance (${walletBal.toFixed(2)} USDT)`}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Projected daily earnings preview */}
          <AnimatePresence>
            {inputAmt >= minStake && !overBal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{
                  background: 'rgba(0,229,168,0.05)', border: '1px solid rgba(0,229,168,0.12)',
                  borderRadius: 10, padding: '10px 14px', marginBottom: 16, overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.73rem', color: '#64748B' }}>Projected daily return</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: MINT, fontVariantNumeric: 'tabular-nums' }}>
                    +{(inputAmt * dailyRoi / 100).toFixed(4)} USDT/day
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm Stake CTA */}
          <motion.button
            onClick={handleStake}
            disabled={!canStake}
            whileHover={canStake ? { y: -2, boxShadow: '0 0 25px rgba(212,160,23,0.45), 0 8px 24px rgba(0,0,0,0.4)' } : {}}
            whileTap={canStake ? { scale: 0.97 } : {}}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              width: '100%',
              background: canStake
                ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`
                : 'rgba(255,255,255,0.06)',
              border: 'none',
              color: canStake ? OBSIDIAN : '#52525B',
              fontFamily: FONT, fontSize: '0.92rem', fontWeight: 800,
              padding: '14px', borderRadius: 12,
              cursor: canStake ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              position: 'relative', overflow: 'hidden',
            }}
          >
            {canStake && (
              <motion.div
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)', translateX: '-100%' }}
                animate={{ translateX: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'linear', repeatDelay: 1 }}
              />
            )}
            {actionLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(5,5,5,0.2)', borderTopColor: OBSIDIAN }}
                />
                Staking…
              </>
            ) : (
              <>
                <Zap size={16} />
                Confirm Stake
                <ChevronRight size={15} />
              </>
            )}
          </motion.button>

          {/* Toast */}
          <AnimatePresence>
            {txState && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{
                  marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 8, padding: '11px 14px', borderRadius: 10,
                  background: txState === 'success' ? 'rgba(0,229,168,0.07)' : 'rgba(248,113,113,0.07)',
                  border: `1px solid ${txState === 'success' ? 'rgba(0,229,168,0.2)' : 'rgba(248,113,113,0.2)'}`,
                }}
              >
                {txState === 'success'
                  ? <CheckCircle2 size={15} color={MINT}     style={{ flexShrink: 0, marginTop: 1 }} />
                  : <AlertCircle  size={15} color="#F87171"  style={{ flexShrink: 0, marginTop: 1 }} />
                }
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: txState === 'success' ? MINT : '#F87171', lineHeight: 1.5 }}>
                  {txMsg}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Min stake note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
            <Info size={12} color="#3F4A5A" />
            <span style={{ fontSize: '0.7rem', color: '#3F4A5A', lineHeight: 1.5 }}>
              Min stake: <span style={{ color: '#52525B', fontWeight: 600 }}>{minStake} USDT</span> · ROI credited daily
            </span>
          </div>
        </AntiGravityCard>

        {/* ── Active Positions Table ── */}
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 26, overflow: 'hidden' }}>
          {/* Panel title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color={GOLD} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                Active Positions List
              </h3>
            </div>
            {activeCount > 0 && (
              <span style={{
                background: 'rgba(0,229,168,0.07)', border: '1px solid rgba(0,229,168,0.2)',
                color: MINT, fontSize: '0.7rem', fontWeight: 700,
                borderRadius: 99, padding: '3px 10px',
              }}>
                {activeCount} running
              </span>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Stake ID', 'Amount', 'Start Date', 'Daily Dividend', 'Status'].map(col => (
                    <th key={col} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: '0.68rem', color: '#94A3B8',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      fontWeight: 700, fontFamily: FONT, whiteSpace: 'nowrap',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stakes.length === 0
                  ? (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState />
                      </td>
                    </tr>
                  )
                  : stakes.map((s, idx) => <StakeRow key={s.id} stake={s} idx={idx} />)
                }
              </tbody>
            </table>
          </div>
        </AntiGravityCard>
      </motion.div>
    </motion.div>
  );
};

export default StakingActive;
