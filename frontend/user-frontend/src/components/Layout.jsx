import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Background3D from './Background3D';

const Layout = () => {
  return (
    <div className="layout">
      <Background3D />
      <Navbar />
      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;