import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

/* ─── Stagger variants ─── */
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show:   {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: LUXURY_EASE },
  },
};

export const TeamNetwork = () => {
  const { authFetch } = useWallet();
  const [network, setNetwork] = useState(null);
  const [depth, setDepth] = useState(3);
  const [collapsedNodes, setCollapsedNodes] = useState({});

  useEffect(() => {
    const loadNetwork = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/referrals/network');
        const data = await res.json();
        setNetwork(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadNetwork();
  }, []);

  const handleToggleNode = (addr) => {
    setCollapsedNodes(prev => ({ ...prev, [addr]: !prev[addr] }));
  };

  if (!network) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: '#D4A017' }}
        />
        Loading binary tree model...
      </div>
    );
  }

  const { tree, networkStats } = network;

  const renderTreeNode = (node, x, y, width, xOffset) => {
    if (!node) return null;

    const isCollapsed = collapsedNodes[node.walletAddress];
    const hasChildren = node.leftChild || node.rightChild;

    return (
      <g key={node.walletAddress}>
        {hasChildren && !isCollapsed && (
          <>
            {node.leftChild && (
              <line 
                x1={x} y1={y + 45} 
                x2={x - xOffset} y2={y + 110} 
                stroke="var(--gold-dark)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
            )}
            {node.rightChild && (
              <line 
                x1={x} y1={y + 45} 
                x2={x + xOffset} y2={y + 110} 
                stroke="var(--gold-dark)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
            )}
          </>
        )}

        <g transform={`translate(${x - 85}, ${y})`} style={{ cursor: 'pointer' }} onClick={() => handleToggleNode(node.walletAddress)}>
          <rect 
            width="170" height="70" rx="8" 
            fill="var(--surface)" 
            stroke={isCollapsed ? "var(--warning)" : "var(--gold-primary)"} 
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))' }}
          />
          <text x="85" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="600">
            {node.username.toUpperCase()}
          </text>
          <text x="85" y="40" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-mono)">
            {node.walletAddress.substring(0, 12)}...
          </text>
          <text x="85" y="58" textAnchor="middle" fill="var(--gold-light)" fontSize="10">
            Stake: ${node.selfStake} USDT | Rank: {node.currentRank}
          </text>
        </g>

        {hasChildren && !isCollapsed && (
          <>
            {renderTreeNode(node.leftChild, x - xOffset, y + 110, width, xOffset / 2)}
            {renderTreeNode(node.rightChild, x + xOffset, y + 110, width, xOffset / 2)}
          </>
        )}
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0 }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1,  x: 0 }}
        transition={{ duration: 0.5, ease: LUXURY_EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.05))',
            border: '1px solid rgba(212,160,23,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Users size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Team Network Downline
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>Interactive binary tree network structure mapping. Click nodes to collapse downlines.</p>
      </motion.div>

      {/* Stats Cards Row */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid-cols-4"
        style={{ gap: '16px' }}
      >
        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LEFT VOLUMES</span>
            <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 800, marginTop: 4 }}>${networkStats.leftVolume.toFixed(2)} USDT</h3>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RIGHT VOLUMES</span>
            <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 800, marginTop: 4 }}>${networkStats.rightVolume.toFixed(2)} USDT</h3>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ACTIVE TEAM MEMBERS</span>
            <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 800, marginTop: 4 }}>{networkStats.activeTeam} Accounts</h3>
          </AntiGravityCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL REFERRALS</span>
            <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 800, marginTop: 4 }}>{networkStats.totalTeam} Accounts</h3>
          </AntiGravityCard>
        </motion.div>
      </motion.div>

      {/* Main Hierarchy Card */}
      <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ padding: '24px', overflowX: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontWeight: '600', color: 'var(--gold-light)' }}>Binary Tree Hierarchy View</span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Depth Filter:</span>
            <input 
              type="number" 
              className="form-control" 
              style={{ width: '80px', padding: '6px', background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(212,160,23,0.2)' }}
              value={depth}
              onChange={e => setDepth(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        <div style={{ width: '100%', minWidth: '900px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px 0' }}>
          <svg width="100%" height="450" viewBox="0 0 900 450">
            {tree ? renderTreeNode(tree, 450, 20, 900, 200) : (
              <text x="450" y="200" textAnchor="middle" fill="var(--text-secondary)">No tree downlines available.</text>
            )}
          </svg>
        </div>
      </AntiGravityCard>
    </motion.div>
  );
};

export default TeamNetwork;
