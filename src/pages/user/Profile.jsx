import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Wallet, CheckCircle, AlertTriangle } from 'lucide-react';
import AntiGravityCard, { LUXURY_EASE } from '../../components/AntiGravityCard';

const GOLD = '#E0A01E';
const GOLD_LIGHT = '#F8D954';
const FONT = "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

export const Profile = () => {
  const { user, authFetch, refreshProfile, apiUrl } = useWallet();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-secondary)', fontFamily: FONT }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          style={{ width: '30px', height: '30px', border: '3px solid rgba(224, 160, 30, 0.1)', borderTopColor: GOLD, borderRadius: '50%' }}
        />
        <span style={{ marginLeft: '12px', fontSize: '0.95rem' }}>Loading secure profile...</span>
      </div>
    );
  }

  const listItems = [
    {
      label: 'Wallet Address',
      value: user.walletAddress,
      icon: Wallet,
      color: GOLD_LIGHT,
      isMono: true,
    },
    {
      label: 'Registered Email',
      value: user.email,
      icon: Mail,
      color: '#3B82F6',
    },
    {
      label: 'LPDAO Membership',
      value: user.lpdaoStatus === 'member' ? 'Member' : 'Non-Member',
      icon: CheckCircle,
      badge: true,
      badgeStyle: user.lpdaoStatus === 'member' ? 'badge-success' : 'badge-info',
    },
    {
      label: 'Registration Date',
      value: new Date(user.joinDate).toLocaleString(),
      icon: Calendar,
      color: '#A1A1AA',
    },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      setErrorMsg("Username and email cannot be empty.");
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await authFetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }
      setSuccessMsg("Profile updated successfully!");
      await refreshProfile();
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
    setIsEditing(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: FONT }}>
      {/* Header Banner — Unboxed clean layout matching Buy/Sell DLMC */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: LUXURY_EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, rgba(224, 160, 30, 0.2), rgba(224, 160, 30, 0.05))`,
            border: `1px solid rgba(224, 160, 30, 0.25)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={18} color={GOLD_LIGHT} />
          </div>
          <h2 style={{
            fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, #FFFFFF 30%, ${GOLD_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            My Account Profile
          </h2>
        </div>
        <p style={{ margin: '4px 0 0 46px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Verify wallet listings, LPDAO membership status, and registration timestamps.
        </p>
      </motion.div>

      {/* Main Info Card Grid — Modular separate 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Card: Identity & Action Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: LUXURY_EASE }}
        >
          <AntiGravityCard depth={6} accent={GOLD} style={{ padding: '24px 28px' }}>
            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800', color: '#05070a', boxShadow: '0 8px 24px rgba(224, 160, 30, 0.25)' }}>
                  {user.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
                    {user.username.toUpperCase()}
                  </h3>
                  <span className="badge badge-info" style={{ display: 'inline-block', fontSize: '0.75rem', textTransform: 'uppercase', padding: '4px 10px', letterSpacing: '0.05em', marginTop: '10px' }}>
                    Role: {user.role}
                  </span>
                </div>
                
                <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', margin: '10px 0' }} />

                <button
                  onClick={() => {
                    setIsEditing(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <User size={15} /> Edit Profile Details
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Edit Profile Details
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>
                    Update your account details below.
                  </p>
                </div>

                {errorMsg && (
                  <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#FCA5A5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div style={{ padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '10px', color: '#86EFAC', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    disabled={loading}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </AntiGravityCard>
        </motion.div>

        {/* Right Card: Security & Parameters Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: LUXURY_EASE }}
        >
          <AntiGravityCard depth={6} accent={GOLD_LIGHT} style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Security & Network parameters
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>
                  Read-only cryptographic listings and account milestones.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {listItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.03)', flexWrap: 'wrap', gap: '12px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={18} style={{ color: GOLD_LIGHT }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span className={`badge ${item.badgeStyle}`} style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
                          {item.value}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, fontFamily: item.isMono ? 'var(--font-mono)' : FONT, color: item.isMono ? GOLD_LIGHT : '#FFFFFF', wordBreak: 'break-all', textAlign: 'right', maxWidth: '100%' }}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </AntiGravityCard>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
