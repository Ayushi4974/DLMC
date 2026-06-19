import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { Download, History } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

export const DividendHistory = () => {
  const { authFetch } = useWallet();
  const [dividends, setDividends] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadDivs = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/staking/dividends');
        const d = await res.json();
        setDividends(d.dividends || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadDivs();
  }, []);

  const handleDownload = (type) => {
    alert(`Downloading dividend statement as ${type.toUpperCase()}...`);
  };

  const filteredDividends = dividends.filter(d => {
    if (filter === 'all') return true;
    const itemDate = new Date(d.date);
    const now = new Date();
    if (filter === 'today') {
      return itemDate.toDateString() === now.toDateString();
    }
    if (filter === 'weekly') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return itemDate >= sevenDaysAgo;
    }
    if (filter === 'monthly') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return itemDate >= thirtyDaysAgo;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0 }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: FONT }}
    >
      {/* ── Page Header ── */}
      <motion.div
        className="flex-between"
        style={{ flexWrap: 'wrap', gap: '16px' }}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1,  x: 0 }}
        transition={{ duration: 0.5, ease: LUXURY_EASE }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.05))',
              border: '1px solid rgba(212,160,23,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <History size={18} color={GOLD} />
            </div>
            <h2 style={{
              fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
              background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Dividend History
            </h2>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>Review daily ROI yield allocations accrued on active stakes.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <motion.button
            className="btn btn-secondary"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}
            onClick={() => handleDownload('csv')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={14} style={{ marginRight: '6px' }} /> Export CSV
          </motion.button>
          <motion.button
            className="btn btn-secondary"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}
            onClick={() => handleDownload('pdf')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={14} style={{ marginRight: '6px' }} /> Export PDF
          </motion.button>
        </div>
      </motion.div>

      {/* ── Main Data Card ── */}
      <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 0 }}>
        <div style={{ padding: '24px' }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            <span style={{ fontWeight: '700', color: 'var(--gold-light)' }}>Dividends Log</span>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '2px', maxWidth: '100%' }}>
              {['all', 'today', 'weekly', 'monthly'].map(f => (
                <button
                  key={f}
                  className="btn btn-secondary filter-tab"
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    background: filter === f ? 'var(--gold-primary)' : 'transparent',
                    color: filter === f ? '#000000' : 'inherit',
                    borderColor: filter === f ? 'var(--gold-primary)' : 'rgba(212,160,23,0.2)',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => setFilter(f)}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Stake ID</th>
                  <th>Dividend Earned</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDividends.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>No dividends earned records.</td>
                  </tr>
                ) : (
                  filteredDividends.map((d, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * Math.min(i, 8), duration: 0.35, ease: LUXURY_EASE }}
                      whileHover={{ backgroundColor: 'rgba(212, 160, 23, 0.04)' }}
                      style={{ transition: 'background-color 0.2s ease', cursor: 'default' }}
                    >
                      <td>{new Date(d.date || d.createdAt || Date.now()).toLocaleString()}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{d.stakeId || 'N/A'}</td>
                      <td className="text-gold" style={{ fontWeight: '700' }}>+{Number(d.dividendEarned || d.amount || 0).toFixed(4)} USDT</td>
                      <td>
                        <span className="badge badge-success">{d.status || 'paid'}</span>
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

export default DividendHistory;
