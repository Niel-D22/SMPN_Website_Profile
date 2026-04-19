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
import { beritaApi } from '../../Api/beritaApi';

// PENTING: Ganti BACKEND_URL ke port server backend kalian, biasanya 5000 (BUKAN 3000)
const BACKEND_URL = 'http://localhost:3000'; // Contoh: http://localhost:5000

// Format tanggal helper
const formatTanggal = (dateString) => {
  if (!dateString) return 'Baru-baru ini';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Konversi dan normalisasi gambar_url agar gambar muncul dengan benar
const parseGambarUrl = (gambar_url) => {
  const fallback =
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80';

  if (!gambar_url) return [fallback];

  // Jika sudah array
  if (Array.isArray(gambar_url) && gambar_url.length > 0) {
    return gambar_url.map((u) => normalizeUrl(u));
  }

  // Jika string JSON array
  if (typeof gambar_url === 'string') {
    try {
      const parsed = JSON.parse(gambar_url);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((u) => normalizeUrl(u));
      }
    } catch {
      // gagal JSON.parse, berarti string biasa
    }
    return [normalizeUrl(gambar_url)];
  }

  return [fallback];
};

// Penyesuaian agar path gambar selalu valid
const normalizeUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\//.test(u)) return u;
  if (u.startsWith('/')) return `${BACKEND_URL}${u}`;
  // Default (misal hanya "namafile.png")
  return `${BACKEND_URL}/uploads/${u}`;
};

const BeritaPages = () => {
  const [dataBerita, setDataBerita] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Ref untuk lokasi scroll section Kabar Terbaru
  const contentRef = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      try {
        // Mendapatkan data berita dari API
        const response = await beritaApi.getBeritaPublic();

        // Pemetaan data, pastikan gambar_url ikut diambil
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
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // ----- Modal handlers -----
  const openModal = (item) => {
    setSelectedBerita(item);
    setCurrentPhotoIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedBerita(null);
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
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 relative">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg tracking-tight">
            Berita Terkini
          </h1>
          <p className="text-lg md:text-base text-gray-200 font-medium leading-relaxed drop-shadow-md">
            Temukan berita, pengumuman, dan informasi terbaru tentang aktivitas, prestasi, serta
            kegiatan SMPN 3 Manado di halaman ini. Tetap terupdate dengan berbagai kabar penting
            sekolah!
          </p>
        </div>
        {/* Scroll Down Icon */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-3xl" />
        </div>
      </section>
      {/* HEADER KONTEN */}
      <section ref={contentRef} className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#003366] tracking-tight mb-2">
              Kabar Terbaru
            </h2>
            <p className="text-gray-500">Jangan lewatkan informasi penting dari sekolah kami.</p>
          </div>
          <div className="flex items-center gap-2 text-[#b30000] font-bold text-sm bg-red-50 px-4 py-2 rounded-full">
            <FaRegNewspaper size={18} />
            <span>Update Resmi</span>
          </div>
        </div>
      </section>

      {/* GRID CARD */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="w-full aspect-[4/3] bg-gray-200" />
                <div className="p-6 flex flex-col gap-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : dataBerita.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">Belum ada berita yang diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dataBerita.map((item) => {
              const photos = parseGambarUrl(item.gambar_url);

              return (
                <div
                  key={item.id_berita}
                  onClick={() => openModal(item)}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer transform hover:-translate-y-1">
                  {/* Gambar */}
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
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badge tanggal */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#003366] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 z-10">
                      <FaCalendarAlt className="text-[#b30000]" />
                      {formatTanggal(item.tanggal)}
                    </div>

                    {/* Badge jumlah foto */}
                    {photos.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 z-10">
                        <FaImages />
                        <span>{photos.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Teks */}
                  <div className="p-6 flex flex-col flex-grow">
                    {item.kategori && (
                      <span className="text-[#b30000] text-xs font-bold uppercase tracking-widest mb-2">
                        {item.kategori}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-[#003366] transition-colors line-clamp-2">
                      {item.judul}
                    </h3>

                    {/* Menghapus Tag HTML dari teks untuk preview */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                      {item.isi_konten
                        ? item.isi_konten.replace(/<[^>]*>?/gm, '')
                        : 'Tidak ada deskripsi singkat.'}
                    </p>

                    <div className="mt-auto flex items-center text-[#b30000] font-bold text-sm group-hover:text-red-800 transition-colors">
                      <span>Baca selengkapnya</span>
                      <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL / POP-UP */}
      {selectedBerita &&
        (() => {
          const photos = parseGambarUrl(selectedBerita.gambar_url);
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
              <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-10 overflow-hidden animate-fade-in-up">
                {/* Tombol tutup */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full z-20 transition-colors">
                  <FaTimes size={20} />
                </button>

                {/* Header gambar modal */}
                <div className="w-full h-60 sm:h-72 lg:h-80 bg-gray-200 shrink-0 relative group">
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={selectedBerita.judul}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
                    }}
                  />

                  {/* Navigasi foto jika lebih dari 1 */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100">
                        <FaChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100">
                        <FaChevronRight size={20} />
                      </button>
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                        Foto {currentPhotoIndex + 1} / {photos.length}
                      </div>
                    </>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold mb-2">
                      <FaCalendarAlt />
                      {formatTanggal(selectedBerita.tanggal)}
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                      {selectedBerita.judul}
                    </h2>
                  </div>
                </div>

                {/* Isi konten modal */}
                <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                  <div
                    className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: selectedBerita.isi_konten || 'Detail berita belum tersedia.',
                    }}
                  />
                </div>

                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                  <button
                    onClick={closeModal}
                    className="bg-[#003366] hover:bg-[#b30000] text-white px-6 py-2 rounded-full font-bold transition-colors text-sm shadow-md">
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
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `,
        }}
      />
    </div>
  );
};

export default BeritaPages;
