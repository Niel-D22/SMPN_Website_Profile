import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { pesanApi } from '../../Api/pesanApi';
import Skeleton from '../../components/ui/Skeleton';
import PesanItem from '../../components/admin/Pesan/PesanItem'; // Import Komponen 1
import ModalBalasPesan from '../../components/admin/Pesan/ModalBalasPesan'; // Import Komponen 2

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
    if (!jawabanText.trim()) return toast.warning('Tulis jawaban terlebih dahulu!');

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
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    try {
      await pesanApi.hapusPesan(id);
      setPesanList((prev) => prev.filter((p) => p.id_pesan !== id));
      toast.success('Pesan berhasil dihapus.');
    } catch (error) {
      toast.error('Gagal menghapus pesan.');
    }
  };

  // --- SKELETON LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-4">
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="w-full space-y-3">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- TAMPILAN UTAMA ---
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 lg:p-10 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pesan & Buku Tamu</h1>
          <p className="text-sm text-gray-500 mt-1">
            Interaksi langsung dengan publik dan wali murid.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-red-50 text-primary px-4 py-2 rounded-full border border-primary/10 font-semibold text-sm">
          <FaCheckCircle className="text-primary" /> Semua Pesan Terbalas
        </div>
      </div>

      {/* DAFTAR PESAN (Mapping Komponen PesanItem) */}
      <div className="space-y-4">
        {pesanList.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">Belum ada pesan masuk.</div>
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
      />
    </div>
  );
};

export default AdminPesanPage;
