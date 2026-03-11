import React, { useState, useEffect } from 'react';
import { fetchAllData, registerData, uploadFile, revokeAccess as apiRevokeAccess, getAccessRequests, registerUser } from '../services/api';

const DataWallet = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    const syncUserAndFetch = async () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.uid) {
        try {
          // Sync user to PostgreSQL if not already there
          await registerUser({
            id: currentUser.uid,
            name: currentUser.name || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email
          });
        } catch (err) {
          console.error("Failed to sync user profile:", err);
        }
      }
      fetchDocuments();
    };
    
    syncUserAndFetch();
  }, []);

  const fetchDocuments = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.uid || 'anonymous';
      const data = await fetchAllData(userId);
      const mockDocs = data.map((item) => {
        let dateStr = item.date || new Date().toISOString().split('T')[0];
        return {
          id: item.id,
          name: item.name,
          type: 'DOC',
          size: '1.0 MB',
          date: dateStr,
          ipfsHash: item.ipfsHash ? `https://gateway.pinata.cloud/ipfs/${item.ipfsHash}` : '',
          blockchainTx: item.blockchainTx,
          sharedWith: []
        };
      });

      // Filter unique by id/name from mockDocs (Blockchain returned docs)
      const storedRequests = await getAccessRequests({ userId });
      const uniqueDocs = mockDocs.map(doc => {
        const sharedOrgs = storedRequests
          .filter(req => req.status === 'approved' && (req.document === doc.name || (req.documents && req.documents.some(d => d.name === doc.name))))
          .map(req => req.organization);
        
        return {
          ...doc,
          sharedWith: [...new Set(sharedOrgs)]
        };
      });
      
      setDocuments(uniqueDocs);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.uid || 'anonymous';

      // 1. Upload to Pinata via our backend
      const uploadRes = await uploadFile(selectedFile);
      const ipfsHash = uploadRes.ipfsHash;
      
      if (!ipfsHash) throw new Error("Did not receive IPFS hash from Pinata.");

      const fileType = selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE';
      const fileSize = `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;

      // 2. Register metadata string representation on Blockchain and Postgres
      const res = await registerData(
        selectedFile.name, 
        'Uploaded: ' + selectedFile.name, 
        ipfsHash,
        userId,
        fileType,
        fileSize
      );
      const txHash = res.transaction || 'Blockchain Registration Failed';

      // Refresh documents list from server
      fetchDocuments();

      // Record the upload in access history so it shows up in Access History.
      const history = JSON.parse(localStorage.getItem('accessHistory') || '[]');
      history.unshift({
        id: Date.now(),
        organization: 'You',
        document: selectedFile.name,
        accessType: 'uploaded',
        timestamp: new Date().toISOString(),
        transactionHash: txHash,
        blockNumber: null,
        expiryDate: null,
        purpose: 'Document uploaded to IPFS and registered'
      });
      localStorage.setItem('accessHistory', JSON.stringify(history));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Upload failed:', error);

      let message = 'Upload failed.';
      if (error.response?.data) {
        message += ` ${JSON.stringify(error.response.data)}`;
      } else if (error.message) {
        message += ` ${error.message}`;
      }

      alert(message);
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setFilePreview(null);
      const input = document.getElementById('fileInput');
      if (input) input.value = '';
    }
  };

  const handleRevokeAccess = async (docId, org) => {
    if (!window.confirm(`Are you sure you want to revoke access from ${org}?`)) return;

    try {
      const orgAddress = '0x1111222233334444555566667777888899990000';
      const res = await apiRevokeAccess(docId, orgAddress);
      const txHash = res.transaction || '0x' + Math.random().toString(36).substring(7);

      setDocuments(prevDocs => prevDocs.map(d => {
        if (d.id === docId) {
          return { ...d, sharedWith: d.sharedWith.filter(o => o !== org) };
        }
        return d;
      }));

      // Update accessRequests to reflect revoked status
      const storedRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
      const updatedRequests = storedRequests.map(req => {
        if (req.organization === org && req.status === 'approved' && (req.document === (documents.find(d => d.id === docId)?.name) || (req.documents && req.documents.some(d => d.id === docId)))) {
           return { ...req, status: 'revoked' };
        }
        return req;
      });
      localStorage.setItem('accessRequests', JSON.stringify(updatedRequests));

      const history = JSON.parse(localStorage.getItem('accessHistory') || '[]');
      history.push({
        id: Date.now(),
        organization: org,
        document: documents.find(d => d.id === docId)?.name || docId,
        accessType: 'revoked',
        timestamp: new Date().toISOString(),
        transactionHash: txHash,
        purpose: 'Access explicitly revoked'
      });
      localStorage.setItem('accessHistory', JSON.stringify(history));

      // Log to PostgreSQL (Requirement 10)
      try {
        await fetch('http://127.0.0.1:5000/log-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: JSON.parse(localStorage.getItem('user') || '{}').uid || 'anonymous',
            organization: org,
            documentNames: documents.find(d => d.id === docId)?.name || String(docId),
            action: 'revoke',
            txHash: txHash
          })
        });
      } catch (err) {
        console.error('Failed to log to PostgreSQL', err);
      }

      alert('Access revoked successfully!');
    } catch (error) {
      console.error('Revoke access failed:', error);
      alert('Failed to revoke access.');
    }
  };

  const dataWalletStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const uploadSectionStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    color: '#2c3e50'
  };

  const fileInputStyle = {
    padding: '1rem',
    border: '2px dashed #3498db',
    borderRadius: '10px',
    width: '100%',
    cursor: 'pointer',
    marginBottom: '1rem'
  };

  const previewStyle = {
    maxWidth: '200px',
    maxHeight: '200px',
    marginTop: '1rem',
    borderRadius: '5px'
  };

  const documentCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    color: '#2c3e50'
  };

  const docHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  };

  const docTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50'
  };

  const docBadgeStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    backgroundColor: '#e9ecef',
    color: '#495057'
  };

  const docDetailsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#2c3e50'
  };

  const detailItemStyle = {
    fontSize: '0.9rem'
  };

  const detailLabelStyle = {
    color: '#666',
    marginBottom: '0.25rem'
  };

  const detailValueStyle = {
    fontWeight: '500',
    wordBreak: 'break-all'
  };

  const sharedWithStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center'
  };

  const orgTagStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <div style={dataWalletStyle}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Data Wallet</h1>
      
      {/* Upload Section */}
      <div style={uploadSectionStyle}>
        <h2 style={{ marginBottom: '1rem' }}>Upload New Document</h2>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileSelect}
          style={fileInputStyle}
        />
        
        {filePreview && (
          <div style={{ textAlign: 'center' }}>
            {selectedFile?.type.startsWith('image/') ? (
              <img src={filePreview} alt="Preview" style={previewStyle} />
            ) : (
              <p>Selected file: {selectedFile?.name}</p>
            )}
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          {uploading ? 'Uploading...' : 'Upload to IPFS & Blockchain'}
        </button>
      </div>

      {/* Documents List */}
      <h2 style={{ marginBottom: '1rem' }}>Your Documents</h2>
      
      {documents.map(doc => (
        <div key={doc.id} style={documentCardStyle}>
          <div style={docHeaderStyle}>
            <span style={docTitleStyle}>{doc.name}</span>
            <span style={docBadgeStyle}>{doc.type}</span>
          </div>
          
          <div style={docDetailsStyle}>
            <div style={detailItemStyle}>
              <div style={detailLabelStyle}>Size</div>
              <div style={detailValueStyle}>{doc.size}</div>
            </div>
            <div style={detailItemStyle}>
              <div style={detailLabelStyle}>Upload Date</div>
              <div style={detailValueStyle}>{doc.date}</div>
            </div>
            <div style={detailItemStyle}>
              <div style={detailLabelStyle}>IPFS Hash</div>
              <div style={detailValueStyle}>{doc.ipfsHash}</div>
            </div>
            <div style={detailItemStyle}>
              <div style={detailLabelStyle}>Blockchain Tx</div>
              <div style={detailValueStyle}>{doc.blockchainTx}</div>
            </div>
          </div>
          
          <div>
            <div style={{ ...detailLabelStyle, marginBottom: '0.5rem' }}>
              Shared With:
            </div>
            <div style={sharedWithStyle}>
              {doc.sharedWith.map((org, index) => (
                <span key={index} style={orgTagStyle}>
                  {org}
                  <button
                    onClick={() => handleRevokeAccess(doc.id, org)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d32f2f',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '0 0 0 5px'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              {doc.sharedWith.length === 0 && (
                <span style={{ color: '#999' }}>Not shared with any organization</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataWallet;