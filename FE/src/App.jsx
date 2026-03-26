import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BerandaPage from './pages/public/BerandaPage';
import ProfilPages from './pages/public/ProfilPages';
import VisiMisiPages from './pages/public/VisiMisiPages';
import PrestasiPages from './pages/public/PrestasiPages';
import DirektoriStafPages from './pages/public/DirektoriStafPages';
import BeritaPages from './pages/public/BeritaPages';
import Publiclayout from './layout/Publiclayout';
import LoginPage from './pages/auth/LoginPage';
import LupaPasswordPage from './pages/auth/LupaPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={<Publiclayout />}>
          <Route index element={<BerandaPage />} />
          <Route path="profil" element={<ProfilPages />} />
          <Route path="visi-misi" element={<VisiMisiPages />} />
          <Route path="prestasi" element={<PrestasiPages />} />
          <Route path="direktori-staf" element={<DirektoriStafPages />} />
          <Route path="berita" element={<BeritaPages />} />
        </Route>
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/lupa-password" element={<LupaPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin routes */}
      </Routes>
    </Router>
  );
}

export default App;
