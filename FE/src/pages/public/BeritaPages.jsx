import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // ✅ IMPORT PORTAL DITAMBAHKAN
import {
  FaCalendarAlt,
  FaTimes,
  FaRegNewspaper,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaChevronDown,
  FaSearchPlus,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { beritaApi } from '../../Api/beritaApi';
import 'animate.css';
import heroBerita from '../../../public/Images/heroBerita.webp';

const BACKEND_URL = import.meta.env.VITE_MEDIA_URL;

const formatTanggal = (dateString) => {
  if (!dateString) return 'Baru-baru ini';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const parseGambarUrl = (gambar_url) => {
  const fallback = heroBerita;
  if (!gambar_url) return [fallback];
  if (Array.isArray(gambar_url) && gambar_url.length > 0)
    return gambar_url.map((u) => normalizeUrl(u));
  if (typeof gambar_url === 'string') {
    try {
      const parsed = JSON.parse(gambar_url);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map((u) => normalizeUrl(u));
    } catch {}
    return [normalizeUrl(gambar_url)];
  }
  return [fallback];
};

const normalizeUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\//.test(u)) return u;
  if (u.startsWith('/')) return `${BACKEND_URL}${u}`;
  return `${BACKEND_URL}/uploads/${u}`;
};

const getPreviewText = (htmlContent, maxLines = 3) => {
  if (!htmlContent) return '';
  const plain = htmlContent.replace(/<[^>]*>?/gm, '');
  let lines = plain
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .split('. ')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return '';
  const preview = lines.slice(0, maxLines).join('. ');
  return preview.length > 0 ? preview + (lines.length > maxLines ? '...' : '') : '';
};

const BeritaPages = () => {
  const [dataBerita, setDataBerita] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  // Tambahkan state ini
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      try {
        const response = await beritaApi.getBeritaPublic();
        const berita = Array.isArray(response)
          ? response
              .map((b) => ({
                id_berita: b.id_berita,
                judul: b.judul,
                isi_konten: b.isi_konten,
                kategori: b.kategori,
                gambar_url: b.gambar_url,
                tanggal: b.created_at,
              }))
              .sort((a, b) => (b.id_berita || 0) - (a.id_berita || 0))
          : [];
        if (active) setDataBerita(berita);
      } catch (err) {
        console.error('Gagal mengambil data berita:', err);
        if (active) setDataBerita([]);
        toast.error('Gagal mengambil data berita.');
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const openModal = (item) => {
    setSelectedBerita(item);
    setCurrentPhotoIndex(0);
    // Mencegah body di-scroll saat modal terbuka
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedBerita(null);
    setIsLightboxOpen(false);
    // Mengembalikan scroll body
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    const photos = parseGambarUrl(selectedBerita?.gambar_url);
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    const photos = parseGambarUrl(selectedBerita?.gambar_url);
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleScrollDown = () => {
    if (contentRef.current) contentRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16 sm:pb-20 md:pb-24 relative animate__animated animate__fadeInUp animate__faster overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[55vh] sm:min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#003366] overflow-hidden">
          <img
            src={heroBerita}
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
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-xs sm:max-w-xl md:max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-5 drop-shadow-lg tracking-tight leading-tight">
            Berita Terkini
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-medium leading-relaxed drop-shadow-md">
            Temukan berita, pengumuman, dan informasi terbaru tentang aktivitas, serta kegiatan SMPN
            3 Manado. Tetap terupdate dengan berbagai kabar penting sekolah!
          </p>
        </div>
        <button
          type="button"
          onClick={handleScrollDown}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-1.5 focus:outline-none"
          style={{ minWidth: 48, minHeight: 48 }}
          aria-label="Scroll Down">
          <span className="text-white/50 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-xl sm:text-2xl" />
        </button>
      </section>

      {/* ── HEADER KONTEN ── */}
      <section
        ref={contentRef}
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-4 sm:pb-6 md:pb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end border-b-2 border-gray-200 pb-4 sm:pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#003366] tracking-tight mb-1">
              Kabar Terbaru
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
              Jangan lewatkan informasi penting dari sekolah kami.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#b30000] font-bold text-xs sm:text-sm bg-red-50 px-3 py-2 rounded-full self-start sm:self-auto">
            <FaRegNewspaper size={15} />
            <span>Update Resmi</span>
          </div>
        </div>
      </section>

      {/* ── GRID CARD ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse flex flex-col">
                <div className="w-full aspect-[4/3] bg-gray-200" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-2 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : dataBerita.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <FaRegNewspaper className="text-gray-300 text-4xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm sm:text-base font-medium">
              Belum ada berita yang diterbitkan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {dataBerita.map((item) => {
              const photos = parseGambarUrl(item.gambar_url);
              return (
                <button
                  type="button"
                  key={item.id_berita}
                  onClick={() => openModal(item)}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl active:scale-[0.98] transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1 p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003366]">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200 shrink-0">
                    <img
                      src={photos[0]}
                      alt={item.judul}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="hidden md:flex absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-[#003366] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm items-center gap-1.5 z-10">
                      <FaCalendarAlt className="text-[#b30000]" size={10} />
                      {formatTanggal(item.tanggal)}
                    </div>
                    {photos.length > 1 && (
                      <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 z-10">
                        <FaImages size={9} />
                        <span>{photos.length}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 sm:p-3 md:p-5 flex flex-col flex-grow min-h-0">
                    {item.kategori && (
                      <span className="text-[#b30000] text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1 truncate">
                        {item.kategori}
                      </span>
                    )}
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-[#003366] transition-colors line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="hidden md:block text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 mb-2">
                      {item.isi_konten
                        ? getPreviewText(item.isi_konten, 2)
                        : 'Tidak ada deskripsi singkat.'}
                    </p>
                    <p className="md:hidden text-gray-400 text-[9px] sm:text-[10px] mb-1.5 truncate">
                      {formatTanggal(item.tanggal)}
                    </p>
                    <div className="flex items-center text-[#b30000] font-bold text-[10px] sm:text-xs md:text-sm group-hover:text-red-800 transition-colors mt-auto">
                      <span>Selengkapnya</span>
                      <FaArrowRight
                        className="ml-1 transform group-hover:translate-x-1 transition-transform"
                        size={9}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── MODAL BERITA MENDETAIL MENGGUNAKAN PORTAL ── */}
      {selectedBerita &&
        createPortal(
          (() => {
            const photos = parseGambarUrl(selectedBerita.gambar_url);
            return (
              // ✅ z-index dinaikkan ke tingkat ekstrim (z-[99999])
              <div
                className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6"
                style={{ pointerEvents: 'auto' }}>
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={closeModal}
                />

                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col z-10 overflow-hidden animate-fade-in-up">
                  {/* Header Modal - Judul & Tombol Tutup */}
                  <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-white z-20 shrink-0">
                    <div className="pr-4">
                      <h2 className="text-base sm:text-xl font-extrabold text-[#003366] line-clamp-2">
                        {selectedBerita.judul}
                      </h2>
                      <div className="flex items-center gap-1.5 text-gray-500 text-[10px] sm:text-xs font-bold mt-1">
                        <FaCalendarAlt size={10} />
                        {formatTanggal(selectedBerita.tanggal)}
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors focus:outline-none flex items-center justify-center shrink-0"
                      style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
                      aria-label="Tutup berita">
                      <FaTimes size={16} />
                    </button>
                  </div>

                  {/* Konten Scrollable */}
                  <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                    {/* Container Gambar */}
                    <div
                      className="relative w-full mb-6 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer"
                      onClick={() => setIsLightboxOpen(true)}>
                      <img
                        src={photos[currentPhotoIndex]}
                        alt={selectedBerita.judul}
                        className="w-full h-auto max-h-[50vh] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
                        }}
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                        <div className="bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                          <FaSearchPlus size={24} />
                        </div>
                      </div>

                      {photos.length > 1 && (
                        <>
                          <button
                            onClick={prevPhoto}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all flex items-center justify-center z-10"
                            style={{ width: 32, height: 32 }}>
                            <FaChevronLeft size={14} />
                          </button>
                          <button
                            onClick={nextPhoto}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all flex items-center justify-center z-10"
                            style={{ width: 32, height: 32 }}>
                            <FaChevronRight size={14} />
                          </button>
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold z-10">
                            {currentPhotoIndex + 1} / {photos.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Teks Konten */}
                    <div
                      className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed"
                      style={{ wordBreak: 'break-word' }}
                      dangerouslySetInnerHTML={{
                        __html: selectedBerita.isi_konten || 'Detail berita belum tersedia.',
                      }}
                    />
                  </div>
                </div>

                {/* ── LIGHTBOX ── */}
                {isLightboxOpen && (
                  <div className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-2 sm:p-8 animate__animated animate__fadeIn animate__faster">
                    <button
                      onClick={() => setIsLightboxOpen(false)}
                      className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/10 hover:bg-red-600 text-white rounded-full p-3 transition-colors z-50">
                      <FaTimes size={24} />
                    </button>

                    <img
                      src={photos[currentPhotoIndex]}
                      alt="Zoom"
                      className="max-w-full max-h-full object-contain select-none"
                    />

                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={prevPhoto}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-4 transition-all z-50">
                          <FaChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextPhoto}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-4 transition-all z-50">
                          <FaChevronRight size={24} />
                        </button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-bold z-50">
                          {currentPhotoIndex + 1} / {photos.length}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })(),
          document.body // ✅ MERENDER MODAL DI LUAR HALAMAN BERITA
        )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.25s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        html, body { overflow-x: hidden !important; }
      `,
        }}
      />
    </div>
  );
};

export default BeritaPages;
