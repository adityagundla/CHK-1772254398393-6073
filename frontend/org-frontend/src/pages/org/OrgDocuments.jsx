import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestAccess, fetchAllData, getUser as fetchUserData } from '../../services/api';

const OrgDocuments = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [requestPurpose, setRequestPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch user metadata from Postgres
        const userData = await fetchUserData(userId);
        setUser(userData);

        // Fetch user documents from Postgres
        const dbDocs = await fetchAllData(userId);
        setDocuments(dbDocs.map(doc => ({
          ...doc,
          id: doc.id,
          name: doc.name,
          date: doc.date
        })));
      } catch (error) {
        console.error("Failed to fetch user or documents:", error);
        setUser({ id: userId, name: 'User', email: 'unknown' });
      }
    };
    
    loadData();
  }, [userId]);

  const handleDocSelect = (docId) => {
    setSelectedDocs(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map(doc => doc.id));
    }
  };

    const sendAccessRequest = async () => {
      if (selectedDocs.length === 0) {
        alert('Please select at least one document');
        return;
      }

      if (!requestPurpose.trim()) {
        alert('Please provide a purpose for the request');
        return;
      }

      setLoading(true);

      // Create request object
      const selectedDocuments = documents.filter(doc => selectedDocs.includes(doc.id));
      const orgData = JSON.parse(localStorage.getItem('orgData') || '{}');
      const requestData = {
        dataId: selectedDocs[0], // primary doc ID for the contract method
        userId: userId,
        userName: user.name,
        userEmail: user.email,
        organization: orgData.name || 'Organization',
        documents: selectedDocuments,
        document: selectedDocuments.map((d) => d.name).join(', '),
        purpose: requestPurpose,
        requestedDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      try {
        await requestAccess(requestData);
        setLoading(false);
        setRequestSent(true);
        setTimeout(() => {
          navigate('/access-requests');
        }, 2000);
      } catch (err) {
        setLoading(false);
        alert('Failed to send access request. ' + (err.response?.data?.message || err.message));
      }
    };

  const pageStyle = {
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
    marginBottom: '0.5rem'
  };

  const userInfoStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    color: '#2c3e50'
  };

  const docsSectionStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    color: '#2c3e50'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem'
  };

  const thStyle = {
    textAlign: 'left',
    padding: '1rem',
    borderBottom: '2px solid #dee2e6',
    backgroundColor: '#f8f9fa'
  };

  const tdStyle = {
    padding: '1rem',
    borderBottom: '1px solid #dee2e6',
    color: '#2c3e50'
  };

  const checkboxStyle = {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  };

  const purposeSectionStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    color: '#2c3e50'
  };

  const textareaStyle = {
    width: '100%',
    padding: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    minHeight: '100px',
    marginTop: '1rem'
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  };

  const cancelButtonStyle = {
    padding: '1rem 2rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  };

  const sendButtonStyle = {
    padding: '1rem 2rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  };

  const successMessageStyle = {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center'
  };

  if (requestSent) {
    return (
      <div style={pageStyle}>
        <div style={successMessageStyle}>
          <h3>✓ Access Request Sent Successfully!</h3>
          <p>Redirecting to your requests page...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Request Document Access</h1>
      </div>

      <div style={userInfoStyle}>
        <h3 style={{ marginBottom: '1rem' }}>User Information</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.id}</p>
      </div>

      <div style={docsSectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Available Documents</h3>
          {documents.length > 0 && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={selectedDocs.length === documents.length}
                onChange={handleSelectAll}
                style={checkboxStyle}
              />
              Select All
            </label>
          )}
        </div>

        {documents.length === 0 ? (
          <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '10px', textAlign: 'center' }}>
            No documents have been uploaded by this user yet.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Select</th>
                <th style={thStyle}>Document Name</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => handleDocSelect(doc.id)}
                      style={checkboxStyle}
                    />
                  </td>
                  <td style={tdStyle}>{doc.name}</td>
                  <td style={tdStyle}>{doc.type}</td>
                  <td style={tdStyle}>{doc.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={purposeSectionStyle}>
        <h3 style={{ marginBottom: '1rem' }}>Request Purpose</h3>
        <p style={{ color: '#666', marginBottom: '0.5rem' }}>
          Please explain why you need access to these documents:
        </p>
        <textarea
          value={requestPurpose}
          onChange={(e) => setRequestPurpose(e.target.value)}
          placeholder="e.g., Identity verification for loan application, Medical records for insurance claim, etc."
          style={textareaStyle}
        />
      </div>

      <div style={actionButtonsStyle}>
        <button 
          onClick={() => navigate('/search-users')}
          style={cancelButtonStyle}
        >
          Cancel
        </button>
        <button 
          onClick={sendAccessRequest}
          style={sendButtonStyle}
          disabled={loading || selectedDocs.length === 0 || documents.length === 0}
        >
          {loading ? 'Sending Request...' : 'Send Access Request'}
        </button>
      </div>
    </div>
  );
};

export default OrgDocuments;