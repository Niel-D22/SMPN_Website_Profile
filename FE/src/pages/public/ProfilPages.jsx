import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaAward,
  FaUsers,
  FaBookOpen,
  FaBuilding,
  FaChevronRight,
  FaStar,
  FaCheckCircle,
  FaBuilding as FaKelas,
  FaCameraRetro, // Tambahan Icon
  FaRunning, // Tambahan Icon
} from 'react-icons/fa';

/* ── DATA PROFIL ── */
const PROFIL = {
  nama: 'SMP Negeri 3 Manado',
  npsn: '40100512',
  nsm: '201176001003',
  status: 'Negeri',
  akreditasi: 'A',
  tahunBerdiri: '1965',
  kepalaSekolah: 'Drs. H. Johny Mokoginta, M.Pd',
  alamat: 'Jl. Diponegoro No. 1, Wenang, Kota Manado, Sulawesi Utara 95111',
  telepon: '(0431) 864279',
  email: 'smpn3manado@gmail.com',
  website: 'smpn3manado.sch.id',
  deskripsi:
    'SMP Negeri 3 Manado adalah salah satu sekolah menengah pertama negeri unggulan di Kota Manado yang telah berdiri sejak tahun 1965. Dengan pengalaman lebih dari setengah abad, sekolah ini terus berkomitmen menghadirkan pendidikan berkualitas tinggi yang membentuk karakter, kecerdasan, dan kreativitas generasi penerus bangsa.',
  deskripsi2:
    'Sekolah ini telah melahirkan ribuan alumni berprestasi yang kini berkarya di berbagai bidang—mulai dari akademisi, profesional, hingga pemimpin daerah. Kami terus berinovasi dalam metode pembelajaran dan pengembangan infrastruktur untuk memastikan setiap siswa mendapat pengalaman belajar terbaik.',
};

const STATS = [
  { label: 'Total Siswa', value: '900+', icon: <FaUsers /> },
  { label: 'Tenaga Pendidik', value: '60+', icon: <FaBookOpen /> },
  { label: 'Kelas', value: '24', icon: <FaBuilding /> },
];

// Data Preview Fasilitas (Tampilkan 3 saja di halaman profil)
const FASILITAS = [
  {
    nama: 'Laboratorium Komputer',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop',
  },
  {
    nama: 'Perpustakaan Digital',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop',
  },
  {
    nama: 'Lapangan Olahraga Terpadu',
    img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop',
  },
];

// Data Preview Ekskul
const EKSKUL = [
  'Pramuka',
  'PMR',
  'Basket',
  'Voli',
  'Futsal',
  'Seni Tari',
  'Paduan Suara',
  'English Club',
];

/* ── COMPONENT ── */
const ProfilPages = () => {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* ══════════════════════════════
          HERO SECTION
      ══════════════════════════════ */}
      <section className="relative w-full min-h-[70vh] flex items-end justify-start overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1920&auto=format&fit=crop')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.15) 100%)',
          }}
        />

        <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 lg:px-10 pb-14 pt-32">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 max-w-3xl">
            SMP Negeri 3<br />
            <span style={{ color: 'var(--color-primary, #cc0000)' }}>Manado</span>
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-xl leading-relaxed">
            Berdiri sejak 1965 · Jl. Diponegoro No. 1, Wenang, Manado
          </p>
        </div>
      </section>

      {/* ══════════════════════════════
          STATS BAR
      ══════════════════════════════ */}
      <section style={{ background: 'var(--color-primary, #cc0000)' }}>
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-0 md:gap-0">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className={
                  `flex-1 flex items-center gap-5 justify-center px-6 py-5 ` +
                  (i !== 0 ? 'border-t md:border-t-0 md:border-l border-white/25' : '')
                }>
                <div className="flex-shrink-0 bg-white/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-white text-2xl">{stat.icon}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-white font-bold text-2xl md:text-3xl leading-none">
                    {stat.value}
                  </span>
                  <span className="text-white/80 text-xs font-semibold uppercase tracking-wider mt-1">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          DESKRIPSI + IDENTITAS
      ══════════════════════════════ */}
      <section className="max-w-[1240px] mx-auto px-6 lg:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-start">
          {/* Kiri — teks */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.18em] mb-3"
              style={{ color: 'var(--color-primary, #cc0000)' }}>
              Tentang Sekolah
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
              Melahirkan Generasi Unggul Sejak Enam Dekade
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-base">{PROFIL.deskripsi}</p>
            <p className="text-gray-500 leading-relaxed text-sm">{PROFIL.deskripsi2}</p>

            {/* Poin keunggulan */}
            <div className="mt-8 flex flex-col gap-3">
              {[
                'Kurikulum Merdeka Belajar',
                'Tenaga pendidik bersertifikat nasional',
                'Fasilitas lengkap & modern',
                'Program ekstrakurikuler beragam',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <FaCheckCircle
                    size={15}
                    style={{ color: 'var(--color-primary, #cc0000)', flexShrink: 0 }}
                  />
                  <span className="text-gray-700 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3 flex-wrap">
              <Link
                to="/visi-misi"
                className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-full text-sm transition-all hover:opacity-90 no-underline"
                style={{ background: 'var(--color-primary, #cc0000)' }}>
                Visi & Misi <FaChevronRight size={11} />
              </Link>
              <Link
                to="/guru"
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-sm border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-700 transition-all no-underline">
                Guru & Staf <FaChevronRight size={11} />
              </Link>
            </div>
          </div>

          {/* Kanan — kartu identitas */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div
              className="px-6 py-4 border-b border-gray-100"
              style={{ background: 'var(--color-primary, #cc0000)' }}>
              <h3 className="text-white font-extrabold text-base">Identitas Sekolah</h3>
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              {[
                { label: 'NPSN', value: PROFIL.npsn },
                { label: 'NSM', value: PROFIL.nsm },
                { label: 'Status', value: PROFIL.status },
                { label: 'Akreditasi', value: PROFIL.akreditasi, highlight: true },
                { label: 'Tahun Berdiri', value: PROFIL.tahunBerdiri },
                { label: 'Kepala Sekolah', value: PROFIL.kepalaSekolah },
              ].map((row, i) => (
                <div key={i} className="flex items-start justify-between px-6 py-3.5 gap-4">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide shrink-0 pt-0.5">
                    {row.label}
                  </span>
                  <span
                    className={`text-sm font-bold text-right ${row.highlight ? 'text-green-600' : 'text-gray-800'}`}>
                    {row.highlight ? `✓ ${row.value}` : row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Kontak */}
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaMapMarkerAlt style={{ color: 'var(--color-primary, #cc0000)', flexShrink: 0 }} />
                <span className="leading-snug">{PROFIL.alamat}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaPhone style={{ color: 'var(--color-primary, #cc0000)', flexShrink: 0 }} />
                <span>{PROFIL.telepon}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaEnvelope style={{ color: 'var(--color-primary, #cc0000)', flexShrink: 0 }} />
                <span>{PROFIL.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaGlobe style={{ color: 'var(--color-primary, #cc0000)', flexShrink: 0 }} />
                <span>{PROFIL.website}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          PREVIEW FASILITAS & EKSKUL (BARU)
      ══════════════════════════════ */}
      <section className="bg-gray-50 py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                Fasilitas & Ekstrakurikuler
              </h2>
              <p className="text-gray-500 text-sm md:text-base">
                Lingkungan belajar yang mendukung pengembangan minat dan bakat siswa.
              </p>
            </div>

            {/* Tombol Lihat Selengkapnya (Arahkan ke halaman galeri fasilitas/ekskul) */}
            <Link
              to="/galeri-fasilitas"
              className="group inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all no-underline shrink-0">
              Lihat Selengkapnya
              <FaChevronRight
                size={10}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
            {/* KOLOM KIRI: Galeri Fasilitas Mini */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FASILITAS.map((fasilitas, index) => (
                <div
                  key={index}
                  className="relative group rounded-2xl overflow-hidden aspect-[4/5] bg-gray-200">
                  <img
                    src={fasilitas.img}
                    alt={fasilitas.nama}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                    <h4 className="text-white font-bold text-sm tracking-wide leading-snug drop-shadow-md">
                      {fasilitas.nama}
                    </h4>
                  </div>
                  {/* Ikon Kamera pojok kanan atas */}
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCameraRetro size={12} />
                  </div>
                </div>
              ))}
            </div>

            {/* KOLOM KANAN: Daftar Ekstrakurikuler (Bentuk Pill/Tags) */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
                  <FaRunning size={20} />
                </div>
                <h3 className="font-extrabold text-gray-800 text-lg">Daftar Ekstrakurikuler</h3>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {EKSKUL.map((item, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-default">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-400 italic">
                  *Terdapat lebih dari 15+ pilihan ekstrakurikuler aktif lainnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilPages;
