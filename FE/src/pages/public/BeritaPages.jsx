import React, { useState, useEffect, useRef } from 'react';
import {
  FaCalendarAlt,
  FaTimes,
  FaRegNewspaper,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaChevronDown,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { beritaApi } from '../../Api/beritaApi';
import 'animate.css';
import heroBerita from '../../../public/Images/heroBerita.jpg'; // import dari folder public

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

// Fungsi untuk meng-extract hanya beberapa baris (misal 3 baris) dari teks plain
const getPreviewText = (htmlContent, maxLines = 3) => {
  if (!htmlContent) return '';
  // Hilangkan tag HTML
  const plain = htmlContent.replace(/<[^>]*>?/gm, '');
  // Pecah jadi baris per baris (gunakan titik atau baris baru sebagai pemisah)
  let lines = plain
    .replace(/(\r\n|\n|\r)/gm, ' ') // Ubah \n jadi spasi
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
  };

  const closeModal = () => {
    setSelectedBerita(null);
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
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${heroBerita}')`,
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-xs sm:max-w-xl md:max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-5 drop-shadow-lg tracking-tight leading-tight">
            Berita Terkini
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-medium leading-relaxed drop-shadow-md">
            Temukan berita, pengumuman, dan informasi terbaru tentang aktivita, serta kegiatan SMPN
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
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl active:scale-[0.98] transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1 p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003366]"
                  aria-label={`Baca detail berita: ${item.judul}`}>
                  {/* ── Gambar ── */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200 shrink-0">
                    <img
                      src={photos[0]}
                      alt={item.judul}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/600x450/e2e8f0/64748b?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Badge tanggal — hanya desktop */}
                    <div className="hidden md:flex absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-[#003366] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm items-center gap-1.5 z-10">
                      <FaCalendarAlt className="text-[#b30000]" size={10} />
                      {formatTanggal(item.tanggal)}
                    </div>

                    {/* Badge jumlah foto */}
                    {photos.length > 1 && (
                      <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 z-10">
                        <FaImages size={9} />
                        <span>{photos.length}</span>
                      </div>
                    )}
                  </div>

                  {/* ── Teks ── */}
                  <div className="p-2.5 sm:p-3 md:p-5 flex flex-col flex-grow min-h-0">
                    {item.kategori && (
                      <span className="text-[#b30000] text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1 truncate">
                        {item.kategori}
                      </span>
                    )}

                    {/* Judul: 2 baris di semua ukuran */}
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-[#003366] transition-colors line-clamp-2">
                      {item.judul}
                    </h3>

                    {/* 
                      Deskripsi:
                      - mobile (< md): TIDAK muncul sama sekali agar card tetap ringkas
                      - md ke atas (desktop): muncul hanya beberapa baris (preview saja)
                    */}
                    <p className="hidden md:block text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 mb-2">
                      {item.isi_konten
                        ? getPreviewText(item.isi_konten, 2) || 'Tidak ada deskripsi singkat.'
                        : 'Tidak ada deskripsi singkat.'}
                    </p>

                    {/* Tanggal — muncul di mobile & tablet sebagai pengganti badge */}
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

      {/* ── MODAL ── */}
      {selectedBerita &&
        (() => {
          const photos = parseGambarUrl(selectedBerita.gambar_url);
          return (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
              style={{ pointerEvents: 'auto' }}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
              <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[88vh] flex flex-col z-10 overflow-hidden animate-fade-in-up">
                {/* Tombol tutup */}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 hover:bg-red-600 text-white rounded-full z-20 transition-colors focus:outline-none flex items-center justify-center"
                  style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
                  aria-label="Tutup berita">
                  <FaTimes size={18} />
                </button>

                {/* Gambar header modal */}
                <div className="w-full h-36 sm:h-56 md:h-72 bg-gray-200 shrink-0 relative overflow-hidden">
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={selectedBerita.judul}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
                    }}
                  />

                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all focus:outline-none flex items-center justify-center"
                        style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
                        aria-label="Sebelumnya">
                        <FaChevronLeft size={15} />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all focus:outline-none flex items-center justify-center"
                        style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
                        aria-label="Selanjutnya">
                        <FaChevronRight size={15} />
                      </button>
                      <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold z-10">
                        {currentPhotoIndex + 1} / {photos.length}
                      </div>
                    </>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-full px-3 sm:px-5 py-3 sm:py-4">
                    <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] sm:text-xs font-bold mb-1">
                      <FaCalendarAlt size={10} />
                      {formatTanggal(selectedBerita.tanggal)}
                    </div>
                    <h2 className="text-sm sm:text-xl md:text-2xl font-extrabold text-white leading-tight line-clamp-2">
                      {selectedBerita.judul}
                    </h2>
                  </div>
                </div>

                {/* Isi konten scrollable */}
                <div className="p-3 sm:p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                  <div
                    className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed"
                    style={{ wordBreak: 'break-word' }}
                    dangerouslySetInnerHTML={{
                      __html: selectedBerita.isi_konten || 'Detail berita belum tersedia.',
                    }}
                  />
                </div>

                <div className="px-3 py-3 sm:px-5 sm:py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                  <button
                    onClick={closeModal}
                    className="bg-[#003366] hover:bg-[#b30000] active:scale-95 text-white px-5 sm:px-7 rounded-full font-bold transition-colors text-xs sm:text-sm shadow-md"
                    style={{ minHeight: 40 }}
                    aria-label="Tutup Berita">
                    Tutup Berita
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.25s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
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
