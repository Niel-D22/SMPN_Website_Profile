import React from 'react';
import { FaEdit, FaTrash, FaImage, FaTag } from 'react-icons/fa';
import { mediaUrl } from '../../../config/apiBase';

const formatTanggal = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const GaleriItem = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col">
      {/* Area Gambar & Overlay Hover */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {item.file_url ? (
          <img
            src={item.file_url ? mediaUrl(item.file_url) : ''}
            alt={item.judul_foto}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x400?text=Gambar+Rusak';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <FaImage size={40} />
          </div>
        )}

        {/* Label Badge di Kiri Atas diganti kategori */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-gray-700 shadow-sm">
          <FaTag className="text-blue-400" size={12} />
          {item.kategori ? item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1) : 'Umum'}
        </div>

        {/* Overlay Tombol Aksi (Muncul saat di-hover) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
          <button
            onClick={() => onEdit(item)}
            className="bg-white/20 hover:bg-white text-white hover:text-blue-600 p-3 rounded-full backdrop-blur-md transition shadow-lg"
            title="Edit Foto">
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id_galeri)}
            className="bg-white/20 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-md transition shadow-lg"
            title="Hapus Foto">
            <FaTrash size={18} />
          </button>
        </div>
      </div>

      {/* Area Teks (Judul & Deskripsi) */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 line-clamp-1" title={item.judul_foto}>
          {item.judul_foto}
        </h3>

        {/* Deskripsi & Kategori */}
        <div className="mt-1.5 flex flex-row flex-wrap items-center gap-2">
          <p
            className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1"
            title={item.deskripsi}>
            {item.deskripsi || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
          </p>
          {/* Kategori di bagian atas sudah ditampilkan, tidak perlu di sini */}
        </div>

        {/* Footer Card: Tanggal */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400">
            {formatTanggal(item.tgl_upload || new Date())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GaleriItem;
