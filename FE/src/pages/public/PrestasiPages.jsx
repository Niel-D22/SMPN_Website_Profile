import React, { useState, useEffect } from 'react';
// Hapus import Link karena kita pakai Pop-up sekarang
import {
  FaTrophy,
  FaImages,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown, // imported for usage below
} from 'react-icons/fa';
import { prestasiApi } from '../../Api/prestasiApi';

const BACKEND_URL = 'http://localhost:3000';

const PrestasiPages = () => {
  const [dataPrestasi, setDataPrestasi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // === STATE UNTUK POP-UP MODAL ===
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

  // FUNGSI HELPER: Parsing semua foto menjadi Array URL
  const parsePhotos = (fotoString) => {
    if (!fotoString)
      return [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&q=80&w=600&auto=format&fit=crop',
      ];
    try {
      const arr = JSON.parse(fotoString);
      if (Array.isArray(arr) && arr.length > 0) {
        return arr.map((path) => (/^https?:\/\//.test(path) ? path : `${BACKEND_URL}${path}`));
      }
    } catch (e) {
      console.error('Error parsing foto_url:', e);
    }
    return ['https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Found'];
  };

  // FUNGSI NAVIGASI POP-UP
  const openModal = (item) => {
    setSelectedPrestasi(item);
    setCurrentPhotoIndex(0);
  };

  const closeModal = () => {
    setSelectedPrestasi(null);
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
    <div className="min-h-screen pb-24 relative">
      {/* =========================================
          HERO SECTION (TIDAK DIUBAH SAMA SEKALI)
      ========================================== */}
      <section className="relative w-full min-h-screen flex items-center justify-center">
        {/* Gambar Latar Belakang */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop')",
          }}></div>

        {/* Overlay Hitam Transparan */}
        <div className="absolute inset-0 bg-black/65"></div>

        {/* Konten Teks Hero */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
            Prestasi Siswa SMPN 3 Manado
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed drop-shadow-md mb-10">
            Dedikasi, kerja keras, dan semangat pantang menyerah telah mengantarkan siswa-siswi kami
            meraih berbagai penghargaan gemilang baik di bidang akademik maupun non-akademik.
          </p>
          {/* Tombol Scroll Down */}
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-3xl" />
        </div>
      </section>

      {/* =========================================
          HEADER KONTEN 
      ========================================== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">
              Segudang Prestasi, <span className="text-[#003366]">Bukti Dedikasi</span>
            </h2>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed border-l-4 border-[#b30000] pl-6">
              Menggapai prestasi membanggakan tentu bukan tanpa proses. Segala pencapaian yang
              membanggakan adalah hasil jerih payah, kegigihan, dan dukungan dari seluruh keluarga
              besar SMPN 3 Manado.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          GRID PRESTASI (Kotak Disamakan: aspect-[4/3])
      ========================================== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-20 font-bold text-gray-500 animate-pulse">
            Memuat galeri prestasi...
          </div>
        ) : dataPrestasi.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Belum ada galeri prestasi yang dipublikasikan.</p>
          </div>
        ) : (
          /* Menggunakan Grid standar agar ukuran kartunya sama persis (disamakan) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataPrestasi.map((item) => {
              const photos = parsePhotos(item.foto_url);
              const count = photos.length;
              const thumb = photos[0];

              return (
                <div
                  key={item.id_prestasi}
                  onClick={() => openModal(item)}
                  className="relative group overflow-hidden rounded-xl cursor-pointer bg-gray-200 block shadow-sm hover:shadow-xl transition-shadow duration-300">
                  {/* Gambar dipaksa menjadi kotak melebar (aspect 4:3) agar semua kartu tingginya sama rata */}
                  <img
                    src={thumb}
                    alt={item.nama_lomba}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    onError={(e) => {
                      e.target.src =
                        'https://placehold.co/600x450/e2e8f0/64748b?text=Image+Not+Found';
                    }}
                  />

                  {/* Indikator Multiple Photos */}
                  {count > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 z-20">
                      <FaImages />
                      <span>{count}</span>
                    </div>
                  )}

                  {/* Overlay saat hover */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col justify-end p-6 z-10">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block bg-[#b30000] text-white text-[10px] font-bold px-2 py-1 rounded mb-2 uppercase tracking-wider">
                        Tingkat {item.tingkat}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-1 line-clamp-2">
                        {item.nama_lomba}
                      </h3>
                      <p className="text-sm font-medium text-gray-300">
                        Oleh: {item.nama_pemenang} • {item.tahun_meraih}
                      </p>

                      <p className="text-xs text-yellow-400 font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                        Klik untuk lihat foto &rarr;
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================
          POP-UP MODAL GALLERY
      ========================================== */}
      {selectedPrestasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          {/* Tombol Close */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-50 bg-black/50 rounded-full">
            <FaTimes size={28} />
          </button>

          {/* Kontainer Gambar Pop-up */}
          <div className="relative w-full max-w-5xl flex flex-col items-center">
            {/* Foto Utama di Pop-up */}
            <div className="relative w-full flex justify-center items-center h-[70vh]">
              <img
                src={parsePhotos(selectedPrestasi.foto_url)[currentPhotoIndex]}
                alt="Galeri Prestasi"
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
              />

              {/* Navigasi Kiri / Kanan (Jika foto lebih dari 1) */}
              {parsePhotos(selectedPrestasi.foto_url).length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all">
                    <FaChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all">
                    <FaChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Judul & Indikator Halaman di bawah foto */}
            <div className="text-center mt-6">
              <h3 className="text-xl font-bold text-white mb-1">{selectedPrestasi.nama_lomba}</h3>
              <p className="text-sm text-gray-400">
                Oleh {selectedPrestasi.nama_pemenang}
                {parsePhotos(selectedPrestasi.foto_url).length > 1 && (
                  <span className="ml-3 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    Foto {currentPhotoIndex + 1} dari{' '}
                    {parsePhotos(selectedPrestasi.foto_url).length}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrestasiPages;
