import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronDown,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaSchool,
  FaBullseye,
  FaUsers,
  FaTrophy,
  FaImages,
  FaQuestionCircle,
} from 'react-icons/fa';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sidebarDropdown, setSidebarDropdown] = useState(null);

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

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

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

  const handleSidebarDropdown = (name) => {
    if (sidebarDropdown === name) setSidebarDropdown(null);
    else setSidebarDropdown(name);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100 py-0'
            : 'bg-transparent border-transparent shadow-none py-2'
        }`}>
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
                className={`font-semibold text-sm uppercase tracking-widest ${
                  isScrolled ? 'text-gray-500' : 'text-white/80'
                }`}>
                SMP Negeri
              </p>
              <p
                className={`font-black text-xl uppercase tracking-wide ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                3 MANADO
              </p>
            </div>
          </Link>

          {/* === TENGAH: NAVIGASI (Desktop) === */}
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

                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#b30000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-md" />

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

          {/* === KANAN: LOGIN (Desktop) dan BURGER (Mobile) === */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden lg:flex items-center gap-2 bg-[#b30000] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-red-800 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 no-underline">
              <FaSignInAlt />
              LOGIN
            </Link>
            {/* === BURGER (Mobile) - Pindah ke paling kanan === */}
            <button
              className={`flex lg:hidden items-center justify-center p-2 rounded-md transition-all duration-200 focus:outline-none ${
                isScrolled ? 'text-gray-700 hover:text-[#003366]' : 'text-white hover:text-white/70'
              }`}
              aria-label="Menu"
              onClick={() => setSidebarOpen(true)}>
              <FaBars size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================
          SIDEBAR (Mobile) — dipindah ke luar <header>
      ========================================== */}

      {/* Overlay Gelap */}
      <div
        className={`fixed inset-0 z-[9999] bg-black/60 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ backdropFilter: sidebarOpen ? 'blur(4px)' : 'none' }}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`fixed top-0 left-0 z-[10000] h-full w-[85%] max-w-[340px] bg-white shadow-[10px_0_30px_rgba(0,0,0,0.2)] transition-transform duration-300 transform flex flex-col overflow-hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar">
        {/* Header Sidebar */}
        <div className="flex items-center justify-between px-6 py-6 bg-white text-gray-900 relative overflow-hidden shrink-0">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <Link
            to="/"
            className="flex items-center gap-3 relative z-10 no-underline"
            onClick={() => setSidebarOpen(false)}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg"
              alt="Logo SMPN 3"
              className="w-10 h-10 object-contain bg-white rounded-full p-1 shadow-sm"
            />
            <div className="leading-tight">
              <p className="font-semibold text-[10px] uppercase tracking-widest text-gray-400">
                SMP Negeri
              </p>
              <p className="font-black text-lg uppercase tracking-wide text-gray-900 drop-shadow-md">
                3 MANADO
              </p>
            </div>
          </Link>
          <button
            className="relative z-10 p-2 -mr-2 bg-gray-100 rounded-full text-gray-600 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}>
            <FaTimes size={18} />
          </button>
        </div>

        {/* Konten Menu Navigation */}
        <nav className="flex-1 overflow-y-auto pt-6 px-4 pb-6 hide-scrollbar bg-white">
          <div className="flex flex-col gap-1">
            {navItems.map((item, idx) => (
              <div key={idx} className="w-full">
                {item.hasDropdown ? (
                  <div>
                    <button
                      className={`flex items-center w-full justify-between font-bold px-5 py-4 text-gray-800 transition-colors ${
                        sidebarDropdown === item.name ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                      style={{
                        boxShadow: 'none',
                        border: 'none',
                        borderRadius: 0,
                        background: 'none',
                      }}
                      onClick={() => handleSidebarDropdown(item.name)}>
                      <span className="flex items-center gap-3 text-[15px]">{item.name}</span>
                      <FaChevronDown
                        size={12}
                        className={`transition-transform duration-300 text-gray-400 ${
                          sidebarDropdown === item.name ? 'rotate-180 text-gray-900' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        sidebarDropdown === item.name
                          ? 'max-h-[500px] opacity-100 bg-white'
                          : 'max-h-0 opacity-0'
                      }`}>
                      <div className="flex flex-col pl-9 pr-2 py-1">
                        {item.items.map((subItem, subIdx) => (
                          <Link
                            key={subIdx}
                            to={subItem.path}
                            className="flex items-center gap-3 px-1 py-2 text-gray-600 hover:text-[#b30000] hover:bg-gray-100 transition-colors text-sm font-semibold no-underline"
                            style={{
                              borderRadius: 0,
                              background: 'none',
                              boxShadow: 'none',
                              marginBottom: 0,
                            }}
                            onClick={() => setSidebarOpen(false)}>
                            <span className="text-gray-400 text-lg">{subItem.icon}</span>
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center px-5 py-4 text-gray-800 font-bold hover:text-[#b30000] hover:bg-gray-100 transition-colors text-[15px] no-underline"
                    style={{
                      border: 'none',
                      borderRadius: 0,
                      background: 'none',
                      boxShadow: 'none',
                      marginBottom: 0,
                    }}
                    onClick={() => setSidebarOpen(false)}>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link
            to="/login"
            className="flex items-center gap-2 justify-center w-full bg-gradient-to-r from-[#b30000] to-red-800 text-white px-6 py-3.5 rounded-full font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 no-underline"
            onClick={() => setSidebarOpen(false)}>
            <FaSignInAlt size={16} />
            LOGIN ADMIN
          </Link>
        </div>
      </aside>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </>
  );
};

export default Header;
