import React, { useState, useEffect } from 'react';

import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import profilApi dari adminProfilApi untuk fetch profil admin
import { profilApi } from '../../Api/adminProfilApi';

const Header = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    id_admin: 1,
    username: 'adminSmp3',
    email: 'danielwarouw01@gmail.com',
    nama_lengkap: 'daniel22',
  });
  const navigate = useNavigate();

  // Fetch profil admin saat mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profilApi();
        setAdminProfile({
          id_admin: res.id_admin || 1,
          username: res.username || '',
          email: res.email || '',
          nama_lengkap: res.nama_lengkap || '',
        });
      } catch (e) {
        // Optional: Error handling
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Anda berhasil keluar.');
    navigate('/');
  };

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleBurgerClick = () => {
    setMobileSidebarOpen(true);
    if (onMobileMenuClick) onMobileMenuClick(true);
  };

  const handleSidebarClose = () => {
    setMobileSidebarOpen(false);
    if (onMobileMenuClick) onMobileMenuClick(false);
  };

  return (
    <header
      className="
      h-16
      xs:h-16
      sm:h-18
      md:h-20
      lg:h-20
      bg-white border-b border-gray-200
      flex items-center justify-between
      px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8
      sticky top-0 z-10
      ">
      {/* Kiri: Menu Burger & Status */}
      <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
        {/* Burger menu mobile: selalu tampil di bawah lg */}
        <button
          className="text-gray-500 hover:text-red-700 lg:hidden transition p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
          onClick={handleBurgerClick}
          aria-label="Buka Menu Sidebar">
          <FaBars size={24} />
        </button>
        {/* Status Aktif: hanya di desktop */}
        <div className="hidden lg:flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100 min-w-[120px]">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-green-700 tracking-wide uppercase">
            Sistem Aktif
          </span>
        </div>
      </div>

      {/* Kanan - Tanggal, Profil */}
      <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 md:gap-5">
        {/* Tanggal, desktop only */}
        <div className="hidden lg:block text-xs md:text-sm font-medium text-gray-500">{today}</div>

        {/* Pembatas, width adaptif */}
        <div className="w-px h-6 xs:h-7 sm:h-8 bg-gray-200 mx-1 sm:mx-2"></div>

        {/* Profil & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((v) => !v)}
            className="
              flex items-center gap-2 xs:gap-2.5 sm:gap-3
              hover:bg-gray-50
              p-1.5 xs:p-2 sm:p-2.5
              rounded-lg
              transition
              focus:outline-none focus:ring-2 focus:ring-red-200
            "
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu">
            {/* Nama & role: hanya di desktop */}
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-gray-800 leading-none">
                {adminProfile.nama_lengkap || 'Admin TU'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Admin</p>
            </div>
            {/* Icon profil: responsive size */}
            <FaUserCircle className="text-gray-400" size={28} />
          </button>

          {/* Dropdown menu: */}
          {isDropdownOpen && (
            <div
              className="
                absolute right-0 mt-2 w-44 xs:w-48 bg-white rounded-xl 
                shadow-lg border border-gray-100 py-2 z-50 
                animate-fade-in-down
                text-sm
              ">
              {/* Nama only on mobile/tablet */}
              <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                <p className="font-bold text-gray-800">{adminProfile.nama_lengkap || 'Admin TU'}</p>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="
                  w-full text-left
                  px-4 py-2
                  text-red-600 
                  hover:bg-red-50 
                  flex items-center gap-2 transition
                  rounded-b-xl
                ">
                <FaSignOutAlt /> Keluar Aplikasi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar overlay & drawer untuk mobile (opsional, bisa dihapus jika parent handle sendiri) */}
      {/* 
        Jika sidebar-nya dihandle di parent, gunakan prop onMobileMenuClick untuk trigger.
        Jika ingin controllernya di header (self-contained/mobile), gunakan state mobileSidebarOpen dan render di sini.
      */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={handleSidebarClose}
          aria-label="Tutup Sidebar"></div>
      )}
    </header>
  );
};

export default Header;
