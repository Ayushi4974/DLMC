import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';

export const AdminOverview = () => {
  const { authFetch } = useWallet();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await authFetch('http://localhost:5000/api/admin/stats');
        if (res.ok) {
          const d = await res.json();
          setStats(d);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadStats();
  }, []);

  if (!stats) return <div style={{ color: 'var(--text-secondary)' }}>Loading system statistics...</div>;

  const { metrics, cms } = stats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--gold-light)' }} className="glow-text">Admin Master Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Global metrics, live circulation trackers, and system configuration overrides.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid-cols-4">
        {[
          { title: "Global Users Count", val: metrics.totalUsers, label: "Registered accounts" },
          { title: "Total USDT Deposited", val: `${Number(metrics.totalUSDT).toFixed(2)} USDT`, label: "Circulating liquidities" },
          { title: "Circulating Vertex Capital", val: `${Number(metrics.totalCirculatingDlmc).toFixed(2)} Vertex Capital`, label: `Total Minted supply` },
          { title: "Total Claims Paid", val: `${Number(metrics.totalClaimed).toFixed(2)} USDT`, label: "Net yields claimed" },
          { title: "Active LPDAO Members", val: metrics.totalUsers > 1 ? 1 : 0, label: "Governance participants" },
          { title: "Open Support Tickets", val: metrics.openTickets, label: "Awaiting administrator response" },
          { title: "Active Proposals", val: metrics.totalProposals, label: "Open voting polls" },
          { title: "Vertex Capital Token Price", val: `$${cms.tokenPrice.toFixed(4)} USDT`, label: "Base exchange index" }
        ].map((m, i) => (
          <div key={i} className="glass-card" style={{ borderLeft: '4px solid var(--gold-primary)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>{m.title}</span>
            <h3 style={{ fontSize: '1.8rem', margin: '8px 0 4px', fontWeight: '700' }}>{m.val}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.label}</span>
          </div>
        ))}
      </div>

      <div className="grid-cols-2">
        {/* Support Tickets Quick View */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--gold-light)' }}>Recent Open Tickets</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTickets.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No open helpdesk tickets.</td>
                  </tr>
                ) : (
                  stats.recentTickets.map((t, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{t.walletAddress.substring(0, 10)}...</td>
                      <td>{t.subject}</td>
                      <td>{t.priority}</td>
                      <td>
                        <span className="badge badge-warning">{t.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Transactions Ledger */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--gold-light)' }}>System Transactions Log</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No global transactions log.</td>
                  </tr>
                ) : (
                  stats.recentTransactions.map((tx, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{tx.walletAddress.substring(0, 10)}...</td>
                      <td>{tx.type.toUpperCase()}</td>
                      <td className="text-gold">${tx.amount.toFixed(2)}</td>
                      <td>{new Date(tx.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
