import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaEdit, FaSave, FaUserTie, FaImage } from 'react-icons/fa';

// Array pilihan Jabatan
const JABATAN_OPTIONS = [
  'Kepala Sekolah',
  'Wakil Kepala Sekolah',
  'Guru Mata Pelajaran',
  'Guru Bimbingan Konseling',
  'Staf Tata Usaha',
  'Pustakawan',
  'Lainnya',
];

// Helper: Konversi File ke Base64 Teks
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const emptyForm = {
  nama_lengkap: '',
  nip: '',
  jabatan: '',
  mata_pelajaran: '',
  foto_url: '', // Akan diisi teks Base64
};

const ModalFormDirektori = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState(emptyForm);
  const isEditMode = initialData !== null;

  useEffect(() => {
    if (!isOpen) return;
    if (isEditMode && initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm);
    }
  }, [isOpen, initialData, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFormData({ ...formData, foto_url: base64 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Mengirim object JSON biasa (cocok dengan req.body backend)
  };

  const inputClass =
    'w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-700 outline-none transition text-gray-800 text-sm';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <FaEdit className="text-blue-600" size={18} />
            ) : (
              <FaUserTie className="text-red-700" size={18} />
            )}
            <h2 className="text-lg font-bold text-gray-900">
              {isEditMode ? 'Ubah Data Pegawai' : 'Tambah Pegawai Baru'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-red-700 transition">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Foto Profil Upload */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative w-24 h-24 rounded-full border-4 border-gray-100 bg-gray-50 overflow-hidden mb-3 shadow-sm group">
              {formData.foto_url ? (
                <img src={formData.foto_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <FaImage size={30} />
                </div>
              )}
              {/* Overlay Ganti Foto */}
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-[10px] font-bold">Ganti Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-gray-400 text-center">
              Klik area foto untuk mengunggah (Maks 2MB)
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Nama Lengkap & Gelar
            </label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              required
              placeholder="Contoh: Budi Santoso, S.Pd., M.Pd."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                NIP (Nomor Induk)
              </label>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ada"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Jabatan
              </label>
              <select
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                required
                className={`${inputClass} cursor-pointer`}>
                <option value="" disabled>
                  Pilih Jabatan...
                </option>
                {JABATAN_OPTIONS.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Mata Pelajaran yang Diampu
            </label>
            <input
              type="text"
              name="mata_pelajaran"
              value={formData.mata_pelajaran}
              onChange={handleChange}
              placeholder="Contoh: Matematika, IPA (Opsional)"
              className={inputClass}
            />
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold transition flex items-center gap-2 disabled:opacity-60 shadow-md">
              {isSubmitting ? (
                'Menyimpan...'
              ) : isEditMode ? (
                <>
                  <FaSave /> Simpan Perubahan
                </>
              ) : (
                <>
                  <FaPlus /> Tambah Pegawai
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormDirektori;
