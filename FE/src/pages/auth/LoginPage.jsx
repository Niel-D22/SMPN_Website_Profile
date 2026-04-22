import React, { useState, useEffect } from 'react';

import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../Api/axios'; // Pastikan path axios sudah benar
import toast from 'react-hot-toast';
import { profilSekolahApi } from '../../Api/profilSekolahApi';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // State untuk data profil sekolah
  const [logoUrl, setLogoUrl] = useState('');
  const [namaSekolah, setNamaSekolah] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data profil sekolah untuk logo_url dan nama_sekolah
    const fetchProfilSekolah = async () => {
      try {
        const data = await profilSekolahApi.getProfilSekolah();
        setLogoUrl(data.logo_url || '/Images/LogoSekolah.png'); // fallback ke default jika tidak ada
        setNamaSekolah(data.nama_sekolah || 'SMP Negeri 3 Manado');
      } catch (err) {
        setLogoUrl('/Images/LogoSekolah.png');
        setNamaSekolah('SMP Negeri 3 Manado');
      }
    };
    fetchProfilSekolah();
  }, []);

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

  // Handler untuk button back
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center sm:p-4 p-2 relative overflow-hidden"
      style={{
        backgroundImage: `url('/Images/BG.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f3f4f6',
      }}>
      <div className="absolute inset-0 backdrop-blur-[1px] z-0"></div>
      {/* container */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 min-h-[500px] md:min-h-[500px] min-h-[100dvh] md:min-h-0">
        {/* Sisi Kiri - Logo & Nama Sekolah */}
        <div className="w-full md:w-2/5 bg-red-700 p-6 sm:p-10 flex flex-col items-center justify-center text-white relative">
          <div className="w-30 h-30 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <img
              src={logoUrl}
              alt={namaSekolah}
              className="w-28 h-28 sm:w-36 sm:h-32 object-contain"
            />
          </div>

          <div className="text-center leading-tight">
            {/* Split namaSekolah jika perlu, atau tampilkan dinamis jika tidak ada pattern fix */}
            <h2 className="font-bold text-base sm:text-xl uppercase tracking-wider">
              {namaSekolah?.split('3 MANADO')[0]?.trim() || 'SMP Negeri'}
            </h2>
            <h1 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-widest mt-1">
              {namaSekolah?.includes('3 MANADO')
                ? '3 MANADO'
                : namaSekolah?.replace('SMP Negeri', '').trim()}
            </h1>
          </div>
        </div>

        {/* Sisi Kanan - Form Login */}
        <div className="w-full md:w-3/5 bg-gray-100 p-4 xs:p-6 sm:p-10 md:p-14 flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 w-14 h-14 sm:w-20 sm:h-20 bg-gray-200 rounded-bl-full"></div>

          {/* Tombol Back pindah ke dalam kotak form login ujung kiri */}
          <div className="w-full flex items-center">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 bg-white text-gray-700 px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-200 transition z-20 border border-gray-200 text-sm font-semibold mb-4"
              style={{ position: 'static' }}>
              <FaArrowLeft className="text-base" />
              Kembali
            </button>
          </div>
          <div className="mb-5 sm:mb-8 relative z-10">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              SELAMAT DATANG
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg">
              Silakan Login Terlebih Dahulu
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5 relative z-10">
            {/* Username */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="username"
                className="font-semibold text-gray-700 block text-sm sm:text-base">
                Nama / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama pengguna"
                  className="w-full pl-9 pr-3 sm:pl-11 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white outline-none transition text-sm sm:text-base"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="password"
                className="font-semibold text-gray-700 block text-sm sm:text-base">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-9 pr-10 sm:pl-11 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white outline-none transition text-sm sm:text-base"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* LINK LUPA KATA SANDI */}
              <div className="flex justify-end mt-1">
                <Link
                  to="/lupa-password"
                  className="text-xs sm:text-sm font-medium text-red-700 hover:text-red-800 hover:underline transition-all">
                  Lupa Kata Sandi?
                </Link>
              </div>
            </div>

            {/* Tombol Login */}
            <div className="pt-1 sm:pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-red-700 text-white py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-red-800 transition duration-150 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
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
