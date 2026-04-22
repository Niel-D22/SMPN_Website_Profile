import React from 'react';
import { createPortal } from 'react-dom';

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

  return createPortal(
    <div className="fixed inset-0 z-[30] flex items-center justify-center px-4 bg-black/30 backdrop-blur-[2px]">
      {/* Overlay */}
      <div
        className="absolute inset-0 z-0"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Tutup Modal"
        role="presentation"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-4 xs:p-6 border border-gray-100">
        <h3 className="text-lg xs:text-xl font-bold text-gray-800 mb-2 text-center">{judul}</h3>
        <p className="text-gray-600 mb-6 text-sm xs:text-base text-center">{pesan}</p>
        <div className="flex flex-col gap-2 xs:gap-3 sm:flex-row justify-center sm:justify-end pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold transition text-sm">
            {teksBatal}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-white bg-red-700 hover:bg-red-800 font-semibold transition shadow-md text-sm">
            {teksKonfirmasi}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalKonfirmasi;
