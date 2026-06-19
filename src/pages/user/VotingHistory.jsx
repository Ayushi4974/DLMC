import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle2, XCircle } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const MINT       = '#00E5A8';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

export const VotingHistory = () => {
  const { authFetch } = useWallet();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/lpdao/voting-history');
        const data = await res.json();
        setHistory(data.history);
      } catch (e) { console.error(e); }
    };
    loadHistory();
  }, []);

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
            <ClipboardList size={18} color={GOLD} />
          </div>
          <h2 className="dashboard-page-title">
            Voting History
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
          A ledger of your past governance responses and proposal positions.
        </p>
      </motion.div>

      {/* ── Table Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ delay: 0.2, duration: 0.5, ease: LUXURY_EASE }}
      >
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 0, overflow: 'hidden' }}>
          <div className="responsive-card-inner">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    {['Proposal Title', 'Your Vote', 'Date of Vote'].map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#3F4A5A', fontSize: '0.88rem' }}>
                        You have not cast any votes on proposals yet.
                      </td>
                    </tr>
                  ) : (
                    history.map((h, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * Math.min(i, 10), duration: 0.35, ease: LUXURY_EASE }}
                        whileHover={{ backgroundColor: 'rgba(212,160,23,0.04)' }}
                        style={{ cursor: 'default', transition: 'background 0.2s' }}
                      >
                        <td style={{ fontWeight: 600, fontSize: '0.88rem', minWidth: '200px', wordBreak: 'break-word' }}>
                          {h.proposal}
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
                            textTransform: 'uppercase', borderRadius: 99, padding: '3px 10px',
                            background: h.vote === 'Approve' ? 'rgba(0,229,168,0.07)' : 'rgba(248,113,113,0.07)',
                            border: `1px solid ${h.vote === 'Approve' ? 'rgba(0,229,168,0.25)' : 'rgba(248,113,113,0.25)'}`,
                            color: h.vote === 'Approve' ? MINT : '#F87171',
                          }}>
                            {h.vote === 'Approve' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                            {h.vote}
                          </span>
                        </td>
                        <td style={{ color: '#64748B', fontSize: '0.82rem' }}>
                          {new Date(h.date).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </AntiGravityCard>
      </motion.div>
    </motion.div>
  );
};

export default VotingHistory;
