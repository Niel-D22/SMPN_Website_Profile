import React, { useState, useEffect } from 'react';
import FormProfilSekolah from '../../components/admin/ProfilSekolah/FormProfilSekolah';
import { profilSekolahApi } from '../../Api/profilSekolahApi';
import Skeleton from '../../components/ui/Skeleton';
import { toast } from 'react-toastify';
import ModalKonfirmasi from '../../components/admin/ModalKonfirmasi';
import { FiLoader } from 'react-icons/fi';

import 'animate.css';

const AdminPengaturanProfilSekolahPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    nama_sekolah: '',
    npsn: '',
    akreditas: '',
    no_telepon: '',
    email_sekolah: '',
    alamat: '',
    visi: '',
    misi: '',
    sejarah: '',
    jumlah_siswa: '',
    jumlah_guru: '',
    jumlah_kelas: '',
    sambutan_kepsek: '',
    logo_url: '',
    updated_at: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (attempt = 1) => {
      try {
        const [res] = await Promise.all([
          profilSekolahApi.getProfilSekolah(),
          new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 2000 : 0)),
        ]);

        const dataSekolah = res?.data?.data ?? res?.data ?? res;

        if (dataSekolah && isMounted) {
          setFormData((prev) => ({ ...prev, ...dataSekolah }));
          toast.success('Data profil sekolah berhasil dimuat!');
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Percobaan ke-${attempt} gagal:`, error);
        if (isMounted) {
          setTimeout(() => fetchData(attempt + 1), 3000);
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
        setFormData((prev) => ({ ...prev, logo_url: reader.result }));
      };
    }
  };

  const handleSimpan = async () => {
    setIsSaving(true);

    // Toast loading muncul saat proses berjalan
    const toastId = toast.loading('Menyimpan perubahan...');

    try {
      await profilSekolahApi.updateProfilSekolah(formData);

      // Ganti toast loading → success
      toast.update(toastId, {
        render: '✅ Profil sekolah berhasil diperbarui!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    } catch (error) {
      console.error(error);

      // Ganti toast loading → error
      toast.update(toastId, {
        render: `❌ ${error.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'}`,
        type: 'error',
        isLoading: false,
        autoClose: 4000,
        closeOnClick: true,
      });
    } finally {
      setIsSaving(false);
      setShowModal(false);
    }
  };

  const handleKonfirmasiSimpan = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // --- SKELETON LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-10 animate__animated animate__fadeInUp animate__faster">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-9 w-64 mb-2 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-10 w-44 rounded-lg" />
        </div>

        <div className="p-8 rounded-2xl shadow-sm border bg-white border-gray-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="h-6 w-56 rounded-md" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-6">
            <div className="h-44 w-full rounded-xl border-2 border-gray-100 flex flex-col items-center justify-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <Skeleton className="h-4 w-32 mb-2 rounded" />
                <Skeleton className="h-11 w-full rounded-lg" />
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
            <div className="flex flex-col h-full">
              <Skeleton className="h-4 w-16 mb-2 rounded" />
              <Skeleton className="h-full min-h-[9rem] w-full rounded-lg" />
            </div>
            <div className="flex flex-col h-full">
              <Skeleton className="h-4 w-32 mb-2 rounded" />
              <Skeleton className="h-full min-h-[8rem] w-full rounded-lg" />
            </div>
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
            <div className="flex flex-col h-full">
              <Skeleton className="h-4 w-16 mb-2 rounded" />
              <Skeleton className="h-full min-h-[8rem] w-full rounded-lg" />
            </div>
            <div className="col-span-1 lg:col-span-3 pt-5 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-28 mb-2 rounded" />
                    <Skeleton className="h-11 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-1 lg:col-span-3 pt-5 border-t border-gray-100">
              <Skeleton className="h-4 w-44 mb-2 rounded" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
            <div className="col-span-1 lg:col-span-3 pt-5 border-t border-gray-100">
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
    <div className="min-h-screen bg-gray-50 py-10 px-15">
      {/* OVERLAY LOADING — muncul di tengah layar saat isSaving */}
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center gap-4 animate__animated animate__fadeIn animate__faster">
            <FiLoader className="text-red-700 text-4xl animate-spin" />
            <p className="text-gray-700 font-semibold text-base">Menyimpan perubahan...</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profil SMP 3 Manado</h1>
          <p className="text-sm font-semibold text-gray-800 mt-1">Keterangan</p>
        </div>

        <div> </div>

        {/* TOMBOL SIMPAN — spinner saat loading */}
        <button
          onClick={handleKonfirmasiSimpan}
          disabled={isSaving}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition disabled:bg-gray-400 disabled:opacity-70 min-w-[160px] justify-center">
          {isSaving ? (
            <>
              <FiLoader className="animate-spin text-base" />
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
      </div>

      {/* FORM */}
      <FormProfilSekolah
        formData={formData}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
      />

      {/* Modal Konfirmasi */}
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
