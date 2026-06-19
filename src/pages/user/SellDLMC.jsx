/**
 * SellDLMC — Ultra-Premium Luxury Obsidian & Gold Sell Interface
 *
 * Design system highlights:
 *  - 3D Elevated card shadow layout
 *  - Lighter gray contrasting labels (#A1A1AA)
 *  - Fully rounded "pill" inputs with focus highlights
 *  - 3-column horizontal breakdown metrics grid
 *  - Sleek Quota visual indicator
 *  - Stakeholder timeline illusion for future growth
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown, Flame, AlertCircle, CheckCircle2,
  ChevronRight, Info, Zap, BarChart3, Coins, Clock, Layers
} from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

/* ─── Design tokens ─── */
const GOLD        = '#D4A017';
const GOLD_LIGHT  = '#F4D06F';
const BURN_RED    = '#F87171';
const MINT        = '#00E5A8';
const OBSIDIAN    = '#050505';
const FONT        = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";
const EASE        = LUXURY_EASE;

/* ─── Gold confetti burst ─── */
const fireConfetti = async () => {
  try {
    const confetti = (await import('canvas-confetti')).default;
    const colors   = ['#F4D06F', '#D4A017', '#8B5E00', '#FBE89A', '#FFFFFF'];
    confetti({
      particleCount: 80,
      angle: 90,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors,
    });
  } catch {
    // silently skip if not installed
  }
};

/* ─── Animated number display ─── */
const AnimNum = ({ value, prefix = '', suffix = '', decimals = 4, color = '#FFF', size = '1rem' }) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const target = parseFloat(value) || 0;

  useEffect(() => {
    startRef.current = null;
    cancelAnimationFrame(rafRef.current);
    const from = display;
    const run = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / 700, 1);
      setDisplay(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) rafRef.current = requestAnimationFrame(run);
    };
    rafRef.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return (
    <span style={{ color, fontSize: size, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', fontFamily: FONT }}>
      {prefix}{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
};

/* ─── Quota Progress Indicator ─── */
const QuotaIndicator = ({ used, max }) => {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  const color = pct > 80 ? BURN_RED : pct > 50 ? GOLD : MINT;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
          Daily Quota Limit
        </span>
        <span style={{ fontSize: '0.8rem', color, fontWeight: 700 }}>
          {used.toLocaleString()} / {max.toLocaleString()} DLMC
        </span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ 
            height: '100%', 
            borderRadius: 99, 
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 10px ${color}55`
          }}
        />
      </div>
    </div>
  );
};

/* ─── Preset Percentage Selector ─── */
const PctBtn = ({ label, active, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    style={{
      flex: 1,
      padding: '10px 8px',
      borderRadius: '99px',
      border: `1px solid ${active ? BURN_RED : 'rgba(255, 255, 255, 0.12)'}`,
      background: active ? 'rgba(248, 113, 113, 0.15)' : 'rgba(22, 27, 34, 0.5)',
      color: active ? BURN_RED : '#E5E7EB',
      fontSize: '0.8rem',
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: FONT,
      letterSpacing: '0.03em',
      transition: 'all 0.2s ease',
    }}
  >
    {label}
  </motion.button>
);

export const SellDLMC = () => {
  const { authFetch } = useWallet();
  const [dlmcInput, setDlmcInput] = useState('');
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [txState,   setTxState]   = useState(null); // null | 'success' | 'error'
  const [txMsg,     setTxMsg]     = useState('');
  const [focused,   setFocused]   = useState(false);
  const [pctActive, setPctActive] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const res = await authFetch('http://localhost:5000/api/dashboard/summary');
      setData(await res.json());
    } catch (e) { console.error(e); }
  }, [authFetch]);

  useEffect(() => { loadData(); }, []);

  const handleSell = async () => {
    if (!dlmcInput || Number(dlmcInput) <= 0) return;
    setLoading(true);
    setTxState(null);
    try {
      const res     = await authFetch('http://localhost:5000/api/staking/sell-token', {
        method: 'POST',
        body: JSON.stringify({ dlmcAmount: Number(dlmcInput) }),
      });
      const resData = await res.json();
      if (res.ok) {
        setTxState('success');
        setTxMsg(`${Number(dlmcInput).toFixed(4)} DLMC burned → ${resData.netUsdt?.toFixed(4) ?? netUsdt.toFixed(4)} USDT credited!`);
        setDlmcInput(''); setPctActive(null);
        fireConfetti();
        setTimeout(() => { setTxState(null); loadData(); }, 3500);
      } else {
        setTxState('error');
        setTxMsg(resData.message || 'Transaction failed.');
        setTimeout(() => setTxState(null), 3000);
      }
    } catch (e) {
      setTxState('error');
      setTxMsg(e.message);
      setTimeout(() => setTxState(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40, fontFamily: FONT }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: GOLD }}
      />
      Loading exchange ratios…
    </div>
  );

  const { summary, cms } = data;
  const currentPrice  = cms.tokenPrice;
  const postSellPrice = currentPrice * 0.9;
  const dlmcBal       = Number(summary.dlmcBalance);
  const inputAmt      = Number(dlmcInput) || 0;
  const grossUsdt     = parseFloat((inputAmt * currentPrice).toFixed(4));
  const burnFee       = parseFloat((grossUsdt * (cms.sellFeePercent || 10) / 100).toFixed(4));
  const netUsdt       = parseFloat((grossUsdt - burnFee).toFixed(4));
  const maxSellLimit  = 5000;
  const usedQuota     = 0;
  const overBalance   = inputAmt > dlmcBal && inputAmt > 0;
  const overQuota     = inputAmt > maxSellLimit && inputAmt > 0;
  const canSell       = inputAmt > 0 && !overBalance && !overQuota && !loading;

  const applyPct = (pct) => {
    const val = parseFloat((dlmcBal * pct).toFixed(4));
    setDlmcInput(String(val));
    setPctActive(pct);
  };

  return (
    <div style={{
      minHeight: '100%',
      background: 'radial-gradient(circle at top center, rgba(17,24,39,0.5) 0%, rgba(11,15,25,0.3) 40%, transparent 100%)',
      display: 'flex', flexDirection: 'column', gap: 30,
      maxWidth: '100%', fontFamily: FONT,
    }}>

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1,  y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(248,113,113,0.18), rgba(248,113,113,0.05))',
            border: '1px solid rgba(248,113,113,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingDown size={18} color={BURN_RED} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Sell DLMC Token
          </h2>
        </div>
        
        {/* Warning Banner styled alert box */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.07)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginTop: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
        }}>
          <p style={{ color: '#F8FAFC', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
            Redeem DLMC tokens for USDT. Sold supply is <strong style={{ color: '#FCA5A5' }}>permanently burned</strong> from circulation. The token price will <strong style={{ color: '#FDE047' }}>drop 10%</strong> after each sell transaction.
          </p>
        </div>
      </motion.div>

      {/* ── Top Stats Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1,  y: 0 }}
        transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Token Value Card */}
        <AntiGravityCard accent={GOLD} depth={8} tilt={true} glow={true}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '22px 20px' }}>
            <div style={{ fontSize: '0.75rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Token Value
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(212,160,23,0.08)',
                border: '1px solid rgba(212,160,23,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Coins size={14} color={GOLD} />
              </div>
              <AnimNum value={currentPrice} prefix="$" suffix=" USDT" decimals={4} color={GOLD_LIGHT} size="1.6rem" />
            </div>
          </div>
        </AntiGravityCard>

        {/* DLMC Balance Card */}
        <AntiGravityCard accent="#FFFFFF" depth={8} tilt={true} glow={true}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '22px 20px' }}>
            <div style={{ fontSize: '0.75rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              DLMC Balance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Layers size={14} color="#FFF" style={{ opacity: 0.8 }} />
              </div>
              <AnimNum value={dlmcBal} suffix=" DLMC" decimals={4} color="#FFFFFF" size="1.6rem" />
            </div>
          </div>
        </AntiGravityCard>
      </motion.div>

      {/* ── Interactive Workspace Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Left Card: Sell Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        >
          <AntiGravityCard accent={GOLD} depth={8} tilt={false} glow={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 28px' }}>
              
              {/* Title Section inside the card for visual balance */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={16} color={GOLD} />
                  Initiate Sell Order
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4, marginBottom: 0 }}>
                  Enter the amount of DLMC you wish to burn and redeem for USDT.
                </p>
              </div>

              {/* Quota limit */}
              <QuotaIndicator used={usedQuota} max={maxSellLimit} />

              {/* Rounded Pill Input Box */}
              <div>
                <label style={{
                  display: 'block', fontSize: '0.72rem', color: '#A1A1AA',
                  textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 10,
                  paddingLeft: '4px'
                }}>
                  Sell Amount (DLMC)
                </label>

                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: 'rgba(5,5,5,0.85)',
                  border: `1px solid ${focused ? GOLD : overBalance || overQuota ? 'rgba(248,113,113,0.5)' : 'rgba(212,160,23,0.15)'}`,
                  borderRadius: '99px',
                  boxShadow: focused ? '0 0 20px rgba(224, 160, 30, 0.2)' : 'none',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  padding: '4px 8px'
                }}>
                  <span style={{
                    padding: '0 18px', fontSize: '0.9rem', color: '#9CA3AF',
                    fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.08)', userSelect: 'none',
                  }}>
                    DLMC
                  </span>
                  <input
                    type="number" min="0" placeholder="0.0000"
                    value={dlmcInput}
                    onChange={e => { setDlmcInput(e.target.value); setPctActive(null); }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800,
                      padding: '12px 16px', fontFamily: FONT, fontVariantNumeric: 'tabular-nums',
                    }}
                  />
                  <motion.button
                    onClick={() => { setDlmcInput(String(dlmcBal)); setPctActive(1); }}
                    whileHover={{ color: BURN_RED }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'transparent', border: 'none', color: '#A1A1AA',
                      fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
                      padding: '0 20px', cursor: 'pointer', fontFamily: FONT,
                      borderLeft: '1px solid rgba(255,255,255,0.08)',
                      height: '100%', minHeight: 44, transition: 'color 0.2s ease',
                    }}
                  >
                    MAX
                  </motion.button>
                </div>

                {/* Validation errors */}
                <AnimatePresence>
                  {(overBalance || overQuota) && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: BURN_RED, fontSize: '0.8rem', paddingLeft: '8px' }}
                    >
                      <AlertCircle size={14} />
                      {overBalance
                        ? `Insufficient balance. Max: ${dlmcBal.toFixed(4)} DLMC`
                        : `Exceeds daily limit of ${maxSellLimit.toLocaleString()} DLMC`
                      }
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Preset % quick-select pills */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[0.25, 0.5, 0.75, 1].map(pct => (
                  <PctBtn
                    key={pct}
                    label={pct === 1 ? 'MAX' : `${pct * 100}%`}
                    active={pctActive === pct}
                    onClick={() => applyPct(pct)}
                  />
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: 16, width: '100%', marginTop: 8 }}>
                {/* Approve Token — hollow layout */}
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(212,160,23,0.07)', boxShadow: `0 0 18px rgba(212,160,23,0.15)`, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    flex: 1, background: 'transparent', border: `1px solid ${GOLD}`,
                    color: GOLD, fontFamily: FONT, fontSize: '0.9rem', fontWeight: 700,
                    padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                    letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  }}
                >
                  <CheckCircle2 size={15} />
                  Approve
                </motion.button>

                {/* Sell DLMC — solid red/gold gradient */}
                <motion.button
                  onClick={handleSell}
                  disabled={!canSell}
                  whileHover={canSell ? { boxShadow: `0 0 28px rgba(248,113,113,0.35), 0 8px 24px rgba(0,0,0,0.4)`, y: -2 } : {}}
                  whileTap={canSell ? { scale: 0.97 } : {}}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{
                    flex: 1.5,
                    background: canSell
                      ? 'linear-gradient(135deg, #FCA5A5, #F87171, #B91C1C)'
                      : 'transparent',
                    border: canSell ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: canSell ? '#050505' : 'rgba(255, 255, 255, 0.25)',
                    fontFamily: FONT, fontSize: '0.9rem', fontWeight: 800,
                    padding: '12px 16px', borderRadius: '12px',
                    cursor: canSell ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Shimmer */}
                  {canSell && (
                    <motion.div
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        translateX: '-100%',
                      }}
                      animate={{ translateX: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.2 }}
                    />
                  )}
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(5,5,5,0.2)', borderTopColor: '#000' }}
                      />
                      Burn…
                    </>
                  ) : (
                    <>
                      <Flame size={15} />
                      Sell DLMC
                      <ChevronRight size={14} />
                    </>
                  )}
                </motion.button>
              </div>

            </div>
          </AntiGravityCard>
        </motion.div>

        {/* Right Card: Order Summary & Output Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        >
          <AntiGravityCard accent={BURN_RED} depth={8} tilt={false} glow={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '24px 28px' }}>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart3 size={16} color={BURN_RED} />
                  Burn Transaction Summary
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4, marginBottom: 0 }}>
                  Real-time exchange ratios, burn deductions, and dynamic pricing changes.
                </p>
              </div>

              {/* breakdown columns restructured as structured rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Gross Value */}
                <div style={{
                  background: 'rgba(22, 27, 34, 0.4)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#A1A1AA', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Gross Value
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC', fontVariantNumeric: 'tabular-nums', fontFamily: FONT }}>
                      ${grossUsdt.toFixed(4)}
                    </span>
                    <Coins size={14} color={GOLD} style={{ opacity: 0.7 }} />
                  </div>
                </div>

                {/* Burn Fee */}
                <div style={{
                  background: 'rgba(22, 27, 34, 0.4)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#A1A1AA', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Burn Fee ({cms.sellFeePercent || 10}%)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: BURN_RED, fontVariantNumeric: 'tabular-nums', fontFamily: FONT }}>
                      -${burnFee.toFixed(4)}
                    </span>
                    <Flame size={14} color={BURN_RED} style={{ opacity: 0.7 }} />
                  </div>
                </div>

                {/* Next Price */}
                <div style={{
                  background: 'rgba(22, 27, 34, 0.4)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#A1A1AA', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Post-Sell Price
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: BURN_RED, fontVariantNumeric: 'tabular-nums', fontFamily: FONT }}>
                      ${postSellPrice.toFixed(4)}
                    </span>
                    <TrendingDown size={14} color={BURN_RED} style={{ opacity: 0.7 }} />
                  </div>
                </div>
              </div>

              {/* Net USDT Received POP Highlight Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(224, 160, 30, 0.12) 0%, rgba(224, 160, 30, 0.04) 100%)',
                border: '1px solid rgba(224, 160, 30, 0.35)',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(224, 160, 30, 0.06), inset 0 1px 1px rgba(255,255,255,0.05)',
                textShadow: '0 0 10px rgba(244,208,111,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: GOLD_LIGHT, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Net USDT Received
                  </span>
                  <motion.span
                    key={netUsdt}
                    initial={{ scale: 0.9, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      fontSize: '1.6rem', fontWeight: 800, color: GOLD_LIGHT,
                      fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
                      textShadow: '0 0 16px rgba(244,208,111,0.5)',
                      fontFamily: FONT,
                    }}
                  >
                    {netUsdt.toFixed(4)} USDT
                  </motion.span>
                </div>
              </div>

              {/* Transaction state toast inline */}
              <AnimatePresence>
                {txState && (
                  <motion.div
                    key="toast"
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: txState === 'success'
                        ? 'rgba(0,229,168,0.07)'
                        : 'rgba(248,113,113,0.07)',
                      border: `1px solid ${txState === 'success' ? 'rgba(0,229,168,0.2)' : 'rgba(248,113,113,0.2)'}`,
                    }}
                  >
                    {txState === 'success'
                      ? <CheckCircle2 size={16} color={MINT} />
                      : <AlertCircle  size={16} color={BURN_RED} />
                    }
                    <span style={{
                      fontSize: '0.83rem',
                      fontWeight: 600,
                      color: txState === 'success' ? MINT : BURN_RED,
                    }}>
                      {txMsg}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </AntiGravityCard>
        </motion.div>
      </div>



      {/* ── Info notice ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '14px 18px', borderRadius: 12,
          background: 'rgba(212,160,23,0.04)',
          border: '1px solid rgba(212,160,23,0.1)',
        }}
      >
        <Info size={15} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
          Selling DLMC permanently removes tokens from the circulating supply via the&nbsp;
          <span style={{ color: '#F8FAFC', fontWeight: 600 }}>automatic burn mechanism</span>.
          A <span style={{ color: BURN_RED, fontWeight: 600 }}>{cms.sellFeePercent || 10}% liquidity/burn fee</span> is deducted before USDT is released.
          The token price will decrease by&nbsp;
          <span style={{ color: BURN_RED, fontWeight: 600 }}>10% to ${postSellPrice.toFixed(4)} USDT</span> following your transaction.
        </p>
      </motion.div>
    </div>
  );
};

export default SellDLMC;
