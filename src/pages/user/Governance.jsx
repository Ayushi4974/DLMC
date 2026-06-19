import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Vote, HelpCircle } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

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

export const Governance = () => {
  const { authFetch } = useWallet();
  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 1240,
    votingWeight: 850000,
    treasuryPool: 250000,
    activeProposals: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/lpdao/proposals');
        if (res.ok) {
          const d = await res.json();
          setProposals(d.proposals || []);
          setStats(prev => ({
            ...prev,
            activeProposals: (d.proposals || []).filter(p => p.endDate ? (new Date(p.endDate) > new Date()) : (p.endDays !== undefined ? p.endDays > 0 : false)).length
          }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0 }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
    >
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1,  x: 0 }}
        transition={{ duration: 0.5, ease: LUXURY_EASE }}
      >
        <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>LPDAO Governance Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Global statistics, guidelines, and past proposal records of community voting.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid-cols-4"
        style={{ gap: '16px' }}
      >
        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL LPDAO MEMBERS</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: 4, color: '#FFFFFF' }}>{stats.totalMembers}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>Governance participants</span>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL VOTING WEIGHT</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: 4, color: '#FFFFFF' }}>{stats.votingWeight.toLocaleString()} DLMC</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>Staked tokens weight</span>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DAO TREASURY POOL</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: 4, color: '#FFFFFF' }}>${stats.treasuryPool.toLocaleString()} USDT</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>Accumulated stability fees</span>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ACTIVE PROPOSALS</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: 4, color: '#FFFFFF' }}>{stats.activeProposals}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>Open voting windows</span>
          </AntiGravityCard>
        </motion.div>
      </motion.div>

      <div className="staking-active-grid">
        {/* Proposal Guidelines */}
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: '26px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--gold-light)' }}>Proposal Guidelines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <ShieldCheck size={18} className="text-gold" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>Eligibility to Submit:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>Must hold a D1 Rank or stake a minimum of 5,000 USDT to author a proposal.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Vote size={18} className="text-gold" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>Voting Weight:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>Your voting weight is proportional to your total staked USDT volume.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <HelpCircle size={18} className="text-gold" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>Passing Criteria:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>Proposals require a simple majority ({'>'}50% approval) to be executed by system contracts.</p>
              </div>
            </div>
          </div>
        </AntiGravityCard>

        {/* Proposals Directory */}
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: '26px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#FFFFFF' }}>Global Proposals Directory</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Proposal Title</th>
                  <th>Total Votes</th>
                  <th>End Date</th>
                  <th>Result Status</th>
                </tr>
              </thead>
              <tbody>
                {proposals.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>No governance proposals logged.</td>
                  </tr>
                ) : (
                  proposals.map((p, i) => {
                    const isClosed = p.endDate ? (new Date(p.endDate) < new Date()) : (p.endDays !== undefined ? p.endDays <= 0 : false);
                    const approveCount = p.votes?.approve?.length || p.votesFor || 0;
                    const rejectCount = p.votes?.reject?.length || p.votesAgainst || 0;
                    const passed = approveCount > rejectCount;

                    return (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * Math.min(i, 8), duration: 0.35, ease: LUXURY_EASE }}
                        whileHover={{ backgroundColor: 'rgba(212, 160, 23, 0.04)' }}
                        style={{ transition: 'background-color 0.2s ease', cursor: 'default' }}
                      >
                        <td style={{ fontWeight: '600', color: 'var(--gold-light)' }}>{p.title}</td>
                        <td>{p.totalVotes || (approveCount + rejectCount)} votes</td>
                        <td>{p.endDate ? new Date(p.endDate).toLocaleDateString() : (p.endDays !== undefined ? `${p.endDays} days left` : 'N/A')}</td>
                        <td>
                          <span className={`badge ${!isClosed ? 'badge-info' : passed ? 'badge-success' : 'badge-error'}`}>
                            {!isClosed ? 'Voting Open' : passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </AntiGravityCard>
      </div>
    </motion.div>
  );
};

export default Governance;
