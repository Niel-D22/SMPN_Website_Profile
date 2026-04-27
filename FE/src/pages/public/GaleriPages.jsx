import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // ✅ IMPORT PORTAL
import {
  FaChevronDown,
  FaSearchPlus, // ✅ IMPORT ICON ZOOM
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
} from 'react-icons/fa';
import { galeriApi } from '../../Api/galeriApi';
import 'animate.css';
// Import hero image dari folder public
import heroImage from '../../../public/Images/heroGaleri.webp';

const BACKEND_URL = 'http://localhost:3000';

const normalizeUrl = (url) => {
  if (!url) return 'https://placehold.co/800x600/e5e7eb/9ca3af?text=No+Image';
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
  return `${BACKEND_URL}/uploads/galeri/${url}`;
};

const parseImages = (file_url) => {
  if (!file_url) return [];
  if (Array.isArray(file_url)) return file_url.map((u) => normalizeUrl(u));
  if (typeof file_url === 'string') {
    try {
      const parsed = JSON.parse(file_url);
      if (Array.isArray(parsed)) return parsed.map((u) => normalizeUrl(u));
    } catch {}
    return [normalizeUrl(file_url)];
  }
  return [];
};

const getBadgeColor = (kategori) => {
  if (kategori === 'fasilitas') return 'bg-[#003366]';
  if (kategori === 'ekskul') return 'bg-[#b30000]';
  return 'bg-gray-600';
};

/* =========================
   LIGHTBOX COMPONENT (MODAL KONSISTEN)
========================= */
const Lightbox = ({ items, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  const [imgIdx, setImgIdx] = useState(0);

  // ✅ STATE UNTUK FULLSCREEN ZOOM
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentItem = items[idx];
  const images = parseImages(currentItem.file_url);

  const nextImage = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return createPortal(
    // ✅ z-[99999] agar berada di atas header utama
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6"
      style={{ pointerEvents: 'auto' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel Modal */}
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col z-10 overflow-hidden animate-lightbox-up"
        onClick={(e) => e.stopPropagation()}>
        {/* Header Modal - Judul & Tombol Tutup */}
        <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-white z-20 shrink-0">
          <div className="pr-4">
            <span
              className={`inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white mb-1 ${getBadgeColor(currentItem.kategori)}`}>
              {currentItem.kategori}
            </span>
            <h2 className="text-base sm:text-xl font-extrabold text-[#003366] line-clamp-2 leading-tight">
              {currentItem.judul_foto}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors focus:outline-none flex items-center justify-center shrink-0"
            style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
            aria-label="Tutup">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Area Konten Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {/* Container Gambar Utama - object-contain & max-h */}
          <div
            className="relative w-full mb-4 sm:mb-6 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer"
            onClick={() => setIsZoomOpen(true)}>
            <img
              src={images[imgIdx]}
              alt={currentItem.judul_foto}
              // ✅ AGAR TIDAK KEMOTONG
              className="w-full h-auto max-h-[50vh] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/800x600/e5e7eb/9ca3af?text=Image+Error';
              }}
            />

            {/* Overlay ikon Zoom saat di-hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                <FaSearchPlus size={24} />
              </div>
            </div>

            {/* Navigasi multi-foto */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all flex items-center justify-center z-10 focus:outline-none"
                  style={{ width: 32, height: 32 }}>
                  <FaChevronLeft size={14} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all flex items-center justify-center z-10 focus:outline-none"
                  style={{ width: 32, height: 32 }}>
                  <FaChevronRight size={14} />
                </button>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold z-10">
                  {imgIdx + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip jika foto lebih dari 1 */}
          {images.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                    i === imgIdx
                      ? 'border-[#003366] scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}>
                  <img
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/80x60/e2e8f0/64748b?text=?';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Info/Deskripsi Tambahan */}
          {currentItem.deskripsi && (
            <div className="text-gray-700 text-sm sm:text-base leading-relaxed mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {currentItem.deskripsi}
            </div>
          )}

          {/* Indikator Pindah Album (Opsional, bawaan kodemu) */}
          {items.length > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-right">
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                Album {idx + 1} dari {items.length}
              </p>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-[#003366] hover:bg-[#b30000] active:scale-95 text-white px-5 sm:px-7 rounded-full font-bold transition-colors text-xs sm:text-sm shadow-md focus:outline-none"
            style={{ minHeight: 40 }}>
            Tutup
          </button>
        </div>
      </div>

      {/* ── LIGHTBOX (FULLSCREEN IMAGE ZOOM) ── */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-2 sm:p-8 animate__animated animate__fadeIn animate__faster"
          onClick={() => setIsZoomOpen(false)}>
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/10 hover:bg-red-600 text-white rounded-full p-3 transition-colors z-50 focus:outline-none">
            <FaTimes size={24} />
          </button>

          <img
            src={images[imgIdx]}
            alt="Zoom Galeri"
            className="max-w-full max-h-full object-contain select-none"
            onClick={(e) => e.stopPropagation()} // Supaya klik gambar tidak nutup zoom
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-4 transition-all z-50 focus:outline-none">
                <FaChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-4 transition-all z-50 focus:outline-none">
                <FaChevronRight size={24} />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-bold z-50">
                {imgIdx + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>,
    document.body // ✅ RENDER KE LUAR DOM UTAMA
  );
};

/* =========================
   MAIN PAGE
========================= */
const GaleriPages = () => {
  const [dataGaleri, setDataGaleri] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [activeTab, setActiveTab] = useState('semua');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      try {
        const data = await galeriApi.getGaleri();
        if (active && Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => new Date(b.tgl_upload) - new Date(a.tgl_upload));
          setDataGaleri(sorted);
        }
      } catch (err) {
        console.error('Gagal mengambil data galeri:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Fixed: filter untuk ekstrakurikuler harus membandingkan ".toLowerCase()" terhadap "ekskul"
  // dan nilai kategori juga harus di-lowercase
  const filteredGaleri =
    activeTab === 'semua'
      ? dataGaleri
      : dataGaleri.filter((item) => (item.kategori || '').toLowerCase().trim() === activeTab);

  const openLightbox = (idx) => {
    setLightbox(idx);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = 'auto';
  };

  // Gunakan gambar hero dari public S A J A, tidak ambil dari dataGaleri
  const heroImg = heroImage;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 sm:pb-24 animate__animated animate__fadeInUp animate__faster overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[55vh] sm:min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Pembungkus utama, kita kasih warna biru gelap agar tidak putih kosong saat awal */}
        <div className="absolute inset-0 bg-[#003366] overflow-hidden">
          <img
            src={heroImage}
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
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-2xl sm:text-4xl font-bold">Galeri Sekolah</h1>
          <p className="mt-2 sm:mt-3 text-gray-200 text-xs sm:text-base">
            Dokumentasi kegiatan sekolah
          </p>
        </div>
        <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-y-1 sm:gap-y-2">
          <span className="text-white/50 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-xl sm:text-3xl" />
        </div>
      </section>

      {/* --- JUDUL SINGKAT & DESKRIPSI SEBELUM KARTU GALERI --- */}
      <section className="max-w-3xl mx-auto px-3 sm:px-6 text-center mb-4 sm:mb-8 pt-10">
        <h2 className="text-xl sm:text-3xl font-bold text-[#003366] mb-2">
          Kumpulan Momen & Kegiatan
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Temukan berbagai dokumentasi foto momen, kegiatan, fasilitas, dan ekstrakurikuler di
          sekolah kami. Klik gambar untuk melihat lebih jelas.
        </p>
      </section>

      {/* ── FILTER TABS ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 pb-4 sm:pb-8">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-3 md:gap-x-4 md:gap-y-4">
          {[
            { id: 'semua', label: 'Semua Foto' },
            { id: 'umum', label: 'Kegiatan Umum' },
            { id: 'fasilitas', label: 'Fasilitas Sekolah' },
            { id: 'ekskul', label: 'Ekstrakurikuler' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#003366] text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#003366] hover:text-[#003366]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── GALLERY GRID ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        {isLoading ? (
          <div className="flex justify-center py-16 sm:py-20">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#003366]" />
          </div>
        ) : filteredGaleri.length === 0 ? (
          <div className="text-center py-14 sm:py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium text-sm sm:text-base">
              Belum ada foto di kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-3 sm:gap-x-4 sm:gap-y-4 md:gap-x-6 md:gap-y-6">
            {filteredGaleri.map((item, i) => {
              const images = parseImages(item.file_url);
              const isFasilitas = (item.kategori || '').toLowerCase().trim() === 'fasilitas';
              const isEkskul = (item.kategori || '').toLowerCase().trim() === 'ekskul';

              return (
                <div
                  key={item.id_galeri}
                  onClick={() => openLightbox(i)}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-[4/3] sm:aspect-square">
                  <img
                    src={images[0]}
                    alt={item.judul_foto}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x600/e5e7eb/9ca3af?text=No+Image';
                    }}
                  />

                  {images.length > 1 && (
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-lg flex items-center gap-x-1 z-10">
                      <FaImages size={9} />
                      <span>{images.length}</span>
                    </div>
                  )}

                  <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-10">
                    <span
                      className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-white backdrop-blur-md ${
                        isFasilitas
                          ? 'bg-[#003366]/90'
                          : isEkskul
                            ? 'bg-[#b30000]/90'
                            : 'bg-gray-800/80'
                      }`}>
                      {item.kategori}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-5">
                    <h3 className="text-white font-bold text-xs sm:text-base md:text-lg leading-tight mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 line-clamp-2">
                      {item.judul_foto}
                    </h3>
                    <div className="flex items-center gap-x-1 text-yellow-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      <FaSearchPlus size={10} /> Perbesar
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <Lightbox items={filteredGaleri} startIndex={lightbox} onClose={closeLightbox} />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes lightboxUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-lightbox-up { animation: lightboxUp 0.25s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html, body { overflow-x: hidden !important; }
      `,
        }}
      />
    </div>
  );
};

export default GaleriPages;
