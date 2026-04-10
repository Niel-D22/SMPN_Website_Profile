import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaTrophy, FaChartLine } from 'react-icons/fa';

import { prestasiApi } from '../../Api/prestasiApi';
import PrestasiItem from '../../components/admin/Prestasi/PrestasiItem';
import ModalFormPrestasi, {
  TINGKAT_OPTIONS,
} from '../../components/admin/Prestasi/ModalFormPrestasi';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';

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
    const tahunIni = list.filter((p) => Number(p.tahun_meraih) === year).length;
    const nasional = list.filter((p) =>
      (p.tingkat || '').toLowerCase().includes('nasional')
    ).length;
    return { total: list.length, tahunIni, nasional };
  }, [list]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 relative">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            Prestasi Siswa
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-xl">
            Kelola pencatatan prestasi lomba dan penghargaan. Data ini dapat ditampilkan di halaman
            publik sekolah.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary hover:bg-red-800 text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-red-900/25 transition">
          <FaPlus size={14} /> Tambah prestasi
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-primary flex items-center justify-center">
            <FaChartLine size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Total tercatat
            </p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FaTrophy size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Prestasi tahun ini
            </p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{stats.tahunIni}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FaTrophy size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Tingkat nasional
            </p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{stats.nasional}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 overflow-x-auto p-1 scrollbar-thin">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-md shadow-red-900/20'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-80 shrink-0 px-2 pb-2 lg:pb-0 lg:pr-2">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari lomba, nama, tingkat, atau tahun…"
            className="w-full bg-gray-50 py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="h-36 skeleton-shimmer" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-4/5 skeleton-shimmer rounded-lg" />
                <div className="h-4 w-full skeleton-shimmer rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4 text-primary/40">
            <FaTrophy size={28} />
          </div>
          <p className="text-gray-700 font-semibold">
            {list.length === 0
              ? 'Belum ada prestasi yang dicatat.'
              : 'Tidak ada data untuk filter ini.'}
          </p>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            {list.length === 0
              ? 'Klik “Tambah prestasi” untuk mencatat lomba atau penghargaan pertama.'
              : 'Ubah tab tingkat atau kata kunci pencarian.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
        pesan="Data prestasi ini akan dihapus permanen dari basis data. Tindakan ini tidak dapat dibatalkan."
        teksKonfirmasi="Ya, hapus"
        teksBatal="Batal"
      />
    </div>
  );
};

export default AdminPrestasiPage;
