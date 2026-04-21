import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaImage } from 'react-icons/fa';
import { galeriApi } from '../../Api/galeriApi';
import GaleriItem from '../../components/admin/Galeri/GaleriItem';
import ModalFormGaleri from '../../components/admin/Galeri/ModalFormGaleri';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import 'animate.css';

const AdminGaleriPage = () => {
  const [galeri, setGaleri] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchGaleri = async () => {
    try {
      setIsLoading(true);
      const response = await galeriApi.getGaleri();
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];
      setGaleri(data);
    } catch {
      toast.error('Gagal memuat data Galeri');
      setGaleri([]);
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
    } catch {
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
    // ✅ Hapus min-h-screen & bg-gray-50 — diatur AdminLayout
    <div className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 animate__animated animate__fadeInUp animate__faster">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Galeri Multimedia
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-600 font-medium">
            Kelola dokumentasi foto dan video kegiatan sekolah.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-red-800 text-white px-4 py-3 sm:px-5 rounded-xl font-bold text-sm transition shadow-lg shadow-primary/30 min-h-[44px] w-full sm:w-auto">
          <FaPlus size={13} /> Unggah Media
        </button>
      </div>

      {/* Filter Tabs + Search */}
      <div className="bg-white p-2 sm:p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 sm:mb-6">
        {/* Tabs scroll horizontal di mobile */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          {['Semua', 'Kegiatan', 'Prestasi', 'Fasilitas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all min-h-[36px] ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 shrink-0">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari media..."
            className="w-full bg-gray-50 py-2.5 pl-9 pr-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition"
          />
        </div>
      </div>

      {/* Grid Galeri */}
      {isLoading ? (
        // ✅ 2 kolom di mobile, makin banyak di desktop
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredGaleri.length === 0 ? (
        <div className="text-center py-14 sm:py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-50 mb-4 text-gray-300">
            <FaImage size={26} />
          </div>
          <p className="text-gray-500 font-medium text-sm sm:text-base">
            Belum ada media yang diunggah.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
