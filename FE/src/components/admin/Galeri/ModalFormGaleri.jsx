import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaImage, FaSave, FaUpload, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import { mediaUrl } from '../../../config/apiBase';
import toast from 'react-hot-toast';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ModalFormGaleri = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    judul_foto: '',
    deskripsi: '',
    kategori: 'umum',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileError, setFileError] = useState('');

  const isEditMode = initialData !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setFormData({
          judul_foto: initialData.judul_foto || '',
          deskripsi: initialData.deskripsi || '',
          kategori: initialData.kategori || 'umum',
        });
        setPreviewUrl(initialData.file_url ? mediaUrl(initialData.file_url) : '');
      } else {
        setFormData({ judul_foto: '', deskripsi: '', kategori: 'umum' });
        setPreviewUrl('');
      }
      setSelectedFile(null);
      setFileError('');
    }
  }, [isOpen, initialData, isEditMode]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      const msg = `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maks ${MAX_SIZE_MB}MB.`;
      setFileError(msg);
      toast.error(msg);
      setSelectedFile(null);
      e.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      const msg = 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP.';
      setFileError(msg);
      toast.error(msg);
      setSelectedFile(null);
      e.target.value = '';
      return;
    }

    setFileError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileError) {
      toast.error(fileError);
      return;
    }
    if (!formData.judul_foto || !formData.deskripsi) {
      toast.error('Judul dan deskripsi wajib diisi.');
      return;
    }
    if (!isEditMode && !selectedFile) {
      toast.error('File foto wajib dipilih.');
      return;
    }

    const data = new FormData();
    data.append('judul_foto', formData.judul_foto);
    data.append('deskripsi', formData.deskripsi);
    data.append('kategori', formData.kategori);
    if (selectedFile) data.append('foto', selectedFile);
    onSave(data);
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition text-sm min-h-[44px]';

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="bg-white w-full max-w-md sm:max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl sm:rounded-t-3xl shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            {isEditMode ? (
              <>
                <FaEdit className="text-primary" size={15} /> Edit Data Galeri
              </>
            ) : (
              <>
                <FaUpload className="text-primary" size={15} /> Unggah Media Baru
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            type="button"
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
          {/* Preview Gambar */}
          <div className="w-full aspect-video bg-gray-50 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group">
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-bold text-xs sm:text-sm px-2 text-center">
                    Klik "Pilih File" untuk mengganti
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="bg-white p-3 rounded-full inline-block shadow-sm mb-2 text-primary">
                  <FaImage size={24} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-500">Preview Gambar</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Pilih file foto dari perangkat Anda
                </p>
              </div>
            )}
          </div>

          {/* Input File */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              {isEditMode ? 'Ganti File Foto (Opsional)' : 'Pilih File Foto'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!isEditMode}
              className={`w-full bg-gray-50 text-sm file:text-xs p-2 sm:p-3 rounded-xl border focus:bg-white focus:ring-2 focus:ring-primary outline-none transition file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:font-semibold file:bg-red-50 file:text-primary hover:file:bg-red-100 cursor-pointer min-h-[44px] ${
                fileError ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {fileError ? (
              <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-medium">
                <FaExclamationTriangle className="mt-0.5 shrink-0" size={12} />
                <span>{fileError}</span>
              </div>
            ) : (
              <p className="text-[10px] text-gray-400 mt-1">
                Format: JPG, PNG, GIF, WEBP. Maks {MAX_SIZE_MB}MB.
                {selectedFile && (
                  <span className="ml-2 text-green-600 font-semibold">
                    ✓ {(selectedFile.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Judul */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Judul Media
            </label>
            <input
              type="text"
              name="judul_foto"
              value={formData.judul_foto}
              onChange={handleChange}
              required
              placeholder="Contoh: Upacara Bendera 17 Agustus"
              className={inputClass}
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Kategori
            </label>
            {/* ✅ 3 kolom di semua ukuran layar — tombol pendek, cocok di mobile */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'umum', label: 'Umum', desc: 'Kegiatan umum' },
                { value: 'fasilitas', label: 'Fasilitas', desc: 'Sarana & prasarana' },
                { value: 'ekskul', label: 'Ekskul', desc: 'Ekstrakurikuler' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, kategori: opt.value }))}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border-2 text-center transition-all min-h-[44px] ${
                    formData.kategori === opt.value
                      ? 'border-primary bg-red-50 text-primary'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                  }`}>
                  <span className="text-xs sm:text-sm font-extrabold leading-tight">
                    {opt.label}
                  </span>
                  <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium opacity-70 hidden sm:block">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Deskripsi Kegiatan
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              placeholder="Ceritakan momen dalam foto ini..."
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none h-20 sm:h-24 resize-none transition text-sm"
            />
          </div>

          {/* Footer Tombol */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition min-h-[44px]">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!fileError}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary hover:bg-red-800 text-white font-bold transition shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-h-[44px]">
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
                  <FaSave size={13} /> Simpan
                </>
              ) : (
                <>
                  <FaUpload size={13} /> Unggah
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

export default ModalFormGaleri;
