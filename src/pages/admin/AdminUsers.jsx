import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';

export const AdminUsers = () => {
  const { authFetch } = useWallet();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usdtInj, setUsdtInj] = useState('');
  const [dlmcInj, setDlmcInj] = useState('');
  const [rankUpdate, setRankUpdate] = useState('D0');
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await authFetch('http://localhost:5000/api/admin/users');
      if (res.ok) {
        const d = await res.json();
        setUsers(d.users);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const updates = {};
      if (usdtInj) updates.usdtBalance = Number(usdtInj);
      if (dlmcInj) updates.dlmcBalance = Number(dlmcInj);
      if (rankUpdate) updates.currentRank = rankUpdate;

      const res = await authFetch(`http://localhost:5000/api/admin/users/${selectedUser.walletAddress}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        alert("User overrode successfully!");
        setSelectedUser(null);
        setUsdtInj('');
        setDlmcInj('');
        loadUsers();
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--gold-light)' }} className="glow-text">Users & Wallets Override</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Inspect user registrations and adjust credit balances manually.</p>
      </div>

      <div className="grid-cols-3">
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Registered Accounts Directory</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Wallet Address</th>
                  <th>USDT Bal</th>
                  <th>Vertex Capital Bal</th>
                  <th>Rank</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td>{u.username}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{u.walletAddress}</td>
                    <td>${Number(u.usdtBalance).toFixed(2)}</td>
                    <td>{Number(u.dlmcBalance).toFixed(2)} Vertex Capital</td>
                    <td style={{ fontWeight: '700' }}>{u.currentRank || "D0"}</td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => {
                        setSelectedUser(u);
                        setUsdtInj(u.usdtBalance);
                        setDlmcInj(u.dlmcBalance);
                        setRankUpdate(u.currentRank || "D0");
                      }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--gold-light)' }}>Override Account</h3>
          {selectedUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.85rem' }}>
                <strong>User:</strong> {selectedUser.username.toUpperCase()}<br/>
                <strong>Wallet:</strong> {selectedUser.walletAddress.substring(0, 16)}...
              </div>

              <div className="form-group">
                <label className="form-label">USDT Balance Override</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={usdtInj} 
                  onChange={e => setUsdtInj(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vertex Capital Balance Override</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={dlmcInj} 
                  onChange={e => setDlmcInj(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rank Promotion</label>
                <select className="form-control" value={rankUpdate} onChange={e => setRankUpdate(e.target.value)}>
                  {Array.from({ length: 16 }, (_, i) => `D${i}`).map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedUser(null)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdateUser} disabled={loading}>
                  Save changes
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Select a user from the directory grid to override balances.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
