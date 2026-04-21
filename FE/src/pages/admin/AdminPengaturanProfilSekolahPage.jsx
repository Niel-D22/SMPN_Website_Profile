import React, { useState, useEffect } from 'react';
import FormProfilSekolah from '../../components/admin/ProfilSekolah/FormProfilSekolah';
import { profilSekolahApi } from '../../Api/profilApi';
import Skeleton from '../../components/ui/Skeleton';
import { toast } from 'react-toastify';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import 'animate.css';

const AdminPengaturanProfilSekolahPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    nama_sekolah: '',
    npsn: '',
    no_telepon: '',
    email_sekolah: '',
    alamat: '',
    visi: '',
    misi: '',
    sejarah: '',
    logo_url: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (attempt = 1) => {
      try {
        const [res] = await Promise.all([
          profilSekolahApi.getProfilSekolah(),
          new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 2000 : 0)), // 2 detik di percobaan pertama
        ]);

        const dataSekolah = res.data?.data || res.data || res;

        if (dataSekolah && isMounted) {
          setFormData((prev) => ({ ...prev, ...dataSekolah }));
          toast.success('Data profil sekolah berhasil dimuat!');
          setIsLoading(false); // ✅ hanya matiin skeleton kalau berhasil
        }
      } catch (error) {
        console.error(`Percobaan ke-${attempt} gagal:`, error);
        if (isMounted) {
          setTimeout(() => fetchData(attempt + 1), 3000); // retry diam-diam tiap 3 detik
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Simpan hasil base64 ke formData.logo_url
        setFormData((prev) => ({ ...prev, logo_url: reader.result }));
      };
    }
  };

  const handleSimpan = async () => {
    setIsSaving(true);
    try {
      await profilSekolahApi.updateProfilSekolah(formData);
      toast.success('Profil sekolah berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
      setShowModal(false);
    }
  };

  const handleKonfirmasiSimpan = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // --- TAMPILAN LOADING SKELETON YANG SUPER DETAIL ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-10 animate__animated animate__fadeInUp animate__faster">
        {/* Header Page Skeleton */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-9 w-64 mb-2 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-10 w-44 rounded-lg" />
        </div>

        {/* Kotak Form Skeleton */}
        <div className="p-8 rounded-2xl shadow-sm border bg-white border-gray-100">
          {/* Header Dalam Skeleton */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="h-6 w-56 rounded-md" />
          </div>

          {/* Grid Utama Skeleton */}
          <div className=" grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-6">
            {/* Kolom 1: Logo (Diberi border dashed biar mirip aslinya) */}
            <div className="h-44 w-full rounded-xl border-2 border-gray-100  flex flex-col items-center justify-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>

            {/* Kolom 2: Nama, NPSN, Akreditas */}
            <div className="flex flex-col gap-4">
              <div>
                <Skeleton className="h-4 w-32 mb-2 rounded" /> {/* Label Skeleton */}
                <Skeleton className="h-11 w-full rounded-lg" /> {/* Input Skeleton */}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Skeleton className="h-4 w-12 mb-2 rounded" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2 rounded" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Kolom 3: Visi */}
            <div className="flex flex-col h-full">
              <Skeleton className="h-4 w-16 mb-2 rounded" />
              <Skeleton className="h-full min-h-[9rem] w-full rounded-lg" />
            </div>

            {/* --- Baris 2 --- */}

            {/* Kolom 1: Alamat */}
            <div className="flex flex-col h-full">
              <Skeleton className="h-4 w-32 mb-2 rounded" />
              <Skeleton className="h-full min-h-[8rem] w-full rounded-lg" />
            </div>

            {/* Kolom 2: Telp & Email */}
            <div className="flex flex-col gap-5 h-full">
              <div>
                <Skeleton className="h-4 w-28 mb-2 rounded" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2 rounded" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </div>

            {/* Kolom 3: Misi */}
            <div className="flex flex-col h-full">
              <Skeleton className="h-4 w-16 mb-2 rounded" />
              <Skeleton className="h-full min-h-[8rem] w-full rounded-lg" />
            </div>

            {/* --- Baris 3: Sejarah --- */}
            <div className="col-span-1 lg:col-span-3 mt-2 pt-6 border-t border-gray-100">
              <Skeleton className="h-4 w-32 mb-2 rounded" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN UTAMA ---
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 ">
      {/* HEADER: Judul & Tombol Simpan */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profil SMP 3 Manado</h1>
          <p className="text-sm font-semibold text-gray-800 mt-1">Keterangan</p>
        </div>

        {/* TOMBOL SIMPAN */}
        <button
          onClick={handleKonfirmasiSimpan}
          disabled={isSaving}
          className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition disabled:bg-gray-400 disabled:text-white disabled:opacity-70">
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* KONTEN UTAMA: Form */}
      <FormProfilSekolah
        formData={formData}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
      />

      {/* Modal Konfirmasi sebelum simpan */}
      {showModal && (
        <ModalKonfirmasi
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleSimpan}
          judul="Simpan Perubahan"
          pesan="Apakah Anda yakin ingin menyimpan data profil sekolah ini?"
          teksKonfirmasi="Ya, Simpan"
        />
      )}
    </div>
  );
};

export default AdminPengaturanProfilSekolahPage;
