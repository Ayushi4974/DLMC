import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';

export const AdminTickets = () => {
  const { authFetch } = useWallet();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    try {
      const res = await authFetch('http://localhost:5000/api/admin/tickets');
      if (res.ok) {
        const d = await res.json();
        setTickets(d.tickets);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleReplyTicket = async (e) => {
    e.preventDefault();
    if (!reply) return;
    setLoading(true);
    try {
      const res = await authFetch(`http://localhost:5000/api/admin/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ content: reply })
      });
      if (res.ok) {
        alert("Reply submitted successfully!");
        setReply('');
        setSelectedTicket(null);
        loadTickets();
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
        <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--gold-light)' }} className="glow-text">Support Tickets Solver</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Review client queries and post responder inputs directly to help threads.</p>
      </div>

      <div className="grid-cols-3">
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Client Inquiries Directory</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>User Wallet</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>{t.id}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{t.walletAddress.substring(0, 12)}...</td>
                    <td>{t.subject}</td>
                    <td>{t.priority}</td>
                    <td>
                      <span className={`badge ${t.status === 'open' ? 'badge-warning' : 'badge-success'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setSelectedTicket(t)}>
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--gold-light)' }}>Conversation Thread</h3>
          {selectedTicket ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.85rem' }}>
                <strong>Subject:</strong> {selectedTicket.subject}<br/>
                <strong>Status:</strong> {selectedTicket.status}
              </div>

              <div style={{ maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTicket.messages.map((m, idx) => (
                  <div key={idx} style={{ textAlign: m.sender === 'admin' ? 'right' : 'left' }}>
                    <div style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '8px', background: m.sender === 'admin' ? 'var(--gold-dark)' : 'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleReplyTicket} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Type admin response..." 
                  value={reply} 
                  onChange={e => setReply(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  Send Reply
                </button>
              </form>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Select a support ticket to reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;
