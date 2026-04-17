import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages Public
import BerandaPage from './pages/public/BerandaPage';
import ProfilPages from './pages/public/ProfilPages';
import VisiMisiPages from './pages/public/VisiMisiPages';
import PrestasiPages from './pages/public/PrestasiPages';
import DirektoriStafPages from './pages/public/DirektoriStafPages';
import BeritaPages from './pages/public/BeritaPages';
import Publiclayout from './layout/Publiclayout';
import JadwalPPDB from './pages/public/JadwalPPDB.jsx';
import Faq from './pages/public/Faq.jsx';
// Pages Auth
import LoginPage from './pages/auth/LoginPage';
import LupaPasswordPage from './pages/auth/LupaPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import ProtectedRoute from './pages/auth/ProtecttedRoute.jsx';
import GuestRoute from './pages/auth/GuestRoute';

// Pages Admin
import AdminLayout from './layout/AdminLayout.jsx';

// Import Halaman Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBeritaPage from './pages/admin/AdminBeritaPage';
import AdminDirektoriPage from './pages/admin/AdminDirektoriPage';
import AdminPesanPage from './pages/admin/AdminPesanPage';
import AdminPengaturanPage from './pages/admin/AdminPengaturanProfilSekolahPage.jsx';
import AdminProfilPage from './pages/admin/AdminProfilPage';
import AdminPPDBPage from './pages/admin/AdminPPDBPage';
import AdminPrestasiPage from './pages/admin/AdminPrestasiPage';
import AdminGaleriPage from './pages/admin/AdminGaleriPage.jsx';
import AdminFAQPage from './pages/admin/AdminFAQPage';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Router>
        <Routes>
          <Route path="/" element={<Publiclayout />}>
            <Route index element={<BerandaPage />} />
            <Route path="profil" element={<ProfilPages />} />
            <Route path="visi-misi" element={<VisiMisiPages />} />
            <Route path="prestasi" element={<PrestasiPages />} />
            <Route path="direktori-staf" element={<DirektoriStafPages />} />
            <Route path="berita" element={<BeritaPages />} />
            <Route path="ppdb" element={<JadwalPPDB />} />
            <Route path="faq" element={<Faq />} />
          </Route>

          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/lupa-password"
            element={
              <GuestRoute>
                <LupaPasswordPage />
              </GuestRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <GuestRoute>
                <ResetPasswordPage />
              </GuestRoute>
            }
          />
          {/* Admin routes (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="berita" element={<AdminBeritaPage />} />
            <Route path="direktori" element={<AdminDirektoriPage />} />
            <Route path="profil" element={<AdminProfilPage />} />
            <Route path="pesan" element={<AdminPesanPage />} />
            <Route path="pengaturan" element={<AdminPengaturanPage />} />
            <Route path="ppdb" element={<AdminPPDBPage />} />
            <Route path="prestasi" element={<AdminPrestasiPage />} />
            <Route path="galeri" element={<AdminGaleriPage />} />
            <Route path="faq" element={<AdminFAQPage />} />
          </Route>

          {/* Auto Redirect jika link asal-asalan */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
