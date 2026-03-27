import React, { useState } from 'react';
import { FaLock, FaSchool, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Api/axios';
import toast from 'react-hot-toast';
// import BG from '../../../public/Images/BG.png'; // JANGAN AMBIL BG DARI IMPORT

function ResetPasswordPage() {
  const { token } = useParams(); // Mengambil token dari URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Konfirmasi password tidak cocok!');
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { newPassword });
      toast.success(res.data.message || 'Password berhasil diperbarui!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Link tidak valid atau sudah kadaluarsa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('/Images/BG.png')`,
        backgroundSize: 'cover',
      }}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-red-700 rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
            <FaSchool size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">RESET PASSWORD</h1>
          <p className="text-gray-500 text-center text-sm mt-2">
            Masukkan kata sandi baru untuk akun Admin SMPN 3 Manado
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          {/* Input Password Baru */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Kata Sandi Baru</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-3 rounded-lg font-bold hover:bg-red-800 transition shadow-lg">
            {loading ? 'MEMPROSES...' : 'SIMPAN PASSWORD BARU'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
