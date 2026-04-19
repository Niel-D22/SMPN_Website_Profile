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
const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />
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
    <SkeletonBox className="w-[110px] h-[78px] shrink-0 rounded-xl" />
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
          style={{ display: 'block' }}
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

        {/* Judul */}
        <Link to={`/berita/${berita.id_berita}`} className="no-underline group">
          <h2
            className="font-extrabold text-gray-900 leading-snug group-hover:text-red-700 transition-colors duration-200 line-clamp-2"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.45rem)' }}>
            {berita.judul}
          </h2>
        </Link>

        {/* Excerpt — max 3 baris */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {excerpt || 'Baca berita selengkapnya di halaman berita kami.'}
        </p>

        {/* Selengkapnya */}
        <Link
          to={`/berita`}
          className="inline-flex items-center gap-1.5 text-sm font-bold no-underline group w-fit"
          style={{ color: 'var(--color-primary, #cc0000)' }}>
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
    <div className={`flex gap-3 py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      {/* Thumbnail */}
      <Link
        to={`/berita/${berita.id_berita}`}
        className="shrink-0 block rounded-xl overflow-hidden bg-gray-100 no-underline"
        style={{ width: 110, height: 110 }}>
        <img
          src={img}
          alt={berita.judul}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://placehold.co/200x200/f1f5f9/94a3b8?text=No+Image';
          }}
        />
      </Link>

      {/* Teks */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
        {/* Judul */}
        <Link to={`/berita/${berita.id_berita}`} className="no-underline group">
          <h4
            className="font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors duration-200"
            style={{ fontSize: 'clamp(0.8rem, 1.1vw, 0.9rem)' }}>
            {berita.judul}
          </h4>
        </Link>

        {/* Excerpt — max 2 baris */}
        {excerpt && (
          <p className="text-gray-400 leading-relaxed line-clamp-2" style={{ fontSize: '0.75rem' }}>
            {excerpt}
          </p>
        )}

        {/* Selengkapnya */}
        <Link
          to={`/berita`}
          className="inline-flex items-center gap-1 text-xs font-bold no-underline group w-fit mt-0.5"
          style={{ color: 'var(--color-primary, #cc0000)' }}>
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
    <section className="w-full py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.18em] mb-1.5"
              style={{ color: 'var(--color-primary, #cc0000)' }}>
              Informasi Sekolah
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Berita & <span style={{ color: 'var(--color-primary, #cc0000)' }}>Pengumuman</span>
            </h2>
          </div>
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-600 transition-colors duration-200 shrink-0 group no-underline">
            Lihat Semua
            <FaArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── BODY ── */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10"
            style={{ alignItems: 'stretch' }}>
            <SkeletonFeatured />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SkeletonBox className="h-5 w-24 mb-4" />
              {[1, 2, 3].map((n) => (
                <SkeletonSmall key={n} />
              ))}
            </div>
          </div>
        ) : dataBerita.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-gray-200">
            <FaNewspaper size={36} className="text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm font-medium">
              Belum ada berita yang dipublikasikan.
            </p>
          </div>
        ) : (
          /*
           * items-stretch → kedua kolom sama tinggi
           * Kolom kiri pakai flex-col h-full → gambar mengisi sisa ruang
           * Kolom kanan pakai flex-col → konten tersebar merata
           */
          <div
            className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10"
            style={{ alignItems: 'stretch' }}>
            {/* KIRI — Featured */}
            {featured && <FeaturedCard berita={featured} />}

            {/* KANAN — Box Terbaru */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-2 mb-1 shrink-0">
                <FaFire size={18} style={{ color: 'var(--color-primary, #cc0000)' }} />
                <h3 className="text-lg font-extrabold text-gray-900">Terbaru</h3>
              </div>

              {/* List — flex-1 supaya mengisi sisa tinggi box */}
              <div className="flex flex-col flex-1">
                {sideList.length > 0 ? (
                  sideList.map((item, i) => (
                    <SmallCard
                      key={item.id_berita}
                      berita={item}
                      isLast={i === sideList.length - 1}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-6 text-center">
                    Tidak ada berita lainnya.
                  </p>
                )}
              </div>

              {/* Footer lihat semua */}
              {dataBerita.length > 4 && (
                <div className="pt-4 mt-2 border-t border-gray-100 shrink-0">
                  <Link
                    to="/berita"
                    className="inline-flex items-center gap-1.5 text-xs font-bold no-underline group"
                    style={{ color: 'var(--color-primary, #cc0000)' }}>
                    Lihat semua berita
                    <FaArrowRight
                      size={10}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BeritaSingkat;
