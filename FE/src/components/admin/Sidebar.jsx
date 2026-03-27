import React from 'react';
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
  FaCalendarAlt, // Untuk Timeline PPDB
  FaQuestionCircle, // Untuk FAQ
  FaImages, // Untuk Galeri
  FaTrophy,
} from 'react-icons/fa';

const Sidebar = () => {
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

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed left-0 top-0">
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
    </div>
  );
};

export default Sidebar;
