import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaPlus, FaEdit, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const KATEGORI_OPTIONS = [
  'PPDB & Pendaftaran',
  'Akademik & Kurikulum',
  'Ekstrakurikuler & Prestasi',
  'Fasilitas Sekolah',
  'Biaya & Administrasi',
  'Umum',
];

const ModalFormfaq = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    kategori: '',
    pertanyaan: '',
    jawaban: '',
  });

  const isEditMode = initialData !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setFormData(initialData);
      } else {
        setFormData({ kategori: '', pertanyaan: '', jawaban: '' });
      }
    }
  }, [isOpen, initialData, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.kategori) {
      toast.error('Pilih kategori FAQ terlebih dahulu.');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-700 outline-none transition text-sm text-gray-800 min-h-[44px]';

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="bg-white w-full max-w-md sm:max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl sm:rounded-t-3xl shrink-0">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <FaEdit className="text-blue-600" size={15} />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Ubah Data FAQ</h2>
              </>
            ) : (
              <>
                <FaPlus className="text-red-700" size={15} />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Tambah FAQ Baru</h2>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-700 hover:bg-red-50 transition"
            aria-label="Tutup">
            <FaTimes size={17} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Banner edit mode */}
          {isEditMode && (
            <div className="bg-blue-50 text-blue-700 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-blue-100">
              Anda sedang mengubah FAQ yang sudah ada. Pastikan jawaban terbaru sudah akurat.
            </div>
          )}

          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Kategori FAQ
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
              required>
              <option value="" disabled>
                -- Pilih Kategori --
              </option>
              {KATEGORI_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Pertanyaan */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Pertanyaan
            </label>
            <input
              type="text"
              name="pertanyaan"
              value={formData.pertanyaan}
              onChange={handleChange}
              placeholder="Tuliskan pertanyaan yang sering diajukan..."
              className={inputClass}
              required
            />
          </div>

          {/* Jawaban */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Jawaban
            </label>
            <textarea
              name="jawaban"
              value={formData.jawaban}
              onChange={handleChange}
              placeholder="Tuliskan jawaban yang informatif..."
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-700 outline-none h-28 sm:h-32 resize-none transition text-sm"
              required
            />
          </div>

          {/* Footer Tombol */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition min-h-[44px]">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:flex-1 py-3 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 disabled:opacity-70 min-h-[44px] ${
                isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-700 hover:bg-red-800'
              }`}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Menyimpan...
                </span>
              ) : isEditMode ? (
                <>
                  <FaSave size={13} /> Simpan Perubahan
                </>
              ) : (
                <>
                  <FaPlus size={13} /> Tambah FAQ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ModalFormfaq;
