import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const AdminLayout = () => {
  const [minimized, setMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMinimize = () => setMinimized((prev) => !prev);

  return (
    <div className="flex bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar
        minimized={minimized}
        onToggleMinimize={handleToggleMinimize}
        mobileOpen={isMobileMenuOpen}
        setMobileOpen={setIsMobileMenuOpen}
      />

      {/* MAIN AREA — ✅ HAPUS overflow-hidden dari sini */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          minimized ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
        <Header onMobileMenuClick={setIsMobileMenuOpen} />
        {/* ✅ Hanya main yang scroll */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
