import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ShieldAlert } from 'lucide-react';

export const AdminRanks = () => {
  const { authFetch } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleSalaryPayout = async () => {
    setLoading(true);
    try {
      const res = await authFetch('http://localhost:5000/api/admin/distribute-salaries', { method: 'POST' });
      const data = await res.json();
      alert(data.message);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--gold-light)' }} className="glow-text">Ranks & Salaries Payout Trigger</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Disburse daily rank salary incentives based on active milestone ranks (D1-D15).</p>
      </div>

      <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(224, 160, 30, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', margin: '0 auto' }}>
          <ShieldAlert size={36} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Daily Salary Disbursements</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Triggering this action processes and posts salary payments to all registered profiles based on their achievements. Payout records are logged to transaction history grids.
          </p>
        </div>

        <button className="btn btn-primary" style={{ padding: '14px' }} onClick={handleSalaryPayout} disabled={loading}>
          {loading ? 'Distributing Salaries...' : 'Simulate Salary Distribution'}
        </button>
      </div>
    </div>
  );
};

export default AdminRanks;
