import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaNewspaper, FaFire } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { beritaApi } from '../../../../Api/beritaApi';

/* ─── HELPERS ─── */
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

/* ─── SKELETON ─── */
const SkeletonBox = ({ className, style }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} style={style} />
);

const SkeletonFeatured = () => (
  <div className="flex flex-col gap-3 h-full">
    <SkeletonBox className="w-full rounded-2xl" style={{ flex: 1 }} />
    <div className="flex items-center gap-2">
      <SkeletonBox className="w-6 h-6 rounded-full" />
      <SkeletonBox className="h-3 w-28" />
    </div>
    <SkeletonBox className="h-6 w-full" />
    <SkeletonBox className="h-6 w-4/5" />
    <SkeletonBox className="h-4 w-full" />
    <SkeletonBox className="h-4 w-full" />
    <SkeletonBox className="h-4 w-3/4" />
    <SkeletonBox className="h-4 w-20 mt-1" />
  </div>
);

const SkeletonSmall = () => (
  <div className="flex gap-3 py-4 border-b border-gray-100">
    <SkeletonBox
      className="rounded-xl"
      style={{
        width: 'clamp(75px, 20vw, 110px)',
        height: 'clamp(55px, 18vw, 78px)',
        minWidth: 60,
        minHeight: 45,
        maxWidth: 110,
        maxHeight: 78,
      }}
    />
    <div className="flex-1 flex flex-col gap-2">
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-4 w-4/5" />
      <SkeletonBox className="h-3 w-full" />
      <SkeletonBox className="h-3 w-3/4" />
      <SkeletonBox className="h-3 w-16 mt-1" />
    </div>
  </div>
);

/* ─── FEATURED CARD (kiri) ─── */
const FeaturedCard = ({ berita }) => {
  const img = berita.gambar_url || 'https://placehold.co/800x500/f1f5f9/94a3b8?text=SMPN+3';
  const excerpt = stripHtml(berita.isi_konten);

  return (
    <div className="flex flex-col h-full">
      {/* Gambar — flex-1 supaya mengisi sisa tinggi */}
      <Link
        to={`/berita/${berita.id_berita}`}
        className="block w-full overflow-hidden rounded-2xl bg-gray-100 no-underline"
        style={{ flex: '1 1 0', minHeight: 0 }}>
        <img
          src={img}
          alt={berita.judul}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          style={{
            display: 'block',
            aspectRatio: '16/10',
            width: '100%',
            height: 'auto',
            maxHeight: 350,
          }}
          onError={(e) => {
            e.target.src = 'https://placehold.co/800x500/f1f5f9/94a3b8?text=No+Image';
          }}
        />
      </Link>

      {/* Konten bawah gambar — tinggi tetap, tidak tumbuh */}
      <div className="flex flex-col gap-2.5 pt-4 shrink-0">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <FaNewspaper size={9} className="text-gray-400" />
          </div>
          <span className="text-sm text-gray-500 font-medium">Admin Sekolah</span>
        </div>

        <h2
          className="font-extrabold text-gray-900 leading-snug group-hover:text-red-700 transition-colors duration-200 line-clamp-2"
          style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.45rem)', // responsive font-size
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            overflow: 'hidden',
          }}>
          {berita.judul}
        </h2>

        {/* Excerpt — max 3 baris */}
        <p
          className="text-gray-500 text-sm leading-relaxed line-clamp-3"
          style={{
            fontSize: 'clamp(0.85rem, 3vw, 1rem)',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            overflow: 'hidden',
          }}>
          {excerpt || 'Baca berita selengkapnya di halaman berita kami.'}
        </p>

        {/* Selengkapnya */}
        <Link
          to={`/berita`}
          className="inline-flex items-center gap-1.5 text-sm font-bold no-underline group w-fit"
          style={{ color: 'var(--color-primary, #cc0000)', fontSize: 'inherit' }}>
          Selengkapnya
          <FaArrowRight
            size={11}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>
    </div>
  );
};

/* ─── SMALL CARD (kanan) — dengan excerpt ─── */
const SmallCard = ({ berita, isLast }) => {
  const img = berita.gambar_url || 'https://placehold.co/200x200/f1f5f9/94a3b8?text=SMPN+3';
  const excerpt = stripHtml(berita.isi_konten);

  return (
    <div
      className={`flex gap-3 py-4 ${!isLast ? 'border-b border-gray-100' : ''} items-center`}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}>
      {/* Thumbnail */}
      <Link
        className="shrink-0 block rounded-xl overflow-hidden bg-gray-100 no-underline"
        style={{
          width: 'clamp(66px, 22vw, 110px)',
          height: 'clamp(50px, 22vw, 110px)',
          minWidth: 60,
          minHeight: 45,
          maxHeight: 110,
          maxWidth: 110,
        }}>
        <img
          src={img}
          alt={berita.judul}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://placehold.co/200x200/f1f5f9/94a3b8?text=No+Image';
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Link>

      {/* Teks */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
        {/* Judul */}

        <h4
          className="font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors duration-200"
          style={{
            fontSize: 'clamp(0.85rem, 2.7vw, 0.95rem)',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            overflow: 'hidden',
          }}>
          {berita.judul}
        </h4>

        {/* Excerpt — max 2 baris */}
        {excerpt && (
          <p
            className="text-gray-400 leading-relaxed line-clamp-2"
            style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.82rem)',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              display: '-webkit-box',
              overflow: 'hidden',
            }}>
            {excerpt}
          </p>
        )}

        {/* Selengkapnya */}
        <Link
          to={`/berita`}
          className="inline-flex items-center gap-1 text-xs font-bold no-underline group w-fit mt-0.5"
          style={{
            color: 'var(--color-primary, #cc0000)',
            fontSize: 'clamp(0.75rem, 2vw, 0.90rem)',
          }}>
          Selengkapnya
          <FaArrowRight
            size={9}
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </Link>
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
const BeritaSingkat = () => {
  const [dataBerita, setDataBerita] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ── Fetch — TIDAK DIUBAH ── */
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

  const featured = dataBerita[0] || null;
  const sideList = dataBerita.slice(1, 4); // 3 item

  return (
    <section className="w-full py-7 md:py-16 lg:py-20 bg-white">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">
        {/* ── HEADER ── */}
        <div
          data-aos="fade-up"
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-3 md:mb-10">
          <div>
            <h2
              className="font-extrabold text-gray-900 leading-tight"
              style={{
                fontSize: 'clamp(1.25rem, 5vw, 2.4rem)',
                lineHeight: '1.16',
              }}>
              Berita & <span style={{ color: 'var(--color-primary, #cc0000)' }}>Pengumuman</span>
            </h2>
          </div>
        </div>

        {/* ── BODY ── */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1.07fr_1fr]
            gap-4 
            xs:gap-6
            md:gap-8
            lg:gap-10
            items-stretch
          ">
          {isLoading ? (
            <>
              <SkeletonFeatured />
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 xs:p-4 sm:p-5 flex flex-col">
                <SkeletonBox className="h-5 w-24 mb-4" />
                {[1, 2, 3].map((n) => (
                  <SkeletonSmall key={n} />
                ))}
              </div>
            </>
          ) : dataBerita.length === 0 ? (
            <div
              className="
              col-span-full
              flex flex-col items-center justify-center 
              py-12 xs:py-16 sm:py-20 
              rounded-2xl border border-dashed border-gray-200">
              <FaNewspaper size={30} className="text-gray-300 mb-2" />
              <p
                className="text-gray-400 text-sm font-medium"
                style={{
                  fontSize: 'clamp(0.91rem, 2.6vw, 1.03rem)',
                }}>
                Belum ada berita yang dipublikasikan.
              </p>
            </div>
          ) : (
            <>
              {/* KIRI — Featured */}
              <div data-aos="fade-right" data-aos-delay="100" className="flex flex-col min-h-0">
                {featured && <FeaturedCard berita={featured} />}
              </div>
              {/* KANAN — Box Terbaru */}
              <div
                data-aos="fade-left"
                data-aos-delay="200"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 xs:px-4 md:px-5 py-4 xs:py-5 flex flex-col h-full min-h-[210px]">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1 shrink-0">
                  <FaFire size={18} style={{ color: 'var(--color-primary, #cc0000)' }} />
                  <h3
                    className="font-extrabold text-gray-900"
                    style={{
                      fontSize: 'clamp(1.02rem, 2.3vw, 1.18rem)',
                    }}>
                    Terbaru
                  </h3>
                </div>

                {/* List — flex-1 supaya mengisi sisa tinggi box */}
                <div className="flex flex-col flex-1 min-h-[90px]">
                  {sideList.length > 0 ? (
                    sideList.map((item, i) => (
                      <SmallCard
                        key={item.id_berita}
                        berita={item}
                        isLast={i === sideList.length - 1}
                      />
                    ))
                  ) : (
                    <p
                      className="text-gray-400 text-sm py-6 text-center"
                      style={{ fontSize: 'clamp(0.81rem, 2vw, 0.99rem)' }}>
                      Tidak ada berita lainnya.
                    </p>
                  )}
                </div>

                {/* Footer lihat semua */}
                {dataBerita.length > 4 && (
                  <div
                    data-aos="fade-in"
                    data-aos-delay="500"
                    className="pt-3 mt-1 border-t border-gray-100 shrink-0">
                    <Link
                      to="/berita"
                      className="inline-flex items-center gap-1.5 text-xs font-bold no-underline group"
                      style={{
                        color: 'var(--color-primary, #cc0000)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.92rem)',
                      }}>
                      Lihat semua berita
                      <FaArrowRight
                        size={10}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BeritaSingkat;
