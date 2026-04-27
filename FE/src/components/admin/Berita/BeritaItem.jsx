import React, { useState } from 'react';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaCalendarAlt,
  FaExpand,
  FaTimes,
  FaNewspaper,
  FaClock,
} from 'react-icons/fa';
import { mediaUrl } from '../../../config/apiBase';
import { createPortal } from 'react-dom';
import { formatTanggal, formatWaktuWITA } from '../../../../utils/formatWaktu'; // ← import dari utils

// Modal Preview
const ModalPreviewBerita = ({ item, onClose }) => {
  const [zoomGambar, setZoomGambar] = useState(false);
  if (!item) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <FaNewspaper className="text-red-700" size={15} />
            <h2 className="text-sm font-bold text-gray-900">Preview Berita</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-700 hover:bg-red-50 transition">
            <FaTimes size={15} />
          </button>
        </div>

        {/* Konten — scrollable */}
        <div className="overflow-y-auto flex flex-col">
          {/* Gambar + Tombol Zoom */}
          {item.gambar_url && (
            <div className="relative group/img">
              <img
                src={mediaUrl(item.gambar_url)}
                alt={item.judul}
                className="w-full object-cover max-h-64"
              />
              <button
                onClick={() => setZoomGambar(true)}
                className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition opacity-0 group-hover/img:opacity-100">
                <FaExpand size={10} /> Zoom
              </button>
            </div>
          )}

          {/* Info */}
          <div className="px-8 py-6 space-y-5">
            {/* Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full ${item.kategori?.toLowerCase() === 'pengumuman' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {item.kategori}
              </span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {item.status === 'active' ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Judul */}
            <h2 className="text-xl font-extrabold text-gray-900 leading-snug">{item.judul}</h2>

            {/* Tanggal */}
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <FaCalendarAlt size={13} />
              <span>{formatTanggal(item.tgl_publikasi)}</span>
            </div>

            {/* Isi Konten */}
            <div
              className="text-base text-gray-600 leading-relaxed prose prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: item.isi_konten }}
            />
          </div>
          {/* Terakhir Diperbarui */}
          {item.updated_at && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 px-8 pb-2">
              <FaClock size={10} />
              <span>Diperbarui: {formatWaktuWITA(item.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Gambar */}
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
            src={mediaUrl(item.gambar_url)}
            alt={item.judul}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>,
    document.body
  );
};

const BeritaItem = ({ item, onEdit, onDelete }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const isAnnouncement = item.kategori?.toLowerCase() === 'pengumuman';
  const isActive = item.status === 'active';

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-shadow shadow-sm hover:shadow-xl duration-200 group flex flex-col h-full relative">
        {/* Badge Status — tidak berubah */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <span
            className={`flex items-center gap-1 text-[11px] font-extrabold tracking-wide px-3 py-1 rounded-full shadow-sm ${isActive ? 'bg-green-500/90 text-white' : 'bg-gray-400/90 text-white'}`}>
            {isActive ? <FaEye className="mb-0.5" /> : <FaEyeSlash className="mb-0.5" />}
            {isActive ? 'PUBLISHED' : 'DRAFT'}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full backdrop-blur-md ${isAnnouncement ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
            {item.kategori}
          </span>
        </div>

        {/* Gambar Cover — tidak berubah */}
        <div className="relative aspect-[16/7] md:aspect-[16/6] bg-gray-100 overflow-hidden border-b border-gray-100 flex items-center justify-center">
          {item.gambar_url ? (
            <img
              src={mediaUrl(item.gambar_url)}
              alt={item.judul}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
              <div className="bg-gray-200 rounded-xl w-[58px] h-[58px] flex items-center justify-center mb-1 shadow">
                <FaImage size={32} className="opacity-50" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Tanpa Gambar</span>
            </div>
          )}

          {/* Overlay — tambah tombol Preview */}
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200 z-10">
            <button
              onClick={() => setPreviewOpen(true)}
              className="bg-white hover:bg-purple-50 text-purple-700 p-3 rounded-lg shadow-lg transition flex items-center gap-2 font-bold text-[13px]">
              <FaEye className="mr-1" /> Preview
            </button>
            <button
              onClick={() => onEdit(item)}
              className="bg-white hover:bg-blue-50 text-blue-700 p-3 rounded-lg shadow-lg transition flex items-center gap-2 font-bold text-[13px]">
              <FaEdit className="mr-1" /> Edit
            </button>
            <button
              onClick={() => onDelete(item.id_berita)}
              className="bg-white hover:bg-red-100 text-red-700 p-3 rounded-lg shadow-lg transition flex items-center gap-2 font-bold text-[13px]">
              <FaTrash className="mr-1" /> Hapus
            </button>
          </div>
        </div>

        {/* Teks Konten — tidak berubah */}
        {/* Teks Konten — tidak berubah */}
        <div className="flex flex-1 flex-col px-6 py-5">
          <h3 className="font-extrabold text-gray-800 leading-snug mb-2 text-[18px] line-clamp-2">
            {item.judul}
          </h3>
          <p className="text-sm text-gray-500 mt-2 mb-5 line-clamp-3 leading-relaxed">
            {item.isi_konten?.replace(/<[^>]*>/g, '')}
          </p>
          <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-1">
            {/* Tanggal Publikasi */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <FaCalendarAlt />
              <span>{formatTanggal(item.tgl_publikasi)}</span>
            </div>

            {/* Terakhir Diperbarui */}
            {item.updated_at && (
              <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                <FaClock size={9} />
                <span>Diperbarui: {formatWaktuWITA(item.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      <ModalPreviewBerita item={previewOpen ? item : null} onClose={() => setPreviewOpen(false)} />
    </>
  );
};

export default BeritaItem;
