import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaTrophy, FaChartLine } from 'react-icons/fa';
import { prestasiApi } from '../../Api/prestasiApi';
import PrestasiItem from '../../components/admin/Prestasi/PrestasiItem';
import ModalFormPrestasi, {
  TINGKAT_OPTIONS,
} from '../../components/admin/Prestasi/ModalFormPrestasi';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import 'animate.css';

const TABS = ['Semua', ...TINGKAT_OPTIONS];

const AdminPrestasiPage = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchPrestasi = async () => {
    try {
      setIsLoading(true);
      const response = await prestasiApi.getPrestasi();
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];
      setList(data);
    } catch {
      toast.error('Gagal memuat data prestasi');
      setList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestasi();
    // eslint-disable-next-line
  }, []);

  const handleSave = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingData) {
        await prestasiApi.updatePrestasi(editingData.id_prestasi, payload);
        toast.success('Prestasi berhasil diperbarui!');
      } else {
        await prestasiApi.addPrestasi(payload);
        toast.success('Prestasi berhasil dicatat!');
      }
      setIsModalOpen(false);
      setEditingData(null);
      fetchPrestasi();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || 'Gagal menyimpan data prestasi';
      toast.error(typeof msg === 'string' ? msg : 'Gagal menyimpan data prestasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete == null) return;
    try {
      await prestasiApi.deletePrestasi(itemToDelete);
      toast.success('Prestasi berhasil dihapus');
      setList((prev) => prev.filter((p) => p.id_prestasi !== itemToDelete));
    } catch {
      toast.error('Gagal menghapus prestasi');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return list.filter((p) => {
      if (activeTab !== 'Semua' && (p.tingkat || '') !== activeTab) return false;
      if (!q) return true;
      const tahun = String(p.tahun_meraih ?? '');
      return (
        (p.nama_lomba && p.nama_lomba.toLowerCase().includes(q)) ||
        (p.nama_pemenang && p.nama_pemenang.toLowerCase().includes(q)) ||
        (p.tingkat && p.tingkat.toLowerCase().includes(q)) ||
        tahun.includes(q)
      );
    });
  }, [list, searchTerm, activeTab]);

  const stats = useMemo(() => {
    const year = new Date().getFullYear();
    return {
      total: list.length,
      tahunIni: list.filter((p) => Number(p.tahun_meraih) === year).length,
      nasional: list.filter((p) => (p.tingkat || '').toLowerCase().includes('nasional')).length,
    };
  }, [list]);

  return (
    <div className="w-full max-w-full px-2 py-3 xs:px-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 animate__animated animate__fadeInUp animate__faster">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-5 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="mb-1 sm:mb-0">
          <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Prestasi Siswa
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-600 max-w-xl">
            Kelola pencatatan prestasi lomba dan penghargaan yang ditampilkan di halaman publik.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-red-800 text-white px-3 py-2 xs:px-4 xs:py-3 rounded-xl font-bold text-xs xs:text-sm shadow-lg shadow-red-900/25 transition min-h-[42px] w-full sm:w-auto">
          <FaPlus size={13} /> <span className="hidden xs:inline">Tambah Prestasi</span>
          <span className="inline xs:hidden">Tambah</span>
        </button>
      </div>

      {/* Stats Cards — 1 column on mobile, 3 in sm+ */}
      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 sm:gap-4 mb-5 sm:mb-6">
        {[
          {
            icon: <FaChartLine size={18} />,
            bg: 'bg-red-50',
            color: 'text-primary',
            label: 'Total Tercatat',
            val: stats.total,
          },
          {
            icon: <FaTrophy size={18} />,
            bg: 'bg-amber-50',
            color: 'text-amber-700',
            label: 'Prestasi Tahun Ini',
            val: stats.tahunIni,
          },
          {
            icon: <FaTrophy size={18} />,
            bg: 'bg-blue-50',
            color: 'text-blue-700',
            label: 'Tingkat Nasional',
            val: stats.nasional,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-3 xs:p-4 sm:p-5 shadow-sm flex items-center gap-2 xs:gap-3 sm:gap-4">
            <div
              className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] xs:text-xs font-bold text-gray-500 uppercase tracking-wide">
                {s.label}
              </p>
              <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 tabular-nums">
                {s.val}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar Filter + Search */}
      <div className="bg-white p-2 xs:p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 xs:gap-3 lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
        {/* Tabs scroll horizontal */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 xs:px-3 xs:py-2 sm:px-4 rounded-xl text-xs xs:text-sm font-bold whitespace-nowrap transition-all min-h-[36px] ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-md shadow-red-900/20'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}>
              {tab}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative w-full xs:w-56 sm:w-64 lg:w-72 shrink-0">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari lomba, nama, tingkat…"
            className="w-full bg-gray-50 py-2 pl-9 pr-4 rounded-xl text-xs xs:text-sm outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition"
          />
        </div>
      </div>

      {/* Grid Konten */}
      {isLoading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
              <div className="h-24 xs:h-28 sm:h-36 bg-gray-200" />
              <div className="p-3 xs:p-4 space-y-3">
                <div className="h-4 w-4/5 bg-gray-200 rounded-lg" />
                <div className="h-3 w-full bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 xs:py-14 sm:py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-50 mb-2 xs:mb-4 text-primary/40">
            <FaTrophy size={22} className="xs:size-[26px]" />
          </div>
          <p className="text-gray-700 font-semibold text-xs xs:text-sm sm:text-base">
            {list.length === 0
              ? 'Belum ada prestasi yang dicatat.'
              : 'Tidak ada data untuk filter ini.'}
          </p>
          <p className="text-[11px] xs:text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto px-3">
            {list.length === 0
              ? 'Klik "Tambah Prestasi" untuk mencatat lomba atau penghargaan pertama.'
              : 'Ubah tab tingkat atau kata kunci pencarian.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
          {filtered.map((item) => (
            <PrestasiItem
              key={item.id_prestasi}
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

      <ModalFormPrestasi
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingData(null);
        }}
        onSave={handleSave}
        initialData={editingData}
        isSubmitting={isSubmitting}
      />

      <ModalKonfirmasi
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        judul="Hapus prestasi?"
        pesan="Data prestasi ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
        teksKonfirmasi="Ya, hapus"
        teksBatal="Batal"
      />
    </div>
  );
};

export default AdminPrestasiPage;
