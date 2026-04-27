import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaTimes, FaQuestionCircle, FaTag, FaClock } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { formatWaktuWITA } from '../../../../utils/formatWaktu';

// Modal Preview
const ModalPreviewFAQ = ({ faq, onClose }) => {
  if (!faq) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="bg-white w-full max-w-md sm:max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <FaQuestionCircle className="text-red-700" size={14} />
            <h2 className="text-xs sm:text-sm font-bold text-gray-900">Detail FAQ</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-700 hover:bg-red-50 transition">
            <FaTimes size={14} />
          </button>
        </div>

        {/* Konten */}
        <div className="overflow-y-auto px-3 py-4 sm:px-6 sm:py-5 space-y-4">
          {/* Kategori */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
              <FaTag size={9} /> {faq.kategori || 'Umum'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100">
              Aktif
            </span>
          </div>

          {/* Pertanyaan */}
          <div className="bg-red-50 border border-red-100 border-l-4 border-l-red-700 rounded-xl px-3 py-2 sm:px-4 sm:py-3">
            <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide mb-1">
              Pertanyaan
            </p>
            <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug break-words break-all">
              {faq.pertanyaan}
            </p>
          </div>

          {/* Jawaban */}
          <div className="bg-gray-50 border border-gray-100 border-l-4 border-l-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
              Jawaban
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words break-all">
              {faq.jawaban}
            </p>
          </div>

          {/* Terakhir Diperbarui */}
          {faq.updated_at && (
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 bg-gray-50 rounded-xl border border-gray-100 px-3 py-2 sm:px-4 sm:py-3">
              <FaClock className="shrink-0" size={11} />
              <div>
                <p className="font-bold uppercase tracking-wide mb-0.5">Terakhir Diperbarui</p>
                <p className="text-gray-600 font-medium">{formatWaktuWITA(faq.updated_at)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition text-xs sm:text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const FAQItem = ({ faq, onEdit, onDelete }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <div className="bg-white px-3 py-4 sm:p-6 sm:px-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition hover:shadow-md group">
        {/* Bagian Kiri */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center rounded-lg mr-3 sm:mr-4 shrink-0 text-gray-400">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-red-700 leading-tight line-clamp-2">
              {faq.pertanyaan}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
              Kategori: {faq.kategori}
            </p>
            {/* updated_at di card */}
            {faq.updated_at && (
              <div className="flex items-center gap-1 text-[9px] sm:gap-1.5 sm:text-[10px] text-gray-300 mt-1">
                <FaClock size={8} className="sm:size-[9px]" />
                <span className="truncate">Diperbarui: {formatWaktuWITA(faq.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bagian Kanan */}
        <div className="flex flex-row sm:flex-row items-center gap-2 sm:gap-3 shrink-0 mt-3 sm:mt-0">
          <span className="inline-block sm:hidden bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap">
            Aktif
          </span>
          <span className="hidden sm:inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
            Aktif
          </span>
          <div className="flex items-center gap-1 border-l-0 sm:border-l sm:border-gray-100 sm:pl-3">
            <button
              onClick={() => setPreviewOpen(true)}
              className="p-2 text-gray-400 hover:text-purple-600 bg-white hover:bg-purple-50 rounded-lg transition"
              title="Preview FAQ">
              <FaEye size={15} className="sm:size-[16px]" />
            </button>
            <button
              onClick={() => onEdit(faq)}
              className="p-2 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition"
              title="Edit FAQ">
              <FaEdit size={15} className="sm:size-[16px]" />
            </button>
            <button
              onClick={() => onDelete(faq.id_faq)}
              className="p-2 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg transition"
              title="Hapus FAQ">
              <FaTrash size={15} className="sm:size-[16px]" />
            </button>
          </div>
        </div>
      </div>

      <ModalPreviewFAQ faq={previewOpen ? faq : null} onClose={() => setPreviewOpen(false)} />
    </>
  );
};

export default FAQItem;
