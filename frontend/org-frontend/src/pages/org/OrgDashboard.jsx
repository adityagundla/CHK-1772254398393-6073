import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrgDashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedAccess: 0,
    usersWithAccess: 0
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [orgData, setOrgData] = useState({});

  useEffect(() => {
    const storedOrg = JSON.parse(localStorage.getItem('orgData') || '{}');
    setOrgData(storedOrg);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const sentRequests = JSON.parse(localStorage.getItem('orgSentRequests') || '[]');
    
    setStats({
      totalRequests: sentRequests.length,
      pendingRequests: sentRequests.filter(req => req.status === 'pending').length,
      approvedAccess: sentRequests.filter(req => req.status === 'approved').length,
      usersWithAccess: new Set(sentRequests.filter(req => req.status === 'approved').map(req => req.userId)).size
    });

    // Recent requests
    const recent = sentRequests.sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate)).slice(0, 5).map(req => ({
      id: req.id,
      user: req.userName || 'User',
      document: req.documents ? req.documents.map(d => d.name).join(', ') : req.document,
      status: req.status,
      date: req.requestedDate
    }));

    setRecentRequests(recent);
  };

  const statusBadgeStyle = (status) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    backgroundColor: status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
    color: status === 'approved' ? '#10b981' : '#f59e0b',
    border: `1px solid ${status === 'approved' ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}`
  });

  return (
    <div className="container" style={{ padding: '2rem 0', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome back, {orgData.name || 'Organization'}
        </h1>
        <span style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid rgba(16,185,129,0.5)' }}>
          Verified Organization
        </span>
      </div>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.totalRequests}</div>
          <div style={{ color: '#475569', fontWeight: '500' }}>Total Requests</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.pendingRequests}</div>
          <div style={{ color: '#475569', fontWeight: '500' }}>Pending</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.approvedAccess}</div>
          <div style={{ color: '#475569', fontWeight: '500' }}>Approved</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.usersWithAccess}</div>
          <div style={{ color: '#475569', fontWeight: '500' }}>Users with Access</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/search-users" className="btn btn-primary">
            Search Users
          </Link>
          <Link to="/access-requests" className="btn btn-secondary">
            View All Requests
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Recent Access Requests</h2>
          <Link to="/access-requests" className="btn btn-secondary" style={{ padding: '8px 16px' }}>View All →</Link>
        </div>
        
        <div style={{ padding: '0', overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Document</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map(req => (
                <tr key={req.id}>
                  <td>{req.user}</td>
                  <td>{req.document}</td>
                  <td>{req.date}</td>
                  <td>
                    <span style={statusBadgeStyle(req.status)}>{req.status}</span>
                  </td>
                  <td>
                    {req.status === 'pending' ? (
                      <Link to={`/documents/${req.id}`} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>
                        View Details
                      </Link>
                    ) : (
                      <span style={{ opacity: 0.5 }}>Processed</span>
                    )}
                  </td>
                </tr>
              ))}
              {recentRequests.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', opacity: 0.6 }}>No recent requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboard;