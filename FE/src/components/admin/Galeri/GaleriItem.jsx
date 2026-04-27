import React, { useState } from 'react';
import {
  FaEdit,
  FaTrash,
  FaImage,
  FaTag,
  FaEye,
  FaTimes,
  FaExpand,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';
import { mediaUrl } from '../../../config/apiBase';
import { createPortal } from 'react-dom';
import { formatTanggal, formatWaktuWITA } from '../../../../utils/formatWaktu';

// Modal Preview
const ModalPreviewGaleri = ({ item, onClose }) => {
  const [zoomOpen, setZoomOpen] = useState(false);
  if (!item) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <FaImage className="text-red-700" size={14} />
            <h2 className="text-sm font-bold text-gray-900">Detail Foto</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-700 hover:bg-red-50 transition">
            <FaTimes size={14} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* Gambar + Zoom */}
          <div className="relative bg-gray-900 group/img">
            {item.file_url ? (
              <img
                src={mediaUrl(item.file_url)}
                alt={item.judul_foto}
                className="w-full h-56 object-cover cursor-zoom-in"
                onClick={() => setZoomOpen(true)}
              />
            ) : (
              <div className="w-full h-56 flex items-center justify-center text-gray-300">
                <FaImage size={48} />
              </div>
            )}
            {item.file_url && (
              <button
                onClick={() => setZoomOpen(true)}
                className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition opacity-0 group-hover/img:opacity-100">
                <FaExpand size={10} /> Zoom
              </button>
            )}
          </div>

          {/* Info */}
          <div className="px-6 py-5 space-y-4">
            {/* Kategori */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                <FaTag size={9} />
                {item.kategori
                  ? item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)
                  : 'Umum'}
              </span>
            </div>

            {/* Judul */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Judul Foto
              </p>
              <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                {item.judul_foto}
              </h3>
            </div>

            {/* Deskripsi */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Deskripsi
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.deskripsi || (
                  <span className="italic text-gray-400">Tidak ada deskripsi</span>
                )}
              </p>
            </div>

            {/* Tanggal Upload */}
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <FaCalendarAlt size={11} />
              <span>{formatTanggal(item.tgl_upload || new Date())}</span>
            </div>

            {/* Terakhir Diperbarui */}
            {item.updated_at && (
              <div className="flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                <FaClock className="shrink-0" size={11} />
                <div>
                  <p className="font-bold uppercase tracking-wide mb-0.5">Terakhir Diperbarui</p>
                  <p className="text-gray-600 font-medium">{formatWaktuWITA(item.updated_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Fullscreen */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95"
          onClick={() => setZoomOpen(false)}>
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition">
            <FaTimes size={15} />
          </button>
          <img
            src={mediaUrl(item.file_url)}
            alt={item.judul_foto}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>,
    document.body
  );
};

const GaleriItem = ({ item, onEdit, onDelete }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col">
        {/* Area Gambar */}
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

          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-gray-700 shadow-sm">
            <FaTag className="text-blue-400" size={12} />
            {item.kategori
              ? item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)
              : 'Umum'}
          </div>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
            <button
              onClick={() => setPreviewOpen(true)}
              className="bg-white/20 hover:bg-white text-white hover:text-purple-600 p-3 rounded-full backdrop-blur-md transition shadow-lg"
              title="Preview">
              <FaEye size={18} />
            </button>
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

        {/* Area Teks */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base font-bold text-gray-900 line-clamp-1" title={item.judul_foto}>
            {item.judul_foto}
          </h3>
          <div className="mt-1.5 flex flex-row flex-wrap items-center gap-2">
            <p
              className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1"
              title={item.deskripsi}>
              {item.deskripsi || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-400">
              {formatTanggal(item.tgl_upload || new Date())}
            </span>
            {/* updated_at di card */}
            {item.updated_at && (
              <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                <FaClock size={9} />
                <span>Diperbarui: {formatWaktuWITA(item.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalPreviewGaleri item={previewOpen ? item : null} onClose={() => setPreviewOpen(false)} />
    </>
  );
};

export default GaleriItem;
