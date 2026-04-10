import React from 'react';
import { FaSearch } from 'react-icons/fa';

const FAQSearch = () => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" size={16} />
      </div>
      <input
        type="text"
        placeholder="Cari kata kunci pertanyaan"
        className="w-full bg-white p-4 pl-12 rounded-2xl border border-gray-100 shadow-sm placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 transition"
      />
    </div>
  );
};

export default FAQSearch;
