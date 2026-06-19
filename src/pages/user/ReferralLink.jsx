import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { Copy, Share2, Link2 } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD       = '#D4A017';
const GOLD_LIGHT = '#F4D06F';
const FONT       = "'Outfit','Plus Jakarta Sans',system-ui,sans-serif";

export const ReferralLink = () => {
  const { authFetch } = useWallet();
  const [refData, setRefData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadRef = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/referrals/link');
        const data = await res.json();
        setRefData(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadRef();
  }, []);

  const handleCopy = () => {
    if (!refData) return;
    navigator.clipboard.writeText(refData.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!refData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B', padding: 40 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(212,160,23,0.15)', borderTopColor: '#D4A017' }}
        />
        Loading referrals metadata...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0 }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: FONT }}
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
            <Link2 size={18} color={GOLD} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Sponsor Program Link
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>Invite friends and earn binary network volume commissions.</p>
      </motion.div>

      <div className="staking-active-grid">
        <AntiGravityCard accent="#D4A017" depth={6} tilt={true} glow={true} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Referral QR Code</h3>
          <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', width: '192px', height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(refData.referralUrl)}&color=05070a`} 
              alt="Referral QR Code"
              style={{ width: '160px', height: '160px', display: 'block' }}
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scan to register under you</span>
        </AntiGravityCard>

        <AntiGravityCard accent="#D4A017" depth={6} tilt={false} glow={true} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#FFFFFF' }}>Your Referral URL</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input
                type="text"
                className="form-control"
                readOnly
                value={refData.referralUrl}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  borderColor: 'rgba(212,160,23,0.15)',
                  flex: 1
                }}
              />
              <motion.button
                className="btn btn-primary"
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy size={16} style={{ marginRight: '6px' }} /> {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <motion.a
                href={`https://t.me/share/url?url=${encodeURIComponent(refData.referralUrl)}&text=Join%20my%20Vertex Capital%20Staking%20Downline!`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ flex: 1, textDecoration: 'none', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 size={16} /> Telegram Share
              </motion.a>
              <motion.a
                href={`https://api.whatsapp.com/send?text=Join%20my%20Vertex Capital%20Staking%20Downline!%20${encodeURIComponent(refData.referralUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ flex: 1, textDecoration: 'none', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 size={16} /> WhatsApp Share
              </motion.a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL CLICKS</span>
              <h4 style={{ fontSize: '1.6rem', color: 'var(--gold-light)', fontWeight: 800, marginTop: 4 }}>{refData.stats.clicks}</h4>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>REGISTRATIONS</span>
              <h4 style={{ fontSize: '1.6rem', color: 'var(--gold-light)', fontWeight: 800, marginTop: 4 }}>{refData.stats.registrations}</h4>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CONVERSIONS</span>
              <h4 style={{ fontSize: '1.6rem', color: 'var(--gold-light)', fontWeight: 800, marginTop: 4 }}>{refData.stats.conversions}%</h4>
            </div>
          </div>
        </AntiGravityCard>
      </div>
    </motion.div>
  );
};

export default ReferralLink;
