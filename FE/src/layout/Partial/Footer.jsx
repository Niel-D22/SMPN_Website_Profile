import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#b30000] text-white pt-16 pb-6 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* --- GRID UTAMA (3 Kolom) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-12">
          {/* KOLOM 1: Logo & Kontak */}
          <div className="flex flex-col space-y-6">
            {/* Logo Tut Wuri Handayani (Bisa ganti src dengan path gambarmu) */}
            <img
              src="../../../public/Images/LogoSekolah.png"
              alt="Logo Tut Wuri Handayani"
              className="w-16 h-16 object-contain mb-2"
            />

            <h3 className="text-2xl font-bold tracking-wide">Kontak Kami</h3>

            <ul className="space-y-4 text-gray-100 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-white" size={16} />
                <span className="leading-relaxed">
                  Jl. Kakap No. 2, Kec. Tuminting, <br />
                  Kota Manado, Prov. Sulawesi Utara
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0 text-white" size={16} />
                <span>082395358120</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="shrink-0 text-white" size={16} />
                <a
                  href="mailto:smpnegeri3manadosulut@gmail.com"
                  className="hover:text-yellow-300 transition-colors">
                  smpnegeri3manadosulut@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 2: Navigasi */}
          <div className="flex flex-col space-y-6 lg:pl-10">
            <h3 className="text-2xl font-bold tracking-wide">Navigasi</h3>
            <ul className="space-y-3 text-gray-100 text-sm sm:text-base font-medium">
              <li>
                <a
                  href="/"
                  className="hover:text-yellow-300 hover:translate-x-1 inline-block transition-all duration-300">
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/visi-misi"
                  className="hover:text-yellow-300 hover:translate-x-1 inline-block transition-all duration-300">
                  Visi dan Misi
                </a>
              </li>
              <li>
                <a
                  href="/sejarah"
                  className="hover:text-yellow-300 hover:translate-x-1 inline-block transition-all duration-300">
                  Sejarah
                </a>
              </li>
              <li>
                <a
                  href="/berita"
                  className="hover:text-yellow-300 hover:translate-x-1 inline-block transition-all duration-300">
                  Postingan
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: Ikuti Kami (Social Media) */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-2xl font-bold tracking-wide">Ikuti Kami</h3>
            <div className="flex items-center gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-[#b30000] transition-all duration-300"
                title="Facebook">
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-[#b30000] transition-all duration-300"
                title="Instagram">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* --- BAGIAN BAWAH (Copyright) --- */}
        <div className="pt-6 border-t border-white/20 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-200">
          <p>&copy; {currentYear} SMP Negeri 3 Manado. All rights reserved.</p>
          <p className="font-medium text-white/60">Dikelola oleh Tim IT SMP Negeri 3 Manado</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
