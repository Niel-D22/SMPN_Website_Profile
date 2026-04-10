import React from 'react';
import { FaPlus } from 'react-icons/fa'; // Pastikan react-icons terinstal

const FAQHeader = () => {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 tracking-tight">Manajemen FAQ</h1>
        <p className="mt-1.5 text-sm text-gray-600 font-medium">Keterangan</p>
      </div>

      {/* Tombol dengan warna primer merah */}
      <button className="flex items-center gap-2.5 bg-red-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-red-800 transition shadow-red-700/20">
        <FaPlus size={16} />
        Tambah FAQ baru
      </button>
    </div>
  );
};

export default FAQHeader;
