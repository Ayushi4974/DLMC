import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';

export const AdminGovernance = () => {
  const { authFetch } = useWallet();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('7');
  const [loading, setLoading] = useState(false);

  const handleCreateProp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authFetch('http://localhost:5000/api/admin/proposals', {
        method: 'POST',
        body: JSON.stringify({ title, description, durationDays: Number(duration) })
      });
      if (res.ok) {
        alert("Governance Proposal launched successfully!");
        setTitle('');
        setDescription('');
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--gold-light)' }} className="glow-text">Governance Proposal Builder</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Launch new platform proposals for LPDAO governance voting.</p>
      </div>

      <form onSubmit={handleCreateProp} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div className="form-group">
          <label className="form-label">Proposal Title</label>
          <input 
            type="text" 
            className="form-control" 
            required 
            placeholder="e.g. Enable 10% Burn Reduction"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Proposal Description Details</label>
          <textarea 
            className="form-control" 
            rows="5" 
            required 
            placeholder="Provide a comprehensive summary of proposed parameters change..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Voting Duration Limit (Days)</label>
          <select className="form-control" value={duration} onChange={e => setDuration(e.target.value)}>
            <option>3</option>
            <option>5</option>
            <option>7</option>
            <option>14</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '12px' }} disabled={loading}>
          {loading ? 'Launching proposal...' : 'Launch Voting Proposal'}
        </button>
      </form>
    </div>
  );
};

export default AdminGovernance;
