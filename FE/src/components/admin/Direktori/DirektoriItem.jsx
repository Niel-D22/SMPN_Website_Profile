import React from 'react';
import { FaEdit, FaTrash, FaUserTie, FaIdCard, FaBookOpen } from 'react-icons/fa';

const DirektoriItem = ({ item, onEdit, onDelete }) => {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-red-100 transition-all duration-300 group">
      {/* Header & Foto Profil */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-200 h-24 flex justify-center mb-10">
        {/* Tombol Aksi (Muncul saat hover) */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-xl bg-white/90 text-gray-500 hover:text-blue-600 shadow-sm transition"
            title="Edit">
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(item.id_guru)}
            className="p-2 rounded-xl bg-white/90 text-gray-500 hover:text-red-600 shadow-sm transition"
            title="Hapus">
            <FaTrash size={14} />
          </button>
        </div>

        {/* Lingkaran Foto */}
        <div className="absolute -bottom-10 w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
          {item.foto_url ? (
            <img
              src={item.foto_url}
              alt={item.nama_lengkap}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUserTie className="text-gray-300" size={40} />
          )}
        </div>
      </div>

      {/* Info Utama */}
      <div className="px-5 pb-5 text-center flex flex-col flex-1">
        <h3
          className="text-base font-bold text-gray-900 leading-snug mb-1 line-clamp-1"
          title={item.nama_lengkap}>
          {item.nama_lengkap}
        </h3>

        {/* Badge Jabatan */}
        <div className="flex justify-center mb-4">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100 inline-block">
            {item.jabatan || 'Staf'}
          </span>
        </div>

        {/* Detail (NIP & Mapel) */}
        <div className="space-y-2 mt-auto text-left bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FaIdCard className="text-gray-400 shrink-0" size={12} />
            <span className="truncate" title={item.nip || 'Belum ada NIP'}>
              {item.nip || <i className="text-gray-400">NIP tidak tersedia</i>}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FaBookOpen className="text-gray-400 shrink-0" size={12} />
            <span className="truncate" title={item.mata_pelajaran || 'Tidak mengajar'}>
              {item.mata_pelajaran || '-'}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DirektoriItem;
