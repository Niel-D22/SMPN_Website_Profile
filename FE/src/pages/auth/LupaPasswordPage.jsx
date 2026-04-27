import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaSchool, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../Api/axios'; // Pastikan path ini benar
import toast from 'react-hot-toast';
import 'animate.css';
import { profilSekolahApi } from '../../Api/profilSekolahApi';

const LupaPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [namaSekolah, setNamaSekolah] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await profilSekolahApi.getProfilSekolah();
        setNamaSekolah(data.nama_sekolah || 'SMP Negeri 3 Manado');
        setLogoUrl(data.logo_url || '/Images/LogoSekolah.png');
      } catch {
        setNamaSekolah('SMP Negeri 3 Manado');
        setLogoUrl('/Images/LogoSekolah.png');
      }
    };
    fetchProfil();
  }, []);
  const bagian = namaSekolah?.split(/(\d+)/);
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      toast.success(res.data.message || 'Link reset password telah dikirim!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
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

      <div className="bg-white animate__animated animate__fadeInUp animate__faster w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 min-h-[500px]">
        {/* Sisi Kiri - Logo (Warna Merah Senada dengan Login) */}
        <div className="w-full md:w-2/5 bg-red-700 p-10 flex flex-col items-center justify-center text-white relative">
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-tl-full"></div>
          <div className="w-28 h-28  flex items-center justify-center mb-6 shadow-inner overflow-hidden">
            <img src={logoUrl} alt="Logo Sekolah" className="w-full h-full object-contain" />
          </div>
          <div className="text-center leading-tight">
            <h2 className="font-bold text-xl uppercase tracking-wider">
              {bagian?.[0]?.trim() || 'SMP Negeri'}
            </h2>

            <h1 className="font-extrabold text-3xl uppercase tracking-widest mt-1">
              {bagian?.slice(1).join('').trim() || ''}
            </h1>
          </div>{' '}
        </div>

        {/* Sisi Kanan - Form Reset (Desain Senada) */}
        <div className="w-full md:w-3/5 bg-gray-100 p-10 md:p-14 flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200 rounded-bl-full"></div>

          {/* Tombol Kembali ke Login */}
          <Link
            to="/login"
            className="absolute top-6 left-6 text-gray-500 hover:text-red-700 transition flex items-center gap-2 font-medium z-20">
            <FaArrowLeft size={16} /> Kembali
          </Link>

          <div className="mb-8 mt-6 relative z-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">FORGOT</h1>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight -mt-1">PASSWORD</h1>
            <p className="text-gray-600 mt-3 text-lg">
              Masukkan email terdaftar untuk mendapatkan link reset kata sandi.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6 relative z-10">
            {/* Input Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="font-semibold text-gray-700 block">
                Email Terdaftar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: admin@smpn3.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Tombol Kirim */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-red-700 text-white py-3.5 rounded-lg font-bold text-lg hover:bg-red-800 transition duration-150 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? 'MENGIRIM LINK...' : 'KIRIM PERMINTAAN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LupaPasswordPage;
