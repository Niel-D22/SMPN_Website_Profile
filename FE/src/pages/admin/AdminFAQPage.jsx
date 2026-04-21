import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { faqApi } from '../../Api/faqApi';
import ModalFormfaq from '../../components/admin/FAQ/ModalFormfaq';
import FAQItem from '../../components/admin/FAQ/FAQItem';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import { FaPlus, FaSearch } from 'react-icons/fa';
import 'animate.css';

const AdminFAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

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

  const handleDeleteClick = (id) => {
    setFaqToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!faqToDelete) return;
    try {
      await faqApi.deleteFaq(faqToDelete);
      toast.success('FAQ berhasil dihapus!');
      setFaqs(faqs.filter((f) => f.id_faq !== faqToDelete));
    } catch (error) {
      toast.error('Gagal menghapus FAQ');
    } finally {
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
    // ✅ Hapus min-h-screen & bg-gray-50, padding mobile-first
    <div className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 animate__animated animate__fadeInUp animate__faster">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Manajemen FAQ
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-600 font-medium">
            Kelola daftar pertanyaan yang sering diajukan.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-3 sm:px-5 rounded-xl font-bold text-sm shadow-md transition min-h-[44px] w-full sm:w-auto">
          <FaPlus size={13} /> Tambah FAQ Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5 sm:mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari pertanyaan atau kategori..."
          className="w-full bg-white py-3 sm:py-4 pl-11 pr-4 rounded-2xl border border-gray-100 shadow-sm text-sm outline-none focus:ring-2 focus:ring-red-700 transition"
        />
      </div>

      {/* List FAQ */}
      <div className="space-y-3 sm:space-y-4">
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center flex-1 gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex flex-col w-full gap-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/3 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:block h-7 w-14 rounded-lg bg-gray-200" />
                  <div className="h-9 w-20 rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-10 sm:py-14 text-gray-400 font-medium bg-white rounded-2xl border border-gray-100 text-sm">
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

      <ModalFormfaq
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFaq}
        initialData={editingData}
        isSubmitting={isSubmitting}
      />

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
