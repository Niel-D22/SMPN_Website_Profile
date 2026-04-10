import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { faqApi } from '../../Api/faqApi';
import ModalFormfaq from '../../components/admin/FAQ/ModalFormfaq';
import FAQItem from '../../components/admin/FAQ/FAQItem';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import { FaPlus, FaSearch } from 'react-icons/fa';

const AdminFAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal Form (Tambah/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // --- STATE BARU UNTUK MODAL KONFIRMASI HAPUS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  // 1. Ambil Data
  const fetchFaqs = async () => {
    try {
      setIsLoading(true);
      const data = await faqApi.getFaq();
      setFaqs(data || []);
    } catch (error) {
      toast.error('Gagal memuat data FAQ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // 2. Handle Simpan (Tambah / Edit)
  const handleSaveFaq = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingData) {
        await faqApi.updateFaq(editingData.id_faq, formData);
        toast.success('FAQ berhasil diperbarui!');
      } else {
        await faqApi.addFaq(formData);
        toast.success('FAQ baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Terjadi kesalahan saat menyimpan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Buka Modal Hapus (Menerima ID dari FAQItem)
  const handleDeleteClick = (id) => {
    setFaqToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 4. Eksekusi Hapus (Dipanggil saat tombol "Ya, Hapus" di klik pada modal)
  const confirmDelete = async () => {
    if (!faqToDelete) return;

    try {
      await faqApi.deleteFaq(faqToDelete);
      toast.success('FAQ berhasil dihapus!');
      setFaqs(faqs.filter((f) => f.id_faq !== faqToDelete)); // Hapus dari UI
    } catch (error) {
      toast.error('Gagal menghapus FAQ');
    } finally {
      // Selalu tutup modal dan kosongkan state setelah selesai
      setIsDeleteModalOpen(false);
      setFaqToDelete(null);
    }
  };

  const openAddModal = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingData(faq);
    setIsModalOpen(true);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen FAQ</h1>
          <p className="mt-1 text-sm text-gray-600 font-medium">
            Kelola daftar pertanyaan yang sering diajukan
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2.5 bg-red-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-red-800 transition">
          <FaPlus size={16} /> Tambah FAQ baru
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" size={16} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan kata kunci pertanyaan atau kategori..."
          className="w-full bg-white p-4 pl-12 rounded-2xl border border-gray-100 shadow-sm placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700 transition"
        />
      </div>

      {/* LIST FAQ & SKELETON LOADER */}
      <div className="space-y-4">
        {isLoading ? (
          // --- INI ADALAH SKELETON LOADER NYA ---
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-white p-6 px-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center flex-1">
                  {/* Skeleton Icon Kiri */}
                  <div className="w-12 h-12 rounded-xl skeleton-shimmer mr-4 shrink-0"></div>

                  {/* Skeleton Teks (Pertanyaan & Kategori) */}
                  <div className="flex flex-col w-full gap-2.5">
                    <div className="h-5 w-3/4 sm:w-1/2 skeleton-shimmer"></div>
                    <div className="h-3.5 w-1/3 sm:w-1/4 skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Skeleton Bagian Kanan (Label Aktif & Tombol Edit/Hapus) */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block h-7 w-14 rounded-lg skeleton-shimmer"></div>
                  <div className="h-9 w-20 rounded-lg skeleton-shimmer ml-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : // ----------------------------------------
        filteredFaqs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100">
            Tidak ada FAQ yang ditemukan.
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <FAQItem
              key={faq.id_faq}
              faq={faq}
              onEdit={openEditModal}
              onDelete={handleDeleteClick}
            />
          ))
        )}
      </div>

      {/* MODAL FORM (TAMBAH/EDIT) */}
      <ModalFormfaq
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFaq}
        initialData={editingData}
        isSubmitting={isSubmitting}
      />

      {/* MODAL KONFIRMASI HAPUS */}
      <ModalKonfirmasi
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        judul="Hapus FAQ"
        pesan="Apakah Anda yakin ingin menghapus FAQ ini? Data yang dihapus tidak dapat dikembalikan."
        teksKonfirmasi="Ya, Hapus"
        teksBatal="Batal"
      />
    </div>
  );
};

export default AdminFAQPage;
