import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrgAccessHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    // Get all requests and filter approved/rejected ones
    const sentRequests = JSON.parse(localStorage.getItem('orgSentRequests') || '[]');
    const accessHistory = sentRequests.filter(req => 
      req.status === 'approved' || req.status === 'rejected'
    ).sort((a, b) => new Date(b.responseDate) - new Date(a.responseDate));
    
    setHistory(accessHistory);
  };

  const filteredHistory = history.filter(item => 
    filter === 'all' ? true : item.status === filter
  );

  const historyStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '1rem'
  };

  const filterStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const filterButtonStyle = (active) => ({
    padding: '0.5rem 1.5rem',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    backgroundColor: active ? '#e74c3c' : '#e9ecef',
    color: active ? 'white' : '#495057'
  });

  const historyCardStyle = (status) => ({
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1rem'
  });

  const headerRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  };

  const userNameStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50'
  };

  const statusBadgeStyle = (status) => ({
    padding: '0.25rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    textTransform: 'capitalize',
    backgroundColor: status === 'approved' ? '#d4edda' : '#f8d7da',
    color: status === 'approved' ? '#155724' : '#721c24'
  });

  const docListStyle = {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const docTagStyle = {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#e9ecef',
    borderRadius: '20px',
    fontSize: '0.85rem',
    margin: '0.25rem',
    color: '#495057'
  };

  const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const purposeStyle = {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontStyle: 'italic',
    color: '#666'
  };

  const txHashStyle = {
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: '#3498db',
    wordBreak: 'break-all',
    cursor: 'pointer',
    textDecoration: 'underline'
  };

  const noDataStyle = {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '10px',
    color: '#666'
  };

  const verifyOnBlockchain = (txHash) => {
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  return (
    <div style={historyStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Access History</h1>
        <p style={{ color: '#666' }}>Complete record of all your access requests</p>
      </div>
      
      <div style={filterStyle}>
        {['all', 'approved', 'rejected'].map(filterType => (
          <button
            key={filterType}
            style={filterButtonStyle(filter === filterType)}
            onClick={() => setFilter(filterType)}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {filteredHistory.length === 0 ? (
          <div style={noDataStyle}>
            <p>No access history found</p>
            <Link to="/search-users" style={{ color: '#e74c3c', textDecoration: 'none' }}>
              Request access to users →
            </Link>
          </div>
        ) : (
          filteredHistory.map(item => (
            <div key={item.id} style={historyCardStyle(item.status)}>
              <div style={headerRowStyle}>
                <span style={userNameStyle}>{item.userName}</span>
                <span style={statusBadgeStyle(item.status)}>{item.status}</span>
              </div>
              
              <div style={docListStyle}>
                <strong>Documents:</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  {item.documents.map((doc, index) => (
                    <span key={index} style={docTagStyle}>{doc.name}</span>
                  ))}
                </div>
              </div>
              
              <div style={purposeStyle}>
                <strong>Purpose:</strong> {item.purpose}
              </div>
              
              <div style={detailsGridStyle}>
                <div>
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>Requested</div>
                  <div style={{ fontWeight: '500' }}>{item.requestedDate}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>Responded</div>
                  <div style={{ fontWeight: '500' }}>{item.responseDate || item.requestedDate}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>Expiry</div>
                  <div style={{ fontWeight: '500' }}>{item.expiryDate}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>Blockchain</div>
                  <div 
                    style={txHashStyle}
                    onClick={() => verifyOnBlockchain(item.blockchainTx)}
                  >
                    {item.blockchainTx}
                  </div>
                </div>
              </div>
              
              {item.status === 'approved' && (
                <div style={{ 
                  backgroundColor: '#d4edda', 
                  color: '#155724', 
                  padding: '0.5rem',
                  borderRadius: '5px',
                  fontSize: '0.9rem'
                }}>
                  ✓ Access granted - Valid until {item.expiryDate}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrgAccessHistory;