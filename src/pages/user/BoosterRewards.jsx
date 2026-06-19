import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

/* ─── Stagger variants ─── */
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show:   {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: LUXURY_EASE },
  },
};

export const BoosterRewards = () => {
  const { authFetch } = useWallet();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadBooster = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/referrals/booster');
        const d = await res.json();
        setData(d);
      } catch (e) {
        console.error(e);
      }
    };
    loadBooster();
  }, []);

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: '#D4A017' }}
        />
        Auditing booster rewards criteria...
      </div>
    );
  }

  const { eligibility, earnings, boosterTable } = data;
  const isEligible = eligibility.activeCount >= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0 }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: FONT }}
    >
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
            <Zap size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Booster Rewards
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>Earn accelerated distributions by maintaining at least 5 active direct referrals.</p>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid-cols-3"
        style={{ gap: '16px' }}
      >
        <motion.div variants={cardVariants}>
          <AntiGravityCard
            accent={isEligible ? '#00E5A8' : '#D4A017'}
            depth={6}
            tilt={true}
            glow={true}
            style={{ padding: '20px' }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BOOSTER ELIGIBILITY</span>
            <h3 style={{ fontSize: '1.5rem', color: isEligible ? '#00E5A8' : '#FFFFFF', fontWeight: 800, marginTop: 4 }}>
              {eligibility.currentStatus}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>
              {eligibility.activeCount} / {eligibility.requiredActiveMembers} Active Directs
            </span>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BOOSTER EARNED</span>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--gold-light)', fontWeight: 800, marginTop: 4 }}>
              ${earnings.boosterIncome.toFixed(2)} USDT
            </h3>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UPLINE SHARING BONUS</span>
            <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 800, marginTop: 4 }}>
              ${earnings.uplineDistribution.toFixed(2)} USDT
            </h3>
          </AntiGravityCard>
        </motion.div>
      </motion.div>

      {/* Main Allocations Table */}
      <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#FFFFFF' }}>Booster Reward Allocations</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source Downline</th>
                <th>Accrued Reward</th>
              </tr>
            </thead>
            <tbody>
              {boosterTable.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>No booster rewards logged yet.</td>
                </tr>
              ) : (
                boosterTable.map((b, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * Math.min(idx, 8), duration: 0.35, ease: LUXURY_EASE }}
                    whileHover={{ backgroundColor: 'rgba(212, 160, 23, 0.04)' }}
                    style={{ transition: 'background-color 0.2s ease', cursor: 'default' }}
                  >
                    <td>{new Date(b.date).toLocaleDateString()}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{b.sourceUser}</td>
                    <td className="text-gold" style={{ fontWeight: '700' }}>
                      {b.rewardAmount > 0 ? `+$${b.rewardAmount.toFixed(2)} USDT` : "$0.00 USDT (Pending Unlocks)"}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AntiGravityCard>
    </motion.div>
  );
};

export default BoosterRewards;
