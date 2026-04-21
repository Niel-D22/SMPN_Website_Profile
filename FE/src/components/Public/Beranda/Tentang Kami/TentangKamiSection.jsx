import React, { useState } from 'react';
import 'animate.css';
import { FaArrowRight } from 'react-icons/fa';

// Import gambar dari public/images
import imgProfil from '../../../../../public/Images/profil.jpeg';
import imgGuruStaff from '../../../../../public/Images/guru.jpeg';
import imgPrestasi from '../../../../../public/Images/prestasi.jpeg';
import imgGaleri from '../../../../../public/Images/galeri.jpeg';

const cardData = [
  {
    id: 1,
    title: 'Profil Sekolah',
    desc: 'Sejak didirikan, kami membimbing siswa menjadi generasi berkarakter unggul dan siap berkontribusi bagi bangsa.',
    imgUrl: imgProfil,
    link: '/profil',
  },
  {
    id: 2,
    title: 'Guru & Staf',
    desc: 'Didukung oleh tenaga pendidik profesional, berpengalaman, dan berdedikasi tinggi untuk kesuksesan siswa.',
    imgUrl: imgGuruStaff,
    link: '/direktori-staf',
  },
  {
    id: 3,
    title: 'Prestasi',
    desc: 'Mencetak jawara di berbagai bidang akademik maupun non-akademik di tingkat kota hingga nasional.',
    imgUrl: imgPrestasi,
    link: '/prestasi',
  },
  {
    id: 4,
    title: 'Galeri Kegiatan',
    desc: 'Dokumentasi berbagai aktivitas seru, kreatif, dan inspiratif yang dilakukan oleh siswa-siswi kami.',
    imgUrl: imgGaleri,
    link: '/galeri',
  },
];

// Komponen kartu yang responsive & kotak jelas untuk mobile
const InfoCard = ({ card }) => {
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Listen for resize to update isMobile
  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleMouseEnter() {
    if (!isMobile) setActive(true);
  }
  function handleMouseLeave() {
    if (!isMobile) setActive(false);
  }

  function handleTouchStart(e) {
    if (isMobile) setActive((v) => !v);
    e.stopPropagation();
  }

  // agar close saat tap luar pada mobile
  React.useEffect(() => {
    if (!isMobile || !active) return;
    function handleDoc(e) {
      setActive(false);
    }
    document.addEventListener('touchstart', handleDoc);
    return () => document.removeEventListener('touchstart', handleDoc);
  }, [isMobile, active]);

  return (
    <div
      className={`
        relative w-full flex flex-col
        rounded-xl sm:rounded-2xl
        overflow-hidden cursor-pointer
        shadow-md
        transition-shadow duration-300
        outline-none
        // Box border untuk mobile
        border border-gray-200
        bg-white
        // Box shadow kuat di mobile
        mobile:shadow-lg
        // Perbesar gap di mobile
        `}
      tabIndex={0}
      style={{
        minHeight: 'clamp(142px, 28vw, 320px)',
        boxShadow: active ? '0 12px 34px rgba(0,0,0,0.14)' : '0 4px 12px rgba(0,0,0,0.06)',
        borderColor: active ? '#cc0000' : '#e5e7eb',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}>
      {/* Gambar latar */}
      <img
        src={card.imgUrl}
        alt={card.title}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
        style={{
          transform: active ? 'scale(1.10)' : 'scale(1)',
          opacity: 0.93,
        }}
      />

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.38) 54%, transparent 100%)',
          opacity: active ? 0.97 : 0.87,
        }}
      />

      {/* Inner konten, full responsive */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end h-full"
        style={{
          padding: 'clamp(12px, 5vw, 19px)',
        }}>
        <h3
          className="font-extrabold text-white mb-2 transition-transform duration-500"
          style={{
            fontSize: 'clamp(0.99rem, 2vw, 1.22rem)',
            transform: active ? 'translateY(0)' : 'translateY(22px)',
          }}>
          {card.title}
        </h3>
        {/* Link dan desc hanya tampil jika aktif (hover di desktop, tap di mobile) */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{
            maxHeight: active ? 500 : 0,
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: active ? '50ms' : '0ms',
          }}>
          <p
            className="text-gray-100 leading-relaxed mb-2 line-clamp-3"
            style={{
              fontSize: 'clamp(0.68rem, 1.13vw, 0.92rem)',
              textShadow: '0 2px 3px rgba(30,30,30,0.25)',
            }}>
            {card.desc}
          </p>
          <a
            href={card.link}
            className="inline-flex items-center gap-2 text-yellow-100 font-semibold border-b border-yellow-100 pb-0.5 hover:text-yellow-300 hover:border-yellow-300 transition-colors"
            style={{ fontSize: 'clamp(0.72rem, 1vw, 0.85rem)' }}
            onClick={(e) => e.stopPropagation()}>
            Lihat Selengkapnya <FaArrowRight size={13} />
          </a>
        </div>
      </div>
      {/* Kotak putih dan bayangan tebal hanya untuk device kecil (<480px) */}
      <div
        className="
          block
          lg:hidden
          absolute inset-0 pointer-events-none
          rounded-xl
          border-white
          border-opacity-20
        "
        aria-hidden="true"
        style={{
          boxShadow: '0 2px 18px 3px rgba(70,70,95,.12), 0 1.5px 8px 0 rgba(120,110,170,0.02)',
          borderWidth: '2px',
        }}
      />
    </div>
  );
};

// Responsive Section: grid responsive untuk mobile optimal, layout desktop tetap default
const TentangKamiSection = () => {
  // Responsive gridClass
  const gridClass = `
      grid
      grid-cols-2
      xs:grid-cols-2
      sm:grid-cols-2
      md:grid-cols-2
      gap-3
      sm:gap-4
      md:gap-6
      lg:grid-cols-4
      lg:gap-6
    `;

  return (
    <section className="animate__animated animate__fadeInUp animate__faster w-full bg-gradient-to-b from-[var(--color-bg-section,white)] to-white px-2 xs:px-3 sm:px-6 md:px-10 lg:px-14 xl:px-0 py-6 xs:py-8 sm:py-11 md:py-16 lg:py-24">
      <div className="max-w-[1240px] mx-auto">
        {/* BAGIAN ATAS */}
        <div className="inline-flex items-center gap-2 bg-[var(--color-accent-light,#e0e7ff)] text-black px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-black" />
          Tentang Kami
        </div>
        <div
          className="
            flex
            flex-col
            md:flex-row md:items-center md:justify-between
            gap-6 xs:gap-8 mb-8 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-0 md:gap-10">
            <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-5xl font-extrabold text-black leading-tight text-left whitespace-pre-line mb-6 md:mb-0 md:mr-8">
              Bergabunglah dengan{'\n'}SMPN 3 Hari Ini
            </h2>
            <div className="max-w-full md:max-w-[380px] w-full md:items-end mt-0">
              <p className="text-[var(--color-desc,#374151)] text-xs xs:text-sm sm:text-base leading-relaxed mb-4 md:mb-4 md:ml-0">
                Dapatkan semua informasi yang kamu butuhkan tentang cara pendaftaran, syarat
                dokumen, dan jadwal PPDB penting untuk tahun ajaran terbaru. Kami siap menyambut
                masa depanmu dimulai dari sini.
              </p>
              <a
                href="/ppdb"
                className="inline-flex items-center gap-2 bg-primary text-[var(--color-on-primary,#fff)] px-5 md:px-8 py-2.5 md:py-3.5 rounded-full font-bold shadow-lg shadow-[rgba(35,57,93,0.25)] hover:bg-gray-900 hover:-translate-y-1 transition-all duration-300 text-xs xs:text-sm md:text-base"
                style={{ fontFamily: 'inherit' }}>
                Pelajari Selengkapnya
              </a>
            </div>
          </div>
        </div>
        {/* BAGIAN BAWAH: Grid Kartu Responsive */}
        <div className={gridClass}>
          {cardData.map((card) => (
            <InfoCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TentangKamiSection;
