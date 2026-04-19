import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Warna utama: Merah maroon #b30000, biru navy #003366, abu2 #f4f6fb, accent emas #f4b400, teks putih.
  // Ganti menu sesuai menu utama website
  return (
    <footer className="bg-[#b30000] text-white mt-16 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* GRID 4 KOLOM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* KOLOM 1: BRAND + KONTAK */}
          <div className="space-y-4">
            <img
              src="../../../public/Images/LogoSekolah.png"
              alt="Logo"
              className="w-20 h-20 object-contain rounded-xl"
            />

            <p className="text-sm text-white/80 leading-relaxed font-medium">
              SMP NEGERI 3 MANADO — Sekolah Unggul, Berkarakter dan Berprestasi!
            </p>

            <ul className="space-y-2 text-sm text-white/90 font-semibold">
              <li className="flex gap-2 items-start">
                <FaMapMarkerAlt className="mt-0.5 text-[#f4b400]" />
                <span>Jl. Kakap No. 2, Kec. Tuminting, Kota Manado, Sulawesi Utara</span>
              </li>
              <li className="flex gap-2 items-center">
                <FaPhoneAlt className="text-[#f4b400]" />
                <span>082395358120</span>
              </li>
              <li className="flex gap-2 items-center">
                <FaEnvelope className="text-[#f4b400]" />
                <span>smpnegeri3manadosulut@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* KOLOM 2 */}
          <div>
            <h3 className="font-bold mb-4 text-white text-lg tracking-wide">Menu Utama</h3>
            <ul className="space-y-2 text-sm text-white/80 ">
              <li>
                <a href="/" className="hover:text-[#f4b400] transition">
                  Beranda
                </a>
              </li>
              <li>
                <a href="/profil-sekolah" className="hover:text-[#f4b400] transition">
                  Profil Sekolah
                </a>
              </li>
              <li>
                <a href="/visi-misi" className="hover:text-[#f4b400] transition">
                  Visi & Misi
                </a>
              </li>
              <li>
                <a href="/guru" className="hover:text-[#f4b400] transition">
                  Data Guru
                </a>
              </li>
              <li>
                <a href="/alumni" className="hover:text-[#f4b400] transition">
                  Data Alumni
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 3 */}
          <div>
            <h3 className="font-bold mb-4 text-white text-lg tracking-wide">Informasi</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="/berita" className="hover:text-[#f4b400] transition">
                  Berita
                </a>
              </li>
              <li>
                <a href="/pengumuman" className="hover:text-[#f4b400] transition">
                  Pengumuman
                </a>
              </li>
              <li>
                <a href="/agenda" className="hover:text-[#f4b400] transition">
                  Agenda Sekolah
                </a>
              </li>
              <li>
                <a href="/galeri" className="hover:text-[#f4b400] transition">
                  Galeri Foto
                </a>
              </li>
              <li>
                <a href="/kontak" className="hover:text-[#f4b400] transition">
                  Kontak & Lokasi
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 4 */}
          <div>
            <h3 className="font-bold mb-4 text-white text-lg tracking-wide">Ikuti Kami</h3>

            <div className="flex gap-3 mb-4">
              <a
                href="https://facebook.com/smpn3manado"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-[#003366] hover:bg-[#f4b400] hover:text-[#b30000] transition"
                aria-label="Facebook SMPN 3 Manado">
                <FaFacebook size={22} />
              </a>
              <a
                href="https://instagram.com/smpn3manado"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-[#003366] hover:bg-[#f4b400] hover:text-[#b30000] transition"
                aria-label="Instagram SMPN 3 Manado">
                <FaInstagram size={22} />
              </a>
            </div>
            <p className="text-xs text-white/70 mt-2">Follow untuk update terbaru sekolah!</p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/80">
          <p>
            © {currentYear} <span className="font-bold text-[#f4b400]">SMP Negeri 3 Manado</span>
          </p>
          <p>
            Dikelola oleh <span className="font-semibold text-[#003366]">Tim IT SMPN 3 Manado</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
