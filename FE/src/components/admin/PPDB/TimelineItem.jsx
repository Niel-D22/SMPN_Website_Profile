import React from 'react';
import { FaCheck, FaRegClock, FaCalendarAlt, FaEdit, FaTrash, FaClock } from 'react-icons/fa';
import { formatTanggal, formatWaktuWITA } from '../../../../utils/formatWaktu';

const TimelineItem = ({ item, index, isLast, onEdit, onDelete }) => {
  let statusConfig = {
    text: '',
    colorBox: 'bg-gray-200 text-gray-500',
    colorText: 'text-yellow-600',
    icon: <span className="font-bold text-xl">{index + 1}</span>,
  };

  if (item.status === 'selesai') {
    statusConfig = {
      text: 'SELESAI',
      colorBox: 'bg-green-500 text-white shadow-green-500/30 shadow-lg',
      colorText: 'text-green-600',
      icon: <FaCheck size={20} />,
    };
  } else if (item.status === 'berlangsung') {
    statusConfig = {
      text: 'BERLANGSUNG',
      colorBox: 'bg-blue-500 text-white shadow-blue-500/30 shadow-lg',
      colorText: 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md',
      icon: <FaRegClock size={22} />,
    };
  } else {
    statusConfig = {
      text: 'AKAN DATANG',
      colorBox: 'bg-gray-200 text-gray-500',
      colorText: 'text-yellow-600',
      icon: <FaRegClock size={20} />,
    };
  }

  return (
    <div className="relative flex gap-6 sm:gap-8 group">
      {/* Garis Vertikal */}
      {!isLast && <div className="absolute left-6 top-14 bottom-[-2rem] w-0.5 bg-gray-200 z-0" />}

      {/* Ikon Kiri */}
      <div
        className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center z-10 transition-all ${statusConfig.colorBox}`}>
        {statusConfig.icon}
      </div>

      {/* Card Kanan */}
      <div className="flex-1 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative mb-8">
        {/* Tombol Aksi */}
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
              {statusConfig.text}
            </span>
          )}
        </div>

        {/* Deskripsi */}
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.deskripsi}</p>

        {/* Tanggal Mulai - Selesai */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
          <FaCalendarAlt className="text-blue-500" />
          {formatTanggal(item.tanggal_mulai)} - {formatTanggal(item.tanggal_selesai)}
        </div>

        {/* Terakhir Diperbarui */}
        {item.updated_at && (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-300 mt-3">
            <FaClock size={9} />
            <span>Diperbarui: {formatWaktuWITA(item.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
