import React, { useState, useEffect } from 'react';

const AccessRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
    // Listen for new requests
    window.addEventListener('storage', fetchRequests);
    return () => window.removeEventListener('storage', fetchRequests);
  }, []);

  const fetchRequests = async () => {
    // Get requests from localStorage (simulating blockchain/backend)
    const storedRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.uid;

    // Only show requests addressed to the logged-in user
    const filtered = storedRequests
      .filter(req => req.userId === userId || req.userEmail === currentUser.email)
      .map(req => ({
        id: req.id,
        userName: req.userName,
        organization: req.organization,
        documents: req.documents ? req.documents.map(d => ({ name: d.name, id: d.id })) : [],
        purpose: req.purpose,
        requestedDate: req.requestedDate,
        expiryDate: req.expiryDate,
        status: req.status,
        blockchainTx: req.blockchainTx,
        userId: req.userId
      }));

    setRequests(filtered);
  };

  const handleRequest = (requestId, action) => {
    // Update request status
    const storedRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const updatedRequests = storedRequests.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: action === 'approve' ? 'approved' : 'rejected',
            responseDate: new Date().toISOString().split('T')[0],
            blockchainTx: '0x' + Math.random().toString(36).substring(7)
          }
        : req
    );
    
    localStorage.setItem('accessRequests', JSON.stringify(updatedRequests));

    const request = updatedRequests.find(r => r.id === requestId);

    // Update orgSentRequests as well
    const orgRequests = JSON.parse(localStorage.getItem('orgSentRequests') || '[]');
    const updatedOrgRequests = orgRequests.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: action === 'approve' ? 'approved' : 'rejected',
            responseDate: new Date().toISOString().split('T')[0],
            blockchainTx: request.blockchainTx || '0x' + Math.random().toString(36).substring(7)
          }
        : req
    );
    localStorage.setItem('orgSentRequests', JSON.stringify(updatedOrgRequests));
    
    // Add to access history
    const history = JSON.parse(localStorage.getItem('accessHistory') || '[]');
    history.push({
      id: Date.now(),
      organization: request.organization,
      document: request.documents ? request.documents.map(d => d.name).join(', ') : request.document,
      accessType: action === 'approve' ? 'granted' : 'rejected',
      timestamp: new Date().toISOString(),
      transactionHash: request.blockchainTx,
      purpose: request.purpose
    });
    localStorage.setItem('accessHistory', JSON.stringify(history));

    // Refresh requests
    fetchRequests();
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' ? true : req.status === filter
  );

  const requestsStyle = {
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

  const orgHeaderStyle = {
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
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  };

  const notificationBadgeStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    marginLeft: '0.5rem'
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={requestsStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Access Requests</h1>
        {pendingCount > 0 && (
          <span style={notificationBadgeStyle}>{pendingCount}</span>
        )}
      </div>
      
      {/* Filter Buttons */}
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

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          No {filter !== 'all' ? filter : ''} requests found
        </div>
      ) : (
        filteredRequests.map(request => (
          <div key={request.id} style={requestCardStyle(request.status)}>
            <div style={orgHeaderStyle}>
              <span style={orgNameStyle}>{request.organization}</span>
              <span style={statusBadgeStyle(request.status)}>{request.status}</span>
            </div>
            
            <div style={purposeStyle}>
              <strong>Document Requested:</strong> {request.document || (request.documents ? request.documents.map(d => d.name).join(', ') : '')}
            </div>
            
            <div style={purposeStyle}>
              <strong>Purpose:</strong> {request.purpose}
            </div>
            
            <div style={detailsGridStyle}>
              <div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>Requested Date</div>
                <div style={{ fontWeight: '500' }}>{request.requestedDate}</div>
              </div>
              <div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>Expiry Date</div>
                <div style={{ fontWeight: '500' }}>{request.expiryDate}</div>
              </div>
            </div>
            
            {request.status === 'pending' && (
              <div style={actionButtonsStyle}>
                <button
                  onClick={() => handleRequest(request.id, 'reject')}
                  className="btn btn-danger"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleRequest(request.id, 'approve')}
                  className="btn btn-secondary"
                >
                  Approve & Record on Blockchain
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AccessRequests;