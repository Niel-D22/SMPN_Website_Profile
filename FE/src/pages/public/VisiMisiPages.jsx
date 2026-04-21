import React, { useState, useEffect } from 'react';
import { FaLightbulb, FaBullseye, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import { profilSekolahApi } from '../../Api/profilSekolahApi';
import 'animate.css';

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const VisiMisiPages = () => {
  const [profilData, setProfilData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await profilSekolahApi.getProfilSekolah();
        setProfilData(data);
      } catch (err) {
        console.error('Gagal ambil data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const listMisi = profilData?.misi
    ? profilData.misi.split(/\d+\.\s/).filter((item) => item.trim() !== '')
    : [];

  return (
    <div className="min-h-screen bg-white overflow-hidden animate__animated animate__fadeInUp animate__faster">
      {/* HERO */}
      <section className="relative w-full min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
            Visi & Misi Sekolah
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed drop-shadow-md mb-10">
            Mengenal lebih dekat arah, tujuan, dan komitmen sekolah dalam membentuk generasi unggul.
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-3xl" />
        </div>
      </section>

      {/* VISI */}
      <section className="relative w-full bg-white pt-20 pb-32 md:pt-32 md:pb-48 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#003366] mb-6">Visi</h2>
            <div className="w-16 h-1.5 bg-yellow-400 mb-6 rounded-full" />

            {loading ? (
              <div className="flex flex-col gap-3">
                <SkeletonBox className="w-full h-5" />
                <SkeletonBox className="w-full h-5" />
                <SkeletonBox className="w-3/4 h-5" />
              </div>
            ) : (
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed text-justify">
                {profilData?.visi || 'Visi belum tersedia'}
              </p>
            )}
          </div>

          <div className="order-1 md:order-2 flex justify-center md:justify-end relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100 rounded-full blur-3xl" />
            <div className="relative bg-gradient-to-br from-blue-50 to-white border border-gray-100 shadow-2xl p-12 rounded-[3rem] transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <FaLightbulb className="text-7xl md:text-9xl text-[#003366] drop-shadow-md" />
              <div className="absolute top-8 right-8 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
              <div className="absolute bottom-10 left-10 w-3 h-3 bg-red-400 rounded-full" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-[60px] md:h-[120px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.2,192.39,107.57Z"
              fill="#fef2f2"
            />
          </svg>
        </div>
      </section>

      {/* MISI */}
      <section className="relative w-full bg-gradient-to-b from-red-50 via-red-100 to-red-200 pt-16 pb-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex justify-center md:justify-start relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-200 rounded-full blur-3xl" />
            <div className="relative bg-gradient-to-br from-white to-red-50 border border-red-100 shadow-2xl p-12 rounded-[3rem] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <FaBullseye className="text-7xl md:text-9xl text-[#b30000] drop-shadow-md" />
              <div className="absolute top-10 left-8 w-4 h-4 bg-[#003366] rounded-full animate-bounce" />
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#003366] mb-6">Misi</h2>
            <div className="w-16 h-1.5 bg-[#b30000] mb-8 rounded-full" />

            {loading ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <SkeletonBox className="w-5 h-5 rounded-full flex-shrink-0 mt-1" />
                      <div className="flex-1 flex flex-col gap-2">
                        <SkeletonBox className="w-full h-4" />
                        <SkeletonBox className={`h-4 ${i % 2 === 0 ? 'w-3/4' : 'w-5/6'}`} />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-5">
                {listMisi.length > 0 ? (
                  listMisi.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 text-[#b30000]">
                        <FaCheckCircle size={20} />
                      </div>
                      <p className="text-gray-800 text-base md:text-lg leading-relaxed">{item}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700">Misi belum tersedia</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisiMisiPages;
