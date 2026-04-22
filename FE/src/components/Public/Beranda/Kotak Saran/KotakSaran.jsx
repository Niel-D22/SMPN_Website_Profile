import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaDirections } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { pesanApi } from '../../../../Api/pesanApi';
import { profilSekolahApi } from '../../../../Api/profilSekolahApi';

const KotakSaran = () => {
  const [formData, setFormData] = useState({
    nama_pengirim: '',
    email_pengirim: '',
    isi_pesan: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk profil sekolah
  const [profil, setProfil] = useState({
    nama_sekolah: '',
    alamat: '',
    no_telepon: '',
    email_sekolah: '',
  });

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await profilSekolahApi.getProfilSekolah();
        setProfil({
          nama_sekolah: res.nama_sekolah || '',
          alamat: res.alamat || '',
          no_telepon: res.no_telepon || '',
          email_sekolah: res.email_sekolah || '',
        });
      } catch (e) {
        // fallback: kosongkan, jangan crash
        setProfil({
          nama_sekolah: '',
          alamat: '',
          no_telepon: '',
          email_sekolah: '',
        });
      }
    };
    fetchProfil();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lastSubmitTime = localStorage.getItem('last_submit_pesan');
    const cooldown = 60 * 60 * 1000;

    if (lastSubmitTime) {
      const timePassed = Date.now() - parseInt(lastSubmitTime, 10);
      if (timePassed < cooldown) {
        const timeLeft = Math.ceil((cooldown - timePassed) / 60000);
        toast(`Tunggu sekitar ${timeLeft} menit lagi sebelum mengirim pesan baru.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await pesanApi.kirimPesan(formData);
      toast.success('Pesan berhasil dikirim! Terima kasih atas saran Anda.');
      setFormData({ nama_pengirim: '', email_pengirim: '', isi_pesan: '' });
      localStorage.setItem('last_submit_pesan', Date.now().toString());
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
        {/* ── JUDUL SECTION ── */}
        <div className="text-center">
          <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#b30000] bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-3">
            Hubungi Kami
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#003366] leading-tight">
            Kotak Saran & Lokasi Sekolah
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Sampaikan saran atau pertanyaan Anda, dan temukan kami di lokasi sekolah.
          </p>
        </div>

        {/* ── BARIS UTAMA: FORM + PETA ── */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* ══ CARD FORM KOTAK SARAN ══ */}
          <div className="w-full lg:w-1/2 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
            {/* Panel kiri merah — info kontak */}
            <div className="w-full sm:w-5/12 bg-[#b30000] text-white p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden">
              {/* Dekorasi lingkaran */}
              <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-extrabold mb-2 leading-tight">
                  Mari Terhubung!
                </h2>
                <p className="text-white/80 text-xs leading-relaxed mb-6">
                  Punya saran, masukan, atau pertanyaan? Suara Anda sangat berarti untuk kemajuan
                  {profil.nama_sekolah ? ` ${profil.nama_sekolah}` : ' sekolah kami.'}
                </p>

                <div className="flex flex-col gap-4">
                  {[
                    {
                      icon: <FaMapMarkerAlt className="text-[#003366]" />,
                      label: 'Alamat',
                      value: profil.alamat || '-',
                    },
                    {
                      icon: <FaPhoneAlt className="text-[#003366]" />,
                      label: 'Telepon',
                      value: profil.no_telepon || '-',
                    },
                    {
                      icon: <FaEnvelope className="text-[#003366]" />,
                      label: 'Email',
                      value: profil.email_sekolah || '-',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-white shrink-0 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          {item.label}
                        </p>
                        <p className="text-xs text-white mt-0.5 leading-snug">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel kanan — form */}
            <div className="w-full sm:w-7/12 p-5 sm:p-7 flex flex-col justify-center bg-white">
              <h3 className="text-base sm:text-lg font-extrabold text-[#b30000] mb-4">
                Tulis Pesan Anda
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                {[
                  {
                    label: 'Nama Lengkap',
                    type: 'text',
                    key: 'nama_pengirim',
                    placeholder: 'Masukkan nama Anda',
                  },
                  {
                    label: 'Email',
                    type: 'email',
                    key: 'email_pengirim',
                    placeholder: 'contoh@email.com',
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-bold text-[#003366] mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      required
                      value={formData[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#b30000] outline-none transition text-xs sm:text-sm"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-bold text-[#003366] mb-1">
                    Pesan / Saran
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.isi_pesan}
                    onChange={(e) => setFormData({ ...formData, isi_pesan: e.target.value })}
                    placeholder="Tuliskan saran, kritik, atau pertanyaan Anda..."
                    className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#b30000] outline-none transition text-xs sm:text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#b30000] hover:bg-[#003366] active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-70 mt-1"
                  style={{ minHeight: 46 }}>
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
                      Mengirim...
                    </span>
                  ) : (
                    <>
                      Kirim Pesan <FaPaperPlane size={13} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ══ CARD PETA LOKASI ══ */}
          <div className="w-full lg:w-1/2 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {/* Header peta */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-50 rounded-xl">
                  <FaMapMarkerAlt className="text-[#b30000] text-base" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#003366] leading-tight">
                    Lokasi Sekolah
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {profil.nama_sekolah || 'SMP Negeri 3 Manado'}
                  </p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/rhGYCnnr628p4DzC6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-white bg-[#003366] hover:bg-[#b30000] active:scale-95 px-3 py-2 rounded-full transition-all no-underline"
                style={{ minHeight: 36 }}>
                <FaDirections size={11} />
                Petunjuk Arah
              </a>
            </div>

            {/* iframe Google Maps */}
            <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] lg:min-h-0 bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.3070206061243!2d124.84505607447171!3d1.5201734610057316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32879fe6701a13b1%3A0xc76183683e3ad979!2sSMP%20Negeri%203%20Manado!5e1!3m2!1sid!2sid!4v1776755269157!5m2!1sid!2sid"
                title={`Lokasi ${profil.nama_sekolah || 'SMP Negeri 3 Manado'}`}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Footer info alamat */}
            <div className="px-5 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
              <div className="p-1.5 bg-red-50 rounded-lg shrink-0">
                <FaMapMarkerAlt className="text-[#b30000] text-xs" />
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 leading-snug">
                {profil.alamat ||
                  'Jl. Kakap No. 2, Kec. Tuminting, Kota Manado, Prov. Sulawesi Utara'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KotakSaran;
