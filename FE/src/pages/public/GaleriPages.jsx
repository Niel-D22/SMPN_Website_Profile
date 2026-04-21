import React, { useState, useEffect } from 'react';

import {
  FaChevronDown,
  FaSearchPlus,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
} from 'react-icons/fa';
import { galeriApi } from '../../Api/galeriApi';
import 'animate.css';

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
   LIGHTBOX COMPONENT
========================= */
const Lightbox = ({ items, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  const [imgIdx, setImgIdx] = useState(0);

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

  const saamaGalleryItem = (e) => {
    e.stopPropagation();
    setIdx((prev) => (prev + 1) % items.length);
    setImgIdx(0);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel utama — card putih */}
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col z-10 overflow-hidden animate-lightbox-up"
        onClick={(e) => e.stopPropagation()}>
        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 hover:bg-red-600 text-white rounded-full z-30 transition-colors focus:outline-none flex items-center justify-center"
          style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
          aria-label="Tutup">
          <FaTimes size={17} />
        </button>

        {/* Area foto */}
        <div
          className="relative w-full bg-gray-100 shrink-0 overflow-hidden"
          style={{ aspectRatio: '16/9', maxHeight: '52vh' }}>
          <img
            src={images[imgIdx]}
            alt={currentItem.judul_foto}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/800x600/e5e7eb/9ca3af?text=Image+Error';
            }}
          />

          {/* Navigasi foto dalam 1 item (multi-foto) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all focus:outline-none flex items-center justify-center"
                style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
                aria-label="Foto sebelumnya">
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all focus:outline-none flex items-center justify-center"
                style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
                aria-label="Foto selanjutnya">
                <FaChevronRight size={14} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full">
                {imgIdx + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Info & thumbnail */}
        <div className="p-4 sm:p-5 flex flex-col gap-2 overflow-y-auto">
          {/* Badge kategori */}
          <span
            className={`inline-block self-start text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white ${getBadgeColor(currentItem.kategori)}`}>
            {currentItem.kategori}
          </span>

          <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
            {currentItem.judul_foto}
          </h2>

          {currentItem.deskripsi && (
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {currentItem.deskripsi}
            </p>
          )}

          {/* Thumbnail strip multi-foto */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-1 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                    i === imgIdx
                      ? 'border-[#003366] scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}>
                  <img
                    src={src}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/80x60/e2e8f0/64748b?text=?';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Indikator item galeri */}
          {items.length > 1 && (
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
              Item {idx + 1} dari {items.length}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="ml-auto bg-[#003366] hover:bg-[#b30000] active:scale-95 text-white px-5 sm:px-7 rounded-full font-bold transition-colors text-xs sm:text-sm shadow-md"
            style={{ minHeight: 40 }}
            aria-label="Tutup">
            Tutup
          </button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes lightboxUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-lightbox-up { animation: lightboxUp 0.25s ease-out forwards; }
      `,
        }}
      />
    </div>
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

  const filteredGaleri =
    activeTab === 'semua'
      ? dataGaleri
      : dataGaleri.filter((item) => item.kategori?.toLowerCase() === activeTab);

  const openLightbox = (idx) => {
    setLightbox(idx);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = 'auto';
  };

  const heroImg =
    dataGaleri.length > 0
      ? parseImages(dataGaleri[0].file_url)[0]
      : 'https://images.unsplash.com/photo-1580582932707-520aed937b7b';

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 sm:pb-24 animate__animated animate__fadeInUp animate__faster overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[55vh] sm:min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImg}')` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-2xl sm:text-4xl font-bold">Galeri Sekolah</h1>
          <p className="mt-2 sm:mt-3 text-gray-200 text-xs sm:text-base">
            Dokumentasi kegiatan sekolah
          </p>
        </div>
        <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-1 sm:gap-2">
          <span className="text-white/50 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-xl sm:text-3xl" />
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4 sm:pb-8">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredGaleri.map((item, i) => {
              const images = parseImages(item.file_url);
              const isFasilitas = item.kategori === 'fasilitas';
              const isEkskul = item.kategori === 'ekskul';

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
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-lg flex items-center gap-1 z-10">
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
                    <div className="flex items-center gap-1 text-yellow-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
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
        html, body { overflow-x: hidden !important; }
      `,
        }}
      />
    </div>
  );
};

export default GaleriPages;
