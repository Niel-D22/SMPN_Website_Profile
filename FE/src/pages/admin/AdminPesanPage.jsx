import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { pesanApi } from '../../Api/pesanApi';
import Skeleton from '../../components/ui/Skeleton';
import PesanItem from '../../components/admin/Pesan/PesanItem';
import ModalBalasPesan from '../../components/admin/Pesan/ModalBalasPesan';
import 'animate.css';

const AdminPesanPage = () => {
  const [pesanList, setPesanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal Balas
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPesan, setSelectedPesan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchPesan = async () => {
      try {
        setIsLoading(true);
        const data = await pesanApi.getSemuaPesan();
        setPesanList(data.data || data);
      } catch (error) {
        console.error('Gagal memuat pesan:', error);
        toast.error('Gagal memuat daftar pesan.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPesan();
  }, []);

  // 2. Handle Buka Balas (Tandai Dibaca)
  const handleBukaBalas = async (pesan) => {
    setSelectedPesan(pesan);
    setModalOpen(true);

    if (!pesan.is_read) {
      try {
        await pesanApi.tandaiDibaca(pesan.id_pesan);
        setPesanList((prev) =>
          prev.map((p) => (p.id_pesan === pesan.id_pesan ? { ...p, is_read: true } : p))
        );
      } catch (error) {
        console.error('Gagal menandai dibaca', error);
      }
    }
  };

  // 3. Handle Kirim Balasan (Diterima dari Modal)
  const handleKirimBalasan = async (jawabanText) => {
    if (!jawabanText.trim()) return toast.error('Tulis jawaban terlebih dahulu!');

    setIsSubmitting(true);
    try {
      await pesanApi.balasPesan(selectedPesan.id_pesan, {
        jawaban: jawabanText,
        email_pengirim: selectedPesan.email_pengirim,
        nama_pengirim: selectedPesan.nama_pengirim,
        isi_pesan: selectedPesan.isi_pesan,
      });

      // Update state lokal dengan format array riwayat
      setPesanList((prev) =>
        prev.map((p) => {
          if (p.id_pesan !== selectedPesan.id_pesan) return p;

          let riwayatLama = [];
          try {
            const parsed = JSON.parse(p.balasan_admin);
            riwayatLama = Array.isArray(parsed)
              ? parsed
              : [{ isi: p.balasan_admin, tanggal: p.tanggal_balas }];
          } catch {
            if (p.balasan_admin) {
              riwayatLama = [{ isi: p.balasan_admin, tanggal: p.tanggal_balas }];
            }
          }

          const riwayatBaru = [
            ...riwayatLama,
            { isi: jawabanText, tanggal: new Date().toISOString() },
          ];

          return {
            ...p,
            is_read: true,
            balasan_admin: JSON.stringify(riwayatBaru),
            tanggal_balas: new Date().toISOString(),
          };
        })
      );

      toast.success('Balasan berhasil dikirim!');
      setModalOpen(false);
    } catch (error) {
      console.error('Error saat kirim balasan:', error);
      toast.error('Gagal mengirim balasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handle Hapus
  const handleHapus = async (id) => {
    // Ubah konfirmasi alert ke custom toast + confirm UI
    // (Respon mobile-first: toast + confirm, jangan window.confirm)
    let confirmContainer = document.createElement('div');
    confirmContainer.className =
      'fixed z-[9999] inset-0 flex items-center justify-center bg-black/40';
    const confirmBox = document.createElement('div');
    confirmBox.className =
      'bg-white rounded-xl shadow-xl max-w-[90vw] w-[320px] p-5 flex flex-col items-center gap-4 animate__animated animate__fadeInUp';
    confirmBox.innerHTML = `
      <div class="text-lg font-semibold text-gray-900 text-center">Yakin ingin menghapus pesan ini?</div>
      <div class="flex w-full justify-between gap-2 mt-1">
        <button id="batalBtn" class="w-1/2 py-2 px-4 rounded-lg bg-gray-100 text-gray-700 text-base font-medium active:bg-gray-200">Batal</button>
        <button id="hapusBtn" class="w-1/2 py-2 px-4 rounded-lg bg-primary text-white text-base font-semibold active:bg-primary/90">Hapus</button>
      </div>
    `;
    confirmContainer.appendChild(confirmBox);
    document.body.appendChild(confirmContainer);

    function cleanUp() {
      document.body.removeChild(confirmContainer);
    }

    return new Promise((resolve) => {
      confirmBox.querySelector('#batalBtn').onclick = () => {
        cleanUp();
        resolve(false);
      };
      confirmBox.querySelector('#hapusBtn').onclick = () => {
        cleanUp();
        resolve(true);
      };
    }).then(async (shouldDelete) => {
      if (!shouldDelete) return;

      try {
        await pesanApi.hapusPesan(id);
        setPesanList((prev) => prev.filter((p) => p.id_pesan !== id));
        toast.success('Pesan berhasil dihapus.');
      } catch (error) {
        toast.error('Gagal menghapus pesan.');
      }
    });
  };

  // --- SKELETON LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-2 py-4 sm:px-4 md:px-8 lg:px-16 lg:py-10 animate__animated animate__fadeInUp animate__faster">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10">
          <div>
            <Skeleton className="h-7 w-40 mb-2 rounded-md" />
            <Skeleton className="h-3 w-52 rounded-md" />
          </div>
          <div className="mt-2 sm:mt-0 flex-shrink-0">
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
        <div className="space-y-4 md:space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 flex-wrap items-center">
              <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
              <div className="w-full space-y-2 md:space-y-3">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- TAMPILAN UTAMA ---
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4 md:px-10 md:py-8 relative">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-[1.6rem] sm:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
            Pesan &amp; Buku Tamu
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-snug">
            Interaksi langsung dengan publik dan wali murid.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/10 font-semibold text-xs sm:text-sm touch-auto min-h-[44px]">
          <FaCheckCircle className="text-primary text-lg" />
          <span>Semua Pesan Terbalas</span>
        </div>
      </div>

      {/* DAFTAR PESAN */}
      <div className="space-y-3 md:space-y-4">
        {pesanList.length === 0 ? (
          <div className="text-center py-12 sm:py-20 text-gray-400 font-medium text-base">
            Belum ada pesan masuk.
          </div>
        ) : (
          pesanList.map((pesan) => (
            <PesanItem
              key={pesan.id_pesan}
              pesan={pesan}
              onBalas={handleBukaBalas}
              onHapus={handleHapus}
            />
          ))
        )}
      </div>

      {/* MODAL BALAS PESAN */}
      <ModalBalasPesan
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        pesan={selectedPesan}
        onKirim={handleKirimBalasan}
        isSubmitting={isSubmitting}
        // Pastikan Modal memberi responsivitas: uk-modal (lihat ModalBalasPesan), misal gunakan Tailwind berikut pada modal container:
        // 'w-full max-w-md mx-auto rounded-2xl shadow-lg bg-white max-h-[90vh] overflow-y-auto px-4 py-5'
      />
    </div>
  );
};

export default AdminPesanPage;
