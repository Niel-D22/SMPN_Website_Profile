import React, { useState } from 'react';
import { FaBell, FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk Logout
  const handleLogout = () => {
    // 1. Hapus token dari brankas (localStorage)
    localStorage.removeItem('token');

    // 2. Tampilkan notifikasi
    toast.success('Anda berhasil keluar.');

    // 3. Arahkan kembali ke halaman login
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Kiri - Tombol Menu Mobile & Status */}
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-red-700 md:hidden transition">
          <FaBars size={20} />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-green-700 tracking-wide uppercase">
            Sistem Aktif
          </span>
        </div>
      </div>

      {/* Kanan - Tanggal, Notif, & Profil/Logout */}
      <div className="flex items-center gap-5">
        <div className="hidden lg:block text-sm font-medium text-gray-500">{today}</div>

        {/* Tombol Notifikasi */}
        <button className="text-gray-400 hover:text-red-700 transition relative p-2">
          <FaBell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Garis Pembatas */}
        <div className="w-px h-8 bg-gray-200 mx-2"></div>

        {/* Area Profil & Dropdown Logout */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-800 leading-none">Admin TU</p>
              <p className="text-xs text-gray-500 mt-1">Administrator</p>
            </div>
            <FaUserCircle className="text-gray-400" size={32} />
          </button>

          {/* Menu Dropdown yang muncul saat profil diklik */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in-down">
              <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                <p className="text-sm font-bold text-gray-800">Admin TU</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition">
                <FaSignOutAlt /> Keluar Aplikasi
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
