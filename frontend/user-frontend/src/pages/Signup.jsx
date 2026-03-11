import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../auth';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { userData } = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('user', JSON.stringify({
        ...userData,
        registeredAt: new Date().toISOString()
      }));
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '3rem',
        margin: 0
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(to right, #38bdf8, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Create Account</h1>
        
        {error && <div style={{
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          color: '#f43f5e',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid rgba(244, 63, 94, 0.3)'
        }}>{error}</div>}
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }} htmlFor="name">Full Name</label>
            <input
              style={{
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                background: 'white',
                color: '#000000',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }} htmlFor="email">Email</label>
            <input
              style={{
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                background: 'white',
                color: '#000000',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }} htmlFor="password">Password</label>
            <input
              style={{
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                background: 'white',
                color: '#000000',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Minimum 8 characters</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }} htmlFor="confirmPassword">Confirm Password</label>
            <input
              style={{
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                background: 'white',
                color: '#000000',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button 
            className="btn btn-primary"
            style={{ marginTop: '1rem', width: '100%', padding: '1rem' }} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#4b5563' }}>
          Already have an account? <Link to="/login" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-color)', opacity: 0.5 }}>
          By signing up, you agree to our Terms and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default Signup;