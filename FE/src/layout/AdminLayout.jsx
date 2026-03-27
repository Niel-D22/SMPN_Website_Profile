import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Kiri */}
      <Sidebar />

      {/* Area Konten Utama (Bergeser ke kanan karena sidebar fixed 64 (256px)) */}
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <Header />

        {/* Tempat render halaman konten (Dashboard, Berita, dll) */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet /> {/* Di sinilah komponen konten akan dimunculkan oleh React Router */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
