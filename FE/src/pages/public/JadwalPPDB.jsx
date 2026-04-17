import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { timelineApi } from '../../Api/timelineApi'; // Sesuaikan path import

const JadwalPPDB = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data dari Backend
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
    <div className="min-h-screen ">
      {/* =========================================
          HERO SECTION (Full Screen)
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
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg tracking-tight">
            Pendaftaran Siswa Baru
          </h1>
          <p className="text-lg md:text-s text-gray-200 font-medium leading-relaxed drop-shadow-md">
            Tak perlu risau, mendaftar sangat mudah. Pantau jadwal penting dan ikuti alur
            pendaftaran berikut agar Anda tidak melewatkan kesempatan bergabung dengan keluarga
            besar SMPN 3 Manado.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-20 px-6 sm:px-8">
        {/* Judul sebelum timeline */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-3">
            Jadwal Penting Penerimaan Peserta Didik Baru (PPDB)
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Berikut adalah urutan waktu dan tahapan penting PPDB SMPN 3 Manado yang harus kamu
            perhatikan.
          </p>
        </div>
        <div className="relative">
          {/* Garis Vertikal: Di kiri untuk HP, di tengah untuk Laptop */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gray-300 transform md:-translate-x-1/2 rounded-full"></div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-500 font-bold animate-pulse">
              Memuat jadwal PPDB...
            </div>
          ) : timelineData.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-200">
              Jadwal PPDB belum tersedia saat ini.
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {timelineData.map((item, index) => {
                const status = getStatusInfo(item.tanggal_mulai, item.tanggal_selesai);
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id_timeline || index}
                    className="relative flex flex-col md:flex-row items-center w-full">
                    {/* Ikon Bulat */}
                    <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-[#f4f7fb] shadow-md flex items-center justify-center z-10">
                      {status.icon}
                    </div>

                    {/* KARTU KONTEN */}
                    <div
                      className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-14 md:text-right' : 'md:ml-auto md:pl-14 text-left'}`}>
                      <div
                        className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 ${status.label === 'SEDANG BERLANGSUNG' ? 'border-blue-300 ring-2 ring-blue-100' : ''}`}>
                        {/* Header Kartu: Status & Tanggal */}
                        <div className={`flex flex-wrap items-center gap-3 mb-4 justify-start`}>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.badgeBg}`}>
                            {status.label}
                          </span>
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold bg-gray-50 px-3 py-1 rounded-full">
                            <FaCalendarAlt className="text-[#b30000]" />
                            <span>
                              {formatTanggalRange(item.tanggal_mulai, item.tanggal_selesai)}
                            </span>
                          </div>
                        </div>

                        {/* Isi Kartu */}
                        <h4 className="text-xl md:text-2xl font-bold text-[#003366] mb-3">
                          {item.judul_tahapan}
                        </h4>
                        <p className="text-gray-600 text-sm md:text-base text-left leading-relaxed">
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
