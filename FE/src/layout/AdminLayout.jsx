import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const AdminLayout = () => {
  // Samakan logika state dengan yang dibutuhkan Sidebar.jsx
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* HAPUS pembungkus div di sini. 
        Biarkan Sidebar mengatur posisinya sendiri (karena sudah pakai fixed).
      */}
      <Sidebar />

      {/* Area Konten Utama:
        Gunakan 'lg:ml-64' agar sama dengan breakpoint Sidebar (1024px).
      */}
      <div className="flex-1 flex flex-col h-screen transition-all lg:ml-64">
        {/* Header */}
        <Header onMobileMenuClick={handleToggleSidebar} />

        {/* Tempat render halaman konten */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
