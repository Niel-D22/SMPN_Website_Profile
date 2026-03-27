import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaSave } from 'react-icons/fa';
import { profilApi } from '../../../Api/adminProfilApi';
import toast from 'react-hot-toast'; // Sesuaikan jika kamu pakai react-hot-toast
import ModalKonfirmasi from '../ModalKonfirmasi'; // Sesuaikan path-nya

const FormInformasiDasar = ({ data, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  // State untuk mengontrol Modal Konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        nama_lengkap: data.nama_lengkap || '',
        username: data.username || '',
        email: data.email || '',
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi 1: Dipanggil saat tombol Submit form ditekan (Hanya buka modal)
  const handleBukaModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Tampilkan modal konfirmasi
  };

  // Fungsi 2: Dipanggil JIKA user klik "Ya, Simpan" di Modal
  const eksekusiUpdate = async () => {
    setLoading(true);
    try {
      const res = await profilApi.updateProfile({
        username: formData.username,
        email: formData.email,
        nama_lengkap: formData.nama_lengkap,
      });

      if (onUpdateSuccess) {
        onUpdateSuccess({
          ...data,
          ...formData,
        });
      }

      // Tampilkan Toast Sukses
      toast.success(res.message || 'Profil berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Gagal memperbarui profil.';

      // Tampilkan Toast Error
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaUser className="text-red-700" /> Informasi Dasar
        </h3>

        {/* Form memanggil handleBukaModal, bukan langsung API */}
        <form onSubmit={handleBukaModal} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
                required
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Alamat Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition disabled:bg-gray-400">
            <FaSave /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>

      {/* Panggil Modal Konfirmasi di luar kotak putih */}
      <ModalKonfirmasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={eksekusiUpdate}
        judul="Konfirmasi Perubahan"
        pesan="Apakah Anda yakin ingin menyimpan perubahan pada profil ini?"
        teksKonfirmasi="Ya, Simpan"
      />
    </>
  );
};

export default FormInformasiDasar;
