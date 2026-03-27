import React from 'react';

const ModalKonfirmasi = ({
  isOpen,
  onClose,
  onConfirm,
  judul,
  pesan,
  teksBatal = 'Batal',
  teksKonfirmasi = 'Ya, Lanjutkan',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black/10 backdrop-blur-s transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100 opacity-100">
        {/* Header Modal */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{judul}</h3>

        {/* Isi Pesan */}
        <p className="text-gray-600 mb-6">{pesan}</p>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold transition">
            {teksBatal}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose(); // Tutup modal setelah dikonfirmasi
            }}
            className="px-4 py-2 rounded-lg text-white bg-red-700 hover:bg-red-800 font-semibold transition shadow-md">
            {teksKonfirmasi}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalKonfirmasi;
