import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
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

export const LPDAOMembership = () => {
  const { authFetch, refreshProfile } = useWallet();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const res = await authFetch('http://localhost:5000/api/lpdao/membership');
      const d = await res.json();
      setData(d);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await authFetch('http://localhost:5000/api/lpdao/membership', { method: 'POST' });
      const resData = await res.json();
      alert(resData.message);
      if (res.ok) {
        loadData();
        refreshProfile();
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
        Loading LPDAO status...
      </div>
    );
  }

  const isMember = data.status === 'member';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0 }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: FONT }}
    >
      <motion.div
        style={{ textAlign: 'center' }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1,  y: 0 }}
        transition={{ duration: 0.5, ease: LUXURY_EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.05))',
            border: '1px solid rgba(212,160,23,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            LPDAO Membership
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>Claim ownership stake in system fees and vote on development metrics.</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid-cols-2"
        style={{ gap: '16px' }}
      >
        <motion.div variants={cardVariants}>
          <AntiGravityCard
            accent={isMember ? '#00E5A8' : '#D4A017'}
            depth={6}
            tilt={true}
            glow={true}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '20px' }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>MEMBERSHIP STATUS</span>
            <h3 style={{ fontSize: '1.5rem', color: isMember ? 'var(--success)' : 'var(--warning)', fontWeight: 800 }}>
              {isMember ? 'Active Governance Member' : 'Not Registered'}
            </h3>
            {isMember && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Joined on {data.joiningDate}</span>
            )}
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>LPDAO REWARDS GENERATED</span>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--gold-light)', fontWeight: 800 }}>${Number(data.totalRewards).toFixed(2)} USDT</h3>
          </AntiGravityCard>
        </motion.div>
      </motion.div>

      {/* Holder privileges card */}
      <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', color: '#FFFFFF' }}>
          LPDAO Holder Privileges
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', padding: 0 }}>
          {data.benefits.map((b, i) => (
            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.95rem' }}>
              <CheckCircle2 size={16} className="text-gold" />
              <span style={{ color: 'var(--text-secondary)' }}>{b}</span>
            </li>
          ))}
        </ul>

        {!isMember ? (
          <motion.button
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
            onClick={handleJoin}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Registering membership...' : 'Become LPDAO Member (Costs 100 USDT)'}
          </motion.button>
        ) : (
          <div className="badge badge-success" style={{ width: '100%', display: 'block', textAlign: 'center', padding: '12px', background: 'rgba(0,229,168,0.06)', border: '1px solid rgba(0,229,168,0.2)', color: '#00E5A8', fontWeight: 700 }}>
            You have unlocked all governance rights.
          </div>
        )}
      </AntiGravityCard>
    </motion.div>
  );
};

export default LPDAOMembership;
