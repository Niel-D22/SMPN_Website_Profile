import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { profilApi } from '../../../Api/AdminProfilApi';
import { toast } from 'react-toastify'; // Sesuaikan jika pakai react-hot-toast
import ModalKonfirmasi from '../ModalKonfirmasi';

const FormKeamananAkun = ({ data }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show/hide password states
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Handle perubahan input
  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Toggle show password
  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validasi awal sebelum buka modal
  const handleBukaModal = (e) => {
    e.preventDefault();

    // Validasi apakah password baru dan konfirmasi cocok
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Konfirmasi password baru tidak cocok!');
      return;
    }

    // Jika aman, buka modal
    setIsModalOpen(true);
  };

  // Eksekusi API setelah dikonfirmasi di Modal
  const eksekusiUpdatePassword = async () => {
    setLoading(true);
    try {
      // Kita kirimkan data profil yang lama beserta data password
      // Ini agar query backend tidak meng-update nama/email menjadi NULL
      const res = await profilApi.updateProfile({
        username: data.username,
        email: data.email,
        nama_lengkap: data.nama_lengkap,
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      toast.success(res.message || 'Password berhasil diperbarui!');

      // Kosongkan form setelah sukses ganti password
      setPasswords({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Gagal memperbarui password.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaLock className="text-red-700" /> Keamanan Akun
        </h3>

        <form onSubmit={handleBukaModal} className="space-y-5">
          {/* Tambahan: Input Password Lama (Wajib karena diminta Backend) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showPassword.oldPassword ? 'text' : 'password'}
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handleChange}
                placeholder="Masukkan password Anda saat ini"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition pr-11"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700 focus:outline-none"
                onClick={() => toggleShowPassword('oldPassword')}>
                {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password Baru</label>
            <div className="relative">
              <input
                type={showPassword.newPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                placeholder="Masukkan password baru"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition pr-11"
                required
                minLength="6" // Opsional: minimal karakter
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700 focus:outline-none"
                onClick={() => toggleShowPassword('newPassword')}>
                {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Konfirmasi Password Baru</label>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password baru"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition pr-11"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700 focus:outline-none"
                onClick={() => toggleShowPassword('confirmPassword')}>
                {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-md disabled:bg-gray-400">
              <FaLock /> {loading ? 'Memperbarui...' : 'Perbarui Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Panggil Modal Konfirmasi untuk Keamanan */}
      <ModalKonfirmasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={eksekusiUpdatePassword}
        judul="Ganti Password"
        pesan="Apakah Anda yakin ingin mengganti password akun Anda? Pastikan Anda mengingat password baru Anda."
        teksKonfirmasi="Ya, Ganti Password"
      />
    </>
  );
};

export default FormKeamananAkun;
