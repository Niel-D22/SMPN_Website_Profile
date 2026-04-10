import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaPaperPlane, FaPlus, FaImage } from 'react-icons/fa';

// Helper Konversi Gambar ke Base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ModalFormBerita = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Berita',
    status: 'active',
    isi_konten: '',
    gambar_url: '', // Menggunakan nama kolom database
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          judul: initialData.judul || '',
          kategori: initialData.kategori || 'Berita',
          status: initialData.status || 'active',
          isi_konten: initialData.isi_konten || '',
          gambar_url: initialData.gambar_url || '',
        });
      } else {
        setFormData({
          judul: '',
          kategori: 'Berita',
          status: 'active',
          isi_konten: '',
          gambar_url: '',
        });
      }
    }
  }, [isOpen, initialData]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran maksimal 5MB (opsional tapi disarankan)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran gambar terlalu besar! Maksimal 5MB.');
        e.target.value = '';
        return;
      }
      const base64 = await convertToBase64(file);
      setFormData({ ...formData, gambar_url: base64 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full bg-[#f8f9fa] p-3.5 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition text-sm text-gray-800 font-medium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-4">
      {/* Menggunakan warna UI wireframe (biru/abu-abu) */}
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl flex flex-col max-h-[95vh] animate-fade-in-up">
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-[24px] shrink-0">
          <h2 className="text-lg font-extrabold text-gray-800">
            {initialData ? 'Ubah Berita' : 'Unggah Berita Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto hide-scrollbar">
          {/* AREA UPLOAD GAMBAR (MENGKUTI WIREFRAME) */}
          <div className="relative w-full h-56 sm:h-64 bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer group">
            {formData.gambar_url ? (
              <>
                <img src={formData.gambar_url} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-sm">
                    <FaImage size={20} />
                  </div>
                  <span className="text-white text-xs font-bold tracking-wide">GANTI GAMBAR</span>
                </div>
              </>
            ) : (
              <div className="text-center pointer-events-none flex flex-col items-center">
                {/* Ikon Plus di Tengah persis desain */}
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 transition-transform group-hover:scale-110">
                  <FaPlus size={24} />
                </div>
                <h3 className="text-[15px] font-bold text-gray-700 mb-1.5">
                  Klik atau seret file ke sini
                </h3>
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  PNG, JPG hingga 5MB
                </p>
              </div>
            )}
            {/* Input file sembunyi yang menutupi seluruh area */}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* INPUT FORM */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Judul Berita</label>
            <input
              type="text"
              required
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Contoh: Pengumuman Jadwal Ujian Sekolah..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Kategori</label>
              <select
                className={`${inputClass} cursor-pointer appearance-none`}
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}>
                <option value="Berita">Berita</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Agenda">Agenda</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Status Publikasi</label>
              <select
                className={`${inputClass} cursor-pointer appearance-none`}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Active (Publik)</option>
                <option value="inactive">Inactive (Draft)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Isi Konten</label>
            <textarea
              required
              value={formData.isi_konten}
              onChange={(e) => setFormData({ ...formData, isi_konten: e.target.value })}
              placeholder="Tuliskan isi berita di sini..."
              className={`${inputClass} h-40 resize-none`}></textarea>
          </div>

          {/* Footer Tombol */}
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center min-w-[160px] disabled:opacity-60 shadow-lg shadow-blue-600/20">
              {isSubmitting ? 'Loading...' : initialData ? 'Simpan' : 'Unggah Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormBerita;
