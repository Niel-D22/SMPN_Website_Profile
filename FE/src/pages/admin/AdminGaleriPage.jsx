import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaImage } from 'react-icons/fa';

import { galeriApi } from '../../Api/galeriApi';
import GaleriItem from '../../components/admin/Galeri/GaleriItem';
import ModalFormGaleri from '../../components/admin/Galeri/ModalFormGaleri';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';

const AdminGaleriPage = () => {
  const [galeri, setGaleri] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State Filter UI (Bisa dikembangkan nanti jika ada atribut kategori di DB)
  const [activeTab, setActiveTab] = useState('Semua');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchGaleri = async () => {
    try {
      setIsLoading(true);
      const response = await galeriApi.getGaleri();

      // Tangani berbagai kemungkinan bentuk response
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setGaleri(data);
    } catch (error) {
      toast.error('Gagal memuat data Galeri');
      setGaleri([]); // Pastikan tetap array saat error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGaleri();
  }, []);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingData) {
        await galeriApi.updateGaleri(editingData.id_galeri, formData);
        toast.success('Media berhasil diperbarui!');
      } else {
        await galeriApi.addGaleri(formData);
        toast.success('Media baru berhasil diunggah!');
      }
      setIsModalOpen(false);
      fetchGaleri();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Terjadi kesalahan saat menyimpan data';
      toast.error(typeof msg === 'string' ? msg : 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await galeriApi.deleteGaleri(itemToDelete);
      toast.success('Media berhasil dihapus!');
      setGaleri(galeri.filter((g) => g.id_galeri !== itemToDelete));
    } catch (error) {
      toast.error('Gagal menghapus media');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredGaleri = galeri.filter(
    (g) =>
      g.judul_foto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.deskripsi && g.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Galeri Multimedia</h1>
          <p className="mt-1 text-sm text-gray-600 font-medium">
            Kelola dokumentasi foto dan video kegiatan sekolah.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-red-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-primary/30">
          <FaPlus size={14} /> Unggah Media
        </button>
      </div>

      {/* FILTER TABS & SEARCH BAR (Sesuai Wireframe) */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 overflow-x-auto p-1">
          {['Semua', 'Kegiatan', 'Prestasi', 'Fasilitas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0 px-2 pb-2 md:pb-0 md:pr-2">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari media..."
            className="w-full bg-gray-50 py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition"
          />
        </div>
      </div>

      {/* GRID GALERI */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="aspect-video skeleton-shimmer"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 skeleton-shimmer rounded"></div>
                <div className="h-3 w-full skeleton-shimmer rounded"></div>
                <div className="h-3 w-2/3 skeleton-shimmer rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredGaleri.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 text-gray-300">
            <FaImage size={30} />
          </div>
          <p className="text-gray-500 font-medium">Belum ada media yang diunggah.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGaleri.map((item) => (
            <GaleriItem
              key={item.id_galeri}
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

      {/* MODAL FORM & KONFIRMASI */}
      <ModalFormGaleri
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
        judul="Hapus Media"
        pesan="Apakah Anda yakin ingin menghapus foto/video ini dari galeri publik? Tindakan ini tidak dapat dibatalkan."
        teksKonfirmasi="Ya, Hapus"
        teksBatal="Batal"
      />
    </div>
  );
};

export default AdminGaleriPage;
