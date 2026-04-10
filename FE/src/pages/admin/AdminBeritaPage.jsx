import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { beritaApi } from '../../Api/beritaApi';
import BeritaItem from '../../components/admin/Berita/BeritaItem';
import ModalFormBerita from '../../components/admin/Berita/ModalFormBerita';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import Skeleton from '../../components/ui/Skeleton';

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

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingData) {
        await beritaApi.updateBerita(editingData.id_berita, formData);
        toast.success('Berita berhasil diperbarui');
      } else {
        await beritaApi.addBerita(formData);
        toast.success('Berita berhasil diposting');
      }
      setIsModalOpen(false);
      fetchBerita();
    } catch (error) {
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
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Berita & Pengumuman</h1>
          <p className="text-sm text-gray-500 font-medium">
            Kelola informasi terkini untuk warga sekolah.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-red-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-900/20">
          <FaPlus /> Buat Konten Baru
        </button>
      </div>

      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari judul berita..."
          className="w-full bg-white p-4 pl-12 rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-red-700 transition"
        />
      </div>

      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: SKELETON_CARD_COUNT }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full relative animate-pulse">
                {/* Status badge skeleton */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  <Skeleton className="h-5 w-24 mb-1 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                {/* Gambar cover skeleton */}
                <div className="aspect-[16/7] md:aspect-[16/6] bg-gray-100 border-b border-gray-100 flex items-center justify-center">
                  <Skeleton className="w-full h-full rounded-none" />
                </div>
                {/* Konten teks */}
                <div className="flex-1 flex flex-col px-6 py-5">
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
          <div className="bg-white p-10 rounded-3xl text-center border border-gray-100">
            Belum ada berita.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>

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
