import React, { useState } from 'react';
import {
  FaEdit,
  FaTrash,
  FaUserTie,
  FaIdCard,
  FaBookOpen,
  FaEye,
  FaTimes,
  FaExpand,
} from 'react-icons/fa';
import { createPortal } from 'react-dom';

// Modal Preview
const ModalPreviewDirektori = ({ item, onClose }) => {
  const [zoomGambar, setZoomGambar] = useState(false);
  if (!item) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <FaUserTie className="text-red-700" size={14} />
            <h2 className="text-sm font-bold text-gray-900">Detail Pegawai</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-700 hover:bg-red-50 transition">
            <FaTimes size={14} />
          </button>
        </div>

        {/* Konten */}
        <div className="overflow-y-auto">
          {/* Foto + Header Gradien */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-28 flex justify-center mb-12">
            <div className="absolute -bottom-10 group/foto">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
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
              {/* Tombol zoom foto */}
              {item.foto_url && (
                <button
                  onClick={() => setZoomGambar(true)}
                  className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover/foto:opacity-100 transition">
                  <FaExpand className="text-white" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="px-6 pb-6 text-center space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 leading-snug">
                {item.nama_lengkap}
              </h3>
              <span className="inline-block mt-1.5 text-[11px] font-bold px-3 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100">
                {item.jabatan || 'Staf'}
              </span>
            </div>

            {/* Detail */}
            <div className="text-left bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
              <div className="flex items-center gap-3 px-4 py-3">
                <FaIdCard className="text-gray-400 shrink-0" size={13} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">NIP</p>
                  <p className="text-sm text-gray-700 font-medium">
                    {item.nip || <i className="text-gray-400 font-normal">Tidak tersedia</i>}
                  </p>
                </div>
              </div>
              {item.mata_pelajaran && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <FaBookOpen className="text-gray-400 shrink-0" size={13} />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      Bidang / Mata Pelajaran
                    </p>
                    <p className="text-sm text-gray-700 font-medium">{item.mata_pelajaran}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Foto */}
      {zoomGambar && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90"
          onClick={() => setZoomGambar(false)}>
          <button
            onClick={() => setZoomGambar(false)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition">
            <FaTimes size={15} />
          </button>
          <img
            src={item.foto_url}
            alt={item.nama_lengkap}
            className="max-w-[80vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>,
    document.body
  );
};

const DirektoriItem = ({ item, onEdit, onDelete }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-red-100 transition-all duration-300 group">
        {/* Header & Foto Profil */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-200 h-24 flex justify-center mb-10">
          {/* Tombol Aksi — tambah Preview */}
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() => setPreviewOpen(true)}
              className="p-2 rounded-xl bg-white/90 text-gray-500 hover:text-purple-600 shadow-sm transition"
              title="Preview">
              <FaEye size={14} />
            </button>
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

          {/* Lingkaran Foto — tidak berubah */}
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

        {/* Info Utama — tidak berubah */}
        <div className="px-5 pb-5 text-center flex flex-col flex-1">
          <h3
            className="text-base font-bold text-gray-900 leading-snug mb-1 line-clamp-1"
            title={item.nama_lengkap}>
            {item.nama_lengkap}
          </h3>
          <div className="flex justify-center mb-4">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100 inline-block">
              {item.jabatan || 'Staf'}
            </span>
          </div>
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

      <ModalPreviewDirektori
        item={previewOpen ? item : null}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default DirektoriItem;
