import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaPlus,
  FaEdit,
  FaSave,
  FaTrophy,
  FaUpload,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { mediaUrl } from '../../../config/apiBase';

export const TINGKAT_OPTIONS = [
  'Nasional',
  'Provinsi',
  'Kabupaten/Kota',
  'Antar Sekolah',
  'Sekolah',
];

const MAX_SIZE_MB = 100;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MAX_FILES = 10; // Batas maksimal foto dalam 1 prestasi

const emptyForm = {
  nama_lomba: '',
  nama_pemenang: '',
  tingkat: '',
  tahun_meraih: new Date().getFullYear(),
};

// Helper: Mengubah data foto_url dari database (string) menjadi Array
const parsePhotos = (fotoData) => {
  if (!fotoData) return [];
  if (Array.isArray(fotoData)) return fotoData;
  if (typeof fotoData === 'string') {
    try {
      return JSON.parse(fotoData); // Jika di-database tersimpan sebagai JSON Array
    } catch {
      return fotoData
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean); // Jika tersimpan pakai koma
    }
  }
  return [];
};

const ModalFormPrestasi = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState(emptyForm);
  const isEditMode = initialData !== null;

  // --- STATE UNTUK MULTI FOTO (BERLAKU UNTUK TAMBAH & EDIT) ---
  const [existingPhotos, setExistingPhotos] = useState([]); // Foto lama dari database
  const [newPhotos, setNewPhotos] = useState([]); // Foto baru dari input file
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && initialData) {
      setFormData({
        nama_lomba: initialData.nama_lomba ?? '',
        nama_pemenang: initialData.nama_pemenang ?? '',
        tingkat: initialData.tingkat ?? '',
        tahun_meraih: initialData.tahun_meraih ?? new Date().getFullYear(),
      });
      // Masukkan foto lama ke dalam state existingPhotos
      setExistingPhotos(parsePhotos(initialData.foto_url));
    } else {
      setFormData({ ...emptyForm, tahun_meraih: new Date().getFullYear() });
      setExistingPhotos([]);
    }

    setNewPhotos([]);
    setGlobalError('');
  }, [isOpen, initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tahun_meraih' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  // --- HANDLER: PILIH FOTO BARU ---
  const handleMultiFileChange = (e) => {
    const files = Array.from(e.target.files);

    const results = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      error: file.size > MAX_SIZE_BYTES ? `Max ${(file.size / 1024 / 1024).toFixed(1)}MB` : null,
    }));

    setNewPhotos((prev) => {
      const combined = [...prev, ...results];
      // Cek apakah total (Lama + Baru) melebihi batas
      const totalAllowed = MAX_FILES - existingPhotos.length;

      if (combined.length > totalAllowed) {
        setGlobalError(`Maksimal total ${MAX_FILES} foto per prestasi.`);
        return combined.slice(0, totalAllowed);
      }

      setGlobalError('');
      return combined;
    });

    e.target.value = ''; // Reset input agar bisa pilih file yang sama lagi jika dihapus
  };

  // --- HANDLER: HAPUS FOTO ---
  const removeExistingPhoto = (index) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    setGlobalError('');
  };

  const removeNewPhoto = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    setGlobalError('');
  };

  // --- HANDLER: SUBMIT FORM ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nama_lomba', String(formData.nama_lomba).trim());
    data.append('nama_pemenang', String(formData.nama_pemenang).trim());
    data.append('tingkat', String(formData.tingkat).trim());
    data.append('tahun_meraih', formData.tahun_meraih || new Date().getFullYear());

    // 1. Kirim array foto lama yang TIDAK DIHAPUS
    data.append('existing_fotos', JSON.stringify(existingPhotos));

    // 2. Kirim foto-foto BARU yang ditambahkan
    const validNewFiles = newPhotos.filter((f) => !f.error);
    validNewFiles.forEach((f) => {
      data.append('foto', f.file); // NAMA INI HARUS SAMA DENGAN UPLOAD.ARRAY('foto') DI BACKEND
    });

    onSave(data);
  };

  const validNewCount = newPhotos.filter((f) => !f.error).length;
  const errorNewCount = newPhotos.filter((f) => f.error).length;
  const totalPhotos = existingPhotos.length + newPhotos.length;

  const inputClass =
    'w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition text-gray-800';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-white shrink-0">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <FaEdit className="text-blue-600" size={18} />
                <h2 className="text-lg font-bold text-gray-900">Ubah Prestasi</h2>
              </>
            ) : (
              <>
                <FaTrophy className="text-primary" size={18} />
                <h2 className="text-lg font-bold text-gray-900">Catat Prestasi Baru</h2>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-primary transition p-1 rounded-lg hover:bg-gray-100">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* ===== AREA MULTI FOTO (TAMBAH & EDIT DIGABUNG DISINI) ===== */}
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              <span>Foto Dokumentasi</span>
              <span className="normal-case font-medium text-gray-400">
                Total: {totalPhotos}/{MAX_FILES}
              </span>
            </label>

            {/* Tombol Pilih Foto */}
            <label
              className={`flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-dashed cursor-pointer transition ${totalPhotos >= MAX_FILES ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60' : 'border-primary/30 bg-white hover:bg-primary/5'}`}>
              <FaUpload className="text-primary" size={18} />
              <span className="text-sm font-bold text-primary">
                {totalPhotos === 0 ? 'Pilih foto (Bisa lebih dari 1)' : `Tambah foto lagi`}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultiFileChange}
                className="hidden"
                disabled={totalPhotos >= MAX_FILES}
              />
            </label>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Format: JPG, PNG. Maks {MAX_SIZE_MB}MB per foto.
            </p>

            {globalError && (
              <div className="mt-3 flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs font-medium border border-red-100">
                <FaExclamationTriangle size={12} /> {globalError}
              </div>
            )}

            {/* GRID PREVIEW FOTO (Menampilkan Foto Lama & Baru) */}
            {totalPhotos > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-48 overflow-y-auto p-1">
                {/* 1. Render Foto LAMA (Dari Database) */}
                {existingPhotos.map((url, index) => (
                  <div
                    key={`old-${index}`}
                    className="relative group aspect-square rounded-xl overflow-hidden border-2 border-blue-300 shadow-sm">
                    <img src={mediaUrl(url)} alt="Lama" className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      LAMA
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg"
                      title="Hapus foto lama">
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}

                {/* 2. Render Foto BARU (Yang baru dipilih) */}
                {newPhotos.map((item, index) => (
                  <div
                    key={`new-${index}`}
                    className={`relative group aspect-square rounded-xl overflow-hidden border-2 shadow-sm ${item.error ? 'border-red-400' : 'border-green-400'}`}>
                    <img
                      src={item.previewUrl}
                      alt="Baru"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div
                      className={`absolute top-1 left-1 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow ${item.error ? 'bg-red-500' : 'bg-green-500'}`}>
                      BARU
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg"
                      title="Batal upload">
                      <FaTrash size={10} />
                    </button>
                    {item.error && (
                      <div className="absolute inset-x-0 bottom-0 bg-red-600 text-white text-[9px] text-center py-1 font-bold truncate px-1">
                        {item.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Nama Lomba / Kegiatan
              </label>
              <input
                type="text"
                name="nama_lomba"
                value={formData.nama_lomba}
                onChange={handleChange}
                placeholder="Contoh: Olimpiade Matematika tingkat provinsi"
                className={inputClass}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Nama Pemenang / Perwakilan
              </label>
              <input
                type="text"
                name="nama_pemenang"
                value={formData.nama_pemenang}
                onChange={handleChange}
                placeholder="Nama siswa atau tim"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Tingkat
              </label>
              <select
                name="tingkat"
                value={formData.tingkat}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
                required>
                <option value="" disabled>
                  Pilih tingkat
                </option>
                {TINGKAT_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Tahun Diraih
              </label>
              <input
                type="number"
                name="tahun_meraih"
                value={formData.tahun_meraih}
                onChange={handleChange}
                min={1990}
                max={2035}
                className={inputClass}
                required
              />
            </div>
          </div>

          {validNewCount > 0 && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-medium">
              <FaCheckCircle size={13} />
              {validNewCount} foto baru siap diunggah.
              {errorNewCount > 0 && (
                <span className="text-orange-600 ml-1">({errorNewCount} error)</span>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || errorNewCount > 0}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-red-800 text-white font-bold transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-900/20">
              {isSubmitting ? (
                <span>Menyimpan...</span>
              ) : isEditMode ? (
                <>
                  <FaSave size={14} /> Simpan Perubahan
                </>
              ) : (
                <>
                  <FaPlus size={14} /> Simpan Prestasi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormPrestasi;
