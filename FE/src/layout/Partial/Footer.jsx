import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

import { profilSekolahApi } from '../../Api/profilSekolahApi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [profil, setProfil] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await profilSekolahApi.getProfilSekolah();
        setProfil(data);
      } catch (err) {
        console.error('Gagal ambil profil:', err);
      }
    };

    fetchProfil();
  }, []);

  // Responsive listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's "sm"
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sosial media links yang diberikan user
  const sosialMediaLinks = {
    facebook: 'https://www.facebook.com/share/1ASy4gfZbe/',
    instagram: 'https://www.instagram.com/spentig_mdo?igsh=MTZydWw3MHV4ejl6Zg==',
    tiktok: 'https://www.tiktok.com/@smpnegeri3manado?_r=1&_t=ZS-95iaL7lyfSq',
  };

  // Tailwind breakpoint for mobile size tweaks
  const logoClass = isMobile
    ? 'w-14 h-14 object-contain rounded-xl'
    : 'w-20 h-20 object-contain rounded-xl';

  const headingClass = isMobile
    ? 'font-bold mb-2 text-white text-base tracking-wide'
    : 'font-bold mb-4 text-white text-lg tracking-wide';

  const iconButtonClass = isMobile
    ? 'w-9 h-9 flex items-center justify-center rounded-full bg-[#003366] hover:bg-[#f4b400] hover:text-[#b30000] transition'
    : 'w-11 h-11 flex items-center justify-center rounded-full bg-[#003366] hover:bg-[#f4b400] hover:text-[#b30000] transition';

  const iconSize = isMobile ? 16 : 22;
  const gridClass = isMobile
    ? 'grid grid-cols-1 gap-7'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10';

  const textSizeSm = isMobile ? 'text-xs' : 'text-sm';
  const textSizeFootNote = isMobile ? 'text-[11px]' : 'text-xs';
  const sectionGap = isMobile ? 'px-3 py-6' : 'px-6 lg:px-12 py-12';

  return (
    <footer className="bg-[#b30000] text-white mt-16 rounded-t-3xl">
      <div className={`max-w-7xl mx-auto ${sectionGap}`}>
        <div className={gridClass}>
          {/* KOLOM 1 */}
          <div className="space-y-3 sm:space-y-4">
            {profil?.logo_url && <img src={profil.logo_url} alt="Logo" className={logoClass} />}

            <p className={`${textSizeSm} text-white/80 leading-relaxed font-medium`}>
              {profil?.nama_sekolah || 'Nama Sekolah'} — Sekolah Unggul, Berkarakter dan
              Berprestasi!
            </p>

            <ul className={`space-y-1 sm:space-y-2 ${textSizeSm} text-white/90 font-semibold`}>
              <li className="flex gap-2 items-start">
                <FaMapMarkerAlt
                  className={`mt-0.5 ${isMobile ? 'text-base' : ''} text-[#f4b400]`}
                  size={iconSize - 3}
                />
                <span>{profil?.alamat || '-'}</span>
              </li>
              <li className="flex gap-2 items-center">
                <FaPhoneAlt className="text-[#f4b400]" size={iconSize - 3} />
                <span>{profil?.no_telepon || '-'}</span>
              </li>
              <li className="flex gap-2 items-center">
                <FaEnvelope className="text-[#f4b400]" size={iconSize - 3} />
                <span>{profil?.email_sekolah || '-'}</span>
              </li>
            </ul>
          </div>

          {/* KOLOM 2 */}
          <div>
            <h3 className={headingClass}>Menu Utama</h3>
            <ul className={`space-y-1 sm:space-y-2 ${textSizeSm} text-white/80`}>
              <li>
                <Link to="/" className="hover:text-[#f4b400] transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-[#f4b400] transition">
                  Profil
                </Link>
              </li>
              <li>
                <Link to="/visi-misi" className="hover:text-[#f4b400] transition">
                  Visi & Misi
                </Link>
              </li>
              <li>
                <Link to="/direktori-staf" className="hover:text-[#f4b400] transition">
                  Direktori Staf
                </Link>
              </li>
              <li>
                <Link to="/prestasi" className="hover:text-[#f4b400] transition">
                  Prestasi
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3 */}
          <div>
            <h3 className={headingClass}>Informasi</h3>
            <ul className={`space-y-1 sm:space-y-2 ${textSizeSm} text-white/80`}>
              <li>
                <Link to="/berita" className="hover:text-[#f4b400] transition">
                  Berita
                </Link>
              </li>
              <li>
                <Link to="/ppdb" className="hover:text-[#f4b400] transition">
                  PPDB
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#f4b400] transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/galeri" className="hover:text-[#f4b400] transition">
                  Galeri
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 4 */}
          <div>
            <h3 className={headingClass}>Ikuti Kami</h3>
            <div className={`flex gap-2 sm:gap-3 mb-2 sm:mb-4`}>
              <a
                href={sosialMediaLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={iconButtonClass}>
                <FaFacebook size={iconSize} />
              </a>
              <a
                href={sosialMediaLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={iconButtonClass}>
                <FaInstagram size={iconSize} />
              </a>
              <a
                href={sosialMediaLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className={iconButtonClass}>
                <SiTiktok size={iconSize} />
              </a>
            </div>

            <p className={`${textSizeFootNote} text-white/70 mt-2`}>
              Follow untuk update terbaru sekolah!
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className={`mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 ${textSizeSm} text-white/80`}>
          <p>
            © {currentYear}{' '}
            <span className="font-bold text-[#f4b400]">{profil?.nama_sekolah || 'Sekolah'}</span>
          </p>
          <p className={`${isMobile ? 'text-center' : ''}`}>
            Dikembangkan oleh{' '}
            <span className="font-semibold text-[#003366]">
              Mahasiswa Teknik Informatika Universitas Katolik De La Salle
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
