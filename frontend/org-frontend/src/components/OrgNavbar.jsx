import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../auth';
import { Menu, X } from 'lucide-react';

const OrgNavbar = () => {
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    checkWalletConnection();
    fetchPendingRequests();
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleStorageChange = () => {
    checkAuth();
    fetchPendingRequests();
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const isOrgAuth = !!(token && userType === 'organization');
    
    setIsAuthenticated(isOrgAuth);
    
    if (isOrgAuth) {
      const orgData = JSON.parse(localStorage.getItem('orgData') || '{}');
      setOrgName(orgData.name || 'Organization');
    } else {
      // If not authenticated as organization, redirect to org login
      if (window.location.pathname.startsWith('/org') && 
          !window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        navigate('/login');
      }
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(`${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        setWalletAddress(`${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
        localStorage.setItem('orgWallet', accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask to connect your wallet!');
    }
  };

  const fetchPendingRequests = () => {
    const sentRequests = JSON.parse(localStorage.getItem('orgSentRequests') || '[]');
    const pending = sentRequests.filter(req => req.status === 'pending').length;
    setPendingRequests(pending);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('orgWallet');
    localStorage.removeItem('orgSentRequests');
    
    setIsAuthenticated(false);
    setOrgName('');
    setWalletConnected(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // If not authenticated as organization, don't render the navbar
  if (!isAuthenticated) {
    return null;
  }

  const currentPath = window.location.pathname;

  const getLinkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.1rem',
    transition: 'color 0.3s ease',
    padding: '0.5rem',
    borderRadius: '8px',
    borderLeft: currentPath === path ? '3px solid #10b981' : '3px solid transparent',
    backgroundColor: currentPath === path ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
  });

  return (
    <>
      <nav className="glass" style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleMenu} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              transition: 'background 0.2s ease',
              position: 'relative'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            <Menu size={24} />
            {pendingRequests > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#f59e0b',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid #0f172a'
              }}></span>
            )}
          </button>

          <Link to="/dashboard" style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🏢</span>
            DataChain
            <span style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              border: '1px solid rgba(16,185,129,0.5)'
            }}>ORG</span>
          </Link>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <button onClick={connectWallet} className={walletConnected ? "btn btn-secondary" : "btn btn-primary"} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            {walletConnected ? `🔷 ${walletAddress}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* Side Menu Drawer Dropdown */}
      {isMenuOpen && (
        <div 
          onClick={toggleMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1999
          }}
        />
      )}
      
      <div className="glass" style={{
        position: 'fixed',
        top: 0,
        left: isMenuOpen ? '0' : '-350px',
        width: '300px',
        height: '100vh',
        transition: 'left 0.3s ease',
        boxShadow: '5px 0 15px rgba(0,0,0,0.3)',
        zIndex: 2000,
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        borderRadius: '0 20px 20px 0',
        borderLeft: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Menu</span>
          <button 
            onClick={toggleMenu}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          <Link to="/dashboard" onClick={toggleMenu} style={getLinkStyle('/dashboard')}>
            Dashboard
          </Link>
          
          <Link to="/search-users" onClick={toggleMenu} style={getLinkStyle('/search-users')}>
            Search Users
          </Link>
          
          <Link to="/access-requests" onClick={toggleMenu} style={{ ...getLinkStyle('/access-requests'), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>My Requests</span>
            {pendingRequests > 0 && (
              <span style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                borderRadius: '50%',
                padding: '0.1rem 0.5rem',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>{pendingRequests}</span>
            )}
          </Link>
          
          <Link to="/access-history" onClick={toggleMenu} style={getLinkStyle('/access-history')}>
            History
          </Link>
          
          <Link to="/profile" onClick={toggleMenu} style={getLinkStyle('/profile')}>
            Profile
          </Link>

          <Link to="/" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', opacity: 0.7, padding: '0.5rem', marginTop: '1rem' }}>
            ← Main Site
          </Link>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <span>🏢</span>
            <span style={{ fontWeight: 500 }}>{orgName}</span>
          </div>

          <button onClick={() => { handleLogout(); toggleMenu(); }} className="btn btn-danger" style={{ padding: '0.75rem 1rem', width: '100%', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.1rem' }}>⏻</span> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default OrgNavbar;