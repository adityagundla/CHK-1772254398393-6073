import React from 'react';
import { Outlet } from 'react-router-dom';
import OrgNavbar from './OrgNavbar';
import Background3D from './Background3D';

const OrgLayout = () => {
  return (
    <div className="org-layout">
      <Background3D />
      <OrgNavbar />
      <main className="org-main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default OrgLayout;