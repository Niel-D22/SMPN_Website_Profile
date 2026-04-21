import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaRegClock } from 'react-icons/fa';
import { timelineApi } from '../../Api/timelineApi';
import TimelineItem from '../../components/admin/PPDB/TimelineItem';
import ModalFormPPDB from '../../components/admin/PPDB/ModalFormPPDB';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import 'animate.css';

const AdminPPDBPage = () => {
  const [timelines, setTimelines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchTimeline = async () => {
    try {
      setIsLoading(true);
      const data = await timelineApi.getTimeline();
      setTimelines(data || []);
    } catch (error) {
      toast.error('Gagal memuat data Timeline PPDB');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingData) {
        // ✅ Log ini untuk debug — lihat di console browser
        console.log('editingData:', editingData);
        console.log('id yang akan dikirim:', editingData.id_timeline);
        console.log('formData yang dikirim:', formData);

        if (!editingData.id_timeline) {
          toast.error('ID timeline tidak ditemukan. Coba refresh halaman.');
          return;
        }

        await timelineApi.updateTimeline(editingData.id_timeline, formData);
        toast.success('Tahapan berhasil diperbarui!');
      } else {
        console.log('formData tambah baru:', formData);
        await timelineApi.addTimeline(formData);
        toast.success('Tahapan baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchTimeline();
    } catch (error) {
      // ✅ Log error lengkap
      console.error('Error handleSave:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.error || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await timelineApi.deleteTimeline(itemToDelete);
      toast.success('Tahapan berhasil dihapus!');
      setTimelines(timelines.filter((t) => t.id_timeline !== itemToDelete));
    } catch (error) {
      toast.error('Gagal menghapus tahapan');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    // ✅ Hapus min-h-screen & bg-gray-50, padding mobile-first
    <div className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 animate__animated animate__fadeInUp animate__faster">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Timeline PPDB
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500 font-medium">
            Atur jadwal dan alur pendaftaran siswa baru secara sistematis.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-red-800 text-white px-4 py-3 sm:px-5 rounded-xl font-bold text-sm transition shadow-lg shadow-primary/30 min-h-[44px] w-full sm:w-auto">
          <FaPlus size={13} /> Tambah Tahapan
        </button>
      </div>

      {/* Container Alur Pendaftaran */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden w-full max-w-3xl mx-auto">
        {/* Watermark dekoratif — sembunyikan di mobile agar tidak makan ruang */}
        <FaRegClock className="hidden sm:block absolute -top-10 -right-10 text-gray-50 text-[180px] pointer-events-none" />

        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 sm:mb-10 relative z-10">
          Alur Pendaftaran Aktif
        </h2>

        {isLoading ? (
          // ✅ Skeleton loading — lebih informatif dari teks saja
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                  {i < 3 && <div className="w-0.5 h-12 bg-gray-100 mt-2" />}
                </div>
                <div className="flex-1 pb-6">
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : timelines.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-sm">Belum ada tahapan PPDB yang dibuat.</p>
          </div>
        ) : (
          <div className="relative z-10">
            {timelines.map((item, index) => (
              <TimelineItem
                key={item.id_timeline}
                item={item}
                index={index}
                isLast={index === timelines.length - 1}
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

      <ModalFormPPDB
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingData}
        isSubmitting={isSubmitting}
        id_admin={1}
      />
      <ModalKonfirmasi
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        judul="Hapus Tahapan PPDB"
        pesan="Apakah Anda yakin ingin menghapus jadwal ini? Data yang dihapus tidak akan tampil di website publik."
        teksKonfirmasi="Ya, Hapus"
        teksBatal="Batal"
      />
    </div>
  );
};

export default AdminPPDBPage;
