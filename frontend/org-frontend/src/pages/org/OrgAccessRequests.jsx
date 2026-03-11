import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAccessRequests } from '../../services/api';

const OrgAccessRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
    window.addEventListener('storage', fetchRequests);
    return () => window.removeEventListener('storage', fetchRequests);
  }, []);

  const fetchRequests = async () => {
    try {
      const orgData = JSON.parse(localStorage.getItem('orgData') || '{}');
      const organization = orgData.name || 'Organization';
      const sentRequests = await getAccessRequests({ organization });
      setRequests(sentRequests);
    } catch (error) {
      console.error("Failed to fetch sent requests:", error);
    }
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' ? true : req.status === filter
  );

  const handleViewDocument = async (doc) => {
    try {
      const orgAddress = '0x1111222233334444555566667777888899990000'; // matching dummy org address
      const response = await fetch(`http://127.0.0.1:5000/check-access?dataId=${doc.id}&user=${orgAddress}`);
      const result = await response.json();
      
      if (result.hasAccess) {
        window.open(doc.ipfsHash, '_blank');
      } else {
        alert("Access Denied: Blockchain permission check failed. Access may have been revoked.");
      }
    } catch (err) {
      console.error("Permission check failed", err);
      alert("Error verifying blockchain permissions. Backend might be unreachable.");
    }
  };

  const requestsStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#2c3e50'
  };

  const filterStyle = {
    display: 'flex',
    gap: '1rem'
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

  const requestCardStyle = (status) => ({
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    borderLeft: `4px solid ${
      status === 'approved' ? '#2ecc71' :
      status === 'rejected' ? '#e74c3c' :
      '#f39c12'
    }`
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
    backgroundColor: 
      status === 'approved' ? '#d4edda' :
      status === 'rejected' ? '#f8d7da' :
      '#fff3cd',
    color:
      status === 'approved' ? '#155724' :
      status === 'rejected' ? '#721c24' :
      '#856404'
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
    color: '#2c3e50'
  };

  const txHashStyle = {
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: '#3498db',
    wordBreak: 'break-all'
  };

  const noDataStyle = {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '10px',
    color: '#2c3e50'
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={requestsStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Access Requests</h1>
        {pendingCount > 0 && (
          <span style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            {pendingCount} Pending
          </span>
        )}
      </div>
      
      <div style={filterStyle}>
        {['all', 'pending', 'approved', 'rejected'].map(filterType => (
          <button
            key={filterType}
            style={filterButtonStyle(filter === filterType)}
            onClick={() => setFilter(filterType)}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            {filterType === 'pending' && pendingCount > 0 && ` (${pendingCount})`}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        {filteredRequests.length === 0 ? (
          <div style={noDataStyle}>
            <p>No {filter !== 'all' ? filter : ''} requests found</p>
            <Link to="/search-users" style={{ color: '#e74c3c', textDecoration: 'none' }}>
              Search for users to request access →
            </Link>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} style={requestCardStyle(request.status)}>
              <div style={headerRowStyle}>
                <span style={userNameStyle}>{request.userName}</span>
                <span style={statusBadgeStyle(request.status)}>{request.status}</span>
              </div>
              
              <div style={docListStyle}>
                <strong>Documents Requested:</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  {request.documents.map((doc, index) => (
                    <div key={index} style={{ marginBottom: '0.5rem' }}>
                      <span style={docTagStyle}>{doc.name}</span>
                      {request.status === 'approved' && (
                        <button 
                          onClick={() => handleViewDocument(doc)}
                          className="btn btn-primary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginLeft: '0.5rem' }}
                        >
                          View Document
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={purposeStyle}>
                <strong>Purpose:</strong> {request.purpose}
              </div>
              
              <div style={detailsGridStyle}>
                <div>
                  <div style={{ color: '#475569', fontSize: '0.85rem' }}>Requested Date</div>
                  <div style={{ fontWeight: '500', color: '#2c3e50' }}>{request.requestedDate}</div>
                </div>
                <div>
                  <div style={{ color: '#475569', fontSize: '0.85rem' }}>Expiry Date</div>
                  <div style={{ fontWeight: '500', color: '#2c3e50' }}>{request.expiryDate}</div>
                </div>
                <div>
                  <div style={{ color: '#475569', fontSize: '0.85rem' }}>User ID</div>
                  <div style={{ fontWeight: '500', color: '#2c3e50' }}>{request.userId}</div>
                </div>
                <div>
                  <div style={{ color: '#475569', fontSize: '0.85rem' }}>Blockchain TX</div>
                  <div style={txHashStyle}>{request.blockchainTx}</div>
                </div>
              </div>
              
              {request.status === 'pending' && (
                <div style={{ color: '#f39c12', fontSize: '0.9rem', textAlign: 'right' }}>
                  ⏳ Waiting for user approval
                </div>
              )}
              {request.status === 'approved' && (
                <div style={{ color: '#27ae60', fontSize: '0.9rem', textAlign: 'right' }}>
                  ✓ Access granted - Recorded on blockchain
                </div>
              )}
              {request.status === 'rejected' && (
                <div style={{ color: '#e74c3c', fontSize: '0.9rem', textAlign: 'right' }}>
                  ✗ Request rejected by user
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrgAccessRequests;