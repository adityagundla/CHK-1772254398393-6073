import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginOrg } from '../../auth';

const OrgLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    orgId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password || !formData.orgId) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const { orgData } = await loginOrg({
        email: formData.email,
        password: formData.password,
        orgId: formData.orgId
      });

      // Keep the same storage shape for other parts of the app
      localStorage.setItem('orgData', JSON.stringify(orgData));
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

 

  const loginStyle = {
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    padding: '2rem'
  };

  const formContainerStyle = {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '0.5rem',
    textAlign: 'center'
  };

  const subtitleStyle = {
    textAlign: 'center',
    color: '#666',
    marginBottom: '2rem',
    fontSize: '0.9rem'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease'
  };

  const buttonStyle = {
    padding: '0.75rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const demoButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#27ae60',
    marginTop: '0.5rem'
  };

  const linkStyle = {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#666'
  };

  const errorStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem',
    borderRadius: '5px',
    marginBottom: '1rem'
  };

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '1rem 0',
    color: '#999'
  };

  const lineStyle = {
    flex: 1,
    height: '1px',
    backgroundColor: '#ddd'
  };

  const switchRoleStyle = {
    marginTop: '2rem',
    padding: '1rem',
    borderTop: '1px solid #eee',
    textAlign: 'center'
  };

  return (
    <div style={loginStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Organization Login</h1>
        <p style={subtitleStyle}>Access the DataChain organization portal</p>
        
        {error && <div style={errorStyle}>{error}</div>}
        
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="orgId">Organization ID</label>
            <input
              style={inputStyle}
              type="text"
              id="orgId"
              name="orgId"
              value={formData.orgId}
              onChange={handleChange}
              placeholder="Enter your organization ID"
              required
              disabled={loading}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input
              style={inputStyle}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter organization email"
              required
              disabled={loading}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="password">Password</label>
            <input
              style={inputStyle}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          
          <button 
            style={buttonStyle} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Organization'}
          </button>
        </form>

     
        
        <div style={linkStyle}>
          <Link to="/signup" style={{ color: '#e74c3c' }}>Register New Organization</Link>
        </div>

    
      </div>
    </div>
  );
};

export default OrgLogin;