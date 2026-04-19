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

// PENTING: Pastikan port ini sesuai dengan backend kamu (biasanya 5000)
const BACKEND_URL = 'http://localhost:3000';

/* =========================
   HELPER URL
========================= */
const normalizeUrl = (url) => {
  if (!url) return 'https://placehold.co/800x600/e5e7eb/9ca3af?text=No+Image';
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
  return `${BACKEND_URL}/uploads/galeri/${url}`;
};

/* =========================
   PARSE MULTI IMAGE
========================= */
const parseImages = (file_url) => {
  if (!file_url) return [];

  if (Array.isArray(file_url)) {
    return file_url.map((u) => normalizeUrl(u));
  }

  if (typeof file_url === 'string') {
    try {
      const parsed = JSON.parse(file_url);
      if (Array.isArray(parsed)) {
        return parsed.map((u) => normalizeUrl(u));
      }
    } catch {
      // bukan JSON
    }
    return [normalizeUrl(file_url)];
  }

  return [];
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

  const nextGalleryItem = (e) => {
    e.stopPropagation();
    setIdx((prev) => (prev + 1) % items.length);
    setImgIdx(0);
  };

  const prevGalleryItem = (e) => {
    e.stopPropagation();
    setIdx((prev) => (prev - 1 + items.length) % items.length);
    setImgIdx(0);
  };

  // Warna badge berdasarkan kategori
  const getBadgeColor = (kategori) => {
    if (kategori === 'fasilitas') return 'bg-[#003366]';
    if (kategori === 'ekskul') return 'bg-[#b30000]';
    return 'bg-gray-600';
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-in"
      onClick={onClose}>
      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/70 hover:text-white z-50 p-2">
        <FaTimes size={28} />
      </button>

      {/* Navigasi Item Galeri Kiri/Kanan */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevGalleryItem}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/80 p-4 rounded-full transition-colors z-50">
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={nextGalleryItem}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/80 p-4 rounded-full transition-colors z-50">
            <FaChevronRight size={20} />
          </button>
        </>
      )}

      {/* Kontainer Gambar Utama */}
      <div className="relative w-full max-w-5xl flex items-center justify-center h-[70vh] mb-4">
        <img
          src={images[imgIdx]}
          alt={currentItem.judul_foto}
          className="max-h-full max-w-full object-contain rounded-lg drop-shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/800x600/e5e7eb/9ca3af?text=Image+Error';
          }}
        />

        {/* Navigasi Multi-foto (jika array foto di dalam 1 item > 1) */}
        {images.length > 1 && (
          <div
            className="absolute bottom-4 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-4 px-4 py-2 z-50"
            onClick={(e) => e.stopPropagation()}>
            <button onClick={prevImage} className="text-white hover:text-yellow-400">
              <FaChevronLeft size={14} />
            </button>
            <span className="text-white text-xs font-bold">
              {imgIdx + 1} / {images.length}
            </span>
            <button onClick={nextImage} className="text-white hover:text-yellow-400">
              <FaChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Teks Detail di Bawah */}
      <div className="w-full max-w-3xl text-center z-10" onClick={(e) => e.stopPropagation()}>
        <span
          className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white mb-3 ${getBadgeColor(currentItem.kategori)}`}>
          {currentItem.kategori}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 drop-shadow-lg">
          {currentItem.judul_foto}
        </h2>
        <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
          {currentItem.deskripsi}
        </p>
      </div>
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

  // Filter Data Berdasarkan Tab Kategori
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
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans">
      {/* =========================================
          HERO SECTION (TIDAK DIUBAH SAMA SEKALI)
      ========================================== */}
      <section className="relative w-full min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImg}')` }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold">Galeri Sekolah</h1>
          <p className="mt-3 text-gray-200">Dokumentasi kegiatan sekolah</p>
        </div>

        <div className="absolute bottom-10 animate-bounce text-white">
          <FaChevronDown />
        </div>
      </section>
      {/* =========================================
          FILTER TABS SECTION
      ========================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {[
            { id: 'semua', label: 'Semua Foto' },
            { id: 'umum', label: 'Kegiatan Umum' },
            { id: 'fasilitas', label: 'Fasilitas Sekolah' },
            { id: 'ekskul', label: 'Ekstrakurikuler' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#003366] text-white shadow-lg shadow-blue-900/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#003366] hover:text-[#003366]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* =========================================
          GALLERY GRID
      ========================================== */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
          </div>
        ) : filteredGaleri.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">Belum ada foto di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGaleri.map((item, i) => {
              const images = parseImages(item.file_url);
              const isFasilitas = item.kategori === 'fasilitas';
              const isEkskul = item.kategori === 'ekskul';

              return (
                <div
                  key={item.id_galeri}
                  onClick={() => openLightbox(i)}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-[4/3] sm:aspect-square flex flex-col">
                  {/* Gambar Cover */}
                  <img
                    src={images[0]}
                    alt={item.judul_foto}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x600/e5e7eb/9ca3af?text=No+Image';
                    }}
                  />

                  {/* Indikator Multiple Images */}
                  {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 z-10 shadow-sm">
                      <FaImages size={12} />
                      <span>{images.length}</span>
                    </div>
                  )}

                  {/* Badge Kategori */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white backdrop-blur-md shadow-sm ${
                        isFasilitas
                          ? 'bg-[#003366]/90'
                          : isEkskul
                            ? 'bg-[#b30000]/90'
                            : 'bg-gray-800/80'
                      }`}>
                      {item.kategori}
                    </span>
                  </div>

                  {/* Overlay Hitam saat di-hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-0">
                    <h3 className="text-white font-bold text-lg leading-tight mb-2 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 line-clamp-2">
                      {item.judul_foto}
                    </h3>
                    <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      <FaSearchPlus /> Perbesar
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================
          LIGHTBOX
      ========================================== */}
      {lightbox !== null && (
        <Lightbox items={filteredGaleri} startIndex={lightbox} onClose={closeLightbox} />
      )}

      {/* Global Animation CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      `,
        }}
      />
    </div>
  );
};

export default GaleriPages;
