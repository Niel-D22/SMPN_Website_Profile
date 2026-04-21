import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaSave, FaPlus, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Helper yang lebih tangguh (robust) untuk mengambil hanya YYYY-MM-DD
const getValidDateString = (dateData) => {
  if (!dateData) return '';
  try {
    if (typeof dateData === 'string' && dateData.includes('T')) {
      return dateData.split('T')[0];
    }
    const d = new Date(dateData);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (error) {
    return '';
  }
  return '';
};

const emptyForm = {
  judul: '',
  deskripsi: '',
  tanggal_mulai: '',
  tanggal_selesai: '',
  status: 'akan_datang',
};

const ModalFormPPDB = ({ isOpen, onClose, onSave, initialData, isSubmitting, id_admin }) => {
  const [formData, setFormData] = useState(emptyForm);
  const isEditMode = initialData !== null;

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && initialData) {
      // Pastikan format tanggal sudah bersih saat dimasukkan ke state
      setFormData({
        judul: initialData.judul || '',
        deskripsi: initialData.deskripsi || '',
        tanggal_mulai: getValidDateString(initialData.tanggal_mulai),
        tanggal_selesai: getValidDateString(initialData.tanggal_selesai),
        status: initialData.status || 'akan_datang',
        id_timeline: initialData.id_timeline,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [isOpen, initialData, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.judul.trim()) {
      toast.error('Judul (Nama Tahapan) wajib diisi.');
      return;
    }

    if (!formData.tanggal_mulai || !formData.tanggal_selesai) {
      toast.error('Tanggal mulai dan tanggal selesai wajib diisi.');
      return;
    }

    const startDate = new Date(formData.tanggal_mulai);
    const endDate = new Date(formData.tanggal_selesai);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < startDate) {
      toast.error('Tanggal selesai tidak boleh sebelum tanggal mulai.');
      return;
    }

    // ✅ FIX: pastikan status ikut terkirim
    const dataToSave = {
      judul: formData.judul,
      deskripsi: formData.deskripsi,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      status: formData.status, // PENTING
    };

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition text-sm text-gray-800 min-h-[44px]';

  const STATUS_OPTIONS = [
    {
      value: 'akan_datang',
      label: 'Akan Datang',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      value: 'berlangsung',
      label: 'Sedang Berlangsung',
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    { value: 'selesai', label: 'Selesai', color: 'text-gray-500 bg-gray-50 border-gray-200' },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl sm:rounded-t-3xl shrink-0">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <FaEdit className="text-blue-600" size={15} />
            ) : (
              <FaCalendarAlt className="text-primary" size={15} />
            )}
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {isEditMode ? 'Ubah Tahapan PPDB' : 'Tambah Tahapan Baru'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-primary hover:bg-red-50 transition"
            aria-label="Tutup">
            <FaTimes size={17} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Judul (Nama Tahapan) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Judul Tahapan
            </label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              required
              placeholder="Contoh: Sosialisasi & Pemadanan Data"
              className={inputClass}
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Deskripsi <span className="normal-case font-normal text-gray-400">(Opsional)</span>
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Jelaskan syarat atau petunjuk tahapan ini..."
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none h-20 sm:h-24 resize-none transition text-sm"
            />
          </div>

          {/* Tanggal Mulai + Selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Tanggal Mulai
              </label>
              <input
                type="date"
                name="tanggal_mulai"
                value={formData.tanggal_mulai}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="tanggal_selesai"
                value={formData.tanggal_selesai}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Status — pill selector */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: opt.value })}
                  className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all min-h-[44px] ${
                    formData.status === opt.value
                      ? opt.color + ' border-current'
                      : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Tombol */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition min-h-[44px]">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary hover:bg-red-800 text-white font-bold transition shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-60 min-h-[44px]">
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
                  <FaPlus size={13} /> Tambah Tahapan
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

export default ModalFormPPDB;
