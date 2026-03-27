import React, { useState } from 'react';
import { FaUser, FaLock, FaSchool } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../Api/axios'; // Pastikan path axios sudah benar
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth', { username, password });

      // Simpan data ke localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('admin_nama', res.data.nama);

      toast.success('Login Berhasil!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login Gagal, periksa koneksi anda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('/Images/BG.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f3f4f6',
      }}>
      <div className="absolute inset-0 backdrop-blur-[1px] z-0"></div>

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 min-h-[500px]">
        {/* Sisi Kiri - Logo & Nama Sekolah */}
        <div className="w-full md:w-2/5 bg-red-700 p-10 flex flex-col items-center justify-center text-white relative">
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-tl-full"></div>
          <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-white/20">
            <FaSchool className="text-gray-500" size={50} />
          </div>
          <div className="text-center leading-tight">
            <h2 className="font-bold text-xl uppercase tracking-wider">SMP Negeri</h2>
            <h1 className="font-extrabold text-3xl uppercase tracking-widest mt-1">3 MANADO</h1>
          </div>
        </div>

        {/* Sisi Kanan - Form Login */}
        <div className="w-full md:w-3/5 bg-gray-100 p-10 md:p-14 flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200 rounded-bl-full"></div>
          <div className="mb-8 relative z-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">SELAMAT DATANG</h1>
            <p className="text-gray-600 mt-2 text-lg">Silakan Login Terlebih Dahulu</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="font-semibold text-gray-700 block">
                Nama / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama pengguna"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="font-semibold text-gray-700 block">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* LINK LUPA KATA SANDI */}
              <div className="flex justify-end mt-1">
                <Link
                  to="/lupa-password"
                  className="text-sm font-medium text-red-700 hover:text-red-800 hover:underline transition-all">
                  Lupa Kata Sandi?
                </Link>
              </div>
            </div>

            {/* Tombol Login */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-red-700 text-white py-3.5 rounded-lg font-bold text-lg hover:bg-red-800 transition duration-150 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? 'MENGHUBUNGKAN...' : 'LOGIN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
