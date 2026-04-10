import React, { useState, useEffect } from 'react';
import { FaTimes, FaImage, FaSave, FaUpload, FaEdit } from 'react-icons/fa';

// Helper: Fungsi untuk mengubah File gambar menjadi Teks Base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); // Mengembalikan string Base64
    reader.onerror = (error) => reject(error);
  });
};

const ModalFormGaleri = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    judul_foto: '',
    deskripsi: '',
    file_url: '', // Kita akan isi ini dengan teks Base64
  });

  const isEditMode = initialData !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          judul_foto: initialData.judul_foto,
          deskripsi: initialData.deskripsi,
          file_url: initialData.file_url,
        });
      } else {
        setFormData({ judul_foto: '', deskripsi: '', file_url: '' });
      }
    }
  }, [isOpen, initialData, isEditMode]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Saat Admin memilih foto dari laptop
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tunggu proses konversi gambar jadi teks
      const base64String = await convertFileToBase64(file);

      // Simpan teks panjang tersebut ke state file_url
      setFormData({ ...formData, file_url: base64String });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // KITA KEMBALI MENGIRIM DATA SEBAGAI JSON BIASA
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up max-h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {isEditMode ? (
              <FaEdit className="text-blue-600" />
            ) : (
              <FaUpload className="text-primary" />
            )}
            {isEditMode ? 'Edit Data Galeri' : 'Unggah Media Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-primary transition">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Visual Preview Gambar */}
          <div className="w-full aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group">
            {formData.file_url ? (
              <>
                <img src={formData.file_url} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-bold text-sm">Klik "Pilih File" untuk mengganti</p>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="bg-white p-3 rounded-full inline-block shadow-sm mb-2 text-primary">
                  <FaImage size={24} />
                </div>
                <p className="text-xs font-bold text-gray-500">Preview Gambar</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Pilih file foto dari perangkat Anda
                </p>
              </div>
            )}
          </div>

          {/* INPUT FILE UNTUK UPLOAD */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Pilih File Foto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!isEditMode}
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Judul Media
            </label>
            <input
              type="text"
              name="judul_foto"
              value={formData.judul_foto}
              onChange={handleChange}
              required
              placeholder="Contoh: Upacara Bendera 17 Agustus"
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Deskripsi Kegiatan
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              placeholder="Ceritakan momen dalam foto ini..."
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none h-24 resize-none transition"></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-red-800 text-white font-bold transition shadow-lg shadow-primary/30 flex items-center gap-2 disabled:opacity-70">
              {isSubmitting ? (
                'Menyimpan...'
              ) : isEditMode ? (
                <>
                  <FaSave /> Simpan
                </>
              ) : (
                <>
                  <FaUpload /> Unggah
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormGaleri;
