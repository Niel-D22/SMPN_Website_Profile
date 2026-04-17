import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaArrowRight, FaArrowLeft, FaClock, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { beritaApi } from '../../../../Api/beritaApi';

/* ─────────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────────── */
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const stripHtml = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '');
};

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
const SkeletonCard = () => (
  <div
    className="flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden bg-white animate-pulse shadow-sm border border-gray-100"
    style={{ height: 320 }}>
    <div className="w-full md:w-5/12 bg-gray-200 h-48 md:h-full" />
    <div className="flex-1 p-6 flex flex-col gap-3 justify-center">
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-5 bg-gray-200 rounded w-full" />
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-full mt-2" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
      <div className="mt-auto flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   BERITA CARD
───────────────────────────────────────────── */
const BeritaCard = ({ berita }) => {
  const imgSrc = berita.gambar_url || 'https://placehold.co/600x400/f1f5f9/94a3b8?text=SMPN+3';
  const excerpt = stripHtml(berita.isi_konten);

  return (
    <Link
      to={`/berita/${berita.id_berita}`}
      className="group flex flex-col md:flex-row rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500 no-underline"
      style={{ height: 300 }}>
      {/* ── GAMBAR KIRI ── */}
      <div className="relative w-full md:w-[42%] overflow-hidden shrink-0 bg-gray-100 min-h-[150px] sm:min-h-[160px]">
        {/* Kategori badge */}
        {berita.kategori && (
          <span
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
            style={{ background: 'var(--color-primary, #cc0000)' }}>
            <FaTag size={9} />
            {berita.kategori}
          </span>
        )}
        <img
          src={imgSrc}
          alt={berita.judul}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 aspect-[4/3]"
        />
        {/* Overlay gradient subtle */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(120deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.02) 60%)',
          }}
        />
      </div>

      {/* ── KONTEN KANAN ── */}
      <div className="flex flex-col justify-between flex-1 px-4 md:px-7 py-4 md:py-6">
        {/* Tanggal */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-3">
          <FaClock size={10} />
          <span>{formatDate(berita.tgl_publikasi)}</span>
        </div>

        {/* Judul */}
        <h3
          className="font-extrabold text-gray-900 leading-tight mb-3 line-clamp-2 group-hover:text-red-700 transition-colors duration-300"
          style={{ fontSize: 'clamp(1rem, 1.4vw, 1.3rem)' }}>
          {berita.judul}
        </h3>

        {/* Divider tipis */}
        <div className="h-px w-10 bg-red-600 mb-3 rounded-full transition-all duration-500 group-hover:w-20" />

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{excerpt}</p>

        {/* Footer: Author + CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: 'var(--color-primary, #cc0000)' }}>
              A
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 leading-none">Admin Sekolah</p>
              <p className="text-[11px] text-gray-400 mt-0.5">SMPN 3 Manado</p>
            </div>
          </div>
          {/* CTA */}
          <span
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full text-white transition-all duration-300 group-hover:gap-3 group-hover:pr-5"
            style={{ background: 'var(--color-primary, #cc0000)' }}>
            Baca
            <FaArrowRight
              size={11}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

const BeritaSingkat = () => {
  const [dataBerita, setDataBerita] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setIsLoading(true);
        const data = await beritaApi.getBeritaPublic();
        setDataBerita(data || []);
      } catch (err) {
        console.error('Gagal mengambil data berita:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBerita();
  }, []);

  return (
    <section className="w-full py-16">
      <div className="w-full max-w-[1280px] mx-auto px-2 sm:px-3 md:px-8">
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            {/* Label kecil di atas */}
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: 'var(--color-primary, #cc0000)' }}>
              Terkini
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Berita &{' '}
              <span
                className="relative inline-block"
                style={{ color: 'var(--color-primary, #cc0000)' }}>
                Pengumuman
                {/* Garis bawah dekoratif */}
                <span
                  className="absolute left-0 -bottom-1 h-1 w-full rounded-full opacity-20"
                  style={{ background: 'var(--color-primary, #cc0000)' }}
                />
              </span>
            </h2>
          </div>

          {/* Navigasi Custom */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              ref={prevRef}
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm">
              <FaArrowLeft size={13} />
            </button>
            <button
              ref={nextRef}
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-md hover:opacity-90"
              style={{ background: 'var(--color-primary, #cc0000)' }}>
              <FaArrowRight size={13} />
            </button>
            <Link
              to="/berita"
              className="ml-2 text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-red-600 transition-colors duration-200 hidden md:block">
              Lihat Semua →
            </Link>
          </div>
        </div>

        {/* ── SLIDER AREA ── */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <SkeletonCard />
          </div>
        ) : dataBerita.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">
            Belum ada berita yang dipublikasikan.
          </div>
        ) : (
          <>
            <Swiper
              modules={[Pagination, Autoplay]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                360: { slidesPerView: 1 },
                600: { slidesPerView: 1.03 },
                768: { slidesPerView: 1.08 },
                1024: { slidesPerView: 1.15 },
              }}
              autoplay={{
                delay: 5500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                renderBullet: (index, className) =>
                  `<span class="${className}" style="background:var(--color-primary,#cc0000);width:20px;height:4px;border-radius:2px;opacity:0.35;transition:all 0.3s;"></span>`,
              }}
              className="pb-0"
              style={{
                '--swiper-pagination-bullet-inactive-color': '#cc0000',
                '--swiper-pagination-color': '#cc0000',
              }}>
              {dataBerita.map((berita) => (
                <SwiperSlide key={berita.id_berita} className="h-auto">
                  <BeritaCard berita={berita} />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom position for swiper bullets/pagination */}
            <div className="flex justify-center mt-8">
              {/* Swiper automatically renders pagination here if you use a selector. We need to move it out of the card. */}
              {/* The only way is to override .swiper-pagination class placement */}
              <div
                className="swiper-pagination"
                style={{
                  position: 'static',
                  marginTop: 0,
                  marginBottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              />
            </div>
          </>
        )}

        {/* Link semua berita — mobile only */}
        <div className="mt-2 text-center md:hidden">
          <Link to="/berita" className="text-sm font-bold text-red-600 hover:underline">
            Lihat Semua Berita →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BeritaSingkat;
