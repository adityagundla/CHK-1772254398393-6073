import React, { useState, useEffect } from 'react';
import { fetchAllData } from '../services/api';

const AccessHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // all, uploaded

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    // Load locally tracked history (uploads, requests, approvals, etc.)
    const storedHistory = JSON.parse(localStorage.getItem('accessHistory') || '[]');

    // Include on-chain uploads (for blockchain visibility)
    try {
      const data = await fetchAllData();
      const blockchainHistory = data.map((item) => ({
        id: `chain-${item.id}`,
        organization: 'Blockchain',
        document: item.name,
        accessType: 'uploaded',
        timestamp: new Date().toISOString(),
        transactionHash: item.description || '',
        blockNumber: null,
        expiryDate: null,
        purpose: 'Uploaded to blockchain'
      }));

      setHistory([...storedHistory, ...blockchainHistory]);
    } catch (error) {
      console.error('Failed to fetch blockchain history:', error);
      setHistory(storedHistory);
    }
  };

  const verifyOnBlockchain = (txHash) => {
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  const filteredHistory = history
    .filter(item => (filter === 'all' ? true : item.accessType === filter))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const historyStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
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
    backgroundColor: active ? '#3498db' : '#e9ecef',
    color: active ? 'white' : '#495057'
  });

  const historyCardStyle = (type) => ({
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1rem'
  });

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  };

  const orgNameStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50'
  };

  const typeBadgeStyle = (type) => ({
    padding: '0.25rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    textTransform: 'capitalize',
    backgroundColor: type === 'granted' ? '#d4edda' : '#f8d7da',
    color: type === 'granted' ? '#155724' : '#721c24'
  });

  const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const detailItemStyle = {
    fontSize: '0.9rem'
  };

  const detailLabelStyle = {
    color: '#666',
    marginBottom: '0.25rem',
    fontSize: '0.85rem'
  };

  const detailValueStyle = {
    fontWeight: '500',
    wordBreak: 'break-all'
  };

  const txHashStyle = {
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: '#3498db',
    cursor: 'pointer',
    textDecoration: 'underline'
  };

  const purposeStyle = {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginTop: '1rem'
  };

  return (
    <div style={historyStyle}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Access History</h1>
      
      {/* Filter Buttons */}
      <div style={filterStyle}>
        {['all', 'uploaded'].map(filterType => (
          <button
            key={filterType}
            style={filterButtonStyle(filter === filterType)}
            onClick={() => setFilter(filterType)}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          No access history found
        </div>
      ) : (
        filteredHistory.map(item => (
          <div key={item.id} style={historyCardStyle(item.accessType)}>
            <div style={headerStyle}>
              <span style={orgNameStyle}>{item.organization}</span>
              <span style={typeBadgeStyle(item.accessType)}>
                {item.accessType}
              </span>
            </div>
            
            <div style={detailsGridStyle}>
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Document</div>
                <div style={detailValueStyle}>{item.document}</div>
              </div>
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Timestamp</div>
                <div style={detailValueStyle}>{item.timestamp}</div>
              </div>
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Expiry Date</div>
                <div style={detailValueStyle}>{item.expiryDate}</div>
              </div>
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Block Number</div>
                <div style={detailValueStyle}>{item.blockNumber}</div>
              </div>
            </div>
            
            <div style={detailsGridStyle}>
              <div style={{ ...detailItemStyle, gridColumn: 'span 2' }}>
                <div style={detailLabelStyle}>Transaction Hash</div>
                <div 
                  style={txHashStyle}
                  onClick={() => verifyOnBlockchain(item.transactionHash)}
                >
                  {item.transactionHash}
                </div>
              </div>
            </div>
            
            <div style={purposeStyle}>
              <div style={detailLabelStyle}>Purpose</div>
              <div>{item.purpose}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AccessHistory;