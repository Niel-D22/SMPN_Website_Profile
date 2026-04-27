import React, { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { profilSekolahApi } from '../../../../Api/profilSekolahApi';

const Hero = () => {
  const bgRef = useRef(null);
  const belakangRef = useRef(null);
  const depanRef = useRef(null);
  const pagarRef = useRef(null);
  const matahariRef = useRef(null);
  const currentY = useRef(0);
  const targetY = useRef(0);
  const [profil, setProfil] = useState(null);

  const parallax = (scrollY, start = 0, speed = 0.2) => {
    if (scrollY < start) return 0;
    return (scrollY - start) * speed;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await profilSekolahApi.getProfilSekolah();
        setProfil(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      targetY.current = window.scrollY;
    };

    const animate = () => {
      currentY.current += (targetY.current - currentY.current) * 0.08;
      const y = currentY.current;

      if (matahariRef.current) {
        const moveY = parallax(y, 0, 0.4);
        const moveX = parallax(y, 0, 0.08);
        matahariRef.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      }

      if (bgRef.current) {
        const move = parallax(y, 150, 0.05);
        bgRef.current.style.transform = `translateY(${move}px) scale(1.05)`;
      }

      if (belakangRef.current) {
        const move = parallax(y, 100, 0.15);
        belakangRef.current.style.transform = `translateY(${move}px) scale(1.02)`;
      }

      if (depanRef.current) {
        const move = parallax(y, 50, 0.3);
        depanRef.current.style.transform = `translateY(${move}px) scale(1.03)`;
      }

      if (pagarRef.current) {
        const move = parallax(y, 0, 0.5);
        pagarRef.current.style.transform = `translateY(${move}px) scale(1.05)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    requestAnimationFrame(animate);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full">
      {/* CSS Animasi Murni Tanpa Efek Transparan (Opacity) */}
      <style>
        {`
          @keyframes slideUp {
            0% { transform: translateY(200px); }
            100% { transform: translateY(0); }
          }
          .anim-slide-1 { animation: slideUp 1s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
          .anim-slide-2 { animation: slideUp 1s cubic-bezier(0.25, 1, 0.5, 1) 0.15s forwards; transform: translateY(200px); }
          .anim-slide-3 { animation: slideUp 1s cubic-bezier(0.25, 1, 0.5, 1) 0.3s forwards; transform: translateY(200px); }
          .anim-slide-4 { animation: slideUp 1s cubic-bezier(0.25, 1, 0.5, 1) 0.45s forwards; transform: translateY(200px); }
        `}
      </style>

      {/* HERO */}
      <div className="relative w-full h-screen sm:h-[520px] md:h-[600px] lg:h-[680px] overflow-hidden bg-[#e0f7fa]">
        {/* BG - Tidak perlu dianimasikan naik */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <div ref={bgRef} className="w-full h-full will-change-transform">
            <img
              src="/Images/BgHero.png"
              alt=""
              className="w-full h-full object-cover object-bottom"
              draggable={false}
            />
          </div>
        </div>

        {/* MATAHARI - Naik dari bawah (anim-slide-1) */}
        <div
          className="
            absolute pointer-events-none anim-slide-1
            top-100 left-1/2 -translate-x-1/2
            w-120 sm:w-206 md:w-202 lg:w-166
            sm:top-30 sm:left-35 sm:translate-x-0
          "
          style={{ zIndex: 2 }}>
          <div
            ref={matahariRef}
            style={{ transformOrigin: 'center center', willChange: 'transform' }}>
            <img
              src="/Images/matahari.png"
              alt="matahari"
              className="w-full object-contain"
              draggable={false}
            />
          </div>
        </div>

        {/* BELAKANG - Naik dari bawah (anim-slide-2) */}
        <div className="absolute inset-x-0 bottom-0 w-full anim-slide-2" style={{ zIndex: 2 }}>
          <div ref={belakangRef} className="w-full will-change-transform">
            <img
              src="/Images/BelakangHero.png"
              alt=""
              className="w-full object-contain object-bottom scale-[1.3] sm:scale-100 origin-bottom"
              draggable={false}
            />
          </div>
        </div>

        {/* DEPAN - Naik dari bawah (anim-slide-3) */}
        <div className="absolute inset-x-0 bottom-0 w-full anim-slide-3" style={{ zIndex: 3 }}>
          <div ref={depanRef} className="w-full will-change-transform">
            <img
              src="/Images/DepanHero.png"
              alt=""
              className="w-full object-contain object-bottom scale-[1.3] sm:scale-100 origin-bottom"
              draggable={false}
            />
          </div>
        </div>

        {/* PAGAR - Naik dari bawah paling terakhir (anim-slide-4) */}
        <div className="absolute inset-x-0 bottom-0 w-full anim-slide-4" style={{ zIndex: 4 }}>
          <div ref={pagarRef} className="w-full will-change-transform">
            <img
              src="/Images/Pagarhero.png"
              alt=""
              className="w-full object-contain object-bottom scale-[1.3] sm:scale-100 origin-bottom"
              draggable={false}
            />
          </div>
        </div>

        {/* NAMA SEKOLAH (Mobile) */}
        <div
          className="absolute top-50 left-0 right-0 px-4 sm:hidden anim-slide-2"
          style={{ zIndex: 6 }}>
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              src="/Images/LogoSekolah.png"
              alt="logo"
              className="w-20 h-20 object-contain mx-auto mb-2"
              draggable={false}
            />
            <div className="text-white drop-shadow-lg flex flex-col items-center text-center">
              <p className="font-bold text-4xl leading-tight">SMP Negeri 3</p>
              <p className="font-bold text-4xl leading-tight">Manado</p>
            </div>
          </div>
        </div>

        {/* GRADIENT BAWAH */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 sm:h-48 pointer-events-none"
          style={{ zIndex: 5, background: 'linear-gradient(to bottom, transparent, white)' }}
        />
      </div>

      {/* CARD (Tetap pakai AOS agar bagus munculnya pas di-scroll) */}
      <div
        className="max-w-screen-xl mx-auto px-4 -mt-6 sm:-mt-8 md:-mt-12 relative"
        style={{ zIndex: 10 }}
        data-aos="fade-up"
        data-aos-delay="500">
        <div className="bg-white rounded-[24px] sm:rounded-[30px] shadow-2xl p-5 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border border-gray-100">
          {/* BAGIAN KIRI (FOTO & TEKS SAMBUTAN) */}
          <div className="flex flex-col lg:flex-row items-center md:items-start lg:items-center gap-4 sm:gap-6 w-full md:w-auto flex-1">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {profil?.foto_kepsek ? (
                <img
                  src={profil.foto_kepsek}
                  alt="Kepala Sekolah"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-400 w-full h-full" />
              )}
            </div>

            <div className="text-center md:text-left w-full flex-1">
              <h2 className="text-[#0c356a] text-lg sm:text-xl md:text-3xl font-bold leading-tight">
                Sambutan Kepala Sekolah
              </h2>
              <h3 className="text-[#0c356a] text-sm sm:text-base md:text-xl font-semibold mb-2 md:mb-3">
                {profil?.kepala_sekolah || 'Kepala Sekolah'}
              </h3>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base max-w-2xl md:max-w-none">
                {profil?.sambutan_kepsek || ''}
              </p>
            </div>
          </div>

          {/* BAGIAN KANAN (STATISTIK) */}
          <div className="w-full md:w-auto md:border-l-2 border-gray-200 md:pl-8 shrink-0 border-t-2 md:border-t-0 pt-4 md:pt-0">
            <h4 className="text-[#0c356a] font-bold text-center mb-3 text-sm md:text-lg">
              Statistik Data Sekolah
            </h4>
            <div className="flex flex-row justify-center items-center gap-6 md:gap-8">
              <div className="text-center">
                <p className="text-[#0c356a] text-2xl md:text-3xl font-extrabold">
                  {profil?.jumlah_guru || 0}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Guru & Staf</p>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div className="text-center">
                <p className="text-[#0c356a] text-2xl md:text-3xl font-extrabold">
                  {profil?.jumlah_siswa || 0}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Siswa</p>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div className="text-center">
                <p className="text-[#0c356a] text-2xl md:text-3xl font-extrabold">
                  {profil?.jumlah_kelas || 0}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Kelas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
