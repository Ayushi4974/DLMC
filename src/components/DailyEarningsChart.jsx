/**
 * DailyEarningsChart — Luxury Obsidian & Gold bar chart
 *
 * Design spec:
 *  - Bar palette: Burnished Bronze (#8B5E00) / Roman Gold (#D4A017) / Champagne (#F4D06F)
 *  - barSize: 36px, barCategoryGap: "28%", stackId stacking
 *  - Vertical metallic gradients via <defs>
 *  - Top segment only gets radius={[6,6,0,0]}
 *  - Custom dark-matte tooltip with gold border
 *  - Subtle horizontal-only CartesianGrid
 *  - X/Y axis: #94A3B8 muted typography
 */

import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart2 } from 'lucide-react';

/* ─── Brand token constants ─── */
/* Tricolor luxury gold palette — Warm Amber, Roman Gold, and Champagne Cream */
const AMBER     = '#E2A93E';   // Staking   — Muted Gold/Amber
const GOLD      = '#F4D06F';   // Referrals — Roman Gold (brand primary)
const CREAM     = '#FFF5CC';   // Salary    — Champagne Cream / Light Gold

/* ─── Custom Tooltip ─── */
const PremiumTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const staking   = payload.find(p => p.dataKey === 'staking')?.value   ?? 0;
  const referrals = payload.find(p => p.dataKey === 'referrals')?.value ?? 0;
  const salary    = payload.find(p => p.dataKey === 'salary')?.value    ?? 0;
  const total     = staking + referrals + salary;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#0B0F19',
          border: `1px solid ${GOLD}`,
          borderRadius: 12,
          padding: '14px 18px',
          minWidth: 180,
          boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 16px rgba(212,160,23,0.12)`,
          backdropFilter: 'blur(12px)',
          fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: '1px solid rgba(212,160,23,0.15)',
        }}>
          <span style={{ fontSize: '0.82rem', color: GOLD, fontWeight: 700, letterSpacing: '0.04em' }}>
            {label}
          </span>
          <span style={{
            fontSize: '0.7rem',
            color: '#94A3B8',
            background: 'rgba(212,160,23,0.08)',
            border: '1px solid rgba(212,160,23,0.2)',
            borderRadius: 99,
            padding: '2px 8px',
            fontWeight: 600,
          }}>
            Total: {total.toFixed(2)}
          </span>
        </div>

        {/* Rows */}
        {[
          { label: 'Staking',   value: staking,   color: AMBER },
          { label: 'Referrals', value: referrals, color: GOLD  },
          { label: 'Salary',    value: salary,    color: CREAM  },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
            gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: 3,
                background: row.color,
                boxShadow: `0 0 6px ${row.color}88`,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 500 }}>
                {row.label}
              </span>
            </div>
            <span style={{
              fontSize: '0.82rem',
              color: '#FFFFFF',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {Number(row.value).toFixed(2)} USDT
            </span>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Legend Pill ─── */
const LegendPill = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <span style={{
      width: 10, height: 10,
      borderRadius: 3,
      background: color,
      boxShadow: `0 0 8px ${color}66`,
      flexShrink: 0,
      display: 'inline-block',
    }} />
    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
      {label}
    </span>
  </div>
);

/* ─── Custom Active Dots ─── */
const OBSIDIAN = '#0B0F19';

const AmberDot = (props) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="rgba(226,169,62,0.15)" stroke="none" />
      <circle
        cx={cx} cy={cy} r={5}
        fill={AMBER}
        stroke={OBSIDIAN}
        strokeWidth={2.5}
        style={{ filter: `drop-shadow(0 0 6px ${AMBER})` }}
      />
    </g>
  );
};

const GoldDot = (props) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="rgba(244,208,111,0.15)" stroke="none" />
      <circle
        cx={cx} cy={cy} r={5}
        fill={GOLD}
        stroke={OBSIDIAN}
        strokeWidth={2.5}
        style={{ filter: `drop-shadow(0 0 6px ${GOLD})` }}
      />
    </g>
  );
};

const CreamDot = (props) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="rgba(255,245,204,0.15)" stroke="none" />
      <circle
        cx={cx} cy={cy} r={5}
        fill={CREAM}
        stroke={OBSIDIAN}
        strokeWidth={2.5}
        style={{ filter: `drop-shadow(0 0 6px ${CREAM})` }}
      />
    </g>
  );
};

/* ─── Main component ─── */
const DailyEarningsChart = ({ data = [] }) => {
  const [activeBar, setActiveBar] = useState(null);

  /* total for summary line */
  const weekTotal = data.reduce(
    (acc, d) => acc + (d.staking || 0) + (d.referrals || 0) + (d.salary || 0),
    0
  );

  return (
    <div style={{
      /* Luxury glass card */
      background: 'linear-gradient(135deg, rgba(17,24,39,0.92), rgba(11,15,25,0.88))',
      border: '1px solid rgba(212,160,23,0.12)',
      borderRadius: 18,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 0 30px rgba(212,160,23,0.08), 0 8px 32px rgba(0,0,0,0.45)',
      overflow: 'hidden',
      /* Hardware acceleration */
      willChange: 'transform',
      backfaceVisibility: 'hidden',
    }}>

      {/* ── Card header ── */}
      <div style={{
        padding: '22px 24px 0',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 6,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <BarChart2 size={16} color={GOLD} />
            <h3 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            }}>
              Daily Earnings Trend
            </h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: 25 }}>
            7-day breakdown by income stream
          </p>
        </div>

        {/* Legend + week total */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <LegendPill color={AMBER} label="Staking"   />
            <LegendPill color={GOLD}  label="Referrals" />
            <LegendPill color={CREAM} label="Salary"    />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(212,160,23,0.07)',
            border: '1px solid rgba(212,160,23,0.18)',
            borderRadius: 99,
            padding: '3px 11px',
          }}>
            <TrendingUp size={11} color={GOLD} />
            <span style={{ fontSize: '0.72rem', color: GOLD, fontWeight: 700, letterSpacing: '0.03em' }}>
              7d: {weekTotal.toFixed(2)} USDT
            </span>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{
        height: 1,
        background: 'rgba(212,160,23,0.07)',
        margin: '16px 24px 0',
      }} />

      {/* ── Chart area ── */}
      <div style={{ padding: '16px 8px 20px' }}>
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
          >
            {/* ── Gradient defs ── */}
            <defs>
              {/* Warm Amber — Staking (bottom) */}
              <linearGradient id="fillAmber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#F5C767" stopOpacity={0.25} />
                <stop offset="100%" stopColor={AMBER}    stopOpacity={0.02} />
              </linearGradient>

              {/* Roman Gold — Referrals (middle) */}
              <linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#FBE89A" stopOpacity={0.25} />
                <stop offset="100%" stopColor={GOLD}    stopOpacity={0.02} />
              </linearGradient>

              {/* Champagne Cream — Salary (top) */}
              <linearGradient id="fillCream" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#FFFFFF" stopOpacity={0.25} />
                <stop offset="100%" stopColor={CREAM}   stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {/* ── Grid: horizontal-only, ultra-subtle ── */}
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.03)"
              strokeDasharray="4 4"
            />

            {/* ── Axes ── */}
            <XAxis
              dataKey="day"
              stroke="transparent"
              tick={{
                fill: '#94A3B8',
                fontSize: 12,
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
              }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="transparent"
              tick={{
                fill: '#94A3B8',
                fontSize: 12,
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
              }}
              tickLine={false}
              axisLine={false}
              width={34}
            />

            {/* ── Premium tooltip ── */}
            <Tooltip
              content={<PremiumTooltip />}
              cursor={{
                stroke: 'rgba(212,160,23,0.2)',
                strokeWidth: 1.5,
                strokeDasharray: '3 3',
              }}
            />

            {/* ── Bottom segment: Staking Area ── */}
            <Area
              type="monotone"
              dataKey="staking"
              name="Staking"
              stackId="earnings"
              stroke={AMBER}
              strokeWidth={2.5}
              fill="url(#fillAmber)"
              dot={false}
              activeDot={<AmberDot />}
              style={{ filter: 'drop-shadow(0 0 4px rgba(226,169,62,0.4))' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />

            {/* ── Middle segment: Referrals Area ── */}
            <Area
              type="monotone"
              dataKey="referrals"
              name="Referrals"
              stackId="earnings"
              stroke={GOLD}
              strokeWidth={2.5}
              fill="url(#fillGold)"
              dot={false}
              activeDot={<GoldDot />}
              style={{ filter: 'drop-shadow(0 0 4px rgba(244,208,111,0.4))' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />

            {/* ── Top segment: Salary Area ── */}
            <Area
              type="monotone"
              dataKey="salary"
              name="Salary"
              stackId="earnings"
              stroke={CREAM}
              strokeWidth={2.5}
              fill="url(#fillCream)"
              dot={false}
              activeDot={<CreamDot />}
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,245,204,0.4))' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom summary strip ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 24px 18px',
        borderTop: '1px solid rgba(212,160,23,0.07)',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Staking',   color: AMBER, key: 'staking'   },
          { label: 'Referrals', color: GOLD,  key: 'referrals' },
          { label: 'Salary',    color: CREAM, key: 'salary'    },
        ].map(seg => {
          const segTotal = data.reduce((a, d) => a + (d[seg.key] || 0), 0);
          const pct = weekTotal > 0 ? ((segTotal / weekTotal) * 100).toFixed(1) : '0.0';
          return (
            <div key={seg.key} style={{ textAlign: 'center', flex: 1, minWidth: 80 }}>
              <div style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                marginBottom: 3,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {seg.label}
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: seg.color,
                fontVariantNumeric: 'tabular-nums',
                textShadow: `0 0 12px ${seg.color}55`,
              }}>
                {segTotal.toFixed(2)}
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: '#52525B',
                marginTop: 1,
              }}>
                {pct}% of total
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyEarningsChart;
