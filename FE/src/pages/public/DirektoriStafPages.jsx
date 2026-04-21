import React, { useState, useEffect } from 'react';
import { FaUserTie, FaSearch, FaIdBadge, FaBookReader, FaChevronDown } from 'react-icons/fa';
import { direktoriApi } from '../../Api/direktoriApi';
import 'animate.css';

const BACKEND_URL = 'http://localhost:5000';

// Helper untuk membaca URL gambar dari database
const getImageUrl = (fotoString) => {
  const defaultImg =
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop';
  if (!fotoString) return defaultImg;

  try {
    if (typeof fotoString === 'string' && fotoString.startsWith('[')) {
      const arr = JSON.parse(fotoString);
      if (Array.isArray(arr) && arr.length > 0) {
        const url = arr[0];
        return /^https?:\/\//.test(url)
          ? url
          : `${BACKEND_URL}${url.startsWith('/') ? url : '/uploads/' + url}`;
      }
    }
    if (typeof fotoString === 'string') {
      if (/^https?:\/\//.test(fotoString)) return fotoString;
      if (fotoString.startsWith('/')) return `${BACKEND_URL}${fotoString}`;
      return `${BACKEND_URL}/uploads/${fotoString}`;
    }
  } catch (error) {
    console.error('Error parsing image:', error);
  }
  return defaultImg;
};

const DirektoriStafPages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataGuru, setDataGuru] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuru = async () => {
      setIsLoading(true);
      try {
        const response = await direktoriApi.getGuru();
        setDataGuru(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Gagal mengambil data direktori staf:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuru();
  }, []);

  const filteredGuru = dataGuru.filter((guru) => {
    const nama = guru.nama_lengkap ? guru.nama_lengkap.toLowerCase() : '';
    const jabatan = guru.jabatan ? guru.jabatan.toLowerCase() : '';
    const mapel = guru.mata_pelajaran ? guru.mata_pelajaran.toLowerCase() : '';
    const cari = searchTerm.toLowerCase();
    return nama.includes(cari) || jabatan.includes(cari) || mapel.includes(cari);
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] ">
      {/* =========================================
          HERO SECTION (Responsif)
      ========================================== */}
      <section className="relative w-full min-h-screen animate__animated animate__fadeInUp animate__faster sm:min-h-[70vh] md:min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1920&auto=format&fit=crop')",
          }}></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-3 xs:px-5 sm:px-6 max-w-[98vw] md:max-w-4xl mx-auto">
          <h1 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 xs:mb-6 drop-shadow-lg tracking-tight leading-snug">
            Direktori Guru & Staf
          </h1>
          <p className="text-base xs:text-lg md:text-xl text-gray-200 font-medium leading-relaxed drop-shadow-md max-w-full xs:max-w-2xl mx-auto">
            Mengenal lebih dekat para pendidik dan tenaga kependidikan yang berdedikasi tinggi dalam
            membimbing generasi penerus di SMPN 3 Manado.
          </p>
        </div>
        <div className="absolute bottom-4 xs:bottom-7 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-2xl xs:text-3xl" />
        </div>
      </section>

      {/* =========================================
          SEARCH & FILTER SECTION (Responsif)
      ========================================== */}
      <section className="max-w-[98vw] xs:max-w-[97vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8 pt-7 xs:pt-12 md:pt-20 pb-8 xs:pb-12">
        <div className="flex flex-col gap-6 xs:gap-8 md:gap-8 lg:gap-10 mb-7 xs:mb-12 md:mb-12 md:flex-row md:justify-between md:items-center">
          <div className="text-center md:text-left">
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-slate-800 mb-2">
              Profil Pendidik
            </h2>
            <p className="text-slate-500 text-sm xs:text-base">
              Menampilkan {filteredGuru.length} personil sekolah
            </p>
          </div>
          <div className="relative w-full max-w-full xs:w-[90vw] sm:w-[420px] md:w-[400px]">
            <FaSearch className="absolute left-4 xs:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-base xs:text-lg" />
            <input
              type="text"
              placeholder="Cari nama, mata pelajaran, atau jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 xs:pl-12 pr-5 py-3 xs:py-4 bg-white shadow-sm border border-slate-200 rounded-full focus:bg-white focus:ring-4 focus:ring-[#003366]/10 focus:border-[#003366] outline-none transition-all text-sm xs:text-base"
              autoComplete="off"
            />
          </div>
        </div>

        {/* =========================================
            STAFF GRID LAYOUT (Responsif)
        ========================================== */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 xs:h-12 xs:w-12 border-b-2 border-[#003366]" />
          </div>
        ) : (
          <>
            <div
              className="
                grid
                grid-cols-2
                gap-4 xs:gap-5 sm:gap-8 pb-16 xs:pb-24
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              ">
              {filteredGuru.map((guru) => (
                <div
                  key={guru.id || guru.id_guru}
                  className="
                    rounded-lg xs:rounded-xl
                    overflow-hidden 
                    shadow-sm hover:shadow-2xl transition-all duration-300 
                    border border-gray-100 group 
                    relative
                    h-[240px] xs:h-[280px] sm:h-[420px]
                  ">
                  {/* IMAGE FULL DENGAN FUNGSI HELPER API */}
                  <img
                    src={guru.foto_url}
                    alt={guru.nama_lengkap}
                    className="
                      w-full h-full object-cover
                      transition-transform duration-700 group-hover:scale-105
                      min-h-[120px] xs:min-h-[160px] sm:min-h-[260px]
                    "
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x800/e2e8f0/64748b?text=Tanpa+Foto';
                    }}
                  />

                  {/* OVERLAY BLUR HANYA BAGIAN BAWAH */}
                  <div className="absolute bottom-0 left-0 w-full h-[38%] xs:h-[40%] bg-gradient-to-t from-black/75 via-black/30 to-transparent backdrop-blur-[2px] pointer-events-none"></div>

                  {/* CONTENT DI ATAS FOTO */}
                  <div className="absolute bottom-0 w-full px-2 xs:px-3 py-2 xs:py-3 text-white">
                    {/* NAMA */}
                    <h3 className="text-xs xs:text-sm sm:text-xl font-bold leading-tight mb-1 truncate">
                      {guru.nama_lengkap}
                    </h3>
                    {/* JABATAN + NIP */}
                    <div className="flex flex-wrap justify-between items-center text-[10px] xs:text-xs sm:text-sm mb-1 xs:mb-2 gap-y-1">
                      <span className="truncate">{guru.jabatan}</span>
                      <div className="flex items-center gap-1 min-w-0">
                        <FaIdBadge className="shrink-0" />
                        <span className="truncate">{guru.nip || '-'}</span>
                      </div>
                    </div>
                    {/* MAPEL */}
                    {guru.mata_pelajaran && guru.mata_pelajaran !== '-' && (
                      <div className="flex items-center gap-1 xs:gap-2 text-[10px] xs:text-xs sm:text-sm text-blue-200 truncate">
                        <FaBookReader />
                        <span className="truncate">{guru.mata_pelajaran}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredGuru.length === 0 && (
              <div className="text-center py-16 xs:py-20 bg-white rounded-[1.7rem] xs:rounded-[3rem] border border-dashed border-slate-200 mb-20 xs:mb-32">
                <p className="text-slate-500 font-medium text-lg xs:text-xl">
                  Tidak ada guru atau staf dengan pencarian tersebut.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default DirektoriStafPages;
