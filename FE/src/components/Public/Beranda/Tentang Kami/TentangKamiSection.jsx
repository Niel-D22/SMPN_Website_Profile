import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

const cardData = [
  {
    id: 1,
    title: 'Profil Sekolah',
    desc: 'Sejak didirikan, kami membimbing siswa menjadi generasi berkarakter unggul dan siap berkontribusi bagi bangsa.',
    imgUrl:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600&auto=format&fit=crop',
    link: '/profil',
  },
  {
    id: 2,
    title: 'Guru & Staf',
    desc: 'Didukung oleh tenaga pendidik profesional, berpengalaman, dan berdedikasi tinggi untuk kesuksesan siswa.',
    imgUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop',
    link: '/direktori-staf',
  },
  {
    id: 3,
    title: 'Prestasi',
    desc: 'Mencetak jawara di berbagai bidang akademik maupun non-akademik di tingkat kota hingga nasional.',
    imgUrl:
      'https://images.unsplash.com/photo-1561525140-c2a4cc68e4bd?q=80&w=600&auto=format&fit=crop',
    link: '/prestasi',
  },
  {
    id: 4,
    title: 'Galeri Kegiatan',
    desc: 'Dokumentasi berbagai aktivitas seru, kreatif, dan inspiratif yang dilakukan oleh siswa-siswi kami.',
    imgUrl:
      'https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=600&auto=format&fit=crop',
    link: '/galeri',
  },
];

// ── Card terpisah supaya bisa pakai useState untuk touch/hover ──
const InfoCard = ({ card }) => {
  const [active, setActive] = useState(false);

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-md transition-shadow duration-300 flex"
      style={{
        // Kurangi tinggi minimum -> min 200px di HP kecil, max 320px di desktop
        minHeight: 'clamp(200px, 32vw, 320px)',
        boxShadow: active ? '0 20px 40px rgba(0,0,0,0.22)' : '0 4px 12px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      // Touch: tap untuk toggle aktif, tap lagi untuk nonaktif
      onTouchStart={() => setActive((v) => !v)}>
      {/* Gambar Background */}
      <img
        src={card.imgUrl}
        alt={card.title}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
        style={{ transform: active ? 'scale(1.10)' : 'scale(1)' }}
      />

      {/* Overlay Gradient — sama seperti aslinya */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.40) 55%, transparent 100%)',
          opacity: active ? 0.95 : 0.8,
        }}
      />

      {/* Konten Teks — struktur sama persis dengan aslinya */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end h-full"
        style={{ padding: 'clamp(12px, 2vw, 20px)' }}>
        {/* Judul */}
        <h3
          className="font-bold text-white mb-2 transition-transform duration-500"
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
            transform: active ? 'translateY(0)' : 'translateY(28px)',
          }}>
          {card.title}
        </h3>

        {/* Desc + link — muncul saat hover/touch active */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{
            maxHeight: active ? 130 : 0, // Kurangi maxHeight desc untuk kesan lebih kecil
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: active ? '50ms' : '0ms',
          }}>
          <p
            className="text-gray-300 leading-relaxed mb-3 line-clamp-3"
            style={{ fontSize: 'clamp(0.66rem, 1.2vw, 0.8rem)' }}>
            {card.desc}
          </p>
          <a
            href={card.link}
            className="inline-flex items-center gap-2 text-white font-semibold border-b border-white pb-0.5 hover:text-yellow-300 hover:border-yellow-300 transition-colors"
            style={{ fontSize: 'clamp(0.65rem, 1vw, 0.75rem)' }}
            onClick={(e) => e.stopPropagation()}>
            Lihat Selengkapnya <FaArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ── MAIN SECTION — layout & struktur TIDAK berubah ──
const TentangKamiSection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[var(--color-bg-section,white)] to-white px-4 sm:px-6 md:px-10 lg:px-14 xl:px-0 py-10 md:py-16 lg:py-24">
      <div className="max-w-[1240px] mx-auto">
        {/* === BAGIAN ATAS (Teks & Tombol) — tidak diubah === */}
        <div className="inline-flex items-center gap-2 bg-[var(--color-accent-light,#e0e7ff)] text-black px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-black" />
          Tentang Kami
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-0 md:gap-10">
            <h2 className="text-2xl pb-20 sm:text-2xl md:text-5xl font-extrabold text-black leading-tight text-left whitespace-pre-line mb-6 md:mb-0 md:mr-8">
              Bergabunglah dengan{'\n'}SMPN 3 Hari Ini
            </h2>
            <div className="max-w-full md:max-w-[380px] w-full md:items-end mt-0">
              <p className="text-[var(--color-desc,#374151)] text-sm sm:text-base leading-relaxed mb-4 md:mb-4 md:ml-0">
                Dapatkan semua informasi yang kamu butuhkan tentang cara pendaftaran, syarat
                dokumen, dan jadwal PPDB penting untuk tahun ajaran terbaru. Kami siap menyambut
                masa depanmu dimulai dari sini.
              </p>
              <a
                href="/ppdb"
                className="inline-flex items-center gap-2 bg-primary text-[var(--color-on-primary,#fff)] px-5 md:px-8 py-2.5 md:py-3.5 rounded-full font-bold shadow-lg shadow-[rgba(35,57,93,0.25)] hover:bg-gray-900 hover:-translate-y-1 transition-all duration-300 text-sm md:text-base"
                style={{ fontFamily: 'inherit' }}>
                Pelajari Selengkapnya
              </a>
            </div>
          </div>
        </div>

        {/* === BAGIAN BAWAH (Grid 4 Kartu) ===
            Breakpoint grid:
            < 480px        → 1 kolom  (HP kecil: iPhone SE, Galaxy A)
            480px – 767px  → 2 kolom  (HP besar: iPhone 14, Galaxy S)
            768px – 1023px → 2 kolom  (Tablet portrait: iPad, Tab S)
            ≥ 1024px       → 4 kolom  (Desktop & Tablet landscape)
        */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {cardData.map((card) => (
            <InfoCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TentangKamiSection;
