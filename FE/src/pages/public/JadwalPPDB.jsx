import React, { useState, useEffect } from 'react';

import { FaCheckCircle, FaClock, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import { timelineApi } from '../../Api/timelineApi'; // Sesuaikan path import
import 'animate.css';

const JadwalPPDB = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        const data = await timelineApi.getTimeline();
        // Urutkan berdasarkan tanggal mulaiteks
        const sortedData = data.sort(
          (a, b) => new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai)
        );
        setTimelineData(sortedData);
      } catch (error) {
        console.error('Gagal mengambil data timeline PPDB:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  // FUNGSI HELPER: Menentukan Status
  const getStatusInfo = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) {
      return {
        label: 'SELESAI',
        badgeBg: 'bg-green-100 text-green-700',
        icon: <FaCheckCircle className="text-green-500" size={20} />,
      };
    } else if (now >= start && now <= end) {
      return {
        label: 'SEDANG BERLANGSUNG',
        badgeBg: 'bg-blue-100 text-blue-700',
        icon: <FaClock className="text-blue-600" size={20} />,
      };
    } else {
      return {
        label: 'MENDATANG',
        badgeBg: 'bg-gray-100 text-gray-500',
        icon: <FaClock className="text-gray-300" size={20} />,
      };
    }
  };

  // FUNGSI HELPER: Format Tanggal
  const formatTanggalRange = (start, end) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateStart = new Date(start).toLocaleDateString('id-ID', options);
    const dateEnd = new Date(end).toLocaleDateString('id-ID', options);
    return dateStart === dateEnd ? dateStart : `${dateStart.slice(0, 6)} - ${dateEnd}`;
  };

  return (
    <div className="min-h-screen bg-white animate__animated animate__fadeInUp animate__faster ">
      {/* =========================================
          HERO SECTION (Full Screen)
      ========================================== */}
      <section className="relative w-full min-h-screen flex items-center justify-center animate__animated animate__fadeInUp animate__faster">
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
        <div className="relative z-10 text-center px-3 xs:px-4 sm:px-6 md:px-10 max-w-full sm:max-w-2xl md:max-w-4xl mx-auto">
          <h1 className="text-xl xs:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg tracking-tight">
            Pendaftaran Siswa Baru
          </h1>
          <p className="text-base xs:text-lg md:text-xl text-gray-200 font-medium leading-relaxed drop-shadow-md">
            Tak perlu risau, mendaftar sangat mudah. Pantau jadwal penting dan ikuti alur
            pendaftaran berikut agar Anda tidak melewatkan kesempatan bergabung dengan keluarga
            besar SMPN 3 Manado.
          </p>
        </div>
        <div className="absolute bottom-6 xs:bottom-7 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-1.5">
          <span className="text-white/50 text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-2xl xs:text-3xl" />
        </div>
      </section>

      <section className="max-w-[97vw] xs:max-w-[90vw] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto py-10 xs:py-14 sm:py-16 md:py-20 px-2 xs:px-3 sm:px-6 md:px-8">
        {/* Judul sebelum timeline */}
        <div className="mb-6 xs:mb-8 sm:mb-10 text-center">
          <h2 className="text-lg xs:text-xl md:text-2xl lg:text-3xl font-bold text-[#003366] mb-2 sm:mb-3">
            Jadwal Penting Penerimaan Peserta Didik Baru (PPDB)
          </h2>
          <p className="text-gray-600 text-xs xs:text-sm md:text-base lg:text-lg">
            Berikut adalah urutan waktu dan tahapan penting PPDB SMPN 3 Manado yang harus kamu
            perhatikan.
          </p>
        </div>
        <div className="relative">
          {/* Garis Vertikal: Di kiri untuk HP, di tengah untuk Laptop */}
          {/* Responsive: pindah letak dan scale lebar pada breakpoints */}
          <div
            className="absolute
            left-3 xs:left-4 sm:left-6
            md:left-1/2
            top-0 bottom-0
            w-[3px] xs:w-1
            bg-gray-300
            transform
            md:-translate-x-1/2
            rounded-full"></div>

          {isLoading ? (
            <div className="text-center py-16 xs:py-20 text-gray-500 font-bold animate-pulse text-xs xs:text-sm sm:text-base">
              Memuat jadwal PPDB...
            </div>
          ) : timelineData.length === 0 ? (
            <div className="text-center py-16 xs:py-20 text-gray-500 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 text-xs xs:text-sm sm:text-base">
              Jadwal PPDB belum tersedia saat ini.
            </div>
          ) : (
            <div className="flex flex-col gap-8 sm:gap-10">
              {timelineData.map((item, index) => {
                const status = getStatusInfo(item.tanggal_mulai, item.tanggal_selesai);
                const isEven = index % 2 === 0;

                // Responsive content align and padding
                return (
                  <div
                    key={item.id_timeline || index}
                    className="relative flex flex-col md:flex-row items-center w-full py-5 sm:py-0">
                    {/* Ikon Bulat */}
                    <div
                      className="
                      absolute
                      left-3 xs:left-4 sm:left-6
                      md:left-1/2
                      transform -translate-x-1/2
                      w-9 h-9 sm:w-12 sm:h-12
                      rounded-full
                      bg-white border-4 border-[#f4f7fb]
                      shadow-md flex items-center justify-center z-10">
                      {status.icon}
                    </div>

                    {/* CARD KONTEN */}
                    <div
                      className={`
                        w-full md:w-1/2
                        pl-14 xs:pl-16 sm:pl-20 md:pl-0
                        ${
                          isEven
                            ? 'md:pr-6 lg:pr-12 md:text-right text-left md:justify-end'
                            : 'md:ml-auto md:pl-6 lg:pl-12 text-left'
                        }
                        transition-all
                      `}
                      style={{
                        // ensure minWidth so at xs widths the content doesn't get overly narrow
                        minWidth: 0,
                      }}>
                      <div
                        className={`
                          bg-white
                          p-4 xs:p-5 sm:p-6 md:p-8
                          rounded-xl md:rounded-2xl
                          shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300
                          ${status.label === 'SEDANG BERLANGSUNG' ? 'border-blue-300 ring-2 ring-blue-100' : ''}
                        `}>
                        {/* Header Kartu: Status & Tanggal */}
                        <div
                          className={`
                            flex flex-wrap items-center gap-2 xs:gap-3 mb-3 sm:mb-4
                            ${isEven && 'md:justify-end'}
                          `}>
                          <span
                            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                            style={{ fontSize: '0.7rem' }}
                            // responsive status badge
                          >
                            <span className={`${status.badgeBg}`}>{status.label}</span>
                          </span>
                          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] xs:text-xs font-bold bg-gray-50 px-2 xs:px-3 py-1 rounded-full">
                            <FaCalendarAlt className="text-[#b30000] text-xs xs:text-base" />
                            <span>
                              {formatTanggalRange(item.tanggal_mulai, item.tanggal_selesai)}
                            </span>
                          </div>
                        </div>

                        {/* Isi Kartu */}
                        <h4 className="text-base xs:text-lg md:text-xl lg:text-2xl font-bold text-[#003366] mb-2 xs:mb-3">
                          {item.judul_tahapan}
                        </h4>
                        <p className="text-gray-600 text-xs xs:text-sm md:text-base text-left leading-relaxed">
                          {item.deskripsi}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default JadwalPPDB;
