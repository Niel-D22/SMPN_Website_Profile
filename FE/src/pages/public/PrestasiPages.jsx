import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FaTrophy,
  FaImages,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaSearchPlus,
  FaCalendarAlt,
} from 'react-icons/fa';
import { prestasiApi } from '../../Api/prestasiApi';
import 'animate.css';
import PrestasiHero from '../../../public/Images/prestasiHero.webp';

const BACKEND_URL = import.meta.env.VITE_MEDIA_URL;

const PrestasiPages = () => {
  const [dataPrestasi, setDataPrestasi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrestasi, setSelectedPrestasi] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
    if (!fotoString) return [PrestasiHero];
    try {
      const arr = JSON.parse(fotoString);
      if (Array.isArray(arr) && arr.length > 0)
        return arr.map((path) => (/^https?:\/\//.test(path) ? path : `${BACKEND_URL}${path}`));
    } catch (e) {
      console.error('Error parsing foto_url:', e);
    }
    return [PrestasiHero];
  };

  const openModal = (item) => {
    setSelectedPrestasi(item);
    setCurrentPhotoIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPrestasi(null);
    setIsLightboxOpen(false);
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
      <section className="relative w-full min-h-[55vh] sm:min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${PrestasiHero})`,
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

      {selectedPrestasi &&
        createPortal(
          (() => {
            const photos = parsePhotos(selectedPrestasi.foto_url);
            return (
              <div
                className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6"
                style={{ pointerEvents: 'auto' }}>
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={closeModal}
                />

                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col z-10 overflow-hidden animate-modal-up">
                  <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-white z-20 shrink-0">
                    <div className="pr-4">
                      <span className="inline-block bg-[#b30000] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                        Tingkat {selectedPrestasi.tingkat}
                      </span>
                      <h2 className="text-base sm:text-xl font-extrabold text-[#003366] line-clamp-2 leading-tight">
                        {selectedPrestasi.nama_lomba}
                      </h2>
                    </div>
                    <button
                      onClick={closeModal}
                      className="bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors focus:outline-none flex items-center justify-center shrink-0"
                      style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
                      aria-label="Tutup">
                      <FaTimes size={16} />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                    <div
                      className="relative w-full mb-4 sm:mb-6 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer"
                      onClick={() => setIsLightboxOpen(true)}>
                      <img
                        src={photos[currentPhotoIndex]}
                        alt={selectedPrestasi.nama_lomba}
                        className="w-full h-auto max-h-[50vh] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        onError={(e) => {
                          e.target.src = PrestasiHero;
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
                    {photos.length > 1 && (
                      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
                        {photos.map((src, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentPhotoIndex(idx)}
                            className={`shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                              idx === currentPhotoIndex
                                ? 'border-[#003366] scale-105'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}>
                            <img
                              src={src}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = PrestasiHero;
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:text-base text-gray-700 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="flex items-center gap-2">
                          <span className="text-gray-400">Pemenang:</span>
                          <span className="font-bold text-gray-900">
                            {selectedPrestasi.nama_pemenang}
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-gray-400">Tahun:</span>
                          <span className="font-bold text-gray-900">
                            {selectedPrestasi.tahun_meraih}
                          </span>
                        </span>
                        {selectedPrestasi.peringkat && (
                          <span className="flex items-center gap-2 text-yellow-600 font-bold bg-yellow-50 px-2.5 py-1 rounded-md">
                            <FaTrophy size={14} /> Juara {selectedPrestasi.peringkat}
                          </span>
                        )}
                      </div>
                      {selectedPrestasi.deskripsi && (
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-2">
                          {selectedPrestasi.deskripsi}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                    <button
                      onClick={closeModal}
                      className="bg-[#003366] hover:bg-[#b30000] active:scale-95 text-white px-5 sm:px-7 rounded-full font-bold transition-colors text-xs sm:text-sm shadow-md"
                      style={{ minHeight: 40 }}>
                      Tutup Detail
                    </button>
                  </div>
                </div>
                {isLightboxOpen && (
                  <div className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-2 sm:p-8 animate__animated animate__fadeIn animate__faster">
                    <button
                      onClick={() => setIsLightboxOpen(false)}
                      className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/10 hover:bg-red-600 text-white rounded-full p-3 transition-colors z-50 focus:outline-none">
                      <FaTimes size={24} />
                    </button>
                    <img
                      src={photos[currentPhotoIndex]}
                      alt="Zoom Prestasi"
                      className="max-w-full max-h-full object-contain select-none"
                    />
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={prevPhoto}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-4 transition-all z-50 focus:outline-none">
                          <FaChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextPhoto}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-4 transition-all z-50 focus:outline-none">
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
          document.body
        )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes modalUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-up { animation: modalUp 0.25s ease-out forwards; }
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

export default PrestasiPages;
