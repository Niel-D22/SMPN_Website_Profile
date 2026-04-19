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
      if (currentScrollY > 20) setIsScrolled(true);
      else setIsScrolled(false);
      if (currentScrollY > lastScrollY && currentScrollY > 100) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          path: '/direktori-staf',
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
          ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100 py-0'
          : 'bg-transparent border-transparent shadow-none py-2'
      }`}>
      {/*
        ── OVERLAY GRADIENT ──
        Hanya muncul saat belum di-scroll (header transparan di atas foto).
        Gradient gelap tipis dari atas ke bawah memastikan teks putih
        terbaca di semua warna foto hero (gelap, terang, kuning, dll).
        Saat sudah di-scroll, header pakai bg putih sehingga overlay tidak perlu.
      */}
      {!isScrolled && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.08) 70%, transparent 100%)',
          }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* === KIRI: LOGO === */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg"
            alt="Logo SMPN 3"
            className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <div className="leading-tight">
            <p
              className={`font-semibold text-sm uppercase tracking-widest ${isScrolled ? 'text-gray-500' : 'text-white/80'}`}>
              SMP Negeri
            </p>
            <p
              className={`font-black text-xl uppercase tracking-wide ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              3 MANADO
            </p>
          </div>
        </Link>

        {/* === TENGAH: NAVIGASI === */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navItems.map((item, idx) => (
            <div
              key={idx}
              className="relative h-full flex items-center group cursor-pointer"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}>
              {item.hasDropdown ? (
                <div
                  className={`flex items-center gap-1 font-bold transition-colors duration-200 ${
                    isScrolled
                      ? 'text-gray-800 hover:text-[#b30000]'
                      : 'text-white hover:text-white/70'
                  }`}>
                  {item.name}
                  <FaChevronDown
                    size={10}
                    className={`transition-transform duration-300 ${
                      activeDropdown === item.name ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`font-bold transition-colors duration-200 ${
                    isScrolled
                      ? 'text-gray-800 hover:text-[#b30000]'
                      : 'text-white hover:text-white/70'
                  }`}>
                  {item.name}
                </Link>
              )}

              {/* Garis bawah animasi */}
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#b30000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-md" />

              {/* Dropdown */}
              {item.hasDropdown && (
                <div
                  className={`absolute top-[80px] left-1/2 -translate-x-1/2 w-72 bg-[#003366] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-top ${
                    activeDropdown === item.name
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible'
                  }`}>
                  <div className="p-2 flex flex-col">
                    {item.items.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        to={subItem.path}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group/sub no-underline">
                        <div className="mt-1 text-blue-200 group-hover/sub:text-white transition-colors">
                          {subItem.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white mb-0.5 group-hover/sub:text-blue-100 transition-colors">
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

        {/* === KANAN: SEARCH & LOGIN === */}
        <div className="flex items-center gap-4">
          <button
            className={`p-2 transition-colors duration-200 ${
              isScrolled ? 'text-gray-700 hover:text-[#003366]' : 'text-white hover:text-white/70'
            }`}>
            <FaSearch size={18} />
          </button>
          <Link
            to="/login"
            className="hidden sm:flex items-center gap-2 bg-[#b30000] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-red-800 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 no-underline">
            <FaSignInAlt />
            LOGIN
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
