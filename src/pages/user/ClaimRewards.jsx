import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

/* ─── Design tokens ─── */
const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const MINT       = '#00E5A8';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

/* ─── Stagger variants (same as Overview) ─── */
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: LUXURY_EASE },
  },
};

export const ClaimRewards = () => {
  const { authFetch } = useWallet();
  const [data, setData] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadClaims = async () => {
    try {
      const res1 = await authFetch('http://localhost:5000/api/dashboard/summary');
      const d1 = await res1.json();
      setData(d1);

      const resClaims = await authFetch('http://localhost:5000/api/dashboard/transactions');
      if (resClaims.ok) {
        const txs = await resClaims.json();
        setClaims(txs.transactions.filter(t => t.type === 'claim'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const res = await authFetch('http://localhost:5000/api/staking/claim', { method: 'POST' });
      const resData = await res.json();
      if (res.ok) {
        alert(`Successfully claimed rewards! Received Net USDT: ${resData.netClaim}`);
        loadClaims();
      } else {
        alert(resData.message);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: '#D4A017' }}
        />
        Loading Claim panel...
      </div>
    );
  }

  const { summary, cms } = data;
  const rawDividends = summary.availableDividends;
  const stabilityFee = Number((rawDividends * cms.stabilityFeePercent / 100).toFixed(4));
  const lpdaoFee = Number((rawDividends * cms.lpdaoFeePercent / 100).toFixed(4));
  const netClaim = Number((rawDividends - stabilityFee - lpdaoFee).toFixed(4));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0 }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: FONT }}
    >
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1,  x: 0 }}
        transition={{ duration: 0.5, ease: LUXURY_EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.05))',
            border: '1px solid rgba(212,160,23,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Gift size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Claim Rewards
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Withdraw staking rewards directly to your wallet with automated fee distribution.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ delay: 0.25, duration: 0.5, ease: LUXURY_EASE }}
        className="staking-active-grid"
      >
        {/* Claim Calculator */}
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: '26px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--gold-light)' }}>Withdrawal Terminal</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Claimable Amount:</span>
              <span style={{ fontWeight: '600' }}>{rawDividends.toFixed(4)} USDT</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Stability Fee (3%):</span>
              <span style={{ color: 'var(--error)' }}>-{stabilityFee.toFixed(4)} USDT</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>LPDAO Fee (2%):</span>
              <span style={{ color: 'var(--error)' }}>-{lpdaoFee.toFixed(4)} USDT</span>
            </div>
            <hr style={{ borderColor: 'rgba(212,160,23,0.1)' }} />
            <div className="flex-between">
              <span style={{ color: 'var(--gold-light)', fontWeight: '600', fontSize: '0.85rem' }}>Net Claim:</span>
              <span className="text-gold glow-text" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{netClaim.toFixed(4)} USDT</span>
            </div>
          </div>
          <motion.button
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            onClick={handleClaim}
            disabled={loading || rawDividends <= 0}
            whileHover={rawDividends > 0 ? { scale: 1.02 } : {}}
            whileTap={rawDividends > 0 ? { scale: 0.98 } : {}}
          >
            {loading ? 'Processing Claim...' : 'Claim Now'}
          </motion.button>
        </AntiGravityCard>

        {/* Claim History */}
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: '26px', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#FFFFFF' }}>Claim History Ledger</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Fee Deducted</th>
                  <th>Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>No claim transactions found.</td>
                  </tr>
                ) : (
                  claims.map((c, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * Math.min(i, 8), duration: 0.35, ease: LUXURY_EASE }}
                      whileHover={{ backgroundColor: 'rgba(212, 160, 23, 0.04)' }}
                      style={{ transition: 'background-color 0.2s ease', cursor: 'default' }}
                    >
                      <td>{new Date(c.date || c.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="text-gold" style={{ fontWeight: '600' }}>+{c.amount !== undefined && c.amount !== null ? Number(c.amount).toFixed(2) : '0.00'} USDT</td>
                      <td style={{ color: 'var(--error)' }}>-{c.fee !== undefined && c.fee !== null ? Number(c.fee).toFixed(2) : '0.00'} USDT</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{c.hash ? `${c.hash.substring(0, 16)}...` : 'N/A'}</td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AntiGravityCard>
      </motion.div>
    </motion.div>
  );
};

export default ClaimRewards;
