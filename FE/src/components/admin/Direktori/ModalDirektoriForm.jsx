import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaPlus, FaEdit, FaSave, FaUserTie, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';

const JABATAN_OPTIONS = [
  'Kepala Sekolah',
  'Wakil Kepala Sekolah',
  'Guru Mata Pelajaran',
  'Guru Bimbingan Konseling',
  'Staf Tata Usaha',
  'Pustakawan',
  'Lainnya',
];
// Taruh di luar komponen — config field per jabatan
const FIELD_CONFIG = {
  'Guru Mata Pelajaran': {
    label: 'Mata Pelajaran yang Diampu',
    placeholder: 'Contoh: Matematika, IPA, Bahasa Indonesia',
    suggestions: [
      'Matematika',
      'IPA',
      'IPS',
      'Bahasa Indonesia',
      'Bahasa Inggris',
      'PKN',
      'Agama',
      'Seni Budaya',
      'PJOK',
      'Prakarya',
      'TIK',
    ],
  },
  'Guru Bimbingan Konseling': {
    label: 'Spesialisasi',
    placeholder: 'Contoh: Konseling Individu, Karir',
    suggestions: ['Konseling Individu', 'Konseling Karir', 'Konseling Kelompok'],
  },
  'Wakil Kepala Sekolah': {
    label: 'Bidang',
    placeholder: 'Contoh: Kurikulum',
    suggestions: ['Kurikulum', 'Kesiswaan', 'Sarana & Prasarana', 'Hubungan Masyarakat'],
  },
  'Kepala Sekolah': {
    label: 'Periode Jabatan',
    placeholder: 'Contoh: 2022 - Sekarang',
    suggestions: [],
  },
  'Staf Tata Usaha': {
    label: 'Bidang Tugas',
    placeholder: 'Contoh: Administrasi, Keuangan',
    suggestions: ['Administrasi', 'Keuangan', 'Kepegawaian', 'Persuratan'],
  },
};

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
  foto_url: '',
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
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran foto terlalu besar! Maksimal 2MB.');
      return;
    }

    const base64 = await convertToBase64(file);
    setFormData({ ...formData, foto_url: base64 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-700 outline-none transition text-gray-800 text-sm min-h-[44px]';

  // ✅ createPortal — render langsung ke document.body
  // sehingga tidak terpengaruh CSS/transform dari parent manapun
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
              <FaEdit className="text-blue-600" size={16} />
            ) : (
              <FaUserTie className="text-red-700" size={16} />
            )}
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {isEditMode ? 'Ubah Data Pegawai' : 'Tambah Pegawai Baru'}
            </h2>
          </div>
          {/* ✅ Touch target 44px */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-700 hover:bg-red-50 transition"
            aria-label="Tutup modal">
            <FaTimes size={17} />
          </button>
        </div>

        {/* Body — scrollable */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Foto Profil */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-100 bg-gray-50 overflow-hidden shadow-sm group">
              {formData.foto_url ? (
                <img src={formData.foto_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <FaImage size={26} />
                </div>
              )}
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-[10px] font-bold text-center px-1">
                  Ganti Foto
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Klik area foto untuk mengunggah (Maks 2MB)
            </p>
          </div>

          {/* Nama Lengkap */}
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

          {/* NIP + Jabatan — 1 kolom di mobile, 2 kolom di sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

          {/* Mata Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              {/* Field Dinamis */}
              {(() => {
                const config = FIELD_CONFIG[formData.jabatan];
                if (!config) return null; // Pustakawan & jabatan lain — sembunyikan

                return (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      {config.label}
                    </label>

                    {/* Input bebas ketik */}
                    <input
                      type="text"
                      name="mata_pelajaran"
                      value={formData.mata_pelajaran}
                      onChange={handleChange}
                      placeholder={config.placeholder}
                      className={inputClass}
                    />

                    {/* Suggestions / Pilihan Cepat */}
                    {config.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {config.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              // Kalau sudah ada isi, tambahkan dengan koma
                              const current = formData.mata_pelajaran.trim();
                              const newVal = current
                                ? current.endsWith(',')
                                  ? `${current} ${s}`
                                  : `${current}, ${s}`
                                : s;
                              setFormData({ ...formData, mata_pelajaran: newVal });
                            }}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-100 transition">
                            + {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </label>
          </div>

          {/* Footer Tombol */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition min-h-[44px]">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-md min-h-[44px]">
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
                  <FaPlus size={13} /> Tambah Pegawai
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body // ✅ Portal ke body — bebas dari stacking context parent
  );
};

export default ModalFormDirektori;
