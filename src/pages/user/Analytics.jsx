import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';
import { useWallet } from '../../context/WalletContext';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(5,7,10,0.96)',
      border: '1px solid rgba(212,160,23,0.2)',
      borderRadius: 10, padding: '10px 16px', fontSize: '0.8rem',
    }}>
      <p style={{ color: '#F8D954', fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{Number(p.value).toFixed(2)}</strong></p>
      ))}
    </div>
  );
};

export const Analytics = () => {
  const { authFetch } = useWallet();
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    const loadCharts = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/dashboard/charts');
        const data = await res.json();
        setCharts(data);
      } catch (e) { console.error(e); }
    };
    loadCharts();
  }, [authFetch]);

  if (!charts) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40, fontFamily: FONT }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: GOLD }}
      />
      Running system analytics report...
    </div>
  );

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
            <TrendingUp size={18} color={GOLD} />
          </div>
          <h2 className="dashboard-page-title">
            Analytics & Tokenomics
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Live indices tracking supply limits, team growths, and pricing curves.
        </p>
      </motion.div>

      {/* ── Charts Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ delay: 0.2, duration: 0.5, ease: LUXURY_EASE }}
        className="grid-cols-2"
      >
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 0, height: 360, overflow: 'hidden' }}>
          <div className="responsive-card-inner" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: GOLD_LIGHT, marginBottom: 20, flexShrink: 0 }}>
              Circulating Supply: Mint vs Burn (Vertex Capital)
            </h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.mintBurn}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#52525B" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#52525B" tick={{ fontSize: 11 }} />
                  <Tooltip content={<ChartTip />} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#94A3B8' }} />
                  <Bar dataKey="mint" fill={GOLD} name="Minted Supply" radius={[4,4,0,0]} />
                  <Bar dataKey="burn" fill="#F87171" name="Burned Scarcity" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AntiGravityCard>

        <AntiGravityCard accent="#3B82F6" depth={6} tilt={false} glow={true} style={{ padding: 0, height: 360, overflow: 'hidden' }}>
          <div className="responsive-card-inner" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#93C5FD', marginBottom: 20, flexShrink: 0 }}>
              Network Downline Growth Tracking
            </h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.teamGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#52525B" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#52525B" tick={{ fontSize: 11 }} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="members" stroke={GOLD} strokeWidth={2.5} name="Active Members" dot={{ fill: GOLD, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AntiGravityCard>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
