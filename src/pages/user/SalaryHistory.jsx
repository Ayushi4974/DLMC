import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { Banknote } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

export const SalaryHistory = () => {
  const { authFetch } = useWallet();
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    const loadSalaries = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/dashboard/transactions');
        if (res.ok) {
          const data = await res.json();
          setSalaries(data.transactions.filter(t => t.hash.startsWith('salary-')));
        }
      } catch (e) { console.error(e); }
    };
    loadSalaries();
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
            <Banknote size={18} color={GOLD} />
          </div>
          <h2 className="dashboard-page-title">
            Salary History Ledger
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Review daily rank salaries allocated directly to your USDT balance.
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
                    {['Date Received', 'Salary Disbursed', 'Transaction Hash Reference'].map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salaries.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#3F4A5A', fontSize: '0.88rem' }}>
                        No salary payouts recorded yet.
                      </td>
                    </tr>
                  ) : (
                    salaries.map((s, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * Math.min(i, 10), duration: 0.35, ease: LUXURY_EASE }}
                        whileHover={{ backgroundColor: 'rgba(212,160,23,0.04)' }}
                        style={{ cursor: 'default', transition: 'background 0.2s' }}
                      >
                        <td style={{ color: '#64748B', fontSize: '0.82rem' }}>
                          {new Date(s.date).toLocaleString()}
                        </td>
                        <td style={{ color: GOLD_LIGHT, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          +${s.amount.toFixed(2)} USDT
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#52525B', minWidth: '150px', wordBreak: 'break-all' }}>
                          {s.hash}
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

export default SalaryHistory;
