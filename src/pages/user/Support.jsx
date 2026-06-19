import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { HeadphonesIcon, Send } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const MINT       = '#00E5A8';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

const inputStyle = {
  width: '100%', background: 'rgba(5,5,5,0.6)',
  border: '1px solid rgba(212,160,23,0.15)', borderRadius: 10,
  color: '#FFFFFF', fontSize: '0.88rem', fontFamily: FONT,
  padding: '11px 14px', outline: 'none', boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block', fontSize: '0.68rem', color: '#64748B',
  textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8,
};

const STATUS_COLOR = { open: '#F59E0B', replied: '#00E5A8', closed: '#52525B' };

export const Support = () => {
  const { authFetch } = useWallet();
  const [tickets, setTickets]   = useState([]);
  const [subject, setSubject]   = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);

  const loadTickets = async () => {
    try {
      const res = await authFetch('http://localhost:5000/api/support/tickets');
      const data = await res.json();
      setTickets(data.tickets);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadTickets(); }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authFetch('http://localhost:5000/api/support/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject, category, priority, message }),
      });
      if (res.ok) {
        alert('Support ticket registered successfully!');
        setSubject('');
        setMessage('');
        loadTickets();
      }
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
            <HeadphonesIcon size={18} color={GOLD} />
          </div>
          <h2 className="dashboard-page-title">
            Support Center
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Log issues and review ticket logs with our administration helpdesk.
        </p>
      </motion.div>

      {/* ── Main Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ delay: 0.2, duration: 0.5, ease: LUXURY_EASE }}
        className="staking-active-grid"
      >
        {/* Form */}
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 0 }}>
          <div className="responsive-card-inner">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: GOLD_LIGHT, marginBottom: 22 }}>
              Log Support Request
            </h3>
            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Subject</label>
                <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle} placeholder="Describe your issue..." />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                  <option>General</option>
                  <option>Deposit/Withdrawal</option>
                  <option>Staking ROI</option>
                  <option>Level Referral Commissions</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} style={inputStyle}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Message Details</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Provide full context..." />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { y: -2, boxShadow: '0 0 20px rgba(212,160,23,0.4)' } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                style={{
                  width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                  background: loading ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                  color: loading ? '#52525B' : '#050505', fontFamily: FONT, fontSize: '0.9rem',
                  fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Send size={15} />
                {loading ? 'Submitting...' : 'Create Ticket'}
              </motion.button>
            </form>
          </div>
        </AntiGravityCard>

        {/* Tickets Table */}
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 0, overflow: 'hidden' }}>
          <div className="responsive-card-inner">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>
              Active Support Tickets
            </h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    {['Ticket ID', 'Subject', 'Priority', 'Date', 'Status'].map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '28px', textAlign: 'center', color: '#3F4A5A', fontSize: '0.88rem' }}>
                        No support tickets logged.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((t, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * Math.min(idx, 8), duration: 0.35, ease: LUXURY_EASE }}
                        whileHover={{ backgroundColor: 'rgba(212,160,23,0.04)' }}
                        style={{ cursor: 'default', transition: 'background 0.2s' }}
                      >
                        <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.72rem', color: GOLD_LIGHT }}>{t.id}</td>
                        <td style={{ color: '#F8FAFC', fontSize: '0.85rem', fontWeight: 600 }}>{t.subject}</td>
                        <td style={{ color: '#94A3B8', fontSize: '0.82rem' }}>{t.priority}</td>
                        <td style={{ color: '#64748B', fontSize: '0.78rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                        <td>
                          <span style={{
                            fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.07em', borderRadius: 99, padding: '3px 9px',
                            background: `${STATUS_COLOR[t.status] || '#52525B'}18`,
                            border: `1px solid ${STATUS_COLOR[t.status] || '#52525B'}40`,
                            color: STATUS_COLOR[t.status] || '#94A3B8',
                          }}>
                            {t.status}
                          </span>
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

export default Support;
