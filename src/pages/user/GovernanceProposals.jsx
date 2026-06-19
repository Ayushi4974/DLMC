import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, CheckCircle2, XCircle, Clock } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const MINT       = '#00E5A8';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: LUXURY_EASE } },
};

export const GovernanceProposals = () => {
  const { authFetch } = useWallet();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProps = async () => {
    try {
      const res = await authFetch('http://localhost:5000/api/lpdao/proposals');
      const d = await res.json();
      setProposals(d.proposals);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadProps(); }, []);

  const handleVote = async (propId, type) => {
    setLoading(true);
    try {
      const res = await authFetch(`http://localhost:5000/api/lpdao/proposals/${propId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ voteType: type }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) loadProps();
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0  }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: FONT }}
    >
      {/* ── Page Header ── */}
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
            <Vote size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Active Proposals
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Review community proposals and commit voting weight to guide parameter adjustments.
        </p>
      </motion.div>

      {/* ── Proposals List ── */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {proposals.length === 0 ? (
          <motion.div variants={itemVariants}>
            <AntiGravityCard accent="#D4A017" depth={4} tilt={false} glow={false} style={{ padding: '32px', textAlign: 'center' }}>
              <Vote size={32} color="rgba(212,160,23,0.3)" style={{ marginBottom: 12 }} />
              <p style={{ color: '#52525B', fontSize: '0.9rem' }}>No proposals currently open for voting.</p>
            </AntiGravityCard>
          </motion.div>
        ) : (
          proposals.map((p, idx) => {
            const approveCount  = p.votes?.approve?.length || p.votesFor || 0;
            const rejectCount   = p.votes?.reject?.length || p.votesAgainst || 0;
            const total         = approveCount + rejectCount;
            const approvePct    = total > 0 ? (approveCount / total) * 100 : 0;
            const isClosed      = p.endDate ? (new Date(p.endDate) < new Date()) : (p.endDays !== undefined ? p.endDays <= 0 : false);

            return (
              <motion.div key={idx} variants={itemVariants}>
                <AntiGravityCard
                  accent={isClosed ? '#52525B' : GOLD}
                  depth={6}
                  tilt={false}
                  glow={!isClosed}
                  style={{ padding: 24, borderLeft: `3px solid ${isClosed ? 'rgba(82,82,91,0.4)' : 'rgba(212,160,23,0.5)'}` }}
                >
                  {/* Status row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', borderRadius: 99, padding: '3px 10px',
                      background: isClosed ? 'rgba(82,82,91,0.12)' : 'rgba(59,130,246,0.1)',
                      border: `1px solid ${isClosed ? 'rgba(82,82,91,0.25)' : 'rgba(59,130,246,0.25)'}`,
                      color: isClosed ? '#64748B' : '#60A5FA',
                    }}>
                      {isClosed ? 'Voting Closed' : 'Active Voting'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#52525B', fontSize: '0.78rem' }}>
                      <Clock size={12} />
                      {p.endDate ? new Date(p.endDate).toLocaleString() : (p.endDays !== undefined ? `${p.endDays} days remaining` : 'N/A')}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 8, letterSpacing: '-0.01em' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>{p.description}</p>

                  {/* Vote bars */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', height: 8, borderRadius: 99, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${approvePct}%` }}
                        transition={{ duration: 1, ease: LUXURY_EASE }}
                        style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${MINT}, ${MINT}88)` }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.76rem', color: '#64748B' }}>
                      <span style={{ color: MINT }}>✓ Approve: {approvePct.toFixed(1)}% ({approveCount})</span>
                      <span style={{ color: '#F87171' }}>✗ Reject: {(total > 0 ? 100 - approvePct : 0).toFixed(1)}% ({rejectCount})</span>
                    </div>
                  </div>

                  {/* Vote buttons */}
                  {!isClosed && (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <motion.button
                        onClick={() => handleVote(p.id, 'approve')}
                        disabled={loading}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(0,229,168,0.3)',
                          background: 'rgba(0,229,168,0.07)', color: MINT, fontWeight: 700,
                          fontFamily: FONT, fontSize: '0.85rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                      >
                        <CheckCircle2 size={14} /> Vote Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleVote(p.id, 'reject')}
                        disabled={loading}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(248,113,113,0.3)',
                          background: 'rgba(248,113,113,0.07)', color: '#F87171', fontWeight: 700,
                          fontFamily: FONT, fontSize: '0.85rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                      >
                        <XCircle size={14} /> Vote Reject
                      </motion.button>
                    </div>
                  )}
                </AntiGravityCard>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
};

export default GovernanceProposals;
