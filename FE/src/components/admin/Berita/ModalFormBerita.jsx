import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { mediaUrl } from '../../../config/apiBase'; // ✅ import mediaUrl

const ModalFormBerita = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Berita',
    status: 'active',
    isi_konten: '',
    gambar: null,
    gambar_url: '',
    preview: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          judul: initialData.judul || '',
          kategori: initialData.kategori || 'Berita',
          status: initialData.status || 'active',
          isi_konten: initialData.isi_konten || '',
          gambar: null,
          gambar_url: initialData.gambar_url || '', // ✅ simpan apa adanya dari DB
          preview: '',
        });
      } else {
        setFormData({
          judul: '',
          kategori: 'Berita',
          status: 'active',
          isi_konten: '',
          gambar: null,
          gambar_url: '',
          preview: '',
        });
      }
    }
  }, [isOpen, initialData]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran gambar terlalu besar! Maksimal 5MB.');
        return;
      }
      setFormData({ ...formData, gambar: file, preview: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full bg-[#f8f9fa] p-3 sm:p-3.5 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition text-sm text-gray-800 font-medium';

  // ✅ Gunakan mediaUrl() untuk construct URL gambar
  const displayImage = formData.preview || mediaUrl(formData.gambar_url);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl sm:rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex justify-between items-center rounded-t-2xl sm:rounded-t-[24px] shrink-0">
          <h2 className="text-base sm:text-lg font-extrabold text-gray-800">
            {initialData ? 'Ubah Berita' : 'Unggah Berita Baru'}
          </h2>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Tutup modal">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Area Upload Gambar */}
          <div className="relative w-full h-44 sm:h-56 bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer group">
            {displayImage ? (
              <>
                {/* ✅ pakai displayImage yang sudah di-resolve oleh mediaUrl() */}
                <img src={displayImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2">
                    <FaImage size={18} />
                  </div>
                  <span className="text-white text-xs font-bold tracking-wide">GANTI GAMBAR</span>
                </div>
              </>
            ) : (
              <div className="text-center pointer-events-none flex flex-col items-center px-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 transition-transform group-hover:scale-110">
                  <FaPlus size={20} />
                </div>
                <h3 className="text-sm sm:text-[15px] font-bold text-gray-700 mb-1">
                  Klik atau seret file ke sini
                </h3>
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  PNG, JPG hingga 5MB
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Judul */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Judul Berita</label>
            <input
              type="text"
              required
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Contoh: Pengumuman Jadwal Ujian Sekolah..."
              className={inputClass}
            />
          </div>

          {/* Kategori + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Kategori</label>
              <select
                className={`${inputClass} cursor-pointer`}
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}>
                <option value="Berita">Berita</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Agenda">Agenda</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Status Publikasi
              </label>
              <select
                className={`${inputClass} cursor-pointer`}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Active (Publik)</option>
                <option value="inactive">Inactive (Draft)</option>
              </select>
            </div>
          </div>

          {/* Isi Konten */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Isi Konten</label>
            <textarea
              required
              value={formData.isi_konten}
              onChange={(e) => setFormData({ ...formData, isi_konten: e.target.value })}
              placeholder="Tuliskan isi berita di sini..."
              className={`${inputClass} h-36 sm:h-40 resize-none`}
            />
          </div>

          {/* Footer Tombol */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-1 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-colors min-h-[44px]">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center sm:min-w-[160px] disabled:opacity-60 shadow-lg shadow-blue-600/20 min-h-[44px]">
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
              ) : initialData ? (
                'Simpan Perubahan'
              ) : (
                'Unggah Sekarang'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormBerita;
