import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronDown,
  FaSearch,
  FaSignInAlt,
  FaSchool,
  FaBullseye,
  FaHistory,
  FaUsers,
  FaTrophy,
  FaImages,
  FaQuestionCircle,
} from 'react-icons/fa';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Logika Transparan ke Glassmorphism
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Logika Sembunyi/Muncul Header
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const navItems = [
    { name: 'Beranda', path: '/' },
    {
      name: 'Tentang Kami',
      hasDropdown: true,
      items: [
        {
          title: 'Profil Sekolah',
          desc: 'Identitas dan informasi umum',
          icon: <FaSchool />,
          path: '/profil',
        },
        {
          title: 'Visi & Misi',
          desc: 'Tujuan dan arah pendidikan',
          icon: <FaBullseye />,
          path: '/visi-misi',
        },
        {
          title: 'Guru & Staf',
          desc: 'Tenaga pendidik profesional',
          icon: <FaUsers />,
          path: '/guru',
        },
        {
          title: 'FAQ',
          desc: 'Pertanyaan yang sering diajukan',
          icon: <FaQuestionCircle />,
          path: '/faq',
        },
      ],
    },
    {
      name: 'Kesiswaan',
      hasDropdown: true,
      items: [
        {
          title: 'Prestasi',
          desc: 'Pencapaian siswa-siswi',
          icon: <FaTrophy />,
          path: '/prestasi',
        },
        {
          title: 'Galeri',
          desc: 'Dokumentasi kegiatan sekolah',
          icon: <FaImages />,
          path: '/galeri',
        },
      ],
    },
    { name: 'Info PPDB', path: '/ppdb' },
    { name: 'Berita', path: '/berita' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-md border-b border-gray-100 py-0'
          : 'bg-transparent border-transparent shadow-none py-2'
      }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* === KIRI: LOGO & NAMA SEKOLAH === */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg"
            alt="Logo SMPN 3"
            className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <div className="leading-tight">
            <h1 className="font-semibold text-sm uppercase tracking-widest text-gray-500">
              SMP Negeri
            </h1>
            <h1 className="font-black text-xl uppercase tracking-wide text-[#003366]">3 MANADO</h1>
          </div>
        </Link>

        {/* === TENGAH: NAVIGASI MEGA-MENU === */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navItems.map((item, idx) => (
            <div
              key={idx}
              className="relative h-full flex items-center group cursor-pointer"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}>
              {/* Teks Navigasi Utama */}
              {item.hasDropdown ? (
                <div
                  className={`flex items-center gap-1 font-bold transition-colors duration-300 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-[#b30000]'
                      : 'text-gray-700 hover:text-[#b30000]'
                  }`}>
                  {item.name}
                  <FaChevronDown
                    size={10}
                    className={`transition-transform duration-300 ${
                      activeDropdown === item.name
                        ? 'rotate-180 text-[#b30000]'
                        : isScrolled
                          ? 'text-gray-700'
                          : 'text-gray-700'
                    }`}
                  />
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`font-bold transition-colors duration-300 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-[#b30000]'
                      : 'text-gray-700 hover:text-gray-300'
                  }`}>
                  {item.name}
                </Link>
              )}

              {/* Garis Bawah Animasi (Muncul saat Hover) */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#b30000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-md"></div>

              {/* --- KOTAK DROPDOWN / MEGA MENU --- */}
              {item.hasDropdown && (
                <div
                  className={`absolute top-[80px] left-1/2 -translate-x-1/2 w-72 bg-[#003366] rounded-2xl shadow-2xl shadow-blue-900/20 overflow-hidden transition-all duration-300 origin-top ${
                    activeDropdown === item.name
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible'
                  }`}>
                  <div className="p-2 flex flex-col">
                    {item.items.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        to={subItem.path}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-100/10 transition-colors group/sub">
                        <div className="mt-1 text-blue-300 group-hover/sub:text-blue-400 transition-colors">
                          {subItem.icon}
                        </div>
                        <div>
                          <h4 className="text-blue-100 font-bold text-sm mb-0.5 group-hover/sub:text-blue-400 transition-colors">
                            {subItem.title}
                          </h4>
                          <p className="text-blue-200 text-xs leading-snug">{subItem.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* === KANAN: TOMBOL SEARCH & LOGIN === */}
        <div className="flex items-center gap-4">
          <button
            className={`transition-colors duration-300 p-2 ${
              isScrolled
                ? 'text-gray-400 hover:text-[#003366]'
                : 'text-gray-200 hover:text-gray-300'
            }`}>
            <FaSearch size={18} />
          </button>
          <Link
            to="/login"
            className="hidden sm:flex items-center gap-2 bg-[#b30000] text-gray-100 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-red-800 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <FaSignInAlt />
            LOGIN
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
