import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrgProfile = () => {
  const navigate = useNavigate();
  const [orgData, setOrgData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [stats, setStats] = useState({ totalRequests: 0, approvedAccess: 0, usersWithAccess: 0 });

  useEffect(() => {
    const storedOrg = JSON.parse(localStorage.getItem('orgData') || '{}');
    setOrgData(storedOrg);
    setFormData(storedOrg);
    
    const sentRequests = JSON.parse(localStorage.getItem('orgSentRequests') || '[]');
    setStats({
      totalRequests: sentRequests.length,
      approvedAccess: sentRequests.filter(req => req.status === 'approved').length,
      usersWithAccess: new Set(sentRequests.filter(req => req.status === 'approved').map(req => req.userId)).size
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    localStorage.setItem('orgData', JSON.stringify(formData));
    setOrgData(formData);
    setIsEditing(false);
  };

  const profileStyle = {
    padding: '2rem',
    maxWidth: '1000px',
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

  const editButtonStyle = {
    padding: '0.75rem 2rem',
    backgroundColor: isEditing ? '#27ae60' : '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  };

  const profileCardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const sectionStyle = {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #eee'
  };

  const sectionTitleStyle = {
    fontSize: '1.3rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem'
  };

  const infoItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500'
  };

  const valueStyle = {
    fontSize: '1.1rem',
    color: '#2c3e50',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '2px solid #e0e0e0',
    borderRadius: '5px',
    fontSize: '1rem',
    width: '100%'
  };

  const badgeStyle = (verified) => ({
    display: 'inline-block',
    padding: '0.25rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    backgroundColor: verified ? '#d4edda' : '#fff3cd',
    color: verified ? '#155724' : '#856404',
    marginLeft: '1rem'
  });

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginTop: '1rem'
  };

  const statCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center'
  };

  const statValueStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: '0.5rem'
  };

  return (
    <div style={profileStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          Organization Profile
          <span style={badgeStyle(orgData.verified)}>
            {orgData.verified ? '✓ Verified' : '⏳ Pending Verification'}
          </span>
        </h1>
        <button
          style={editButtonStyle}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div style={profileCardStyle}>
        {/* Organization Details Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>
            <span>🏢</span> Organization Details
          </h3>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Organization Name</span>
              {isEditing ? (
                <input
                  style={inputStyle}
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                />
              ) : (
                <span style={valueStyle}>{orgData.name}</span>
              )}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Organization Email</span>
              {isEditing ? (
                <input
                  style={inputStyle}
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                />
              ) : (
                <span style={valueStyle}>{orgData.email}</span>
              )}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Organization ID</span>
              <span style={valueStyle}>{orgData.id}</span>
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Registration Number</span>
              <span style={valueStyle}>{orgData.registrationNumber}</span>
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Organization Type</span>
              {isEditing ? (
                <select
                  style={inputStyle}
                  name="type"
                  value={formData.type || ''}
                  onChange={handleChange}
                >
                  <option value="financial">Financial Institution</option>
                  <option value="healthcare">Healthcare Provider</option>
                  <option value="education">Educational Institution</option>
                  <option value="government">Government Agency</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <span style={valueStyle}>{orgData.type}</span>
              )}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Registered Date</span>
              <span style={valueStyle}>
                {new Date(orgData.registeredAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>
            <span>📞</span> Contact Information
          </h3>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Phone Number</span>
              {isEditing ? (
                <input
                  style={inputStyle}
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              ) : (
                <span style={valueStyle}>{orgData.phone || 'Not provided'}</span>
              )}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Address</span>
              {isEditing ? (
                <input
                  style={inputStyle}
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                />
              ) : (
                <span style={valueStyle}>{orgData.address || 'Not provided'}</span>
              )}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Website</span>
              {isEditing ? (
                <input
                  style={inputStyle}
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                />
              ) : (
                <span style={valueStyle}>
                  {orgData.website ? (
                    <a href={orgData.website} target="_blank" rel="noopener noreferrer">
                      {orgData.website}
                    </a>
                  ) : 'Not provided'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div>
          <h3 style={sectionTitleStyle}>
            <span>📊</span> Statistics
          </h3>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{stats.totalRequests}</div>
              <div style={{ color: '#666' }}>Total Requests</div>
            </div>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{stats.approvedAccess}</div>
              <div style={{ color: '#666' }}>Approved</div>
            </div>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{stats.usersWithAccess}</div>
              <div style={{ color: '#666' }}>Users with Access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgProfile;