import React, { useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  FaImage,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUniversity,
  FaBook,
  FaHistory,
  FaUsers,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaMicrophone,
  FaFilePdf,
  FaDownload,
  FaUpload,
  FaClock,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaAward,
} from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import toast from 'react-hot-toast';
import { profilSekolahApi } from '../../../Api/profilSekolahApi';
import { formatWaktuWITA } from '../../../../utils/formatWaktu';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ── Modal PDF/Image Viewer ──────────────────────────────────────────────────
const PdfViewerModal = ({ url, title, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(false);

  const isPdf = url?.toLowerCase().includes('.pdf');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <FaFilePdf className="text-red-700" size={14} />
            <p className="text-sm font-bold text-gray-800 truncate max-w-sm">
              {title || 'Pratinjau Dokumen'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 px-3 py-1.5 border border-red-200 rounded-lg transition">
              <FaDownload size={10} />
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition">
              <FaTimes size={12} />
            </button>
          </div>
        </div>

        {/* Konten */}
        <div className="flex-1 overflow-auto bg-gray-100 flex flex-col items-center py-4 px-2">
          {!isPdf ? (
            <img
              src={url}
              alt={title || 'Dokumen'}
              className="max-w-full max-h-full object-contain rounded-lg shadow"
            />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
              <FaFilePdf size={40} className="text-gray-300" />
              <p className="text-sm font-semibold">Gagal memuat PDF</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-700 underline">
                Buka di tab baru
              </a>
            </div>
          ) : (
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => setError(true)}
              loading={
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-red-200 border-t-red-700 rounded-full animate-spin" />
                </div>
              }>
              <Page
                pageNumber={pageNumber}
                width={Math.min(window.innerWidth * 0.8, 800)}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          )}
        </div>

        {isPdf && numPages && numPages > 1 && (
          <div className="flex items-center justify-center gap-4 px-5 py-3 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
              disabled={pageNumber <= 1}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition">
              <FaChevronLeft size={11} />
            </button>
            <span className="text-xs text-gray-600 font-medium">
              Halaman {pageNumber} dari {numPages}
            </span>
            <button
              type="button"
              onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
              disabled={pageNumber >= numPages}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition">
              <FaChevronRight size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Komponen Utama ──────────────────────────────────────────────────────────
const FormProfilSekolah = ({ formData, handleChange, handleImageChange }) => {
  const fileInputRef = useRef(null);

  const [isUploadingKurikulum, setIsUploadingKurikulum] = useState(false);
  const [isUploadingAkreditasi, setIsUploadingAkreditasi] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAkreditasiModal, setShowAkreditasiModal] = useState(false);

  const handleKurikulumUpload = async (file) => {
    try {
      setIsUploadingKurikulum(true);
      const response = await profilSekolahApi.uploadKurikulum(file, formData?.deskripsi_kurikulum);
      toast.success('Kurikulum berhasil diupload');
      handleChange({ target: { name: 'kurikulum_url', value: response.data.kurikulum_url } });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Upload kurikulum gagal');
    } finally {
      setIsUploadingKurikulum(false);
    }
  };

  const handleAkreditasiUpload = async (file) => {
    try {
      setIsUploadingAkreditasi(true);
      const response = await profilSekolahApi.uploadAkreditasi(
        file,
        formData?.deskripsi_akreditasi
      );
      toast.success('Sertifikat akreditasi berhasil diupload');
      handleChange({
        target: {
          name: 'sertifikat_akreditasi_url',
          value: response.data.sertifikat_akreditasi_url,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Upload akreditasi gagal');
    } finally {
      setIsUploadingAkreditasi(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition text-gray-800 placeholder-gray-400';
  const labelClass = 'text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2';
  const iconColor = 'text-red-700';
  const statInputClass =
    'w-full px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition text-gray-800 placeholder-gray-400 text-center font-bold';

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 justify-between">
        <div className="flex gap-5">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shadow-inner">
            <FaUniversity className="text-red-700 text-xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
            INFORMASI DATA SEKOLAH
          </h2>
        </div>
        <div>
          {formData.updated_at && (
            <div className="flex items-center gap-2 text-[10px] text-gray-400 rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-700 mt-1">
                <FaClock size={9} />
                <span>Diperbarui: {formatWaktuWITA(formData.updated_at)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-6">
        {/* Logo */}
        <div className="h-44 flex flex-col items-center">
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition overflow-hidden border-2 border-dashed border-gray-300 hover:border-red-500 group"
            title="Klik untuk upload logo sekolah">
            {formData?.logo_url ? (
              <img
                src={formData.logo_url}
                alt="Logo"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center">
                <FaImage className="text-gray-400 group-hover:text-red-500 text-4xl mb-2 transition" />
                <span className="text-sm text-gray-500 group-hover:text-red-600 font-medium">
                  Pilih Logo
                </span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Nama, NPSN, Akreditasi */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nama Resmi Sekolah</label>
            <input
              type="text"
              name="nama_sekolah"
              value={formData?.nama_sekolah || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="Contoh: SMP Negeri 3 Manado"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>NPSN</label>
              <input
                type="text"
                name="npsn"
                value={formData?.npsn || ''}
                onChange={handleChange}
                className={inputClass}
                placeholder="NPSN"
              />
            </div>
            <div>
              <label className={labelClass}>Akreditasi</label>
              <input
                type="text"
                name="akreditas"
                value={formData?.akreditas || ''}
                onChange={handleChange}
                className={inputClass}
                placeholder="A / B / C"
              />
            </div>
          </div>
        </div>

        {/* Visi */}
        <div className="flex flex-col h-full">
          <label className={labelClass}>Visi</label>
          <textarea
            name="visi"
            value={formData?.visi || ''}
            onChange={handleChange}
            className={`${inputClass} h-full min-h-[9rem] resize-none`}
            placeholder="Tulis visi sekolah di sini..."
          />
        </div>

        {/* Alamat */}
        <div className="flex flex-col h-full">
          <label className={labelClass}>
            <FaMapMarkerAlt className={iconColor} />
            Alamat Lengkap
          </label>
          <textarea
            name="alamat"
            value={formData?.alamat || ''}
            onChange={handleChange}
            className={`${inputClass} h-full min-h-[8rem] resize-none`}
            placeholder="Tulis alamat sekolah lengkap di sini..."
          />
        </div>

        {/* Telepon & Email */}
        <div className="flex flex-col justify-start gap-5 h-full">
          <div>
            <label className={labelClass}>
              <FaPhoneAlt className={iconColor} />
              Telepon Kantor
            </label>
            <input
              type="text"
              name="no_telepon"
              value={formData?.no_telepon || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="(0431) 123456"
            />
          </div>
          <div>
            <label className={labelClass}>
              <FaEnvelope className={iconColor} />
              Email Resmi
            </label>
            <input
              type="email"
              name="email_sekolah"
              value={formData?.email_sekolah || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="admin@sekolah.com"
            />
          </div>
        </div>

        {/* Misi */}
        <div className="flex flex-col h-full">
          <label className={labelClass}>
            <FaBook className={iconColor} />
            Misi
          </label>
          <textarea
            name="misi"
            value={formData?.misi || ''}
            onChange={handleChange}
            className={`${inputClass} h-full min-h-[8rem] resize-none`}
            placeholder="Tulis misi sekolah di sini..."
          />
        </div>

        {/* Statistik */}
        <div className="col-span-1 lg:col-span-3 border-t border-gray-100 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>
                <FaUsers className={iconColor} />
                Total Siswa Aktif
              </label>
              <input
                type="number"
                name="jumlah_siswa"
                value={formData?.jumlah_siswa || ''}
                onChange={handleChange}
                className={statInputClass}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>
                <FaChalkboardTeacher className={iconColor} />
                Total Tenaga Pengajar
              </label>
              <input
                type="number"
                name="jumlah_guru"
                value={formData?.jumlah_guru || ''}
                onChange={handleChange}
                className={statInputClass}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>
                <FaDoorOpen className={iconColor} />
                Total Ruang Kelas
              </label>
              <input
                type="number"
                name="jumlah_kelas"
                value={formData?.jumlah_kelas || ''}
                onChange={handleChange}
                className={statInputClass}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Sambutan Kepsek */}
        <div className="col-span-1 lg:col-span-3 border-t border-gray-100 pt-5">
          <label className={labelClass}>
            <FaMicrophone className={iconColor} />
            Sambutan Kepala Sekolah
          </label>
          <textarea
            name="sambutan_kepsek"
            value={formData?.sambutan_kepsek || ''}
            onChange={handleChange}
            className={`${inputClass} min-h-[10rem] resize-y`}
            placeholder="Tulis sambutan atau pesan dari Kepala Sekolah di sini..."
          />
        </div>

        {/* Sejarah */}
        <div className="col-span-1 lg:col-span-3 border-t border-gray-100 pt-5">
          <label className={labelClass}>
            <FaHistory className={iconColor} />
            Sejarah Sekolah
          </label>
          <textarea
            name="sejarah"
            value={formData?.sejarah || ''}
            onChange={handleChange}
            className={`${inputClass} h-32 resize-none`}
            placeholder="Ceritakan sejarah berdirinya sekolah..."
          />
        </div>

        {/* Kurikulum */}
        <div className="col-span-1 lg:col-span-3 border-t border-gray-100 pt-5">
          <label className={labelClass}>
            <FaFilePdf className={iconColor} />
            Kurikulum Sekolah
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <textarea
                name="deskripsi_kurikulum"
                value={formData?.deskripsi_kurikulum || ''}
                onChange={handleChange}
                className={`${inputClass} h-24 resize-none`}
                placeholder="Contoh: Kurikulum Merdeka Belajar Tahun 2024/2025..."
              />
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="kurikulum-upload"
                className={`group relative overflow-hidden flex flex-col items-center justify-center gap-2 px-6 py-6 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  isUploadingKurikulum
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-red-200 hover:border-red-500 hover:bg-red-50 cursor-pointer'
                }`}>
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-105 transition">
                  <FaUpload className="text-red-700 text-xl" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800">
                    {isUploadingKurikulum ? 'Mengupload file...' : 'Upload File Kurikulum'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG • Maksimal 10MB</p>
                </div>
                <input
                  id="kurikulum-upload"
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  disabled={isUploadingKurikulum}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleKurikulumUpload(file);
                  }}
                />
              </label>

              {formData?.kurikulum_url && (
                <div className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-red-200 transition">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange({ target: { name: 'kurikulum_url', value: '' } });
                      toast.success('File kurikulum dihapus');
                    }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition">
                    <FaTimes size={11} />
                  </button>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                      <FaFilePdf className="text-red-700 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        File Kurikulum Aktif
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {formData?.deskripsi_kurikulum ||
                          'Dokumen kurikulum sekolah telah diupload'}
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setShowPdfModal(true)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800 transition">
                          <FaEye size={12} />
                          Pratinjau
                        </button>
                        <a
                          href={formData.kurikulum_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
                          <FaDownload size={12} />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── SERTIFIKAT AKREDITASI ── */}
        <div className="col-span-1 lg:col-span-3 border-t border-gray-100 pt-5">
          <label className={labelClass}>
            <FaAward className={iconColor} />
            Sertifikat Akreditasi
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <textarea
                name="deskripsi_akreditasi"
                value={formData?.deskripsi_akreditasi || ''}
                onChange={handleChange}
                className={`${inputClass} h-24 resize-none`}
                placeholder="Contoh: Sertifikat Akreditasi A — BAN-S/M Tahun 2024..."
              />
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="akreditasi-upload"
                className={`group relative overflow-hidden flex flex-col items-center justify-center gap-2 px-6 py-6 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  isUploadingAkreditasi
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-red-200 hover:border-red-500 hover:bg-red-50 cursor-pointer'
                }`}>
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-105 transition">
                  <FaUpload className="text-red-700 text-xl" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800">
                    {isUploadingAkreditasi ? 'Mengupload file...' : 'Upload Sertifikat Akreditasi'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG • Maksimal 10MB</p>
                </div>
                <input
                  id="akreditasi-upload"
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  disabled={isUploadingAkreditasi}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleAkreditasiUpload(file);
                  }}
                />
              </label>

              {formData?.sertifikat_akreditasi_url && (
                <div className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-red-200 transition">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange({ target: { name: 'sertifikat_akreditasi_url', value: '' } });
                      toast.success('Sertifikat akreditasi dihapus');
                    }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition">
                    <FaTimes size={11} />
                  </button>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                      <FaAward className="text-red-700 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        Sertifikat Akreditasi Aktif
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {formData?.deskripsi_akreditasi ||
                          'Sertifikat akreditasi sekolah telah diupload'}
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setShowAkreditasiModal(true)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800 transition">
                          <FaEye size={12} />
                          Pratinjau
                        </button>
                        <a
                          href={formData.sertifikat_akreditasi_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
                          <FaDownload size={12} />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Kurikulum */}
      {showPdfModal && (
        <PdfViewerModal
          url={formData.kurikulum_url}
          title={formData.deskripsi_kurikulum}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {/* Modal Akreditasi */}
      {showAkreditasiModal && (
        <PdfViewerModal
          url={formData.sertifikat_akreditasi_url}
          title={formData.deskripsi_akreditasi}
          onClose={() => setShowAkreditasiModal(false)}
        />
      )}
    </div>
  );
};

export default FormProfilSekolah;
