import React, { useState, useEffect } from 'react';
import { searchUsers } from '../../services/api';
import { Link } from 'react-router-dom';

const OrgSearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial load - show all users
    handleSearch({ preventDefault: () => {} });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const users = await searchUsers(searchTerm);
      setSearchResults(users);
    } catch (error) {
       console.error("Failed to fetch search data", error);
    } finally {
       setLoading(false);
    }
  };

  const searchStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const searchBoxStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#2c3e50'
  };

  const searchFormStyle = {
    display: 'flex',
    gap: '1rem'
  };

  const inputStyle = {
    flex: 1,
    padding: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease'
  };

  const searchButtonStyle = {
    padding: '1rem 2rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  };

  const userCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const userInfoStyle = {
    flex: 1
  };

  const userNameStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  };

  const userEmailStyle = {
    color: '#666',
    marginBottom: '0.5rem'
  };

  const docTagsStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  };

  const docTagStyle = {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#e9ecef',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: '#495057'
  };

  const requestButtonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none'
  };

  const noResultsStyle = {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '10px',
    color: '#2c3e50',
    border: '1px solid #e2e8f0'
  };

  return (
    <div style={searchStyle}>
      <h1 style={titleStyle}>Search Users</h1>
      
      <div style={searchBoxStyle}>
        <form style={searchFormStyle} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={searchButtonStyle} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {searched && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>
            Search Results {searchResults.length > 0 && `(${searchResults.length})`}
          </h2>
          
          {searchResults.length === 0 ? (
            <div style={noResultsStyle}>
              <p>No users found matching "{searchTerm}"</p>
            </div>
          ) : (
            searchResults.map(user => (
              <div key={user.id} style={userCardStyle}>
                <div style={userInfoStyle}>
                  <div style={userNameStyle}>{user.name}</div>
                  <div style={userEmailStyle}>{user.email}</div>
                  <div style={docTagsStyle}>
                    {user.documents.map((doc, index) => (
                      <span key={index} style={docTagStyle}>{doc.name || doc}</span>
                    ))}
                  </div>
                </div>
                <Link 
                  to={`/documents/${user.id}`}
                  style={requestButtonStyle}
                >
                  Request Access
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrgSearchUsers;