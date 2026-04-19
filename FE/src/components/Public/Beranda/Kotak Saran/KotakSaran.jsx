import React, { useState } from 'react';
import { FaPaperPlane, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { pesanApi } from '../../../../Api/pesanApi';

const KotakSaran = () => {
  const [formData, setFormData] = useState({
    nama_pengirim: '',
    email_pengirim: '',
    isi_pesan: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // === LOGIKA ANTI-SPAM (Batas Waktu) ===
    // Cek kapan user terakhir kali mengirim pesan
    const lastSubmitTime = localStorage.getItem('last_submit_pesan');
    const cooldown = 60 * 60 * 1000; // 1 Jam (dalam milidetik)

    if (lastSubmitTime) {
      const timePassed = Date.now() - parseInt(lastSubmitTime);
      if (timePassed < cooldown) {
        const timeLeft = Math.ceil((cooldown - timePassed) / 60000); // Hitung sisa menit
        alert(`Anda sudah mengirim pesan baru-baru ini. Tunggu sekitar ${timeLeft} menit lagi ya!`);
        return; // Hentikan proses kirim
      }
    }
    // ======================================

    setIsSubmitting(true);

    try {
      // Panggil fungsi POST ke API
      await pesanApi.kirimPesan(formData);

      alert('Pesan berhasil dikirim! Terima kasih atas saran Anda.');
      setFormData({ nama_pengirim: '', email_pengirim: '', isi_pesan: '' });

      // Catat waktu sukses kirim ke Local Storage
      localStorage.setItem('last_submit_pesan', Date.now().toString());
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 lg:px-8 flex items-center justify-center ">
      <div className="max-w-6xl w-full rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row bg-white">
        {/* ================= BAGIAN KIRI: INFO KONTAK ================= */}
        <div className="w-full md:w-5/12 bg-[#b30000] text-white p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Mari Terhubung!</h2>
            <p className="text-white text-sm leading-relaxed mb-10">
              Punya saran, masukan, atau pertanyaan seputar SMPN 3 Manado? Jangan ragu untuk
              mengirimkan pesan kepada kami. Suara Anda sangat berarti untuk kemajuan sekolah.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full shrink-0 bg-white">
                  <FaMapMarkerAlt className="text-[#003366]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Alamat Sekolah</h4>
                  <p className="text-sm mt-1 text-white">
                    Jl. Kakap No. 2, Kec. Tuminting, Kota Manado, Prov. Sulawesi Utara
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full shrink-0 bg-white">
                  <FaPhoneAlt className="text-[#003366]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Telepon</h4>
                  <p className="text-sm mt-1 text-white">082395358120</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full shrink-0 bg-white">
                  <FaEnvelope className="text-[#003366]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Email</h4>
                  <p className="text-sm mt-1 text-white">smpnegeri3manadosulut@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BAGIAN KANAN: FORM INPUT ================= */}
        <div className="w-full md:w-7/12 p-10 md:p-12">
          <h3 className="text-2xl font-bold text-[#b30000] mb-6">Tulis Pesan Anda</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#003366] mb-2">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.nama_pengirim}
                onChange={(e) => setFormData({ ...formData, nama_pengirim: e.target.value })}
                placeholder="Masukkan nama Anda"
                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#b30000] outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#003366] mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email_pengirim}
                onChange={(e) => setFormData({ ...formData, email_pengirim: e.target.value })}
                placeholder="contoh@email.com"
                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#b30000] outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#003366] mb-2">Pesan / Saran</label>
              <textarea
                required
                rows="5"
                value={formData.isi_pesan}
                onChange={(e) => setFormData({ ...formData, isi_pesan: e.target.value })}
                placeholder="Tuliskan saran, kritik, atau pertanyaan Anda di sini..."
                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#b30000] outline-none transition text-sm resize-none"></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#b30000] hover:bg-[#003366] text-white font-bold p-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70">
              {isSubmitting ? (
                'Mengirim...'
              ) : (
                <>
                  Kirim Pesan Sekarang <FaPaperPlane />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KotakSaran;
