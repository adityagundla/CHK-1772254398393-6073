import React, { useState, useEffect } from 'react';
import { fetchAllData, registerData, uploadFile } from '../services/api';

const DataWallet = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await fetchAllData();
      const mockDocs = data.map((item) => {
        let dateStr = new Date().toISOString().split('T')[0];
        if (item.createdAt) {
          dateStr = new Date(parseInt(item.createdAt) * 1000).toISOString().split('T')[0];
        }
        return {
          id: item.id,
          name: item.name,
          type: 'DOC',
          size: '1.0 MB',
          date: dateStr,
          ipfsHash: item.ipfsHash ? `https://gateway.pinata.cloud/ipfs/${item.ipfsHash}` : '',
          blockchainTx: item.description,
          sharedWith: []
        };
      });

      // Filter unique by id/name from mockDocs (Blockchain returned docs)
      const uniqueDocs = Array.from(new Map(mockDocs.map(item => [item.name, item])).values());
      
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

      const downloadURL = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

      // 2. Register metadata string representation on Blockchain
      const res = await registerData(selectedFile.name, 'Uploaded: ' + selectedFile.name, ipfsHash);
      const txHash = res.transaction || 'Blockchain Registration Failed';

      const newDoc = {
        id: documents.length + 1,
        name: selectedFile.name,
        type: selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        date: new Date().toISOString().split('T')[0],
        ipfsHash: downloadURL, // Link directly instead of just hash 
        blockchainTx: txHash,
        sharedWith: []
      };

      // Removed Supabase dependencies as requested, updating local state directly

      setDocuments([newDoc, ...documents]);

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

  const handleRevokeAccess = (docId, org) => {
    // Handle revoke access
    console.log(`Revoking ${org} access to document ${docId}`);
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
    marginBottom: '2rem'
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
    marginBottom: '1rem'
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
    borderRadius: '8px'
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