import React from 'react';

// DATA DUMMY PRESTASI
const defaultImg =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop';
const dummyPrestasi = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  judul: `Juara ${Math.floor(Math.random() * 3) + 1} Lomba Tingkat ${['Kota', 'Provinsi', 'Nasional'][Math.floor(Math.random() * 3)]}`,
  img: defaultImg,
}));

const row1 = dummyPrestasi.slice(0, 6);
const row2 = dummyPrestasi.slice(6, 12);

const PrestasiMarqueeSection = () => {
  return (
    <section
      className="relative py-20 overflow-hidden w-full"
      style={{
        // PERBAIKAN 1: Background Radial untuk efek sorot lampu di tengah
        background: 'radial-gradient(circle at center, #cc0000 0%, #4a0000 100%)',
      }}>
      <style>{`
        @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes scroll-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-scroll-left { animation: scroll-left 35s linear infinite; }
        .animate-scroll-right { animation: scroll-right 35s linear infinite; }
        .marquee-container:hover .animate-scroll-left,
        .marquee-container:hover .animate-scroll-right { animation-play-state: paused; }
      `}</style>

      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Prestasi Siswa SMPN 3 Manado
        </h2>
        <p className="text-red-100 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
          Setiap tahun, SMP Negeri 3 Manado mencetak prestasi yang membanggakan di tingkat regional
          hingga nasional. Inilah wajah-wajah inspiratif yang berhasil membuktikan bahwa hasil yang
          hebat bermula dari kegigihan.
        </p>
        <a
          href="/prestasi"
          className="inline-block bg-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          style={{ color: '#7a0000' }}>
          Lihat Semua Prestasi
        </a>
      </div>

      {/* 
        MARQUEE ROWS
        === Penjelasan atur gap antar card ===
        Gap (jarak antar kartu) diatur melalui kelas Tailwind `gap-6` pada elemen berikut:
        <div className="flex w-max animate-scroll-left gap-6 pl-6">
        <div className="flex w-max animate-scroll-right gap-6 pl-6">
        Anda dapat mengubah nilai 'gap-6' ke 'gap-4', 'gap-8', dsb, untuk mengecilkan atau memperbesar jarak antar kartu marquee.
      */}
      <div className="marquee-container flex flex-col gap-6 relative z-0 mt-10 w-full overflow-hidden">
        <div className="flex w-max animate-scroll-left gap-4 pl-6">
          {[...row1, ...row1].map((item, index) => (
            <MarqueeCard key={`row1-${index}`} item={item} />
          ))}
        </div>

        <div className="flex w-max animate-scroll-right gap-4 pl-6">
          {[...row2, ...row2].map((item, index) => (
            <MarqueeCard key={`row2-${index}`} item={item} />
          ))}
        </div>

        {/* PERBAIKAN 2: VIGNETTE SHADOW SIRKULAR */}
      </div>
    </section>
  );
};

const MarqueeCard = ({ item }) => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden group cursor-pointer shrink-0 shadow-2xl border border-white/10">
      <img
        src={item.img}
        alt={item.judul}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute " />
      <div className="absolute bottom-0 left-0 w-full p-6">
        <p className="text-white text-lg font-bold leading-tight">{item.judul}</p>
      </div>
    </div>
  );
};

export default PrestasiMarqueeSection;
