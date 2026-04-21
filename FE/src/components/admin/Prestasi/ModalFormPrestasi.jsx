import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import toast from 'react-hot-toast';

export const TINGKAT_OPTIONS = [
  'Nasional',
  'Provinsi',
  'Kabupaten/Kota',
  'Antar Sekolah',
  'Sekolah',
];

const MAX_SIZE_MB = 100;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MAX_FILES = 10;

const emptyForm = {
  nama_lomba: '',
  nama_pemenang: '',
  tingkat: '',
  tahun_meraih: new Date().getFullYear(),
};

const parsePhotos = (fotoData) => {
  if (!fotoData) return [];
  if (Array.isArray(fotoData)) return fotoData;
  if (typeof fotoData === 'string') {
    try {
      return JSON.parse(fotoData);
    } catch {
      return fotoData
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const ModalFormPrestasi = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState(emptyForm);
  const isEditMode = initialData !== null;

  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
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

  const handleMultiFileChange = (e) => {
    const files = Array.from(e.target.files);
    const results = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      error: file.size > MAX_SIZE_BYTES ? `Max ${(file.size / 1024 / 1024).toFixed(1)}MB` : null,
    }));

    setNewPhotos((prev) => {
      const combined = [...prev, ...results];
      const totalAllowed = MAX_FILES - existingPhotos.length;
      if (combined.length > totalAllowed) {
        setGlobalError(`Maksimal total ${MAX_FILES} foto per prestasi.`);
        toast.error(`Maksimal total ${MAX_FILES} foto per prestasi.`);
        return combined.slice(0, totalAllowed);
      }
      setGlobalError('');
      return combined;
    });
    e.target.value = '';
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    setGlobalError('');
  };

  const removeNewPhoto = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    setGlobalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nama_lomba', String(formData.nama_lomba).trim());
    data.append('nama_pemenang', String(formData.nama_pemenang).trim());
    data.append('tingkat', String(formData.tingkat).trim());
    data.append('tahun_meraih', formData.tahun_meraih || new Date().getFullYear());
    data.append('existing_fotos', JSON.stringify(existingPhotos));
    const validNewFiles = newPhotos.filter((f) => !f.error);
    validNewFiles.forEach((f) => data.append('foto', f.file));
    onSave(data);
  };

  const validNewCount = newPhotos.filter((f) => !f.error).length;
  const errorNewCount = newPhotos.filter((f) => f.error).length;
  const totalPhotos = existingPhotos.length + newPhotos.length;

  const inputClass =
    'w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition text-gray-800 text-sm min-h-[44px]';

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="bg-white w-full max-w-xl sm:max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-white rounded-t-2xl sm:rounded-t-3xl shrink-0">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <FaEdit className="text-blue-600" size={16} />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Ubah Prestasi</h2>
              </>
            ) : (
              <>
                <FaTrophy className="text-primary" size={16} />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Catat Prestasi Baru
                </h2>
              </>
            )}
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
          {/* Area Multi Foto */}
          <div className="bg-gray-50/50 p-3 sm:p-4 rounded-2xl border border-gray-100">
            <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              <span>Foto Dokumentasi</span>
              <span className="normal-case font-medium text-gray-400">
                Total: {totalPhotos}/{MAX_FILES}
              </span>
            </label>

            {/* Tombol Pilih Foto */}
            <label
              className={`flex items-center justify-center gap-2 w-full p-3 sm:p-4 rounded-xl border-2 border-dashed cursor-pointer transition min-h-[44px] ${
                totalPhotos >= MAX_FILES
                  ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                  : 'border-primary/30 bg-white hover:bg-primary/5'
              }`}>
              <FaUpload className="text-primary" size={15} />
              <span className="text-sm font-bold text-primary">
                {totalPhotos === 0 ? 'Pilih foto (bisa lebih dari 1)' : 'Tambah foto lagi'}
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
                <FaExclamationTriangle size={11} /> {globalError}
              </div>
            )}

            {/* Grid Preview — 3 kolom di mobile, lebih banyak di desktop */}
            {totalPhotos > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 max-h-44 sm:max-h-52 overflow-y-auto p-1">
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
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg">
                      <FaTrash size={9} />
                    </button>
                  </div>
                ))}
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
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg">
                      <FaTrash size={9} />
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

          {/* Input Fields */}
          <div>
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

          <div>
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

          {/* Tingkat + Tahun — 1 kolom di mobile, 2 kolom di sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2.5 rounded-xl text-sm font-medium">
              <FaCheckCircle size={13} />
              {validNewCount} foto baru siap diunggah.
              {errorNewCount > 0 && (
                <span className="text-orange-600 ml-1">({errorNewCount} error)</span>
              )}
            </div>
          )}

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
              disabled={isSubmitting || errorNewCount > 0}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary hover:bg-red-800 text-white font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-900/20 min-h-[44px]">
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
                  <FaPlus size={13} /> Simpan Prestasi
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

export default ModalFormPrestasi;
