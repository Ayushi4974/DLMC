import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
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

export const DirectReferrals = () => {
  const { authFetch } = useWallet();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadDirects = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/referrals/directs');
        const d = await res.json();
        setData(d);
      } catch (e) {
        console.error(e);
      }
    };
    loadDirects();
  }, []);

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: '#D4A017' }}
        />
        Loading directs network...
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
            <Link2 size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Direct Referrals
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>Explore accounts registered directly using your personal code link.</p>
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
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL DIRECT SPONSORS</span>
            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 800, marginTop: 4 }}>{data.summary.totalDirects}</h3>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ACTIVE SPONSORS</span>
            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 800, marginTop: 4 }}>{data.summary.activeDirects}</h3>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>REFERRAL COMMISSIONS EARNED</span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--gold-light)', fontWeight: 800, marginTop: 4 }}>${data.summary.referralEarnings.toFixed(2)} USDT</h3>
          </AntiGravityCard>
        </motion.div>
      </motion.div>

      {/* Main Roster List */}
      <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#FFFFFF' }}>Direct Sponsors Roster</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Wallet Address</th>
                <th>Join Date</th>
                <th>Deposit Vol. (USDT)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.directs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>No direct sponsors logged yet.</td>
                </tr>
              ) : (
                data.directs.map((d, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * Math.min(i, 8), duration: 0.35, ease: LUXURY_EASE }}
                    whileHover={{ backgroundColor: 'rgba(212, 160, 23, 0.04)' }}
                    style={{ transition: 'background-color 0.2s ease', cursor: 'default' }}
                  >
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>{d.walletAddress}</td>
                    <td>{new Date(d.joinDate).toLocaleDateString()}</td>
                    <td>${Number(d.depositAmount).toFixed(2)} USDT</td>
                    <td>
                      <span className={`badge ${d.depositAmount > 0 ? 'badge-success' : 'badge-warning'}`}>
                        {d.depositAmount > 0 ? 'Active' : 'Inactive'}
                      </span>
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

export default DirectReferrals;
