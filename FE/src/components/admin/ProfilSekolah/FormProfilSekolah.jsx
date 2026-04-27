import React, { useRef } from 'react';
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
} from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import { formatWaktuWITA } from '../../../../utils/formatWaktu';

const FormProfilSekolah = ({ formData, handleChange, handleImageChange }) => {
  const fileInputRef = useRef(null);

  // --- STYLE STANDAR PROFIL ADMIN ---
  const inputClass =
    'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition text-gray-800 placeholder-gray-400';
  const labelClass = 'text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2';
  const iconColor = 'text-red-700';

  // Style khusus untuk input statistik (angka penting)
  const statInputClass =
    'w-full px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition text-gray-800 placeholder-gray-400 text-center font-bold';

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      {/* Header Kotak */}
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
          {/* Terakhir Diperbarui */}
          {formData.updated_at && (
            <div className="flex items-center gap-2 text-[10px] text-gray-400  rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-700 mt-1">
                <FaClock size={9} />
                <span>Diperbarui: {formatWaktuWITA(formData.updated_at)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Utama: 3 Kolom untuk Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-6">
        {/* ============================== */}
        {/* BARIS 1: Identitas Sekolah     */}
        {/* ============================== */}

        {/* Kolom 1: Upload Logo */}
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

        {/* Kolom 2: Nama, NPSN, Akreditasi */}
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

          {/* NPSN & Akreditasi */}
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

        {/* Kolom 3: Visi */}
        <div className="flex flex-col h-full">
          <label className={labelClass}>Visi</label>
          <textarea
            name="visi"
            value={formData?.visi || ''}
            onChange={handleChange}
            className={`${inputClass} h-full min-h-[9rem] resize-none`}
            placeholder="Tulis visi sekolah di sini..."></textarea>
        </div>

        {/* ============================== */}
        {/* BARIS 2: Kontak & Misi        */}
        {/* ============================== */}

        {/* Kolom 1: Alamat Lengkap */}
        <div className="flex flex-col h-full">
          <label className={labelClass}>
            <FaMapMarkerAlt className={iconColor} /> Alamat Lengkap
          </label>
          <textarea
            name="alamat"
            value={formData?.alamat || ''}
            onChange={handleChange}
            className={`${inputClass} h-full min-h-[8rem] resize-none`}
            placeholder="Tulis alamat sekolah lengkap di sini..."></textarea>
        </div>

        {/* Kolom 2: Telepon & Email */}
        <div className="flex flex-col justify-start gap-5 h-full">
          <div>
            <label className={labelClass}>
              <FaPhoneAlt className={iconColor} /> Telepon Kantor
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
              <FaEnvelope className={iconColor} /> Email Resmi
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

        {/* Kolom 3: Misi */}
        <div className="flex flex-col h-full">
          <label className={labelClass}>
            <FaBook className={iconColor} /> Misi
          </label>
          <textarea
            name="misi"
            value={formData?.misi || ''}
            onChange={handleChange}
            className={`${inputClass} h-full min-h-[8rem] resize-none`}
            placeholder="Tulis misi sekolah di sini..."></textarea>
        </div>

        {/* ====================================== */}
        {/* BARIS 3: Statistik — Grup Data Penting */}
        {/* ====================================== */}
        <div className="col-span-1 lg:col-span-3 border-t border-gray-100 pt-5">
          {/* Tiga kolom statistik yang seimbang */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Jumlah Siswa */}
            <div>
              <label className={labelClass}>
                <FaUsers className={iconColor} /> Total Siswa Aktif
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

            {/* Jumlah Guru — BARU */}
            <div>
              <label className={labelClass}>
                <FaChalkboardTeacher className={iconColor} /> Total Tenaga Pengajar
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

            {/* Jumlah Kelas — BARU */}
            <div>
              <label className={labelClass}>
                <FaDoorOpen className={iconColor} /> Total Ruang Kelas
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

        {/* ============================================= */}
        {/* BARIS 4: Sambutan Kepala Sekolah — BARU      */}
        {/* ============================================= */}
        <div className="col-span-1 lg:col-span-3 border-t border-gray-100 pt-5">
          <label className={labelClass}>
            <FaMicrophone className={iconColor} /> Sambutan Kepala Sekolah
          </label>
          <textarea
            name="sambutan_kepsek"
            value={formData?.sambutan_kepsek || ''}
            onChange={handleChange}
            className={`${inputClass} min-h-[10rem] resize-y`}
            placeholder="Tulis sambutan atau pesan dari Kepala Sekolah di sini..."></textarea>
        </div>

        {/* ============================== */}
        {/* BARIS 5: Sejarah Sekolah       */}
        {/* ============================== */}
        <div className="col-span-1 lg:col-span-3 border-t border-gray-100 pt-5">
          <label className={labelClass}>
            <FaHistory className={iconColor} /> Sejarah Sekolah
          </label>
          <textarea
            name="sejarah"
            value={formData?.sejarah || ''}
            onChange={handleChange}
            className={`${inputClass} h-32 resize-none`}
            placeholder="Ceritakan sejarah berdirinya sekolah..."></textarea>
        </div>
      </div>
    </div>
  );
};

export default FormProfilSekolah;
