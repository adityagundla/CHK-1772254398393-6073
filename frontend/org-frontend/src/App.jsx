import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrgLayout from './components/OrgLayout';

// Organization Pages
import OrgLogin from './pages/org/OrgLogin';
import OrgSignup from './pages/org/OrgSignup';
import OrgDashboard from './pages/org/OrgDashboard';
import OrgSearchUsers from './pages/org/OrgSearchUsers';
import OrgAccessRequests from './pages/org/OrgAccessRequests';
import OrgAccessHistory from './pages/org/OrgAccessHistory';
import OrgDocuments from './pages/org/OrgDocuments';
import OrgProfile from './pages/org/OrgProfile';

import './index.css';

const ProtectedRoute = ({ children, isAuthenticated, userType }) => {
  if (!isAuthenticated || userType !== 'organization') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children, isAuthenticated, userType }) => {
  if (isAuthenticated && userType === 'organization') {
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
    
    if (token && type !== 'organization') {
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
        <Route path="/" element={<OrgLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="login" element={
            <PublicRoute {...protectProps}>
              <OrgLogin />
            </PublicRoute>
          } />
          <Route path="signup" element={
            <PublicRoute {...protectProps}>
              <OrgSignup />
            </PublicRoute>
          } />
          
          <Route path="dashboard" element={
            <ProtectedRoute {...protectProps}>
              <OrgDashboard />
            </ProtectedRoute>
          } />
          <Route path="search-users" element={
            <ProtectedRoute {...protectProps}>
              <OrgSearchUsers />
            </ProtectedRoute>
          } />
          <Route path="access-requests" element={
            <ProtectedRoute {...protectProps}>
              <OrgAccessRequests />
            </ProtectedRoute>
          } />
          <Route path="access-history" element={
            <ProtectedRoute {...protectProps}>
              <OrgAccessHistory />
            </ProtectedRoute>
          } />
          <Route path="documents/:userId" element={
            <ProtectedRoute {...protectProps}>
              <OrgDocuments />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute {...protectProps}>
              <OrgProfile />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;