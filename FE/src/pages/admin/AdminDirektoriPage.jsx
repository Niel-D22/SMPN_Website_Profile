import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { direktoriApi } from '../../Api/direktoriApi';
import DirektoriItem from '../../components/admin/Direktori/DirektoriItem';
import ModalFormDirektori from '../../components/admin/Direktori/ModalDirektoriForm';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import 'animate.css';

const AdminDirektoriPage = () => {
  const [gurus, setGurus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const filteredGurus = gurus.filter((g) => {
    const matchSearch =
      g.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.mata_pelajaran && g.mata_pelajaran.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchJabatan = filterJabatan === 'Semua' || g.jabatan === filterJabatan;
    return matchSearch && matchJabatan;
  });

  return (
    // ✅ Hapus min-h-screen & bg-gray-50 — diatur AdminLayout
    // ✅ Padding mobile-first: kecil di HP, besar di desktop
    <div className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 animate__animated animate__fadeInUp animate__faster">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Direktori Guru & Staf
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-600 font-medium">
            Kelola data profil tenaga pendidik dan kependidikan sekolah.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-3 sm:px-5 rounded-xl font-bold text-sm transition shadow-lg shadow-red-900/20 min-h-[44px] w-full sm:w-auto">
          <FaPlus size={13} /> Tambah Pegawai
        </button>
      </div>

      {/* Toolbar: Filter & Search */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        {/* Filter tabs — scroll horizontal di mobile */}

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          {['Semua', ...new Set(gurus.map((g) => g.jabatan).filter(Boolean))].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterJabatan(tab)}
              className={`px-3 py-2 sm:px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[36px] ${
                filterJabatan === tab
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'
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
            placeholder="Cari nama atau mata pelajaran..."
            className="w-full bg-gray-50 py-2.5 pl-9 pr-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-700 border border-transparent transition"
          />
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 space-y-3 animate-pulse">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200" />
              </div>
              <div className="h-3.5 w-3/4 bg-gray-200 rounded mx-auto" />
              <div className="h-3 w-1/2 bg-gray-200 rounded mx-auto" />
            </div>
          ))}
        </div>
      ) : filteredGurus.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm font-medium">
            Tidak ada data pegawai yang ditemukan.
          </p>
        </div>
      ) : (
        // ✅ 2 kolom di mobile (kartu guru cocok 2 kolom), 3 di lg, 4 di xl
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
