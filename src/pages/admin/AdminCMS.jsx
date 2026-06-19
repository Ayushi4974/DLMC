import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';

export const AdminCMS = () => {
  const { authFetch } = useWallet();
  const [cms, setCms] = useState(null);
  const [tokenPrice, setTokenPrice] = useState('');
  const [buyFee, setBuyFee] = useState('');
  const [sellFee, setSellFee] = useState('');
  const [roi, setRoi] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCms = async () => {
    try {
      const res = await authFetch('http://localhost:5000/api/admin/stats');
      if (res.ok) {
        const d = await res.json();
        setCms(d.cms);
        setTokenPrice(d.cms.tokenPrice);
        setBuyFee(d.cms.buyFeePercent);
        setSellFee(d.cms.sellFeePercent);
        setRoi(d.cms.stakingRoiPercent);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCms();
  }, []);

  const handleUpdateCMS = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authFetch('http://localhost:5000/api/admin/cms', {
        method: 'PUT',
        body: JSON.stringify({
          tokenPrice: Number(tokenPrice),
          buyFeePercent: Number(buyFee),
          sellFeePercent: Number(sellFee),
          stakingRoiPercent: Number(roi)
        })
      });
      if (res.ok) {
        alert("CMS Config variables overridden successfully!");
        loadCms();
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!cms) return <div style={{ color: 'var(--text-secondary)' }}>Loading CMS configs...</div>;

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--gold-light)' }} className="glow-text">CMS Configuration Variables</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Configure global rates, purchase pricing, and daily ROI percentages instantly.</p>
      </div>

      <form onSubmit={handleUpdateCMS} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="form-group">
          <label className="form-label">DLMC Token Exchange Price (USDT)</label>
          <input 
            type="number" 
            step="0.0001" 
            className="form-control" 
            value={tokenPrice} 
            onChange={e => setTokenPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">USDT Buy Development Fee (%)</label>
          <input 
            type="number" 
            className="form-control" 
            value={buyFee} 
            onChange={e => setBuyFee(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">DLMC Sell Burn Fee (%)</label>
          <input 
            type="number" 
            className="form-control" 
            value={sellFee} 
            onChange={e => setSellFee(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Daily Staking ROI (%)</label>
          <input 
            type="number" 
            step="0.01" 
            className="form-control" 
            value={roi} 
            onChange={e => setRoi(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '12px' }} disabled={loading}>
          {loading ? 'Overriding...' : 'Save Configuration Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminCMS;
