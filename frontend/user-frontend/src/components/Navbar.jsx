import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../auth';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    checkWalletConnection();
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    setIsAuthenticated(!!token);
    setUserType(type);
    
    if (type === 'user') {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUserName(userData.name || 'User');
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletConnected(true);
        setWalletAddress(`${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        setWalletAddress(`${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUserType(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            DataChain
          </Link>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {isAuthenticated && userType === 'user' && (
            <button onClick={connectWallet} className={walletConnected ? "btn btn-secondary" : "btn btn-primary"} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              {walletConnected ? walletAddress : 'Connect Wallet'}
            </button>
          )}
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
          <Link to="/" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }}>Home</Link>
          
          {isAuthenticated && userType === 'user' ? (
            <>
              <Link to="/dashboard" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '0.5rem', borderRadius: '8px' }}>Dashboard</Link>
              <Link to="/data-wallet" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '0.5rem', borderRadius: '8px' }}>Data Wallet</Link>
              <Link to="/access-requests" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '0.5rem', borderRadius: '8px' }}>Access Requests</Link>
              <Link to="/access-history" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '0.5rem', borderRadius: '8px' }}>History</Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '0.5rem' }}>User Login</Link>
              <Link to="/signup" onClick={toggleMenu} style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '1.1rem', padding: '0.5rem', fontWeight: 'bold' }}>Sign Up</Link>
            </>
          )}
        </div>

        {isAuthenticated && userType === 'user' && (
          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'white',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '12px'
            }}>
              <span>👤</span>
              <span style={{ fontWeight: 500 }}>{userName}</span>
            </div>
            
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.75rem 1rem', width: '100%', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.1rem' }}>⏻</span> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;