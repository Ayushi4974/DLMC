/**
 * AntiGravityCard — Reusable Framer Motion wrapper
 *
 * Design spec:
 *  - Base: #050505 / #0B0F19 dark luxury bg
 *  - Hover lift: translateY(-8px) with cubic-bezier(0.16, 1, 0.3, 1) @ 400ms
 *  - Gold glow: box-shadow 0 20px 40px rgba(212,160,23,0.15)
 *  - Top border light:  rgba(212,160,23,0.55) on hover (metallic reflection)
 *  - Hardware acceleration: will-change + backface-visibility
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

/* ─── Spring configs ─── */
const LIFT_SPRING   = { type: 'spring', stiffness: 280, damping: 22, mass: 0.6 };
const GLOW_SPRING   = { type: 'spring', stiffness: 200, damping: 30 };
const TILT_SPRING   = { type: 'spring', stiffness: 350, damping: 30, mass: 0.5 };

/* ─── Luxury easing for CSS fallback ─── */
export const LUXURY_EASE = [0.16, 1, 0.3, 1];   // cubic-bezier

/**
 * AntiGravityCard
 *
 * Props:
 *  className   – extra CSS classes on the outer wrapper
 *  style       – inline style overrides on the outer wrapper
 *  accent      – hex/rgba accent colour for per-card top-border glow (optional)
 *  depth       – lift distance in px (default 8)
 *  tilt        – enable 3D magnetic tilt on mouse-move (default true)
 *  glow        – enable gold box-shadow glow on hover (default true)
 *  children    – card content
 */
const AntiGravityCard = ({
  children,
  className = '',
  style = {},
  accent = '#D4A017',
  depth = 8,
  tilt = true,
  glow = true,
  onClick,
}) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  /* ── Mouse-position motion values for magnetic tilt ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [tilt ? 6 : 0, tilt ? -6 : 0]),
    TILT_SPRING
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [tilt ? -6 : 0, tilt ? 6 : 0]),
    TILT_SPRING
  );

  const handleMouseMove = (e) => {
    if (!ref.current || !tilt) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  /* ── Dynamic box-shadow spring ── */
  const shadowOpacity = useSpring(hovered ? 1 : 0, GLOW_SPRING);
  const boxShadow = useTransform(
    shadowOpacity,
    [0, 1],
    [
      '0 4px 16px rgba(0,0,0,0.4), 0 0 0 rgba(212,160,23,0)',
      `0 20px 40px rgba(212,160,23,0.15), 0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px ${accent}55`
    ]
  );

  /* ── Border-top glow spring ── */
  const borderSpring = useSpring(hovered ? 1 : 0, GLOW_SPRING);
  const borderTop = useTransform(
    borderSpring,
    [0, 1],
    [
      `1px solid rgba(212,160,23,0.12)`,
      `1px solid ${accent}99`,
    ]
  );

  return (
    <motion.div
      ref={ref}
      className={`ag-card ${className}`}
      style={{
        /* Hardware acceleration */
        willChange: 'transform, box-shadow',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        /* Motion-driven values */
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        boxShadow: glow ? boxShadow : undefined,
        borderTop,
        perspective: 800,
        ...style,
      }}
      /* ── Lift animation ── */
      animate={{
        y: hovered ? -depth : 0,
        scale: hovered ? 1.015 : 1,
      }}
      transition={{
        y:     { type: 'spring', ...LIFT_SPRING },
        scale: { type: 'spring', ...LIFT_SPRING },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {/* Inner shimmer layer — appears on hover */}
      <motion.div
        className="ag-shimmer"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden
      />

      {/* Glow blob anchored to top-center */}
      <motion.div
        className="ag-blob"
        style={{ background: accent }}
        animate={{ opacity: hovered ? 0.12 : 0.04, scale: hovered ? 1.4 : 1 }}
        transition={{ duration: 0.4, ease: LUXURY_EASE }}
        aria-hidden
      />

      {/* Actual content */}
      <div className="ag-content">
        {children}
      </div>
    </motion.div>
  );
};

export default AntiGravityCard;
