import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const MINT       = '#00E5A8';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

/* ─── Stagger variants ─── */
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: LUXURY_EASE } },
};

const rankLevels = [
  { rank: 'D1',  self: '$100',    leg: '$500',        salary: '$5/day',   reward: 'Salary Unlock', color: '#94A3B8' },
  { rank: 'D2',  self: '$250',    leg: '$1,500',      salary: '$10/day',  reward: 'Salary Unlock', color: '#94A3B8' },
  { rank: 'D3',  self: '$500',    leg: '$4,000',      salary: '$15/day',  reward: 'Salary Unlock', color: '#6366F1' },
  { rank: 'D4',  self: '$1,000',  leg: '$10,000',     salary: '$25/day',  reward: 'Salary Unlock', color: '#6366F1' },
  { rank: 'D5',  self: '$2,000',  leg: '$25,000',     salary: '$40/day',  reward: 'Salary Unlock', color: '#3B82F6' },
  { rank: 'D6',  self: '$3,500',  leg: '$60,000',     salary: '$60/day',  reward: 'Bonus Unlock',  color: '#3B82F6' },
  { rank: 'D7',  self: '$5,000',  leg: '$120,000',    salary: '$85/day',  reward: 'Salary Unlock', color: '#22C55E' },
  { rank: 'D8',  self: '$7,500',  leg: '$250,000',    salary: '$120/day', reward: 'Salary Unlock', color: '#22C55E' },
  { rank: 'D9',  self: '$10,000', leg: '$500,000',    salary: '$160/day', reward: 'Bonus Unlock',  color: GOLD      },
  { rank: 'D10', self: '$15,000', leg: '$1,000,000',  salary: '$210/day', reward: 'Salary Unlock', color: GOLD      },
  { rank: 'D11', self: '$20,000', leg: '$2,000,000',  salary: '$280/day', reward: 'Salary Unlock', color: GOLD_LIGHT},
  { rank: 'D12', self: '$25,000', leg: '$4,000,000',  salary: '$360/day', reward: 'Salary Unlock', color: GOLD_LIGHT},
  { rank: 'D13', self: '$35,000', leg: '$8,000,000',  salary: '$460/day', reward: 'Bonus Unlock',  color: '#F97316' },
  { rank: 'D14', self: '$45,000', leg: '$15,000,000', salary: '$580/day', reward: 'Salary Unlock', color: '#F97316' },
  { rank: 'D15', self: '$50,000', leg: '$30,000,000', salary: '$750/day', reward: 'Grand Unlock',  color: MINT      },
];

export const Milestones = () => (
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
          <Trophy size={18} color={GOLD} />
        </div>
        <h2 style={{
          fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
          background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          D1 → D15 Promotion Journey
        </h2>
      </div>
      <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
        Explore targets, rewards, and daily salaries unlocked at each milestone stage.
      </p>
    </motion.div>

    {/* ── Horizontal Scroll Rank Cards ── */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1,  y: 0  }}
      transition={{ delay: 0.2, duration: 0.5, ease: LUXURY_EASE }}
    >
      <AntiGravityCard accent="#D4A017" depth={4} tilt={false} glow={true} style={{ padding: '24px' }}>
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="milestones-grid"
        >
          {rankLevels.map((r, idx) => (
            <motion.div
              key={r.rank}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                background: 'linear-gradient(135deg, rgba(17,24,39,0.9), rgba(11,15,25,0.85))',
                border: `1px solid ${r.color}33`,
                borderRadius: 14,
                padding: '18px 16px',
                boxShadow: `0 0 20px ${r.color}10`,
                cursor: 'default',
                width: '100%',
              }}
            >
              {/* Rank badge */}
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `${r.color}18`,
                border: `1px solid ${r.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: r.color, fontFamily: "'JetBrains Mono',monospace" }}>
                  {r.rank}
                </span>
              </div>

              {/* Daily salary */}
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '0.62rem', color: '#52525B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                  Daily Salary
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: r.color, marginTop: 3 }}>
                  {r.salary}
                </div>
              </div>

              {/* Requirements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#52525B', fontWeight: 600 }}>Self Stake</span>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>{r.self}</span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#52525B', fontWeight: 600 }}>Leg Vol.</span>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>{r.leg}</span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#52525B', fontWeight: 600 }}>Bonus</span>
                  <span style={{ fontSize: '0.68rem', color: r.color, fontWeight: 700 }}>{r.reward}</span>
                </div>
              </div>

              {/* D15 crown */}
              {r.rank === 'D15' && (
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <Star size={14} color={MINT} fill={MINT} style={{ display: 'inline' }} />
                  <span style={{ fontSize: '0.62rem', color: MINT, fontWeight: 700, marginLeft: 4 }}>Grand Crown</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AntiGravityCard>
    </motion.div>
  </motion.div>
);

export default Milestones;
