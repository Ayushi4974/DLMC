/**
 * BuyVertexCapital — Ultra-Premium Luxury Obsidian & Gold Purchase Interface
 *
 * Design spec:
 *  - Radial gradient backdrop: #111827 → #0B0F19 → #050505
 *  - Glassmorphic card with gold glow border
 *  - Animated counter for token value / wallet balance
 *  - Inline MAX button, focus glow on input
 *  - Tokenomics breakdown with color-coded rows
 *  - Vertex Capital Received highlight block in Champagne Gold
 *  - Ghost Approve + gradient Buy CTA buttons
 *  - Anti-gravity lift via Framer Motion
 *  - Gold confetti burst on successful purchase
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ShoppingCart, Zap, CheckCircle2,
  AlertCircle, Info, TrendingUp, Sparkles, ChevronRight,
  Coins, BarChart3
} from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

/* ─── Design tokens ─── */
const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const GOLD_DARK  = '#8B5E00';
const MINT       = '#00E5A8';
const OBSIDIAN   = '#050505';
const SURFACE    = '#0B0F19';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";
const EASE       = LUXURY_EASE;

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
      shapes: ['circle', 'square'],
      scalar: 0.9,
    });
    setTimeout(() => confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.3, y: 0.65 },
      colors,
    }), 150);
    setTimeout(() => confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.7, y: 0.65 },
      colors,
    }), 250);
  } catch {
    /* canvas-confetti optional — silently skip if not installed */
  }
};

/* ─── Animated number display ─── */
const AnimNum = ({ value, prefix = '', suffix = '', decimals = 4, color = '#FFFFFF', size = '1rem' }) => {
  const [display, setDisplay] = useState(0);
  const rafRef  = useRef(null);
  const startRef = useRef(null);
  const target = parseFloat(value) || 0;

  useEffect(() => {
    startRef.current = null;
    cancelAnimationFrame(rafRef.current);
    const from = display;
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / 700, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * e);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return (
    <span style={{ color, fontSize: size, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', fontFamily: FONT }}>
      {prefix}{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
};

/* ─── Info row in breakdown panel ─── */
const InfoRow = ({ label, value, valueColor = '#F8FAFC', bold = false, large = false, showDivider = true }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    gap: 12,
    padding: '10px 0',
    borderBottom: showDivider ? '1px solid rgba(255, 255, 255, 0.04)' : 'none'
  }}>
    <span style={{ fontSize: large ? '0.9rem' : '0.82rem', color: '#9CA3AF', fontWeight: bold ? 700 : 500 }}>
      {label}
    </span>
    <span style={{
      fontSize: large ? '1rem' : '0.88rem',
      color: valueColor,
      fontWeight: bold ? 800 : 600,
      fontVariantNumeric: 'tabular-nums',
      fontFamily: FONT,
    }}>
      {value}
    </span>
  </div>
);


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
      border: `1px solid ${active ? GOLD : 'rgba(255, 255, 255, 0.12)'}`,
      background: active ? 'rgba(212, 160, 23, 0.15)' : 'rgba(22, 27, 34, 0.5)',
      color: active ? GOLD : '#E5E7EB',
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

/* ════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════ */
export const BuyVertexCapital = () => {
  const { authFetch }   = useWallet();
  const [usdtInput, setUsdtInput] = useState('');
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [txState,   setTxState]   = useState(null); // null | 'approving' | 'success' | 'error'
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

  const handleBuy = async () => {
    if (!usdtInput || Number(usdtInput) <= 0) return;
    setLoading(true);
    setTxState(null);
    try {
      const res     = await authFetch('http://localhost:5000/api/staking/buy-token', {
        method: 'POST',
        body: JSON.stringify({ usdtAmount: Number(usdtInput) }),
      });
      const resData = await res.json();
      if (res.ok) {
        setTxState('success');
        setTxMsg(`${resData.dlmcReceived?.toFixed(4) ?? estimatedDlmc.toFixed(4)} Vertex Capital minted to your wallet!`);
        setUsdtInput('');
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

  /* ── Loading state ── */
  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40, fontFamily: FONT }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid rgba(212,160,23,0.15)`, borderTopColor: GOLD }}
      />
      Loading purchase metrics…
    </div>
  );

  const { summary, cms } = data;
  const currentPrice  = cms.tokenPrice;
  const futurePrice   = currentPrice * 1.15;
  const inputAmt      = Number(usdtInput) || 0;
  const devFee        = parseFloat((inputAmt * (cms.buyFeePercent || 5) / 100).toFixed(4));
  const netAmount     = parseFloat((inputAmt - devFee).toFixed(4));
  const estimatedDlmc = parseFloat((netAmount / currentPrice).toFixed(4));
  const walletBal     = Number(summary.usdtBalance);
  const overBudget    = inputAmt > walletBal && inputAmt > 0;
  const canBuy        = inputAmt > 0 && !overBudget && !loading;

  return (
    <div style={{
      /* Radial gradient backdrop */
      minHeight: '100%',
      background: 'radial-gradient(circle at top center, rgba(17,24,39,0.6) 0%, rgba(11,15,25,0.4) 40%, transparent 100%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      maxWidth: '100%',
      fontFamily: FONT,
    }}>

      {/* ── Page title ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.05))`,
            border: `1px solid rgba(212,160,23,0.25)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingCart size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Buy Vertex Capital Token
          </h2>
        </div>
        <div style={{
          background: 'rgba(212, 160, 23, 0.04)',
          border: '1px solid rgba(212, 160, 23, 0.15)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginTop: '12px',
          maxWidth: '100%',
        }}>
          <p style={{ color: '#F8FAFC', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
            Mint utility Vertex Capital tokens using USDT. The token price will <strong style={{ color: '#00E5A8' }}>increase 15%</strong> following each completed purchase cycle.
          </p>
        </div>
      </motion.div>      {/* ── Top Stats Grid ── */}
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
            <div style={{ fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
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
              <AnimNum value={currentPrice} prefix="$" suffix=" USDT" decimals={4} color={GOLD} size="1.6rem" />
            </div>
          </div>
        </AntiGravityCard>

        {/* Available Wallet Card */}
        <AntiGravityCard accent="#FFFFFF" depth={8} tilt={true} glow={true}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '22px 20px' }}>
            <div style={{ fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Available Wallet
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Wallet size={14} color="#FFF" style={{ opacity: 0.8 }} />
              </div>
              <AnimNum value={walletBal} suffix=" USDT" decimals={2} color="#FFFFFF" size="1.6rem" />
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
        {/* Left Card: Purchase Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        >
          <AntiGravityCard accent={GOLD} depth={8} tilt={false} glow={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 28px' }}>
              
              {/* Title Section */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={16} color={GOLD} />
                  Initiate Purchase Order
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4, marginBottom: 0 }}>
                  Enter the amount of USDT you wish to exchange for utility Vertex Capital tokens.
                </p>
              </div>

              {/* Purchase input */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  color: '#A1A1AA',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  marginBottom: 10,
                  paddingLeft: '4px'
                }}>
                  Purchase Amount (USDT)
                </label>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(5,5,5,0.6)',
                  border: `1px solid ${focused ? GOLD : overBudget ? 'rgba(248,113,113,0.4)' : 'rgba(212,160,23,0.15)'}`,
                  borderRadius: '99px',
                  boxShadow: focused ? '0 0 15px rgba(244,208,111,0.15)' : overBudget ? '0 0 12px rgba(248,113,113,0.08)' : 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  overflow: 'hidden',
                  padding: '4px 8px'
                }}>
                  {/* USDT prefix */}
                  <span style={{
                    padding: '0 18px',
                    fontSize: '0.9rem',
                    color: '#52525B',
                    fontWeight: 700,
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    userSelect: 'none',
                  }}>
                    USDT
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={usdtInput}
                    onChange={e => { setUsdtInput(e.target.value); setPctActive(null); }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#FFFFFF',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      padding: '12px 16px',
                      fontFamily: FONT,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  />

                  <motion.button
                    onClick={() => { setUsdtInput(String(walletBal)); setPctActive(1); }}
                    whileHover={{ color: GOLD_LIGHT }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94A3B8',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      padding: '0 20px',
                      cursor: 'pointer',
                      fontFamily: FONT,
                      borderLeft: '1px solid rgba(255,255,255,0.06)',
                      height: '100%',
                      minHeight: 44,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    MAX
                  </motion.button>
                </div>

                {/* Over budget warning */}
                <AnimatePresence>
                  {overBudget && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: '#F87171', fontSize: '0.78rem', paddingLeft: '8px' }}
                    >
                      <AlertCircle size={13} />
                      Insufficient balance. Maximum: {walletBal.toFixed(2)} USDT
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
                    onClick={() => {
                      const val = parseFloat((walletBal * pct).toFixed(2));
                      setUsdtInput(String(val));
                      setPctActive(pct);
                    }}
                  />
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: 16, width: '100%', marginTop: 8 }}>
                {/* Approve USDT — ghost button */}
                <motion.button
                  whileHover={{
                    backgroundColor: 'rgba(212,160,23,0.07)',
                    boxShadow: `0 0 18px rgba(212,160,23,0.15)`,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: `1px solid ${GOLD}`,
                    color: GOLD,
                    fontFamily: FONT,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    padding: '12px 16px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                  }}
                >
                  <CheckCircle2 size={15} />
                  Approve
                </motion.button>

                {/* Buy Vertex Capital — gradient primary button */}
                <motion.button
                  onClick={handleBuy}
                  disabled={!canBuy}
                  whileHover={canBuy ? {
                    boxShadow: `0 0 25px rgba(212,160,23,0.45), 0 8px 24px rgba(0,0,0,0.4)`,
                    y: -2,
                  } : {}}
                  whileTap={canBuy ? { scale: 0.97 } : {}}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{
                    flex: 1.5,
                    background: canBuy
                      ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`
                      : 'transparent',
                    border: canBuy ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: canBuy ? OBSIDIAN : 'rgba(255, 255, 255, 0.25)',
                    fontFamily: FONT,
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    padding: '12px 16px',
                    borderRadius: 12,
                    cursor: canBuy ? 'pointer' : 'not-allowed',
                    letterSpacing: '0.01em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Shimmer overlay */}
                  {canBuy && (
                    <motion.div
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                        translateX: '-100%',
                      }}
                      animate={{ translateX: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
                    />
                  )}
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(5,5,5,0.2)', borderTopColor: OBSIDIAN }}
                      />
                      Minting…
                    </>
                  ) : (
                    <>
                      <Zap size={15} />
                      Buy Vertex Capital
                      <ChevronRight size={14} />
                    </>
                  )}
                </motion.button>
              </div>

            </div>
          </AntiGravityCard>
        </motion.div>

        {/* Right Card: Purchase Allocation Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        >
          <AntiGravityCard accent={GOLD} depth={8} tilt={false} glow={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '24px 28px' }}>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart3 size={16} color={GOLD} />
                  Purchase Allocation Summary
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4, marginBottom: 0 }}>
                  Review system fees, token price inflation adjustments, and net allocations.
                </p>
              </div>

              {/* Tokenomics breakdown */}
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 14,
                padding: '8px 18px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <InfoRow
                  label={`5% System Development Fee`}
                  value={`${devFee.toFixed(4)} USDT`}
                  valueColor="#F8FAFC"
                  showDivider={true}
                />
                <InfoRow
                  label="15% Appreciated Future Price"
                  value={`$${futurePrice.toFixed(4)} USDT`}
                  valueColor={MINT}
                  showDivider={true}
                />
                <InfoRow
                  label="Net Asset Allocation"
                  value={`${netAmount.toFixed(4)} USDT`}
                  valueColor="#94A3B8"
                  showDivider={false}
                />
              </div>

              {/* Net Vertex Capital Received highlight block */}
              <div style={{
                background: 'rgba(224, 160, 30, 0.08)',
                border: '1px solid rgba(224, 160, 30, 0.25)',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
                textShadow: '0 0 10px rgba(244,208,111,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Sparkles size={14} color={GOLD_LIGHT} />
                    <span style={{ fontSize: '0.85rem', color: GOLD_LIGHT, fontWeight: 700, textShadow: '0 0 8px rgba(244,208,111,0.2)' }}>
                      Estimated Vertex Capital Received
                    </span>
                  </div>
                  <motion.span
                    key={estimatedDlmc}
                    initial={{ scale: 0.92, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: GOLD_LIGHT,
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em',
                      textShadow: `0 0 14px rgba(244,208,111,0.5)`,
                      fontFamily: FONT,
                    }}
                  >
                    {estimatedDlmc.toFixed(4)} Vertex Capital
                  </motion.span>
                </div>
              </div>

              {/* Transaction state toast */}
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
                      : <AlertCircle  size={16} color="#F87171" />
                    }
                    <span style={{
                      fontSize: '0.83rem',
                      fontWeight: 600,
                      color: txState === 'success' ? MINT : '#F87171',
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          padding: '14px 18px',
          borderRadius: 12,
          background: 'rgba(212,160,23,0.04)',
          border: '1px solid rgba(212,160,23,0.1)',
        }}
      >
        <Info size={15} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
          Purchases mint new Vertex Capital tokens at the current contract price. A&nbsp;
          <span style={{ color: '#F8FAFC', fontWeight: 600 }}>5% system development fee</span> is deducted before calculation.
          The token price will increase by&nbsp;
          <span style={{ color: MINT, fontWeight: 600 }}>15% to ${futurePrice.toFixed(4)} USDT</span> following your transaction.
        </p>
      </motion.div>
    </div>
  );
};

export default BuyVertexCapital;
