import React from 'react';
import { FaCheck, FaRegClock, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';

// Helper Format Tanggal (Contoh: 1 Mei 2024)
const formatTanggal = (dateString) => {
  if (!dateString) return '';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const TimelineItem = ({ item, index, isLast, onEdit, onDelete }) => {
  // --- LOGIKA STATUS OTOMATIS ---
  const now = new Date();
  const start = new Date(item.tanggal_mulai);
  const end = new Date(item.tanggal_selesai);
  end.setHours(23, 59, 59, 999); // Set jam ke akhir hari

  let statusConfig = {
    text: 'BELUM DIMULAI',
    colorBox: 'bg-gray-200 text-gray-500',
    colorText: 'text-yellow-600',
    icon: <span className="font-bold text-xl">{index + 1}</span>,
  };

  if (now > end) {
    statusConfig = {
      text: 'SELESAI',
      colorBox: 'bg-green-500 text-white shadow-green-500/30 shadow-lg',
      colorText: 'text-green-600',
      icon: <FaCheck size={20} />,
    };
  } else if (now >= start && now <= end) {
    statusConfig = {
      text: 'BERLANGSUNG',
      colorBox: 'bg-blue-500 text-white shadow-blue-500/30 shadow-lg',
      colorText: 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md',
      icon: <FaRegClock size={22} />,
    };
  }

  return (
    <div className="relative flex gap-6 sm:gap-8 group">
      {/* Garis Vertikal Pembatas (Hilang di item terakhir) */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-[-2rem] w-0.5 bg-gray-200 z-0"></div>
      )}

      {/* Ikon Kotak Bulat Kiri */}
      <div
        className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center z-10 transition-all ${statusConfig.colorBox}`}>
        {statusConfig.icon}
      </div>

      {/* Card Konten Kanan */}
      <div className="flex-1 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative mb-8">
        {/* Tombol Aksi (Muncul saat di hover) */}
        <div className="absolute top-5 right-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit">
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(item.id_timeline)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Hapus">
            <FaTrash />
          </button>
        </div>

        {/* Judul & Status */}
        <div className="flex flex-wrap items-center gap-3 mb-2 pr-16">
          <h3 className="text-lg font-bold text-gray-900">{item.judul}</h3>
          {statusConfig.text !== 'SELESAI' && (
            <span
              className={`text-[10px] font-bold tracking-wider uppercase ${statusConfig.colorText}`}>
              {statusConfig.text === 'BELUM DIMULAI' && (
                <FaRegClock className="inline mr-1 mb-0.5" />
              )}
              {statusConfig.text}
            </span>
          )}
        </div>

        {/* Deskripsi */}
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.deskripsi}</p>

        {/* Tanggal */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
          <FaCalendarAlt className="text-blue-500" />
          {formatTanggal(item.tanggal_mulai)} - {formatTanggal(item.tanggal_selesai)}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
