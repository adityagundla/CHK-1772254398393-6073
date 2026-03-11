import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllData } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingRequests: 0,
    approvedAccess: 0,
    walletBalance: '0 ETH'
  });

  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Connect to backend API
      const allData = await fetchAllData();
      
      const documents = allData.map((d, index) => {
        let dateStr = new Date().toISOString().split('T')[0];
        if (d.createdAt) {
          dateStr = new Date(parseInt(d.createdAt) * 1000).toISOString().split('T')[0];
        }
        return {
          id: index + 1,
          name: d.name || 'Document',
          date: dateStr,
          status: 'Verified',
          owner: d.owner
        };
      });

      // Get requests from localStorage for now, since we lack a GET requests endpoint in app.py
      const storedRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
      const history = JSON.parse(localStorage.getItem('accessHistory') || '[]');
      
      setStats({
        totalDocuments: documents.length,
        pendingRequests: storedRequests.filter(req => req.status === 'pending').length,
        approvedAccess: storedRequests.filter(req => req.status === 'approved').length,
        walletBalance: '0.00 ETH'
      });

      setRecentDocuments(documents);

      // Get 3 most recent activities
      const activity = history.map(item => {
        let dateStr = item.timestamp || '';
        try {
          if (dateStr && !dateStr.includes('T')) {
            dateStr = dateStr.replace(' ', 'T') + 'Z';
          }
          dateStr = new Date(dateStr).toISOString().split('T')[0];
        } catch (e) {
          dateStr = (item.timestamp || '').split(' ')[0];
        }
        return {
          id: item.id,
          action: item.accessType === 'granted' ? 'Access Granted' : 'Access Rejected',
          org: item.organization,
          doc: item.document,
          date: dateStr
        };
      }).slice(0, 3);

      setRecentActivity(activity);
    } catch (err) {
      console.error("Error fetching data backend interaction:", err);
    }
  };

  const statusBadgeStyle = (status) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    backgroundColor: status === 'Verified' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(245, 158, 11, 0.2)',
    color: status === 'Verified' ? '#38bdf8' : '#f59e0b',
    border: `1px solid ${status === 'Verified' ? 'rgba(56,189,248,0.5)' : 'rgba(245,158,11,0.5)'}`
  });

  return (
    <div className="container" style={{ padding: '2rem 0', position: 'relative', zIndex: 10 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Dashboard
      </h1>
      {/* Notification Banner */}
      {stats.pendingRequests > 0 && (
        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid #f59e0b', padding: '1rem 1.5rem', marginBottom: '2rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ color: '#d97706', fontSize: '1.1rem' }}>Attention Required</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-color)' }}>You have {stats.pendingRequests} pending access {stats.pendingRequests === 1 ? 'request' : 'requests'} that need your approval.</p>
          </div>
          <Link to="/access-requests" className="btn" style={{ backgroundColor: '#f59e0b', color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>Review Requests</Link>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalDocuments}</div>
          <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Total Documents</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.pendingRequests}</div>
          <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Pending Requests</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.approvedAccess}</div>
          <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Approved Access</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.walletBalance}</div>
          <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Wallet Balance</div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Recent Documents</h2>
          <Link to="/data-wallet" className="btn btn-primary">View All</Link>
        </div>
        <div style={{ padding: '0', overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Owner Address</th>
                <th>Upload Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDocuments.map(doc => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td style={{ opacity: 0.7, fontFamily: 'monospace' }}>{doc.owner ? doc.owner.substring(0,10)+'...' : 'N/A'}</td>
                  <td>{doc.date}</td>
                  <td>
                    <span style={statusBadgeStyle(doc.status)}>{doc.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Recent Activity</h2>
        </div>
        <div style={{ padding: '0', overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Details</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.action}</td>
                  <td>{activity.org || activity.doc}</td>
                  <td>{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;