import React, { useState, useEffect } from 'react';
import FormInformasiDasar from '../../components/admin/AdminProfil/FormInformasiDasar';
import FormKeamananAkun from '../../components/admin/AdminProfil/FormKeamananAkun';
import { profilApi } from '../../Api/adminProfilApi';
import Skeleton from '../../components/ui/Skeleton'; // Sesuaikan path import-nya!

const AdminProfilPage = () => {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let didCancel = false;

    const fetchDataProfil = async () => {
      try {
        if (!didCancel) setIsLoading(true);

        const response = await profilApi.getProfile();
        setTimeout(() => {
          if (!didCancel) {
            setAdminData(response.data || response);
            setIsLoading(false);
          }
        }, 1000);
      } catch (error) {
        if (!didCancel) {
          console.error('Gagal mengambil data profil:', error);
          setIsLoading(false);
        }
      }
    };

    fetchDataProfil();

    return () => {
      didCancel = true;
    };
  }, []);

  // Responsive Skeleton Loading
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Skeleton Header */}
        <div>
          <Skeleton className="h-8 w-3/5 sm:w-1/3 rounded-md mb-2" />
          <Skeleton className="h-4 w-4/5 sm:w-2/3 rounded-md" />
        </div>
        {/* Skeleton Konten (Responsive) */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Box Kiri: Tiruan Form Informasi Dasar */}
          <div className="flex-1 bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6 lg:mb-0">
            <Skeleton className="h-6 w-1/2 sm:w-1/3 rounded-md mb-6" />
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3 sm:w-2/5 mb-2 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div className="flex-1 mt-5 sm:mt-0">
                  <Skeleton className="h-4 w-1/3 sm:w-2/5 mb-2 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
              <div>
                <Skeleton className="h-4 w-2/5 sm:w-1/3 mb-2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <Skeleton className="h-9 w-2/3 sm:w-1/4 rounded-lg mt-4" />
            </div>
          </div>
          {/* Box Kanan: Tiruan Form Keamanan Akun */}
          <div className="flex-1 bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <Skeleton className="h-6 w-1/2 sm:w-1/3 rounded-md mb-6" />
            <div className="space-y-5">
              <div>
                <Skeleton className="h-4 w-2/5 sm:w-1/3 mb-2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="h-4 w-3/5 sm:w-1/2 mb-2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <Skeleton className="h-9 w-2/3 sm:w-1/4 rounded-lg mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        Gagal memuat profil. Silakan login kembali.
      </div>
    );
  }

  return (
    <div className="max-w-6xl  mx-auto py-8 px-4 space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Profil Administrator</h1>
        <p className="text-gray-500 mt-1">Kelola informasi data diri dan keamanan akun Anda.</p>
      </div>
      {/* Konten Profil */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex-1 mb-6 lg:mb-0">
          <FormInformasiDasar data={adminData} />
        </div>
        <div className="flex-1">
          <FormKeamananAkun data={adminData} />
        </div>
      </div>
    </div>
  );
};

export default AdminProfilPage;
