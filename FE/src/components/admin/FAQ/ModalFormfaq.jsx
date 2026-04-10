import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaEdit, FaSave } from 'react-icons/fa';

const ModalFormfaq = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    kategori: '',
    pertanyaan: '',
    jawaban: '',
  });

  // Mengecek apakah ini Mode Edit (ada data awal) atau Mode Tambah (kosong)
  const isEditMode = initialData !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData(initialData); // Isi form dengan data lama
      } else {
        setFormData({ kategori: '', pertanyaan: '', jawaban: '' }); // Kosongkan form
      }
    }
  }, [isOpen, initialData, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* HEADER MODAL DINAMIS */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            {/* Ikon dan Judul berubah tergantung mode */}
            {isEditMode ? (
              <>
                <FaEdit className="text-blue-600" size={18} />
                <h2 className="text-lg font-bold text-gray-900">Ubah Data FAQ</h2>
              </>
            ) : (
              <>
                <FaPlus className="text-red-700" size={18} />
                <h2 className="text-lg font-bold text-gray-900">Tambah FAQ Baru</h2>
              </>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-700 transition">
            <FaTimes size={20} />
          </button>
        </div>

        {/* BODY / FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Peringatan Mode Edit (Opsional, untuk UX tambahan) */}
          {isEditMode && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm font-medium border border-blue-100 mb-2">
              Anda sedang mengubah FAQ yang sudah ada. Pastikan jawaban terbaru sudah akurat.
            </div>
          )}

          {/* --- BAGIAN KATEGORI (SUDAH MENJADI DROPDOWN) --- */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kategori FAQ</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full bg-white p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-700 outline-none cursor-pointer text-gray-700"
              required>
              <option value="" disabled>
                -- Pilih Kategori --
              </option>
              <option value="PPDB & Pendaftaran">PPDB & Pendaftaran</option>
              <option value="Akademik & Kurikulum">Akademik & Kurikulum</option>
              <option value="Ekstrakurikuler & Prestasi">Ekstrakurikuler & Prestasi</option>
              <option value="Fasilitas Sekolah">Fasilitas Sekolah</option>
              <option value="Biaya & Administrasi">Biaya & Administrasi</option>
              <option value="Umum">Umum</option>
            </select>
          </div>
          {/* ----------------------------------------------- */}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Pertanyaan</label>
            <input
              type="text"
              name="pertanyaan"
              value={formData.pertanyaan}
              onChange={handleChange}
              placeholder="Tuliskan pertanyaan yang sering diajukan..."
              className="w-full bg-white p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-700 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Jawaban</label>
            <textarea
              name="jawaban"
              value={formData.jawaban}
              onChange={handleChange}
              placeholder="Tuliskan jawaban yang informatif..."
              className="w-full bg-white p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-700 outline-none h-32 resize-none"
              required></textarea>
          </div>

          {/* FOOTER / BUTTONS DINAMIS */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              // Warna tombol beda sedikit biar Admin sadar
              className={`flex-1 py-3 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 disabled:opacity-70 ${
                isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-700 hover:bg-red-800'
              }`}>
              {isSubmitting ? (
                'Menyimpan...'
              ) : isEditMode ? (
                <>
                  <FaSave size={16} /> Simpan Perubahan
                </>
              ) : (
                <>
                  <FaPlus size={14} /> Tambah FAQ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormfaq;
