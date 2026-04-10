import React from 'react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaImage, FaCalendarAlt } from 'react-icons/fa';

const formatTanggal = (dateString) => {
  if (!dateString) return 'Belum dipublikasi';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const BeritaItem = ({ item, onEdit, onDelete }) => {
  const isAnnouncement = item.kategori?.toLowerCase() === 'pengumuman';
  const isActive = item.status === 'active';

  return (
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-shadow shadow-sm hover:shadow-xl duration-200 group flex flex-col h-full relative">
      {/* Badge Status (floating absolute) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <span
          className={`flex items-center gap-1 text-[11px] font-extrabold tracking-wide px-3 py-1 rounded-full shadow-sm
            ${isActive ? 'bg-green-500/90 text-white' : 'bg-gray-400/90 text-white'}`}>
          {isActive ? <FaEye className="mb-0.5" /> : <FaEyeSlash className="mb-0.5" />}
          {isActive ? 'PUBLISHED' : 'DRAFT'}
        </span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full backdrop-blur-md ${isAnnouncement ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
          {item.kategori}
        </span>
      </div>
      {/* Area Gambar Cover */}
      <div className="relative aspect-[16/7] md:aspect-[16/6] bg-gray-100 overflow-hidden border-b border-gray-100 flex items-center justify-center">
        {item.gambar_url ? (
          <img
            src={item.gambar_url}
            alt={item.judul}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-gray-200 rounded-xl w-[58px] h-[58px] flex items-center justify-center mb-1 shadow">
              <FaImage size={32} className="opacity-50" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Tanpa Gambar</span>
          </div>
        )}

        {/* Overlay Tombol Aksi */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-200 z-10">
          <button
            onClick={() => onEdit(item)}
            className="bg-white hover:bg-blue-50 text-blue-700 p-3 rounded-lg shadow-lg transition flex items-center gap-2 font-bold text-[13px]"
            title="Edit Konten">
            <FaEdit className="mr-1" /> Edit
          </button>
          <button
            onClick={() => onDelete(item.id_berita)}
            className="bg-white hover:bg-red-100 text-red-700 p-3 rounded-lg shadow-lg transition flex items-center gap-2 font-bold text-[13px]"
            title="Hapus">
            <FaTrash className="mr-1" /> Hapus
          </button>
        </div>
      </div>

      {/* Area Teks Konten */}
      <div className="flex flex-1 flex-col px-6 py-5">
        <h3 className="font-extrabold text-gray-800 leading-snug mb-2 text-[18px] line-clamp-2">
          {item.judul}
        </h3>

        <p className="text-sm text-gray-500 mt-2 mb-5 line-clamp-3 leading-relaxed">
          {item.isi_konten?.replace(/<[^>]*>/g, '')}
        </p>

        {/* Footer Card: Tanggal Publikasi */}
        <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100 text-xs font-medium text-gray-400">
          <FaCalendarAlt /> <span>{formatTanggal(item.tgl_publikasi)}</span>
        </div>
      </div>
    </div>
  );
};

export default BeritaItem;
