import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaStar, FaUser, FaFileAlt, FaSearch } from 'react-icons/fa'; // Pastikan sudah install react-icons

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* KIRI: Logo & Nama Sekolah */}
        <div className="flex items-center gap-3">
          <img src="/Images/LogoSekolah.png" alt="Logo" className="w-12 h-12 object-contain " />

          <div className="leading-tight">
            <h1 className="font-bold text-lg text-gray-800 uppercase">SMP Negeri</h1>
            <h1 className="font-extrabold text-xl text-gray-900 uppercase">3 MANADO</h1>
          </div>
        </div>

        {/* TENGAH: Navigasi */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900 transition-colors">
            <FaHome size={18} />
            <span>Beranda</span>
          </Link>
          <Link
            to="/visi-misi"
            className="flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900 transition-colors">
            <FaStar size={16} />
            <span>Visi dan Misi</span>
          </Link>
          <Link
            to="/profil"
            className="flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900 transition-colors">
            <FaUser size={16} />
            <span>Profil</span>
          </Link>
          <Link
            to="/berita"
            className="flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900 transition-colors">
            <FaFileAlt size={16} />
            <span>Postingan</span>
          </Link>
        </nav>

        {/* KANAN: Tombol Aksi */}
        <div className="flex items-center gap-3">
          <button className="bg-red-700 text-white p-3 rounded-md hover:bg-red-800 transition-colors">
            <FaSearch size={18} />
          </button>
          <Link
            to="/login"
            className="bg-red-700 text-white px-6 py-2.5 rounded-md font-bold hover:bg-red-800 transition-colors flex items-center justify-center"
            style={{ textDecoration: 'none' }}>
            LOGIN
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
