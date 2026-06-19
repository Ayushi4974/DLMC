/**
 * PriceIndexChart — Luxury Obsidian & Gold Vertex Capital Price Area Chart
 *
 * Design spec:
 *  - Gold stroke #D4A017, strokeWidth 2.5
 *  - Area fill: rgba(212,160,23,0.15) → transparent gradient
 *  - Glass card container with blur + gold border glow
 *  - Horizontal-only ultra-subtle grid
 *  - minTickGap={20} to prevent X-axis label overlap
 *  - Mint green +24h badge: #00E5A8
 *  - Custom dark-matte tooltip + dashed gold crosshair
 *  - Entry animation: 1500ms cubic-bezier(0.16,1,0.3,1)
 */

import React, { useState } from 'react';
import {
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

/* ─── Design tokens ─── */
const GOLD         = '#D4A017';
const GOLD_DIM     = 'rgba(212,160,23,0.15)';
const MINT         = '#00E5A8';
const OBSIDIAN     = '#0B0F19';
const FONT_STACK   = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

/* ─── Custom Tooltip ─── */
const PriceTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const price = payload[0]?.value ?? 0;

  return (
    <AnimatePresence>
      <motion.div
        key="price-tip"
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: OBSIDIAN,
          border: `1px solid ${GOLD}`,
          borderRadius: 12,
          padding: '12px 18px',
          minWidth: 160,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 20px rgba(212,160,23,0.1)`,
          fontFamily: FONT_STACK,
          pointerEvents: 'none',
        }}
      >
        {/* Date label */}
        <div style={{
          fontSize: '0.75rem',
          color: '#64748B',
          fontWeight: 600,
          letterSpacing: '0.05em',
          marginBottom: 8,
          textTransform: 'uppercase',
        }}>
          {label}
        </div>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: GOLD,
            boxShadow: `0 0 8px ${GOLD}`,
            flexShrink: 0,
          }} />
          <div>
            <div style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#FFFFFF',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
            }}>
              ${Number(price).toFixed(4)}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 1 }}>
              Vertex Capital / USDT
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Custom Active Dot ─── */
const GoldDot = (props) => {
  const { cx, cy } = props;
  return (
    <g>
      {/* Outer pulse ring */}
      <circle cx={cx} cy={cy} r={9} fill={GOLD_DIM} stroke="none" />
      {/* Inner dot */}
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

/* ─── Stat mini pill ─── */
const MiniStat = ({ label, value, color }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '0.68rem', color: '#52525B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, fontWeight: 600 }}>
      {label}
    </div>
    <div style={{ fontSize: '0.9rem', fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const PriceIndexChart = ({ data = [], change24h = 2.5 }) => {
  const [hovered, setHovered] = useState(false);

  const isPositive = change24h >= 0;
  const TrendIcon  = isPositive ? TrendingUp : TrendingDown;
  const mintColor  = isPositive ? MINT : '#F87171';
  const mintBg     = isPositive ? 'rgba(0,229,168,0.06)' : 'rgba(248,113,113,0.06)';
  const mintBorder = isPositive ? 'rgba(0,229,168,0.20)' : 'rgba(248,113,113,0.20)';

  /* Derived stats from data */
  const prices     = data.map(d => d.price).filter(Boolean);
  const currentPx  = prices[prices.length - 1] ?? 0;
  const highPx     = Math.max(...prices);
  const lowPx      = Math.min(...prices);
  const avgPx      = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

  /* Y-axis domain with 10% padding */
  const yMin = lowPx  > 0 ? lowPx  * 0.85 : 0;
  const yMax = highPx > 0 ? highPx * 1.08  : 2;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(17,24,39,0.92), rgba(11,15,25,0.88))',
        border: '1px solid rgba(212,160,23,0.12)',
        borderRadius: 18,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: `0 0 30px rgba(212,160,23,0.08), 0 8px 40px rgba(0,0,0,0.5)`,
        overflow: 'hidden',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        fontFamily: FONT_STACK,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* ── Card header ── */}
      <div style={{
        padding: '22px 24px 0',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        {/* Title block */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <Activity size={16} color={GOLD} />
            <h3 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
            }}>
              Vertex Capital Price Index
            </h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: 25 }}>
            14-day rolling price in USDT
          </p>
        </div>

        {/* 24h badge — mint green institutional pill */}
        <motion.div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: mintBg,
            border: `1px solid ${mintBorder}`,
            color: mintColor,
            borderRadius: 99,
            padding: '6px 13px',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: 'default',
          }}
          whileHover={{
            boxShadow: `0 0 16px ${mintColor}30`,
            scale: 1.04,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ rotate: isPositive ? [0, -10, 0] : [0, 10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.4 }}
          >
            <TrendIcon size={13} />
          </motion.div>
          {isPositive ? '+' : ''}{change24h}% 24h
        </motion.div>
      </div>

      {/* ── Current price large display ── */}
      <div style={{ padding: '12px 24px 0', display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <motion.span
          key={currentPx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          ${Number(currentPx).toFixed(4)}
        </motion.span>
        <span style={{ fontSize: '0.8rem', color: '#52525B', fontWeight: 600 }}>USDT</span>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'rgba(212,160,23,0.07)', margin: '16px 24px 0' }} />

      {/* ── Chart area ── */}
      <div style={{ padding: '6px 4px 8px' }}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: -8, bottom: 0 }}
          >
            {/* ── Gradient fill def ── */}
            <defs>
              <linearGradient id="priceGoldFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={GOLD} stopOpacity={0.18} />
                <stop offset="45%"  stopColor={GOLD} stopOpacity={0.07} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0}    />
              </linearGradient>
              {/* Glow filter on line */}
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ── Horizontal-only subtle grid ── */}
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.02)"
              strokeDasharray="3 3"
            />

            {/* ── X Axis: prevent label overlap ── */}
            <XAxis
              dataKey="date"
              stroke="transparent"
              tick={{
                fill: '#64748B',
                fontSize: 11,
                fontFamily: FONT_STACK,
                fontWeight: 500,
              }}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
              interval="preserveStartEnd"
            />

            {/* ── Y Axis ── */}
            <YAxis
              stroke="transparent"
              domain={[yMin, yMax]}
              tick={{
                fill: '#64748B',
                fontSize: 11,
                fontFamily: FONT_STACK,
                fontWeight: 500,
              }}
              tickLine={false}
              axisLine={false}
              width={42}
              tickFormatter={v => `$${Number(v).toFixed(2)}`}
            />

            {/* ── Premium tooltip + dashed gold crosshair ── */}
            <Tooltip
              content={<PriceTooltip />}
              cursor={{
                stroke: 'rgba(212,160,23,0.25)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />

            {/* ── Area curve — Roman Gold, animated entry ── */}
            <Area
              type="monotone"
              dataKey="price"
              name="Price"
              stroke={GOLD}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGoldFill)"
              dot={false}
              activeDot={<GoldDot />}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
              style={{ filter: 'drop-shadow(0 0 4px rgba(212,160,23,0.4))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom stats strip ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 24px 18px',
        borderTop: '1px solid rgba(212,160,23,0.07)',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        <MiniStat
          label="Current"
          value={`$${currentPx.toFixed(4)}`}
          color={GOLD}
        />
        <div style={{ width: 1, background: 'rgba(255,255,255,0.05)', alignSelf: 'stretch' }} />
        <MiniStat
          label="14d High"
          value={`$${highPx.toFixed(4)}`}
          color={MINT}
        />
        <div style={{ width: 1, background: 'rgba(255,255,255,0.05)', alignSelf: 'stretch' }} />
        <MiniStat
          label="14d Low"
          value={`$${lowPx.toFixed(4)}`}
          color="#F87171"
        />
        <div style={{ width: 1, background: 'rgba(255,255,255,0.05)', alignSelf: 'stretch' }} />
        <MiniStat
          label="14d Avg"
          value={`$${avgPx.toFixed(4)}`}
          color="#94A3B8"
        />
      </div>
    </div>
  );
};

export default PriceIndexChart;
