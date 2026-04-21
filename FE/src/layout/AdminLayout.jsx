import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const AdminLayout = () => {
  // State untuk minimize Sidebar Desktop
  const [minimized, setMinimized] = useState(false);

  // ✅ STATE BARU: Untuk mengontrol buka/tutup Sidebar Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMinimize = () => setMinimized((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR WRAPPER */}
      {/* ✅ PERBAIKAN: "hidden lg:block" dihapus agar versi mobile tetap bisa di-render di background.
          Kita akali dengan w-0 di mobile, dan lg:w-64 / lg:w-20 di desktop. */}
      <div
        className={`
          transition-all duration-300 shrink-0
          ${minimized ? 'w-0 lg:w-20' : 'w-0 lg:w-64'}
        `}>
        <Sidebar
          minimized={minimized}
          onToggleMinimize={handleToggleMinimize}
          mobileOpen={isMobileMenuOpen}
          setMobileOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        {/* HEADER */}
        {/* ✅ PERBAIKAN: Kirim trigger setIsMobileMenuOpen ke tombol burger di Header */}
        <Header onMobileMenuClick={setIsMobileMenuOpen} />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
