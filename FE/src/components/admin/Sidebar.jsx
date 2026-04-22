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
import { profilApi } from '../../Api/adminProfilApi';

const TutWuriHandayaniImg = ({ size = 56, className = '' }) => (
  <img
    src="/Images/LogoSekolah.png"
    alt="Logo Sekolah"
    width={size}
    height={size}
    className={className}
    style={{ width: size, height: size, objectFit: 'contain' }}
    draggable={false}
  />
);

const menuItems = [
  { name: 'Dashboard', icon: <FaHome />, path: '/admin/dashboard' },
  { name: 'Berita & Pengumuman', icon: <FaNewspaper />, path: '/admin/berita' },
  { name: 'Direktori', icon: <FaUsers />, path: '/admin/direktori' },
  { name: 'Prestasi', icon: <FaTrophy />, path: '/admin/prestasi' },
  { name: 'Galeri', icon: <FaImages />, path: '/admin/galeri' },
  { name: 'Timeline PPDB', icon: <FaCalendarAlt />, path: '/admin/ppdb' },
  { name: 'FAQ', icon: <FaQuestionCircle />, path: '/admin/faq' },
  { name: 'Pesan & Kontak', icon: <FaEnvelope />, path: '/admin/pesan' },
  { name: 'Pengaturan', icon: <FaCog />, path: '/admin/pengaturan' },
  { name: 'Profil Admin', icon: <FaUserCircle />, path: '/admin/profil' },
];

const Sidebar = ({ minimized, onToggleMinimize, mobileOpen, setMobileOpen }) => {
  const [adminProfile, setAdminProfile] = useState({
    username: 'admin',
    email: '',
    nama_lengkap: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdminProfile() {
      try {
        const profil = await profilApi.getProfile();
        if (profil?.username) {
          setAdminProfile({
            username: profil.username,
            email: profil.email || '',
            nama_lengkap: profil.nama_lengkap || '',
          });
        }
      } catch {
        // fallback default
      }
    }
    fetchAdminProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_nama');
    navigate('/login');
  };

  // ✅ Tutup sidebar DAN hapus blur saat nav diklik
  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  // ✅ Tutup sidebar DAN hapus blur saat backdrop diklik
  const handleBackdropClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  const displayName = adminProfile.nama_lengkap || adminProfile.username;

  // Menu list — dipakai di desktop & mobile
  const MenuList = ({ onClick }) => (
    <div className="flex flex-col gap-1 px-4 mt-6 pb-4">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onClick}
          title={minimized ? item.name : undefined}
          className={({ isActive }) =>
            `flex items-center ${minimized ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-bold transition-colors ${
              isActive
                ? 'bg-red-700 text-white shadow-md'
                : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
            }`
          }>
          <span className="text-lg shrink-0">{item.icon}</span>
          {!minimized && <span>{item.name}</span>}
        </NavLink>
      ))}
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <div
        className={`hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-30 transition-all duration-300 ${
          minimized ? 'w-20' : 'w-64'
        }`}>
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-6 py-6 border-b border-gray-100 ${minimized ? 'justify-center px-3' : ''}`}>
          <button type="button" onClick={() => navigate('/')} className="focus:outline-none">
            <TutWuriHandayaniImg size={minimized ? 36 : 48} />
          </button>
          {!minimized && <h1 className="font-bold text-gray-800 text-lg">SMPN 3 Manado</h1>}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto">
          <MenuList onClick={undefined} />
        </div>

        {/* Profile + Logout */}
        <div className={`p-4 border-t border-gray-100 ${minimized ? 'px-2' : ''}`}>
          {!minimized && (
            <div className="bg-gray-50 px-4 py-3 rounded-xl mb-2">
              <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
              {adminProfile.email && (
                <p className="text-xs text-gray-400 truncate">{adminProfile.email}</p>
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-bold transition">
            <FaSignOutAlt />
            {!minimized && 'Keluar'}
          </button>
        </div>

        {/* Tombol minimize */}
        <button
          onClick={onToggleMinimize}
          className="absolute -right-4 top-[45%] z-50 flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow hover:bg-gray-50 transition"
          style={{ transform: 'translateY(-50%)' }}>
          {minimized ? <FaAngleRight size={16} /> : <FaAngleLeft size={16} />}
        </button>
      </div>

      {/* ── MOBILE SIDEBAR ── */}

      {/* ✅ Backdrop — pointer-events dikontrol via class, bukan render kondisional */}
      {/* Ini yang fix blur tidak hilang — dulu pakai isMobile check tapi isMobile tidak update */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick} // ✅ klik backdrop = tutup
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Header drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <TutWuriHandayaniImg size={38} />
            <h1 className="font-bold text-gray-800">SMPN 3 Manado</h1>
          </div>
          {/* ✅ Tombol X tutup sidebar */}
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-700 transition">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Menu mobile */}
        <div className="flex-1 overflow-y-auto">
          {/* ✅ handleNavClick menutup drawer saat menu diklik */}
          <div className="flex flex-col gap-1 px-4 mt-4 pb-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick} // ✅ tutup drawer
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

        {/* Profile + Logout mobile */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="bg-gray-50 px-4 py-3 rounded-xl mb-3">
            <p className="text-sm font-bold text-gray-800">{displayName}</p>
            {adminProfile.email && (
              <p className="text-xs text-gray-400 truncate">{adminProfile.email}</p>
            )}
          </div>
          {/* ✅ Logout ada di mobile juga */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl text-sm font-bold transition">
            <FaSignOutAlt /> Keluar
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
