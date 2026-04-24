// AdminLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const AdminLayout = () => {
  const [minimized, setMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  const handleToggleMinimize = () => setMinimized((prev) => !prev);

  useEffect(() => {
    // ✅ Hanya tutup kalau path benar-benar berubah
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex bg-gray-50">
      <Sidebar
        minimized={minimized}
        onToggleMinimize={handleToggleMinimize}
        mobileOpen={isMobileMenuOpen}
        setMobileOpen={setIsMobileMenuOpen}
      />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${minimized ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Header onMobileMenuClick={setIsMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
