import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const { userData } = await login({
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('user', JSON.stringify({
        ...userData,
        loginTime: new Date().toISOString()
      }));
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };


    
 

  const loginStyle = {
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    marginBottom: '2rem',
    textAlign: 'center'
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
    color: '#1e293b',
    fontWeight: '600'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '5px',
    fontSize: '1rem',
    color: '#000000',
    transition: 'border-color 0.3s ease'
  };

  const buttonStyle = {
    padding: '0.75rem',
    backgroundColor: '#3498db',
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

  return (
    <div style={loginStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Welcome Back</h1>
        
        {error && <div style={errorStyle}>{error}</div>}
        
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input
              style={inputStyle}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
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
            />
          </div>
          
          <button 
            style={buttonStyle} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

       
        
        <div style={linkStyle}>
          Don't have an account? <Link to="/signup" style={{ color: '#3498db' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;