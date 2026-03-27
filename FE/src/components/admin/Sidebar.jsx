import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaNewspaper,
  FaUsers,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaSchool,
  FaUserCircle,
  FaCalendarAlt,
  FaQuestionCircle,
  FaImages,
  FaTrophy,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

/**
 * Sidebar Admin Responsive (Mobile, Tablet, & Desktop)
 * - Show sidebar as a drawer for mobile & tablet (window width < 1024px, a.k.a below 'lg')
 * - Hamburger menu for mobile & tablet as trigger
 * - Always visible sidebar on desktop (>= 1024px/'lg')
 */
const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Close sidebar ketika klik link pada mobile/tablet
  const handleNavClick = () => {
    setMobileOpen(false);
  };

  // Sidebar content reuse
  const SidebarContent = (
    <>
      {/* Logo Area */}
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-red-700 text-white rounded-lg flex items-center justify-center">
            <FaSchool size={18} />
          </div>
          <h1 className="font-bold text-gray-800 text-lg">Admin SMPN 3</h1>
        </div>
        {/* Menu Items */}
        <div className="flex flex-col gap-1 px-4 mt-6">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-700 text-white shadow-md'
                    : 'text-gray-500 hover:bg-red-50 hover:text-red-700'
                }`
              }>
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Admin TU</p>
              <p className="text-xs text-gray-500">Staf Pengurus</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold transition">
          <FaSignOutAlt /> Keluar
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger untuk mobile & tablet (<1024px) */}
      <button
        className="fixed lg:hidden z-[60] top-4 left-4 p-2 bg-white border border-gray-200 rounded-lg shadow text-gray-800 focus:outline-none"
        onClick={() => setMobileOpen(true)}>
        <FaBars size={20} />
      </button>

      {/* Sidebar Desktop (>=1024px/lg) */}
      <div className="w-64 h-screen bg-white border-r border-gray-200 flex-col justify-between fixed left-0 top-0 hidden lg:flex z-30">
        {SidebarContent}
      </div>

      {/* Sidebar for Mobile/Tablet (drawer, width < 1024px) */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/10 transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } lg:hidden`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-[60] transition-transform duration-300 lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Admin sidebar mobile/tablet">
        {/* Tombol close */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-700 text-white rounded-lg flex items-center justify-center">
              <FaSchool size={18} />
            </div>
            <h1 className="font-bold text-gray-800 text-lg">Admin SMPN 3</h1>
          </div>
          <button
            className="text-gray-500 hover:text-red-700 p-2 rounded transition"
            onClick={() => setMobileOpen(false)}>
            <FaTimes size={22} />
          </button>
        </div>
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col gap-1 px-4 mt-6">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-700 text-white shadow-md'
                      : 'text-gray-500 hover:bg-red-50 hover:text-red-700'
                  }`
                }>
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
          {/* Bagian bawah user profile & keluar */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Admin TU</p>
                  <p className="text-xs text-gray-500">Staf Pengurus</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold transition">
              <FaSignOutAlt /> Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
