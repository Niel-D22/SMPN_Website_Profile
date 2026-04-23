import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaClock, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import { timelineApi } from '../../Api/timelineApi';
import 'animate.css';
// Import gambar hero dari folder public/images
import heroPPDB from '../../../public/Images/heroPPDB.jpg';

// ✅ Pakai status dari DB, bukan hitung otomatis dari tanggal
const getStatusInfo = (status) => {
  const map = {
    berlangsung: {
      label: 'SEDANG BERLANGSUNG',
      badgeBg: 'bg-blue-100 text-blue-700',
      icon: <FaClock className="text-blue-600" size={20} />,
    },
    akan_datang: {
      label: 'MENDATANG',
      badgeBg: 'bg-gray-100 text-gray-500',
      icon: <FaClock className="text-gray-300" size={20} />,
    },
    selesai: {
      label: 'SELESAI',
      badgeBg: 'bg-green-100 text-green-700',
      icon: <FaCheckCircle className="text-green-500" size={20} />,
    },
  };
  return map[status] || map['akan_datang'];
};

const formatTanggalRange = (start, end) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const dateStart = new Date(start).toLocaleDateString('id-ID', options);
  const dateEnd = new Date(end).toLocaleDateString('id-ID', options);
  return dateStart === dateEnd ? dateStart : `${dateStart} - ${dateEnd}`;
};

const JadwalPPDB = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        const data = await timelineApi.getTimeline();
        const sortedData = [...(data || [])].sort(
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

  return (
    <div className="min-h-screen bg-white animate__animated animate__fadeInUp animate__faster">
      {/* HERO */}
      <section className="relative w-full min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${heroPPDB}')`,
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg tracking-tight">
            Pendaftaran Siswa Baru
          </h1>
          <p className="text-base sm:text-lg text-gray-200 font-medium leading-relaxed drop-shadow-md">
            Pantau jadwal penting dan ikuti alur pendaftaran agar tidak melewatkan kesempatan
            bergabung dengan keluarga besar SMPN 3 Manado.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-1.5">
          <span className="text-white/50 text-xs font-bold tracking-widest uppercase">
            Scroll Down
          </span>
          <FaChevronDown className="text-white/80 text-2xl" />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-5xl mx-auto py-14 sm:py-20 px-4 sm:px-6 md:px-8">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#003366] mb-2">
            Jadwal Penting PPDB SMPN 3 Manado
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Urutan waktu dan tahapan penting yang harus kamu perhatikan.
          </p>
        </div>

        <div className="relative">
          {/* Garis vertikal */}
          <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 md:-translate-x-1/2 rounded-full" />

          {isLoading ? (
            <div className="space-y-6 animate-pulse pl-14 sm:pl-20">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="h-4 w-1/4 bg-gray-200 rounded mb-3" />
                  <div className="h-6 w-2/3 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : timelineData.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm">
              Jadwal PPDB belum tersedia saat ini.
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {timelineData.map((item, index) => {
                // ✅ Pakai status dari DB langsung
                const status = getStatusInfo(item.status);
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id_timeline}
                    className="relative flex flex-col md:flex-row items-center w-full">
                    {/* Ikon bulat */}
                    <div className="absolute left-4 sm:left-6 md:left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-gray-100 shadow-md flex items-center justify-center z-10">
                      {status.icon}
                    </div>

                    {/* Card */}
                    <div
                      className={`w-full md:w-1/2 pl-14 sm:pl-20 md:pl-0 ${
                        isEven
                          ? 'md:pr-8 lg:pr-14 md:text-right'
                          : 'md:ml-auto md:pl-8 lg:pl-14 text-left'
                      }`}>
                      <div
                        className={`bg-white p-5 sm:p-6 md:p-7 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg ${
                          item.status === 'berlangsung'
                            ? 'border-blue-300 ring-2 ring-blue-100'
                            : 'border-gray-100'
                        }`}>
                        {/* Badge status + tanggal */}
                        <div
                          className={`flex flex-wrap items-center gap-2 mb-3 ${isEven ? 'md:justify-end' : ''}`}>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.badgeBg}`}>
                            {status.label}
                          </span>
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium bg-gray-50 px-2.5 py-1 rounded-full">
                            <FaCalendarAlt className="text-[#b30000]" size={10} />
                            <span>
                              {formatTanggalRange(item.tanggal_mulai, item.tanggal_selesai)}
                            </span>
                          </div>
                        </div>

                        {/* ✅ Pakai item.judul bukan item.judul_tahapan */}
                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#003366] mb-2">
                          {item.judul}
                        </h4>

                        {item.deskripsi && (
                          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed text-left">
                            {item.deskripsi}
                          </p>
                        )}
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
