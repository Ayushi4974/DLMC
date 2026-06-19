import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Eye, Save } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD = '#E0A01E';
const GOLD_LIGHT = '#F8D954';
const FONT = "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

export const Settings = () => {
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [currency, setCurrency] = useState('USDT');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Preferences saved successfully!");
    }, 800);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(5,5,5,0.6)',
    border: '1px solid rgba(224,160,23,0.15)',
    borderRadius: 10,
    color: '#FFFFFF',
    fontSize: '0.88rem',
    fontFamily: FONT,
    padding: '11px 14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.68rem',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 700,
    marginBottom: 8,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1,  y: 0 }}
      transition={{ duration: 0.45, ease: LUXURY_EASE }}
      style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: FONT }}
    >
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1,  x: 0 }}
        transition={{ duration: 0.5, ease: LUXURY_EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(224,160,30,0.2), rgba(224,160,30,0.05))',
            border: '1px solid rgba(224,160,30,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SettingsIcon size={18} color={GOLD_LIGHT} />
          </div>
          <h2 className="dashboard-page-title">
            Account Settings
          </h2>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Modify display preferences, notification toggles, and security logs.
        </p>
      </motion.div>

      {/* Main Settings Card */}
      <AntiGravityCard depth={6} accent={GOLD} style={{ padding: 0 }}>
        <div className="responsive-card-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Notification Controls */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Bell size={18} style={{ color: GOLD_LIGHT }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: '#FFFFFF' }}>Notification Control</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Push Notifications Toggle */}
                <div 
                  onClick={() => setPushNotif(!pushNotif)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.03)', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Push Notifications (Withdrawals & Ranks Alerts)</span>
                  <div style={{ flexShrink: 0, width: '44px', height: '24px', borderRadius: '12px', background: pushNotif ? GOLD : 'rgba(255,255,255,0.15)', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: pushNotif ? 'flex-end' : 'flex-start', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <motion.div layout style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>

                {/* Email Notifications Toggle */}
                <div 
                  onClick={() => setEmailNotif(!emailNotif)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.03)', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Weekly Email Statements Payout Summaries</span>
                  <div style={{ flexShrink: 0, width: '44px', height: '24px', borderRadius: '12px', background: emailNotif ? GOLD : 'rgba(255,255,255,0.15)', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: emailNotif ? 'flex-end' : 'flex-start', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <motion.div layout style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', margin: '10px 0' }} />

            {/* Display Settings */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Eye size={18} style={{ color: GOLD_LIGHT }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: '#FFFFFF' }}>Display Settings</h3>
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={labelStyle}>Reference Currency</label>
                <select 
                  style={inputStyle} 
                  value={currency} 
                  onChange={e => setCurrency(e.target.value)}
                >
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: '#000000', borderRadius: '50%' }}
                />
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Saving Preferences...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </AntiGravityCard>
    </motion.div>
  );
};

export default Settings;
