import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BeritaSingkat = () => {
  const dataBerita = [
    {
      id: 1,
      judul: 'Pelaksanaan Ujian Tengah Semester Genap 2025/2026',
      gambar:
        'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80', // Siswa ujian di sekolah
      tanggal: '20 Maret 2026',
    },
    {
      id: 2,
      judul: 'Siswa SMPN 3 Manado Juara 1 Lomba Matematika Provinsi',
      gambar:
        'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80', // Siswa berprestasi
      tanggal: '18 Maret 2026',
    },
    {
      id: 3,
      judul: 'Kegiatan Kerja Bakti Lingkungan Menjelang Ramadhan',
      gambar:
        'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80', // Kegiatan sekolah/pelajar outdoor
      tanggal: '15 Maret 2026',
    },
    {
      id: 4,
      judul: 'Penerimaan Siswa Baru (PPDB) 2026 Dibuka Online',
      gambar:
        'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80', // Gedung sekolah, pendaftaran
      tanggal: '10 Maret 2026',
    },
    {
      id: 5,
      judul: 'Workshop Peningkatan Mutu Guru Abad 21',
      gambar:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80', // Guru mengajar, pelatihan guru
      tanggal: '05 Maret 2026',
    },
    {
      id: 6,
      judul: 'Kunjungan Edukasi ke Museum Sulawesi Utara',
      gambar:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80', // Study tour / kegiatan museum
      tanggal: '01 Maret 2026',
    },
  ];

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-20 font-poppins">
      <div className="text-center mb-12">
        <h2 className="text-[#0c356a] text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
          Berita
        </h2>
        <div className="h-1.5 w-32 bg-red-700 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="relative group ">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          navigation={{
            nextEl: '.button-next-berita',
            prevEl: '.button-prev-berita',
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-14">
          {dataBerita.map((berita) => (
            <SwiperSlide key={berita.id}>
              <div className="group rounded-3xl transition-all duration-500 overflow-hidden border border-gray-300 flex flex-col h-[480px]">
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={berita.gambar}
                    alt={berita.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-red-700 text-white text-[10px] px-3 py-1 rounded-full font-bold">
                    INFO TERBARU
                  </div>
                </div>
                <div className="p-7 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex gap-1 mb-4">
                      <div className="h-1.5 w-10 bg-blue-600 rounded-full"></div>
                      <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
                    </div>
                    <h3 className="text-[#0c356a] font-bold text-lg leading-snug line-clamp-3 mb-4 group-hover:text-red-700 transition-colors">
                      {berita.judul}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-gray-400 text-xs font-semibold">{berita.tanggal}</span>
                    <Link
                      to={`/berita/${berita.id}`}
                      className="text-blue-600 font-bold text-sm hover:underline">
                      Baca Selengkapnya
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="button-prev-berita absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-4 rounded-full text-[#0c356a] hover:bg-[#0c356a] hover:text-white transition-all">
          <FaChevronLeft size={20} />
        </button>
        <button className="button-next-berita absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-4 rounded-full text-[#0c356a] hover:bg-[#0c356a] hover:text-white transition-all">
          <FaChevronRight size={20} />
        </button>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet-active {
        }
      `}</style>
    </section>
  );
};

export default BeritaSingkat;
