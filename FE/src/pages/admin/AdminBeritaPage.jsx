import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { beritaApi } from '../../Api/beritaApi';
import BeritaItem from '../../components/admin/Berita/BeritaItem';
import ModalFormBerita from '../../components/admin/Berita/ModalFormBerita';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import Skeleton from '../../components/ui/Skeleton';
import 'animate.css';

const SKELETON_CARD_COUNT = 6;

const AdminBeritaPage = () => {
  const [beritas, setBeritas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchBerita = async () => {
    try {
      setIsLoading(true);
      const data = await beritaApi.getBeritaAdmin();
      setBeritas(data || []);
    } catch (error) {
      toast.error('Gagal memuat berita');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      // data sudah FormData dari modal, langsung pakai
      if (editingData) {
        const result = await beritaApi.updateBerita(editingData.id_berita, data);
        console.log('Response update:', result);
        toast.success('Berita berhasil diperbarui');
      } else {
        const result = await beritaApi.addBerita(data);
        console.log('Response add:', result);
        toast.success('Berita berhasil diposting');
      }
      setIsModalOpen(false);
      fetchBerita();
    } catch (error) {
      console.error('Error:', error.response?.data);
      toast.error('Gagal menyimpan berita');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await beritaApi.deleteBerita(itemToDelete);
      toast.success('Berita dihapus');
      setBeritas(beritas.filter((b) => b.id_berita !== itemToDelete));
    } catch (error) {
      toast.error('Gagal menghapus berita');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const filteredData = beritas.filter((b) =>
    b.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // ✅ Hapus min-h-screen — biarkan layout admin yang atur tinggi
    // ✅ Padding mobile kecil, makin besar di layar lebih lebar
    <div className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 animate__animated animate__fadeInUp animate__faster">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Berita & Pengumuman
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Kelola informasi terkini untuk warga sekolah.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-3 sm:px-5 rounded-xl font-bold text-sm shadow-lg shadow-red-900/20 transition-colors min-h-[44px] w-full sm:w-auto">
          <FaPlus /> Buat Konten Baru
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 sm:mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari judul berita..."
          className="w-full bg-white py-3 sm:py-4 pl-11 pr-4 rounded-2xl border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-red-700 transition text-sm"
        />
      </div>

      {/* Grid Konten */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full relative animate-pulse">
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                <Skeleton className="h-5 w-24 mb-1 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
              <div className="aspect-[16/7] bg-gray-100 border-b border-gray-100">
                <Skeleton className="w-full h-full rounded-none" />
              </div>
              <div className="flex-1 flex flex-col px-5 py-4 sm:px-6 sm:py-5">
                <Skeleton className="h-6 w-44 mb-3 rounded" />
                <Skeleton className="h-4 w-full mb-2 rounded" />
                <Skeleton className="h-4 w-5/6 mb-2 rounded" />
                <Skeleton className="h-4 w-2/3 mb-5 rounded" />
                <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-white p-8 sm:p-10 rounded-3xl text-center border border-gray-100 text-gray-400 text-sm">
          Belum ada berita yang tersedia.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredData.map((item) => (
            <BeritaItem
              key={item.id_berita}
              item={item}
              onEdit={(data) => {
                setEditingData(data);
                setIsModalOpen(true);
              }}
              onDelete={(id) => {
                setItemToDelete(id);
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ModalFormBerita
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingData}
        isSubmitting={isSubmitting}
      />

      <ModalKonfirmasi
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        judul="Hapus Berita"
        pesan="Apakah anda yakin? Berita yang dihapus tidak bisa dikembalikan."
      />
    </div>
  );
};

export default AdminBeritaPage;
