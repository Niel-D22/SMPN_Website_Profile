import React, { useState } from 'react';
import { FaEnvelope, FaTrash, FaReply, FaClock } from 'react-icons/fa';
import ModalKonfirmasi from '../ModalKonfirmasi';

const hitungWaktuLalu = (tanggal) => {
  if (!tanggal) return '';
  const detikLalu = Math.floor((new Date() - new Date(tanggal)) / 1000);
  let interval = detikLalu / 86400;
  if (interval > 1) return Math.floor(interval) + ' hari yang lalu';
  interval = detikLalu / 3600;
  if (interval > 1) return Math.floor(interval) + ' jam yang lalu';
  interval = detikLalu / 60;
  if (interval > 1) return Math.floor(interval) + ' menit yang lalu';
  return 'Baru saja';
};

const formatTanggalPendek = (tanggal) => {
  if (!tanggal) return '';
  return new Date(tanggal).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTanggalLengkap = (tanggal) => {
  if (!tanggal) return '';
  return new Date(tanggal).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const PesanItem = ({ pesan, onBalas, onHapus }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [lihatBalasan, setLihatBalasan] = useState(false);

  const handleKonfirmasiHapus = () => {
    onHapus(pesan.id_pesan);
    setModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md">
        {/* BAGIAN ATAS: Info pengirim + isi pesan */}
        <div className="p-5 flex flex-col sm:flex-row gap-4">
          {/* Ikon Amplop */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              pesan.is_read ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white shadow-md'
            }`}>
            <FaEnvelope size={17} />
          </div>

          {/* Konten */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  {pesan.nama_pengirim}
                  {!pesan.is_read && (
                    <span className="w-2 h-2 bg-primary rounded-full inline-block" />
                  )}
                </h3>
                <p className="text-xs text-primary font-medium">{pesan.email_pengirim}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                <FaClock size={9} />
                <span title={formatTanggalLengkap(pesan.tanggal_kirim)}>
                  {hitungWaktuLalu(pesan.tanggal_kirim)}
                </span>
              </div>
            </div>

            {/* Isi Pesan */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600 italic mt-3 leading-relaxed">
              "{pesan.isi_pesan}"
            </div>

            {/* Aksi — hanya tampil kalau BELUM dibalas */}
            {!pesan.balasan_admin && (
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-red-50 border border-primary/10 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Belum dibalas
                </span>
                <button
                  onClick={() => onBalas(pesan)}
                  className="ml-auto text-xs font-bold text-white bg-primary hover:bg-primary/90 transition px-4 py-1.5 rounded-lg flex items-center gap-1.5">
                  <FaReply size={10} /> Balas Sekarang
                </button>
                <button
                  onClick={() => setModalOpen(true)}
                  className="text-gray-300 hover:text-red-500 transition p-1"
                  title="Hapus Pesan">
                  <FaTrash size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER — hanya tampil kalau SUDAH dibalas */}
        {pesan.balasan_admin && (
          <>
            {/* Bar status compact */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-2.5 flex items-center gap-2">
              <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                ✓ Dibalas
              </span>
              <span
                className="text-xs text-gray-400 font-medium"
                title={formatTanggalLengkap(pesan.tanggal_balas)}>
                {formatTanggalPendek(pesan.tanggal_balas)}
                {pesan.tanggal_balas && (
                  <span className="ml-1 text-gray-300">
                    · {hitungWaktuLalu(pesan.tanggal_balas)}
                  </span>
                )}
              </span>

              <span className="text-gray-200 mx-1 select-none">|</span>

              <button
                onClick={() => setLihatBalasan(!lihatBalasan)}
                className="text-xs font-semibold text-primary hover:text-primary/70 transition">
                {lihatBalasan ? 'Sembunyikan' : 'Lihat balasan'}
              </button>

              <button
                onClick={() => onBalas(pesan)}
                className="text-xs font-semibold text-primary hover:text-primary/70 transition flex items-center gap-1">
                · <FaReply size={9} /> Kirim ulang
              </button>

              <button
                onClick={() => setModalOpen(true)}
                className="ml-auto text-gray-300 hover:text-red-500 transition p-1"
                title="Hapus Pesan">
                <FaTrash size={13} />
              </button>
            </div>

            {/* Isi Balasan — toggle */}
            {lihatBalasan && (
              <div className="px-5 py-4 bg-red-50/30 border-t border-gray-100">
                <p className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1.5 mb-3">
                  <FaReply size={9} /> Riwayat Balasan
                </p>
                <div className="flex flex-col gap-3">
                  {(() => {
                    let riwayat = [];
                    try {
                      const parsed = JSON.parse(pesan.balasan_admin);
                      riwayat = Array.isArray(parsed)
                        ? parsed
                        : [{ isi: pesan.balasan_admin, tanggal: pesan.tanggal_balas }];
                    } catch {
                      riwayat = [{ isi: pesan.balasan_admin, tanggal: pesan.tanggal_balas }];
                    }

                    return riwayat.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white border border-primary/15 border-l-2 border-l-primary rounded-xl px-4 py-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-bold text-primary">
                            Balasan #{index + 1}
                          </span>
                          <span
                            className="text-[10px] text-gray-400"
                            title={formatTanggalLengkap(item.tanggal)}>
                            {formatTanggalPendek(item.tanggal)} · {hitungWaktuLalu(item.tanggal)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.isi}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ModalKonfirmasi
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleKonfirmasiHapus}
        judul="Hapus Pesan"
        pesan="Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan."
        teksKonfirmasi="Ya, Hapus Pesan"
      />
    </>
  );
};

export default PesanItem;
