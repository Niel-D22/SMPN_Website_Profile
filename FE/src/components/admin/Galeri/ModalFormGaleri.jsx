import React, { useState, useEffect } from 'react';
import { FaTimes, FaImage, FaSave, FaUpload, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import { mediaUrl } from '../../../config/apiBase';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ModalFormGaleri = ({ isOpen, onClose, onSave, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    judul_foto: '',
    deskripsi: '',
    kategori: 'umum', // ✅ field baru
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
          kategori: initialData.kategori || 'umum', // ✅ ambil dari data existing
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
      setFileError(
        `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal ${MAX_SIZE_MB}MB.`
      );
      setSelectedFile(null);
      e.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP.');
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
    if (fileError) return;
    if (!formData.judul_foto || !formData.deskripsi) return;
    if (!isEditMode && !selectedFile) return;

    const data = new FormData();
    data.append('judul_foto', formData.judul_foto);
    data.append('deskripsi', formData.deskripsi);
    data.append('kategori', formData.kategori); // ✅ kirim ke BE
    if (selectedFile) data.append('foto', selectedFile);

    onSave(data);
  };

  if (!isOpen) return null;

  // Label badge kategori
  const kategoriLabel = {
    umum: { label: 'Umum', color: '#6b7280' },
    fasilitas: { label: 'Fasilitas', color: '#0284c7' },
    ekskul: { label: 'Ekskul', color: 'var(--color-primary, #b91c1c)' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up max-h-full flex flex-col">
        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {isEditMode ? (
              <FaEdit className="text-primary" />
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
          {/* ── Preview Gambar ── */}
          <div className="w-full aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group">
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
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

          {/* ── Input File + Error ── */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {isEditMode ? 'Ganti File Foto (Opsional)' : 'Pilih File Foto'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!isEditMode}
              className={`w-full bg-gray-50 p-3 rounded-xl border focus:bg-white focus:ring-2 focus:ring-primary outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-primary hover:file:bg-red-100 cursor-pointer ${
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

          {/* ── Judul ── */}
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

          {/* ── Kategori ✅ field baru ── */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Kategori
            </label>
            {/* Pilihan dengan button visual supaya lebih jelas */}
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
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                    formData.kategori === opt.value
                      ? 'border-primary bg-red-50 text-primary'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                  }`}>
                  <span className="text-sm font-extrabold leading-tight">{opt.label}</span>
                  <span className="text-[10px] mt-0.5 font-medium opacity-70">{opt.desc}</span>
                </button>
              ))}
            </div>
            {/* Hidden input untuk nilai aktual — tetap terkirim jika perlu */}
            <input type="hidden" name="kategori" value={formData.kategori} />
          </div>

          {/* ── Deskripsi ── */}
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
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary outline-none h-24 resize-none transition"
            />
          </div>

          {/* ── Tombol Aksi ── */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!fileError}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-red-800 text-white font-bold transition shadow-lg shadow-primary/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
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
