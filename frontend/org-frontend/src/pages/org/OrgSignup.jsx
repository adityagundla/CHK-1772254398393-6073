import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupOrg } from '../../auth';

const OrgSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orgName: '',
    orgEmail: '',
    orgId: '',
    registrationNumber: '',
    password: '',
    confirmPassword: '',
    orgType: 'financial', // financial, healthcare, education, other
    address: '',
    phone: '',
    website: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    if (!formData.orgName || !formData.orgEmail || !formData.orgId || !formData.registrationNumber) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.orgEmail.includes('@') || !formData.orgEmail.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all password fields');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setError('');
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      handleNextStep();
      return;
    }

    if (step === 2 && !validateStep2()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { orgData } = await signupOrg({
        orgName: formData.orgName,
        orgEmail: formData.orgEmail,
        orgId: formData.orgId,
        registrationNumber: formData.registrationNumber,
        password: formData.password,
        orgType: formData.orgType,
        address: formData.address,
        phone: formData.phone,
        website: formData.website
      });

      localStorage.setItem('orgData', JSON.stringify(orgData));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    width: '100%'
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
        maxWidth: '600px',
        padding: '3rem',
        margin: 0
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '0.5rem',
          textAlign: 'center',
          background: 'linear-gradient(to right, #10b981, #34d399)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Register Organization</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-color)', opacity: 0.8, marginBottom: '2rem', fontSize: '0.9rem' }}>Join DataChain as a verified organization</p>
        
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--glass-border)', zIndex: 1 }}></div>
          {[1,2].map((s) => (
            <div key={s} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: step > s ? '#10b981' : (step === s ? '#10b981' : 'rgba(255,255,255,0.1)'), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '0.5rem', boxShadow: step === s ? '0 0 10px rgba(16,185,129,0.5)' : 'none' }}>
                {s}
              </div>
              <span style={{ fontSize: '0.85rem', color: step === s ? 'white' : 'var(--text-color)', opacity: step === s ? 1 : 0.6, fontWeight: step === s ? '600' : 'normal' }}>
                {s === 1 ? 'Organization' : 'Security'}
              </span>
            </div>
          ))}
        </div>
        
        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>}
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #10b981' }}>Organization Details</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>
                    Organization Name <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                  </label>
                  <input
                    style={inputStyle}
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>
                    Organization Email <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                  </label>
                  <input
                    style={inputStyle}
                    type="email"
                    name="orgEmail"
                    value={formData.orgEmail}
                    onChange={handleChange}
                    placeholder="Enter official email"
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>
                    Organization ID <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                  </label>
                  <input
                    style={inputStyle}
                    type="text"
                    name="orgId"
                    value={formData.orgId}
                    onChange={handleChange}
                    placeholder="Enter unique organization ID"
                    required
                  />
                  <small style={{ color: 'var(--text-color)', opacity: 0.6 }}>This will be your unique identifier on the platform</small>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>
                    Registration Number <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                  </label>
                  <input
                    style={inputStyle}
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Enter business registration number"
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>Organization Type</label>
                  <select
                    style={{ ...inputStyle, backgroundColor: '#0f172a' }}
                    name="orgType"
                    value={formData.orgType}
                    onChange={handleChange}
                  >
                    <option value="financial">Financial Institution</option>
                    <option value="healthcare">Healthcare Provider</option>
                    <option value="education">Educational Institution</option>
                    <option value="government">Government Agency</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #10b981' }}>Contact Information</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>Phone Number</label>
                  <input
                    style={inputStyle}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>Address</label>
                  <input
                    style={inputStyle}
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter organization address"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>Website</label>
                  <input
                    style={inputStyle}
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #10b981' }}>Account Security</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>
                    Password <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                  </label>
                  <input
                    style={inputStyle}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                  />
                  <small style={{ color: 'var(--text-color)', opacity: 0.6 }}>Minimum 8 characters with letters and numbers</small>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.9 }}>
                    Confirm Password <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                  </label>
                  <input
                    style={inputStyle}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #10b981' }}>Verification & Terms</h3>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <input type="checkbox" id="verifyTerms" required style={{ marginTop: '0.2rem' }} />
                    <label htmlFor="verifyTerms" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                      I confirm that the information provided is accurate and I have the authority to register this organization
                    </label>
                  </p>
                  <p style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <input type="checkbox" id="dataTerms" required style={{ marginTop: '0.2rem' }} />
                    <label htmlFor="dataTerms" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                      I agree to comply with data protection regulations and handle user data responsibly
                    </label>
                  </p>
                  <p style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <input type="checkbox" id="blockchainTerms" required style={{ marginTop: '0.2rem' }} />
                    <label htmlFor="blockchainTerms" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                      I understand that all access requests will be recorded on the blockchain
                    </label>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {step === 2 && (
              <button 
                type="button" 
                className="btn btn-secondary"
                style={{ flex: 1, padding: '1rem' }}
                onClick={handlePrevStep}
              >
                Back
              </button>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ flex: 2, padding: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : (step === 1 ? 'Next Step' : 'Complete Registration')}
            </button>
          </div>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-color)', opacity: 0.8, fontSize: '0.85rem' }}>
          By registering, you agree to our <Link to="/terms" style={{ color: '#10b981' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: '#10b981' }}>Privacy Policy</Link>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-color)', opacity: 0.9 }}>
            Already have an organization account? <Link to="/login" style={{ color: '#10b981', fontWeight: 'bold' }}>Login</Link>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
            <Link to="/signup" style={{ color: 'var(--text-color)', opacity: 0.7, textDecoration: 'none' }}>
              Switch to User Registration →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgSignup;