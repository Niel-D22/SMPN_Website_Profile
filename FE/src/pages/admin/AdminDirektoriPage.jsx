import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { direktoriApi } from '../../Api/direktoriApi';
import DirektoriItem from '../../components/admin/Direktori/DirektoriItem';
import ModalFormDirektori from '../../components/admin/Direktori/ModalDirektoriForm';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';

const AdminDirektoriPage = () => {
  const [gurus, setGurus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('Semua');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchGurus = async () => {
    try {
      setIsLoading(true);
      const data = await direktoriApi.getGuru();
      setGurus(data || []);
    } catch (error) {
      toast.error('Gagal memuat data direktori guru & staf');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGurus();
  }, []);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingData) {
        await direktoriApi.updateGuru(editingData.id_guru, formData);
        toast.success('Data pegawai berhasil diperbarui!');
      } else {
        await direktoriApi.addGuru(formData);
        toast.success('Pegawai baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchGurus();
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await direktoriApi.deleteGuru(itemToDelete);
      toast.success('Data pegawai berhasil dihapus!');
      setGurus(gurus.filter((g) => g.id_guru !== itemToDelete));
    } catch (error) {
      toast.error('Gagal menghapus data pegawai');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Filter Data
  const filteredGurus = gurus.filter((g) => {
    const matchSearch =
      g.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.mata_pelajaran && g.mata_pelajaran.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchJabatan = filterJabatan === 'Semua' || g.jabatan === filterJabatan;
    return matchSearch && matchJabatan;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Direktori Guru & Staf</h1>
          <p className="mt-1 text-sm text-gray-600 font-medium">
            Kelola data profil tenaga pendidik dan kependidikan sekolah.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-red-900/20">
          <FaPlus size={14} /> Tambah Pegawai
        </button>
      </div>

      {/* Toolbar: Filter & Search */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto px-2 pb-2 md:pb-0 hide-scrollbar">
          {['Semua', 'Guru Mata Pelajaran', 'Staf Tata Usaha'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterJabatan(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterJabatan === tab ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 shrink-0 pr-2">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau mata pelajaran..."
            className="w-full bg-gray-50 py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-700 border border-transparent transition"
          />
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full skeleton-shimmer"></div>
              </div>
              <div className="h-4 w-3/4 skeleton-shimmer rounded mx-auto"></div>
              <div className="h-3 w-1/2 skeleton-shimmer rounded mx-auto"></div>
            </div>
          ))}
        </div>
      ) : filteredGurus.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">Tidak ada data pegawai yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGurus.map((item) => (
            <DirektoriItem
              key={item.id_guru}
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
      <ModalFormDirektori
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
        judul="Hapus Data Pegawai"
        pesan="Apakah Anda yakin ingin menghapus data pegawai ini dari direktori sekolah?"
        teksKonfirmasi="Ya, Hapus"
        teksBatal="Batal"
      />
    </div>
  );
};

export default AdminDirektoriPage;
