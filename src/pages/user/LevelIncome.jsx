import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
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

export const LevelIncome = () => {
  const { authFetch } = useWallet();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/referrals/level-income');
        const d = await res.json();
        setData(d);
      } catch (e) {
        console.error(e);
      }
    };
    loadLevels();
  }, []);

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: '#D4A017' }}
        />
        Compiling 15 levels matrix...
      </div>
    );
  }

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
            <BarChart3 size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Level Income (15 Levels)
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>Tracks multilevel commissions generated across up to 15 degrees of network depth.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid-cols-2"
        style={{ gap: '16px' }}
      >
        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL LEVEL INCOMES</span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--gold-light)', fontWeight: 800, marginTop: 4 }}>${data.totalLevelIncome.toFixed(4)} USDT</h3>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TODAY'S LEVEL ESTIMATED COMMISSIONS</span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--success)', fontWeight: 800, marginTop: 4 }}>+${data.todaysIncome.toFixed(4)} USDT</h3>
          </AntiGravityCard>
        </motion.div>
      </motion.div>

      {/* Main breakdown matrix */}
      <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#FFFFFF' }}>Downline Matrix Breakdown</h3>
        <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Team Count</th>
                <th>Business Volume (USDT)</th>
                <th>Est. Income generated</th>
              </tr>
            </thead>
            <tbody>
              {data.levelMatrix.map((item, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * Math.min(idx, 15), duration: 0.35, ease: LUXURY_EASE }}
                  whileHover={{ backgroundColor: 'rgba(212, 160, 23, 0.04)' }}
                  style={{ transition: 'background-color 0.2s ease', cursor: 'default' }}
                >
                  <td style={{ fontWeight: '700', color: '#FFFFFF' }}>Level {item.level}</td>
                  <td>{item.teamCount} members</td>
                  <td>${item.businessVolume.toFixed(2)} USDT</td>
                  <td className="text-gold" style={{ fontWeight: '700' }}>+${item.income.toFixed(4)} USDT</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </AntiGravityCard>
    </motion.div>
  );
};

export default LevelIncome;
