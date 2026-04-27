import React, { useState, useEffect } from 'react';
import {
  FaEdit,
  FaTrash,
  FaTrophy,
  FaUser,
  FaCalendarAlt,
  FaImages,
  FaEye,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
} from 'react-icons/fa';
import { mediaUrl } from '../../../config/apiBase';
import { createPortal } from 'react-dom';
import { formatWaktuWITA } from '../../../../utils/formatWaktu';

const badgeForTingkat = (tingkat) => {
  const t = (tingkat || '').toLowerCase();
  if (t.includes('nasional')) return 'bg-red-100 text-red-800 border-red-200/80';
  if (t.includes('provinsi')) return 'bg-blue-100 text-blue-800 border-blue-200/80';
  if (t.includes('kabupaten') || t.includes('kota'))
    return 'bg-amber-100 text-amber-900 border-amber-200/80';
  if (t.includes('antar')) return 'bg-violet-100 text-violet-800 border-violet-200/80';
  return 'bg-emerald-100 text-emerald-800 border-emerald-200/80';
};

const ModalPreviewPrestasi = ({ item, photos, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  if (!item) return null;

  const prev = () => setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setActiveIndex((i) => (i + 1) % photos.length);

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
            <FaTrophy className="text-red-700" size={14} />
            <h2 className="text-sm font-bold text-gray-900">Detail Prestasi</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-700 hover:bg-red-50 transition">
            <FaTimes size={14} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* Galeri Foto */}
          {photos.length > 0 && (
            <div className="relative bg-gray-900 group/gallery">
              <img
                src={mediaUrl(photos[activeIndex])}
                alt=""
                className="w-full h-52 object-cover cursor-zoom-in"
                onClick={() => setZoomOpen(true)}
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition">
                    <FaChevronLeft size={12} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition">
                    <FaChevronRight size={12} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition ${i === activeIndex ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    {activeIndex + 1} / {photos.length}
                  </div>
                </>
              )}
              <p className="absolute bottom-2 right-2 text-[10px] text-white/60 italic">
                Klik foto untuk zoom
              </p>
            </div>
          )}

          {/* Info */}
          <div className="px-6 py-5 space-y-4">
            {/* Badge */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${badgeForTingkat(item.tingkat)}`}>
                {item.tingkat || '—'}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 flex items-center gap-1">
                <FaCalendarAlt size={9} /> {item.tahun_meraih ?? '—'}
              </span>
            </div>

            {/* Nama Lomba */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Nama Lomba
              </p>
              <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                {item.nama_lomba}
              </h3>
            </div>

            {/* Pemenang */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 flex items-start gap-3">
              <FaUser className="text-red-700 shrink-0 mt-0.5" size={13} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                  Pemenang
                </p>
                <p className="text-sm font-semibold text-gray-800">{item.nama_pemenang}</p>
              </div>
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

      {/* Zoom Foto */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95"
          onClick={() => setZoomOpen(false)}>
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition">
            <FaTimes size={15} />
          </button>
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition">
                <FaChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition">
                <FaChevronRight size={16} />
              </button>
            </>
          )}
          <img
            src={mediaUrl(photos[activeIndex])}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>,
    document.body
  );
};

const PrestasiItem = ({ item, onEdit, onDelete }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);

  let photos = [];
  if (item.foto_url) {
    if (Array.isArray(item.foto_url)) {
      photos = item.foto_url;
    } else if (typeof item.foto_url === 'string') {
      try {
        photos = JSON.parse(item.foto_url);
      } catch {
        photos = item.foto_url.split(',').map((s) => s.trim());
      }
    }
  }

  const firstPhoto = photos.length > 0 ? mediaUrl(photos[0]) : null;
  const tahun = item.tahun_meraih ?? '—';

  useEffect(() => {
    setImgBroken(!firstPhoto);
  }, [firstPhoto]);
  const showPhoto = firstPhoto && !imgBroken;

  return (
    <>
      <article className="w-full max-w-full overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md hover:border-red-100 transition-all duration-300 group">
        <div className="relative w-full h-36 overflow-hidden bg-gradient-to-br from-gray-100 to-red-50/40">
          {showPhoto ? (
            <>
              <img
                src={firstPhoto}
                alt=""
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                onError={() => setImgBroken(true)}
              />
              {photos.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                  <FaImages size={12} />+{photos.length - 1} Foto
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-primary/35">
              <FaTrophy className="drop-shadow-sm" size={44} />
            </div>
          )}

          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none">
            <span
              className={`text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-sm truncate max-w-full ${badgeForTingkat(item.tingkat)}`}>
              {item.tingkat || '—'}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/90 text-gray-700 border border-gray-200/80 flex items-center gap-1 shadow-sm whitespace-nowrap">
              <FaCalendarAlt size={10} className="text-primary" />
              {tahun}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setPreviewOpen(true)}
              className="p-2 rounded-xl bg-white/95 text-gray-500 hover:text-purple-600 hover:bg-purple-50 shadow-md border border-gray-100 transition"
              title="Preview">
              <FaEye size={15} />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-xl bg-white/95 text-gray-500 hover:text-blue-600 hover:bg-blue-50 shadow-md border border-gray-100 transition"
              title="Edit">
              <FaEdit size={15} />
            </button>
            <button
              onClick={() => onDelete(item.id_prestasi)}
              className="p-2 rounded-xl bg-white/95 text-gray-500 hover:text-red-600 hover:bg-red-50 shadow-md border border-gray-100 transition"
              title="Hapus">
              <FaTrash size={15} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col flex-1 gap-2 min-w-0">
          <h3
            className="text-base font-bold text-gray-900 leading-snug line-clamp-2 break-words"
            title={item.nama_lomba}>
            {item.nama_lomba}
          </h3>
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <FaUser className="text-primary shrink-0 mt-0.5" size={14} />
            <span className="line-clamp-2 font-medium break-words">{item.nama_pemenang}</span>
          </p>

          {/* updated_at di card */}
          {item.updated_at && (
            <div className="flex items-center gap-1.5 text-[10px] text-gray-300 pt-2 border-t border-gray-100 mt-auto">
              <FaClock size={9} />
              <span>Diperbarui: {formatWaktuWITA(item.updated_at)}</span>
            </div>
          )}
        </div>
      </article>

      <ModalPreviewPrestasi
        item={previewOpen ? item : null}
        photos={photos}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default PrestasiItem;
