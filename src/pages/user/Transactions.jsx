import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { Receipt } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const MINT       = '#00E5A8';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

export const Transactions = () => {
  const { authFetch } = useWallet();
  const [txs, setTxs] = useState([]);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    const loadTxs = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/dashboard/transactions');
        if (res.ok) {
          const data = await res.json();
          setTxs(data.transactions || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadTxs();
  }, []);

  const filteredTxs = tab === 'all' ? txs : txs.filter(t => t.type === tab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0 }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: FONT }}
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
            <Receipt size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Transaction Ledger
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>Review historically recorded deposit, withdrawal, purchase, and claim transactions.</p>
      </motion.div>

      <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 0 }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            {['all', 'deposit', 'withdrawal', 'buy', 'sell', 'claim'].map(t => (
              <button
                key={t}
                className="btn btn-secondary filter-tab"
                style={{
                  padding: '6px 16px',
                  fontSize: '0.85rem',
                  background: tab === t ? 'var(--gold-primary)' : 'transparent',
                  color: tab === t ? '#000000' : 'inherit',
                  borderColor: tab === t ? 'var(--gold-primary)' : 'rgba(212,160,23,0.2)',
                  flexShrink: 0
                }}
                onClick={() => setTab(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Fees Applied</th>
                  <th>Tx Hash</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>No transactions found under this category.</td>
                  </tr>
                ) : (
                  filteredTxs.map((t, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * Math.min(idx, 8), duration: 0.35, ease: LUXURY_EASE }}
                      whileHover={{ backgroundColor: 'rgba(212, 160, 23, 0.04)' }}
                      style={{ transition: 'background-color 0.2s ease', cursor: 'default' }}
                    >
                      <td>{new Date(t.date || t.createdAt || Date.now()).toLocaleString()}</td>
                      <td>
                        <span className="badge badge-info" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          {t.type}
                        </span>
                      </td>
                      <td className="text-gold" style={{ fontWeight: '700' }}>
                        {t.type === 'buy' || t.type === 'deposit' || t.type === 'claim' ? `+$${Number(t.amount || 0).toFixed(2)}` : `-$${Number(t.amount || 0).toFixed(2)}`}
                      </td>
                      <td>${Number(t.fee || 0).toFixed(2)}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{t.hash ? `${t.hash.substring(0, 20)}...` : 'N/A'}</td>
                      <td>
                        <span className="badge badge-success">{t.status || 'completed'}</span>
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
  );
};

export default Transactions;
