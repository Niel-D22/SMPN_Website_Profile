import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaRegClock } from 'react-icons/fa';
import { timelineApi } from '../../Api/timelineApi';
import TimelineItem from '../../components/admin/PPDB/TimelineItem';
import ModalFormPPDB from '../../components/admin/PPDB/ModalFormPPDB';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';

const AdminPPDBPage = () => {
  const [timelines, setTimelines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States untuk Hapus
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
        await timelineApi.updateTimeline(editingData.id_timeline, formData);
        toast.success('Tahapan berhasil diperbarui!');
      } else {
        await timelineApi.addTimeline(formData);
        toast.success('Tahapan baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchTimeline();
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data');
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
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Timeline PPDB</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Atur jadwal dan alur pendaftaran siswa baru secara sistematis.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-red-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-primary/30">
          <FaPlus size={14} /> Tambah Tahapan
        </button>
      </div>

      {/* CONTAINER ALUR PENDAFTARAN */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Watermark Jam di Pojok Kanan Atas (Sesuai Desain) */}
        <FaRegClock className="absolute -top-10 -right-10 text-gray-50 text-[180px] pointer-events-none" />

        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-10 relative z-10">
          Alur Pendaftaran Aktif
        </h2>

        {isLoading ? (
          <div className="text-center py-10 text-gray-400 font-medium">
            Memuat alur pendaftaran...
          </div>
        ) : timelines.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">Belum ada tahapan PPDB yang dibuat.</p>
          </div>
        ) : (
          <div className="relative z-10">
            {timelines.map((item, index) => (
              <TimelineItem
                key={item.id_timeline}
                item={item}
                index={index}
                isLast={index === timelines.length - 1} // Agar garis putus di item terakhir
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

      {/* MODAL FORM */}
      <ModalFormPPDB
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingData}
        isSubmitting={isSubmitting}
      />

      {/* MODAL HAPUS */}
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
