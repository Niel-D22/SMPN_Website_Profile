import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaBookOpen,
  FaBuilding,
  FaChevronRight,
  FaCheckCircle,
} from 'react-icons/fa';
import { profilSekolahApi } from '../../Api/profilSekolahApi';
import { direktoriApi } from '../../Api/direktoriApi';
import 'animate.css';

// Komponen Skeleton
const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const ProfilPages = () => {
  const [profilData, setProfilData] = useState(null);
  const [totalGuru, setTotalGuru] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  useEffect(() => {
    const fetchSemuaData = async () => {
      try {
        const [dataProfil, dataGuru] = await Promise.all([
          profilSekolahApi.getProfilSekolah(),
          direktoriApi.getGuru(),
        ]);
        setProfilData(dataProfil);

        let jumlahGuru = 0;
        if (Array.isArray(dataGuru?.data)) jumlahGuru = dataGuru.data.length;
        else if (Array.isArray(dataGuru)) jumlahGuru = dataGuru.length;
        else if (typeof dataGuru?.total === 'number') jumlahGuru = dataGuru.total;
        setTotalGuru(jumlahGuru);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSemuaData();
  }, []);

  const jumlahSiswa = profilData?.jumlah_siswa || 900;
  const jumlahKelas = Math.ceil(jumlahSiswa / 28);

  const STATS_DYNAMIC = [
    { label: 'Total Siswa', value: `${jumlahSiswa}+`, icon: <FaUsers /> },
    { label: 'Tenaga Pendidik', value: `${totalGuru}+`, icon: <FaBookOpen /> },
    { label: 'Kelas', value: jumlahKelas.toString(), icon: <FaBuilding /> },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 animate__animated animate__fadeInUp animate__faster">
      {/* HERO */}
      <section className="relative w-full min-h-[70vh] flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0 bg-[#003366] overflow-hidden">
          <img
            src="Images/heroSmp3.webp"
            alt="Hero Background"
            fetchpriority="high"
            // Event ini akan otomatis jalan saat gambar selesai di-download 100%
            onLoad={() => setIsImageLoaded(true)}
            // Logika class Tailwind-nya ada di sini
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              isImageLoaded
                ? 'blur-0 scale-100 opacity-100' // Kalau sudah selesai, blur hilang & ukuran normal
                : 'blur-2xl scale-110 opacity-60' // Saat loading, blur tebal & agak di-zoom
            }`}
          />
        </div>
        <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 lg:px-10 pb-14 pt-32">
          {isLoading ? (
            <>
              <SkeletonBox className="w-20 h-20 mb-6 rounded-full bg-white/20" />
              <SkeletonBox className="w-2/3 h-12 mb-4 bg-white/20" />
              <SkeletonBox className="w-1/2 h-5 bg-white/20" />
            </>
          ) : (
            <>
              {profilData?.logo_url && (
                <img
                  src={profilData.logo_url}
                  alt="Logo"
                  className="w-20 h-20 mb-6 object-contain"
                />
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 max-w-3xl">
                {profilData?.nama_sekolah}
              </h1>
              <p className="text-white/75 text-base md:text-lg max-w-xl leading-relaxed">
                {profilData?.alamat}
              </p>
            </>
          )}
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'var(--color-primary, #cc0000)' }}>
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
          <div className="w-full flex flex-col md:flex-row items-center justify-center">
            {STATS_DYNAMIC.map((stat, i) => (
              <div
                key={i}
                className={`flex-1 flex items-center gap-5 justify-center px-6 py-5 ${i !== 0 ? 'border-t md:border-t-0 md:border-l border-white/25' : ''}`}>
                <div className="flex-shrink-0 bg-white/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-white text-2xl">{stat.icon}</span>
                </div>
                <div className="flex flex-col items-start">
                  {isLoading ? (
                    <>
                      <SkeletonBox className="w-16 h-7 mb-1 bg-white/20" />
                      <SkeletonBox className="w-24 h-3 bg-white/20" />
                    </>
                  ) : (
                    <>
                      <span className="text-white font-bold text-2xl md:text-3xl leading-none">
                        {stat.value}
                      </span>
                      <span className="text-white/80 text-xs font-semibold uppercase tracking-wider mt-1">
                        {stat.label}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESKRIPSI + IDENTITAS */}
      <section className="max-w-[1240px] mx-auto px-6 lg:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-start">
          {/* Kiri */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.18em] mb-3"
              style={{ color: 'var(--color-primary, #cc0000)' }}>
              Tentang Sekolah
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
              Melahirkan Generasi Unggul
            </h2>

            {isLoading ? (
              <div className="flex flex-col gap-3">
                <SkeletonBox className="w-full h-4" />
                <SkeletonBox className="w-full h-4" />
                <SkeletonBox className="w-3/4 h-4" />
                <SkeletonBox className="w-full h-4 mt-2" />
                <SkeletonBox className="w-5/6 h-4" />
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed mb-4 text-base whitespace-pre-wrap">
                {profilData?.sejarah || 'Belum ada data sejarah sekolah.'}
              </p>
            )}

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
                to="/direktori-staf"
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
                { label: 'NPSN', value: profilData?.npsn },
                { label: 'Status', value: 'Negeri' },
                { label: 'Akreditasi', value: profilData?.akreditas || 'A', highlight: true },
              ].map((row, i) => (
                <div key={i} className="flex items-start justify-between px-6 py-3.5 gap-4">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide shrink-0 pt-0.5">
                    {row.label}
                  </span>
                  {isLoading ? (
                    <SkeletonBox className="w-24 h-4" />
                  ) : (
                    <span
                      className={`text-sm font-bold text-right ${row.highlight ? 'text-green-600' : 'text-gray-800'}`}>
                      {row.highlight ? `✓ ${row.value}` : row.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
              {isLoading ? (
                <>
                  <SkeletonBox className="w-full h-4" />
                  <SkeletonBox className="w-3/4 h-4" />
                  <SkeletonBox className="w-1/2 h-4" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaMapMarkerAlt
                      style={{ color: 'var(--color-primary, #cc0000)', flexShrink: 0 }}
                    />
                    <span className="leading-snug">{profilData?.alamat}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaPhone style={{ color: 'var(--color-primary, #cc0000)', flexShrink: 0 }} />
                    <span>{profilData?.no_telepon}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaEnvelope style={{ color: 'var(--color-primary, #cc0000)', flexShrink: 0 }} />
                    <span>{profilData?.email_sekolah}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilPages;
