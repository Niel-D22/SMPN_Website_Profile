import React, { useState, useEffect } from 'react';
import {
  FaTrophy,
  FaImages,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from 'react-icons/fa';
import { prestasiApi } from '../../Api/prestasiApi';
import 'animate.css';
import PrestasiHero from '../../../public/Images/prestasiHero.jpg';

const BACKEND_URL = import.meta.env.VITE_MEDIA_URL;

const PrestasiPages = () => {
  const [dataPrestasi, setDataPrestasi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrestasi, setSelectedPrestasi] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchPrestasi = async () => {
      setIsLoading(true);
      try {
        const data = await prestasiApi.getPrestasi();
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => (b.id_prestasi || 0) - (a.id_prestasi || 0))
          : [];
        setDataPrestasi(sorted);
      } catch (err) {
        console.error('Gagal mengambil data prestasi:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrestasi();
  }, []);

  const parsePhotos = (fotoString) => {
    if (!fotoString)
      // Gunakan gambar yang di-import untuk default
      return [PrestasiHero];
    try {
      const arr = JSON.parse(fotoString);
      if (Array.isArray(arr) && arr.length > 0)
        return arr.map((path) => (/^https?:\/\//.test(path) ? path : `${BACKEND_URL}${path}`));
    } catch (e) {
      console.error('Error parsing foto_url:', e);
    }
    // fallback: gambar import
    return [PrestasiHero];
  };

  const openModal = (item) => {
    setSelectedPrestasi(item);
    setCurrentPhotoIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPrestasi(null);
    document.body.style.overflow = '';
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    const photos = parsePhotos(selectedPrestasi?.foto_url);
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    const photos = parsePhotos(selectedPrestasi?.foto_url);
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="min-h-screen pb-24 relative animate__animated animate__fadeInUp animate__faster overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[55vh] sm:min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${PrestasiHero})`, // pakai gambar import
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-lg tracking-tight leading-tight">
            Prestasi Siswa SMPN 3 Manado
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-gray-200 font-medium leading-relaxed drop-shadow-md mb-8 sm:mb-10">
            Prestasi gemilang diraih siswa-siswi kami di berbagai bidang.
          </p>
        </div>
        <div className="absolute bottom-7 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2">
          <span className="text-white/50 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-2xl" />
        </div>
      </section>

      {/* ── HEADER KONTEN ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 md:pt-20 pb-6 sm:pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Segudang Prestasi, <span className="text-[#003366]">Bukti Dedikasi</span>
            </h2>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed border-l-4 border-[#b30000] pl-4 sm:pl-6">
              Segala pencapaian yang membanggakan adalah hasil jerih payah, kegigihan, dan dukungan
              dari seluruh keluargabesar SMPN 3 Manado.
            </p>
          </div>
        </div>
      </section>

      {/* ── GRID PRESTASI ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-20 font-bold text-gray-500 animate-pulse">
            Memuat galeri prestasi...
          </div>
        ) : dataPrestasi.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-base sm:text-lg">
              Belum ada galeri prestasi yang dipublikasikan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {dataPrestasi.map((item) => {
              const photos = parsePhotos(item.foto_url);
              const count = photos.length;
              const thumb = photos[0];

              return (
                <div
                  key={item.id_prestasi}
                  onClick={() => openModal(item)}
                  className="relative group overflow-hidden rounded-xl cursor-pointer bg-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={thumb}
                    alt={item.nama_lomba}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    onError={(e) => {
                      // gunakan gambar import jika gagal
                      e.target.src = PrestasiHero;
                    }}
                  />

                  {count > 1 && (
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-lg flex items-center gap-1 z-20">
                      <FaImages size={9} />
                      <span>{count}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col justify-end p-2 sm:p-4 md:p-6 z-10">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block bg-[#b30000] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded mb-1 uppercase tracking-wider">
                        Tingkat {item.tingkat}
                      </span>
                      <h3 className="text-xs sm:text-base md:text-lg font-bold text-white leading-tight mb-0.5 line-clamp-2">
                        {item.nama_lomba}
                      </h3>
                      <p className="text-[9px] sm:text-xs text-gray-300">
                        Oleh: {item.nama_pemenang} • {item.tahun_meraih}
                      </p>
                      <p className="text-[9px] sm:text-xs text-yellow-400 font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                        Klik untuk lihat foto →
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── MODAL GALLERY — desain card putih bersih ── */}
      {selectedPrestasi &&
        (() => {
          const photos = parsePhotos(selectedPrestasi.foto_url);
          return (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
              onClick={closeModal}>
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

              {/* Panel */}
              <div
                className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col z-10 overflow-hidden animate-modal-up"
                onClick={(e) => e.stopPropagation()}>
                {/* Tombol tutup */}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 hover:bg-red-600 text-white rounded-full z-20 transition-colors focus:outline-none flex items-center justify-center"
                  style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
                  aria-label="Tutup">
                  <FaTimes size={17} />
                </button>

                {/* Area foto */}
                <div
                  className="relative w-full bg-gray-100 shrink-0"
                  style={{ aspectRatio: '16/9', maxHeight: '55vh' }}>
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={selectedPrestasi.nama_lomba}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // pakai default import jika gagal load
                      e.target.src = PrestasiHero;
                    }}
                  />

                  {/* Navigasi foto */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all focus:outline-none flex items-center justify-center"
                        style={{ width: 38, height: 38, minWidth: 38, minHeight: 38 }}
                        aria-label="Sebelumnya">
                        <FaChevronLeft size={15} />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all focus:outline-none flex items-center justify-center"
                        style={{ width: 38, height: 38, minWidth: 38, minHeight: 38 }}
                        aria-label="Selanjutnya">
                        <FaChevronRight size={15} />
                      </button>

                      {/* Counter foto */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full">
                        {currentPhotoIndex + 1} / {photos.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Info prestasi */}
                <div className="p-4 sm:p-5 flex flex-col gap-2 overflow-y-auto">
                  {/* Badge tingkat */}
                  <span className="inline-block self-start bg-[#b30000] text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Tingkat {selectedPrestasi.tingkat}
                  </span>

                  <h3 className="text-base sm:text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                    {selectedPrestasi.nama_lomba}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 font-medium">
                    <span>👤 {selectedPrestasi.nama_pemenang}</span>
                    <span>📅 {selectedPrestasi.tahun_meraih}</span>
                    {selectedPrestasi.peringkat && (
                      <span className="flex items-center gap-1 text-yellow-600 font-bold">
                        <FaTrophy size={12} /> {selectedPrestasi.peringkat}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail strip jika foto lebih dari 1 */}
                  {photos.length > 1 && (
                    <div className="flex gap-2 mt-1 overflow-x-auto pb-1">
                      {photos.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPhotoIndex(idx)}
                          className={`shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                            idx === currentPhotoIndex
                              ? 'border-[#003366] scale-105'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}>
                          <img
                            src={src}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // gunakan gambar import jika error thumb
                              e.target.src = PrestasiHero;
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                  <button
                    onClick={closeModal}
                    className="bg-[#003366] hover:bg-[#b30000] active:scale-95 text-white px-5 sm:px-7 rounded-full font-bold transition-colors text-xs sm:text-sm shadow-md"
                    style={{ minHeight: 40 }}>
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes modalUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-up { animation: modalUp 0.25s ease-out forwards; }
        html, body { overflow-x: hidden !important; }
      `,
        }}
      />
    </div>
  );
};

export default PrestasiPages;
