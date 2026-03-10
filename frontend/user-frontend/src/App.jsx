import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// User Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DataWallet from './pages/DataWallet';
import AccessRequests from './pages/AccessRequests';
import AccessHistory from './pages/AccessHistory';
import Login from './pages/Login';
import Signup from './pages/Signup';

import './index.css';

const ProtectedRoute = ({ children, isAuthenticated, userType }) => {
  if (!isAuthenticated || userType !== 'user') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children, isAuthenticated, userType }) => {
  if (isAuthenticated && userType === 'user') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    
    if (token && type !== 'user') {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      setIsAuthenticated(false);
      setUserType(null);
    } else {
      setIsAuthenticated(!!token);
      setUserType(type);
    }
    setLoading(false);
  };



  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>Loading...</h2>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #e74c3c',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const protectProps = { isAuthenticated, userType };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={
            <PublicRoute {...protectProps}>
              <Login />
            </PublicRoute>
          } />
          <Route path="signup" element={
            <PublicRoute {...protectProps}>
              <Signup />
            </PublicRoute>
          } />
          
          <Route path="dashboard" element={
            <ProtectedRoute {...protectProps}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="data-wallet" element={
            <ProtectedRoute {...protectProps}>
              <DataWallet />
            </ProtectedRoute>
          } />
          <Route path="access-requests" element={
            <ProtectedRoute {...protectProps}>
              <AccessRequests />
            </ProtectedRoute>
          } />
          <Route path="access-history" element={
            <ProtectedRoute {...protectProps}>
              <AccessHistory />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;