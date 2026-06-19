import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Target, Star } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

/* ─── Design tokens ─── */
const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const MINT       = '#00E5A8';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

/* ─── Stagger variants (same as Overview) ─── */
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: LUXURY_EASE },
  },
};

/* ─── Animated progress bar ─── */
const ProgressBar = ({ pct, color = GOLD, delay = 0 }) => (
  <div style={{
    background: 'rgba(255,255,255,0.05)',
    height: 8, borderRadius: 99, overflow: 'hidden',
  }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 1, delay, ease: LUXURY_EASE }}
      style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
    />
  </div>
);

/* ─── Rank level row ─── */
const RankRow = ({ rank, self, leg, isCurrent, isNext, idx }) => (
  <motion.tr
    initial={{ opacity: 0, x: 12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.03 * Math.min(idx, 15), duration: 0.35, ease: LUXURY_EASE }}
    style={{
      background: isCurrent
        ? 'rgba(212,160,23,0.06)'
        : isNext
        ? 'rgba(0,229,168,0.04)'
        : 'transparent',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}
  >
    <td style={{ padding: '11px 16px' }}>
      <span style={{
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        fontSize: '0.82rem', fontWeight: 700,
        color: isCurrent ? GOLD_LIGHT : isNext ? MINT : '#64748B',
        background: isCurrent ? 'rgba(212,160,23,0.1)' : isNext ? 'rgba(0,229,168,0.08)' : 'transparent',
        border: `1px solid ${isCurrent ? 'rgba(212,160,23,0.25)' : isNext ? 'rgba(0,229,168,0.2)' : 'transparent'}`,
        borderRadius: 6, padding: '2px 8px',
      }}>
        {rank}
      </span>
      {isCurrent && (
        <span style={{
          marginLeft: 8, fontSize: '0.6rem', color: GOLD, background: 'rgba(212,160,23,0.1)',
          border: '1px solid rgba(212,160,23,0.2)', borderRadius: 99, padding: '1px 6px',
          textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
        }}>
          Current
        </span>
      )}
      {isNext && (
        <span style={{
          marginLeft: 8, fontSize: '0.6rem', color: MINT, background: 'rgba(0,229,168,0.08)',
          border: '1px solid rgba(0,229,168,0.2)', borderRadius: 99, padding: '1px 6px',
          textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
        }}>
          Next
        </span>
      )}
    </td>
    <td style={{ padding: '11px 16px', color: '#94A3B8', fontSize: '0.83rem', fontVariantNumeric: 'tabular-nums' }}>
      ${self.toLocaleString()} USDT
    </td>
    <td style={{ padding: '11px 16px', color: '#94A3B8', fontSize: '0.83rem', fontVariantNumeric: 'tabular-nums' }}>
      ${leg.toLocaleString()} USDT
    </td>
  </motion.tr>
);

const rankLevels = [
  { rank: 'D1',  self: 100,   leg: 500       },
  { rank: 'D2',  self: 250,   leg: 1500      },
  { rank: 'D3',  self: 500,   leg: 4000      },
  { rank: 'D4',  self: 1000,  leg: 10000     },
  { rank: 'D5',  self: 2000,  leg: 25000     },
  { rank: 'D6',  self: 3500,  leg: 60000     },
  { rank: 'D7',  self: 5000,  leg: 120000    },
  { rank: 'D8',  self: 7500,  leg: 250000    },
  { rank: 'D9',  self: 10000, leg: 500000    },
  { rank: 'D10', self: 15000, leg: 1000000   },
  { rank: 'D11', self: 20000, leg: 2000000   },
  { rank: 'D12', self: 25000, leg: 4000000   },
  { rank: 'D13', self: 35000, leg: 8000000   },
  { rank: 'D14', self: 45000, leg: 15000000  },
  { rank: 'D15', self: 50000, leg: 30000000  },
];

export const CurrentRank = () => {
  const { authFetch } = useWallet();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadRank = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/dashboard/summary');
        const d = await res.json();
        setData(d.summary);
      } catch (e) {
        console.error(e);
      }
    };
    loadRank();
  }, []);

  /* ── Loading ── */
  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40, fontFamily: FONT }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: GOLD }}
      />
      Loading rank progress tracker...
    </div>
  );

  const currentIdx = rankLevels.findIndex(r => r.rank === data.currentRank);
  const nextRank   = currentIdx !== -1 && currentIdx < rankLevels.length - 1
    ? rankLevels[currentIdx + 1]
    : rankLevels[0];

  const selfStakePct  = Math.min(100, (data.selfStake / nextRank.self) * 100);
  const legVolumePct  = Math.min(100, ((data.mainLegVolume + data.otherLegVolume) / nextRank.leg) * 100);

  const statCards = [
    { label: 'Current Rank',      value: data.currentRank,               icon: Award,     color: GOLD,       suffix: '' },
    { label: 'Daily Salary',      value: `$${data.dailySalary} USDT`,    icon: TrendingUp, color: MINT,      suffix: '' },
    { label: 'Next Milestone',    value: nextRank.rank,                  icon: Target,    color: GOLD_LIGHT, suffix: '' },
    { label: 'Self Stake',        value: `$${Number(data.selfStake).toFixed(2)}`, icon: Star, color: GOLD, suffix: '' },
  ];

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
            <Award size={18} color={GOLD} />
          </div>
          <h2 className="dashboard-page-title">
            Current Rank Status
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Achieve higher D1–D15 rank milestones to unlock recurring daily salaries and governance privileges.
        </p>
      </motion.div>

      {/* ── Stat Cards Grid ── */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid-cols-4"
      >
        {statCards.map((c, i) => (
          <motion.div key={i} variants={cardVariants}>
            <AntiGravityCard
              accent={c.color}
              depth={8}
              tilt={true}
              glow={true}
              style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 10, cursor: 'default' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase',
                  letterSpacing: '0.1em', fontWeight: 700,
                }}>
                  {c.label}
                </span>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <c.icon size={14} color={c.color} />
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: LUXURY_EASE }}
                style={{ fontSize: '1.6rem', fontWeight: 800, color: c.color, letterSpacing: '-0.02em' }}
              >
                {c.value}
              </motion.div>
            </AntiGravityCard>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Progress Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ delay: 0.3, duration: 0.5, ease: LUXURY_EASE }}
      >
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 0 }}>
          <div className="responsive-card-inner">
            <h3 style={{
              fontSize: '1rem', fontWeight: 700, color: GOLD_LIGHT,
              letterSpacing: '-0.01em', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Target size={16} color={GOLD} />
              Milestone Promotion Checklist → {nextRank.rank}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {/* Self Stake bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.83rem', color: '#94A3B8' }}>
                    Self Staked Volume
                  </span>
                  <span style={{ fontSize: '0.83rem', fontWeight: 700, color: GOLD_LIGHT, fontVariantNumeric: 'tabular-nums' }}>
                    ${Number(data.selfStake).toLocaleString()} / ${nextRank.self.toLocaleString()} USDT
                    <span style={{ color: '#52525B', marginLeft: 8 }}>({selfStakePct.toFixed(1)}%)</span>
                  </span>
                </div>
                <ProgressBar pct={selfStakePct} color={GOLD} delay={0.4} />
              </div>

              {/* Leg Volume bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.83rem', color: '#94A3B8' }}>
                    Network Leg Volume (Left + Right)
                  </span>
                  <span style={{ fontSize: '0.83rem', fontWeight: 700, color: MINT, fontVariantNumeric: 'tabular-nums' }}>
                    ${(data.mainLegVolume + data.otherLegVolume).toLocaleString()} / ${nextRank.leg.toLocaleString()} USDT
                    <span style={{ color: '#52525B', marginLeft: 8 }}>({legVolumePct.toFixed(1)}%)</span>
                  </span>
                </div>
                <ProgressBar pct={legVolumePct} color={MINT} delay={0.55} />
              </div>

              {/* Leg split sub-info */}
              <div className="grid-cols-2" style={{ gap: 12 }}>
                {[
                  { label: 'Main Leg Volume',  value: data.mainLegVolume,  color: '#3B82F6' },
                  { label: 'Other Leg Volume', value: data.otherLegVolume, color: '#A855F7' },
                ].map((leg, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, padding: '12px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{leg.label}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: leg.color, fontVariantNumeric: 'tabular-nums' }}>
                      ${Number(leg.value).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AntiGravityCard>
      </motion.div>

      {/* ── Rank Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ delay: 0.45, duration: 0.5, ease: LUXURY_EASE }}
      >
        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: 0, overflow: 'hidden' }}>
          <div className="responsive-card-inner">
            <h3 style={{
              fontSize: '1rem', fontWeight: 700, color: '#FFFFFF',
              letterSpacing: '-0.01em', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Star size={16} color={GOLD} />
              Full Rank Qualification Matrix
            </h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    {['Rank', 'Min Self Stake', 'Min Network Volume'].map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rankLevels.map((r, idx) => (
                    <RankRow
                      key={r.rank}
                      {...r}
                      idx={idx}
                      isCurrent={r.rank === data.currentRank}
                      isNext={r.rank === nextRank.rank && r.rank !== data.currentRank}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AntiGravityCard>
      </motion.div>
    </motion.div>
  );
};

export default CurrentRank;
