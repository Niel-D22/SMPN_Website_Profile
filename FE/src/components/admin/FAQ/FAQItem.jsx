import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icon pensil dan sampah

const FAQItem = ({ faq, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 px-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 transition hover:shadow-md group">
      {/* Bagian Kiri: Ikon & Teks */}
      <div className="flex items-center flex-1">
        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg mr-4 shrink-0 text-gray-400">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
          </svg>
        </div>

        <div className="flex flex-col">
          <h3 className="text-base font-bold text-red-700 leading-tight">{faq.pertanyaan}</h3>
          <p className="text-sm text-gray-500 font-medium">Kategori: {faq.kategori}</p>
        </div>
      </div>

      {/* Bagian Kanan: Label Aktif & Tombol Aksi */}
      <div className="flex items-center gap-3">
        {/* Label Aktif (Sesuai Wireframe) */}
        <span className="hidden sm:inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
          Aktif
        </span>

        {/* --- INI DIA TOMBOL PENSIL DAN TONG SAMPAH --- */}
        <div className="flex items-center gap-1.5 border-l border-gray-100 pl-3">
          <button
            onClick={() => onEdit(faq)} // Memanggil fungsi buka modal edit
            className="p-2.5 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition"
            title="Edit FAQ">
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => onDelete(faq.id_faq)} // Memanggil fungsi buka modal hapus
            className="p-2.5 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg transition"
            title="Hapus FAQ">
            <FaTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
