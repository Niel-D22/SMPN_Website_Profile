import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaNewspaper,
  FaUsers,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaCalendarAlt,
  FaQuestionCircle,
  FaImages,
  FaTrophy,
  FaTimes,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';

const TutWuriHandayaniImg = ({ size = 30, className = '' }) => (
  <img
    src="/Images/LogoSekolah.png"
    alt="Tut Wuri Handayani"
    width={size}
    height={size}
    className={className}
    style={{ width: size, height: size, objectFit: 'contain' }}
    draggable={false}
  />
);

// PERHATIKAN: Saya menambahkan props "mobileOpen" dan "setMobileOpen"
// Ini agar Sidebar bisa dikendalikan oleh tombol burger yang ada di Header
const Sidebar = ({ minimized, onToggleMinimize, mobileOpen, setMobileOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/admin/dashboard' },
    { name: 'Berita & Pengumuman', icon: <FaNewspaper />, path: '/admin/berita' },
    { name: ' Direktori', icon: <FaUsers />, path: '/admin/direktori' },
    { name: 'Prestasi', icon: <FaTrophy />, path: '/admin/prestasi' },
    { name: 'Galeri', icon: <FaImages />, path: '/admin/galeri' },
    { name: 'Timeline PPDB', icon: <FaCalendarAlt />, path: '/admin/ppdb' },
    { name: 'FAQ', icon: <FaQuestionCircle />, path: '/admin/faq' },
    { name: 'Pesan & Kontak', icon: <FaEnvelope />, path: '/admin/pesan' },
    { name: 'Pengaturan', icon: <FaCog />, path: '/admin/pengaturan' },
    { name: 'Profil Admin', icon: <FaUserCircle />, path: '/admin/profil' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_nama');
    window.location.href = '/login';
  };

  const handleNavClick = () => {
    // Tutup sidebar mobile saat menu diklik
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  // Sidebar content for desktop
  const SidebarContent = (
    <>
      {/* Logo Area */}
      <div>
        <div
          className={`flex items-center gap-3 px-6 py-6 border-b border-gray-100 transition-all duration-200 ${minimized ? 'justify-center px-3' : ''}`}>
          <button
            onClick={handleLogoClick}
            className="focus:outline-none flex items-center justify-center"
            style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
            tabIndex={0}
            aria-label="Kembali ke halaman utama"
            type="button">
            <TutWuriHandayaniImg size={40} />
          </button>
          {!minimized && (
            <h1 className="font-bold text-gray-800 text-lg whitespace-nowrap">SMPN 3 Manado</h1>
          )}
        </div>

        {/* Menu Items */}
        <div className={`flex flex-col gap-1 ${minimized ? 'px-2' : 'px-4'} mt-6`}>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={handleNavClick}
              title={minimized ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center ${minimized ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-700 text-white shadow-md'
                    : 'text-gray-500 hover:bg-red-50 hover:text-red-700'
                }`
              }
              style={{
                paddingLeft: minimized ? '0.1rem' : undefined,
                paddingRight: minimized ? '0.1rem' : undefined,
              }}>
              <span className="text-lg">{item.icon}</span>
              {!minimized && item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* User Profile & Logout */}
      <div
        className={`p-4 border-t border-gray-200 transition-all duration-200 ${minimized ? 'px-2' : ''}`}>
        <div
          className={`bg-gray-50 p-4 rounded-xl flex items-center ${minimized ? 'justify-center' : 'justify-between'} transition-all`}>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogoClick}
              className="focus:outline-none flex items-center justify-center"
              style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
              tabIndex={0}
              aria-label="Kembali ke halaman utama"
              type="button">
              <TutWuriHandayaniImg size={34} />
            </button>
            {!minimized && (
              <div>
                <p className="text-sm font-bold text-gray-800">Admin TU</p>
                <p className="text-xs text-gray-500">Sekolah</p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`w-full mt-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold transition ${
            minimized ? 'justify-center px-0' : ''
          }`}>
          <FaSignOutAlt /> {!minimized && 'Keluar'}
        </button>
      </div>

      {/* Tombol minimize/expand (Hanya Desktop) */}
      <button
        onClick={onToggleMinimize}
        className={`absolute -right-4 top-[45%] z-50 hidden lg:flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full shadow transition hover:bg-gray-50`}
        style={{ transform: 'translateY(-50%)' }}
        aria-label={minimized ? 'Perbesar sidebar' : 'Minimize sidebar'}
        type="button"
        tabIndex={0}>
        {minimized ? <FaAngleRight size={20} /> : <FaAngleLeft size={20} />}
      </button>
    </>
  );

  return (
    <>
      {/* ❌ TOMBOL BURGER FLOATING DI SINI SUDAH SAYA HAPUS BIAR TIDAK BENTROK DENGAN HEADER ❌ */}

      {/* Sidebar Desktop (>=1024px/lg) */}
      <div
        className={`h-screen bg-white border-r border-gray-200 flex-col justify-between fixed left-0 top-0 hidden lg:flex z-30 transition-all duration-300 ${minimized ? 'w-20' : 'w-64'}`}
        style={{
          minWidth: minimized ? '5rem' : '16rem',
          width: minimized ? '5rem' : '16rem',
        }}>
        <div className="relative h-full w-full flex flex-col justify-between">{SidebarContent}</div>
      </div>

      {/* Sidebar for Mobile/Tablet (drawer, width < 1024px) */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } lg:hidden`}
          onClick={() => {
            if (setMobileOpen) setMobileOpen(false);
          }}
        />
      )}

      {isMobile && (
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 flex flex-col justify-between z-[60] transition-transform duration-300 lg:hidden
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          aria-label="Admin sidebar mobile/tablet">
          {/* Header Sidebar Mobile */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <TutWuriHandayaniImg size={30} />
              <h1 className="font-bold text-gray-800 text-lg">SMPN 3 Manado</h1>
            </div>
            <button
              className="text-gray-500 hover:text-red-700 p-2 rounded transition bg-gray-50"
              onClick={() => {
                if (setMobileOpen) setMobileOpen(false);
              }}>
              <FaTimes size={20} />
            </button>
          </div>

          {/* Menu Items Mobile */}
          <div className="flex-grow overflow-y-auto">
            <div className="flex flex-col gap-1 px-4 mt-6 pb-6">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-red-700 text-white shadow-md'
                        : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
                    }`
                  }>
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
