import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Trophy, Vote, ArrowDownCircle, Users } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const MINT       = '#00E5A8';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

const TYPE_CONFIG = {
  rank:       { icon: Trophy,          color: MINT,     label: 'Rank' },
  governance: { icon: Vote,            color: '#60A5FA', label: 'Governance' },
  deposit:    { icon: ArrowDownCircle, color: GOLD,      label: 'Deposit' },
  ref:        { icon: Users,           color: '#A855F7', label: 'Referral' },
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: LUXURY_EASE } },
};

const mockAlerts = [
  { type: 'rank',       title: 'Rank D2 Achieved!',             desc: 'You have promoted to D2 rank. Daily salary upgraded to 10 USDT.',               date: new Date().toISOString() },
  { type: 'governance', title: 'Governance Proposal Launched',  desc: 'A new governance voting proposal has launched. Cast your vote.',                  date: new Date(Date.now() - 86400000).toISOString() },
  { type: 'deposit',    title: 'USDT Deposit Successful',       desc: 'Successfully loaded 5,000 USDT mock funds.',                                      date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { type: 'ref',        title: 'Referral Link Conversion',      desc: 'Your direct referral has staked 100 USDT, increasing left leg volume.',            date: new Date(Date.now() - 86400000 * 4).toISOString() },
];

export const Notifications = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1,  y: 0  }}
    transition={{ duration: 0.45, ease: LUXURY_EASE }}
    style={{ maxWidth: 750, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28, fontFamily: FONT }}
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
          <Bell size={18} color={GOLD} />
        </div>
        <h2 style={{
          fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
          background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          System Notifications
        </h2>
      </div>
      <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
        Stay updated with promotions, governance triggers, and deposit events.
      </p>
    </motion.div>

    {/* ── Alert Items ── */}
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {mockAlerts.map((a, i) => {
        const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.deposit;
        const Ico = cfg.icon;
        return (
          <motion.div key={i} variants={itemVariants}>
            <AntiGravityCard
              accent={cfg.color}
              depth={5}
              tilt={false}
              glow={false}
              style={{ padding: '18px 20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Icon bubble */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: `${cfg.color}18`,
                  border: `1px solid ${cfg.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ico size={18} color={cfg.color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.09em',
                      textTransform: 'uppercase', borderRadius: 99, padding: '2px 7px',
                      background: `${cfg.color}15`,
                      border: `1px solid ${cfg.color}30`,
                      color: cfg.color,
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC', marginBottom: 3, letterSpacing: '-0.01em' }}>
                    {a.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5 }}>{a.desc}</p>
                </div>

                {/* Date */}
                <span style={{ fontSize: '0.72rem', color: '#52525B', flexShrink: 0 }}>
                  {new Date(a.date).toLocaleDateString()}
                </span>
              </div>
            </AntiGravityCard>
          </motion.div>
        );
      })}
    </motion.div>
  </motion.div>
);

export default Notifications;
