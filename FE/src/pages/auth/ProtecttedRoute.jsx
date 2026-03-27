import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Kita cek apakah ada token di localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    // Jika tidak ada token, paksa user kembali ke halaman login
    // 'replace' digunakan agar user tidak bisa klik tombol 'back' ke halaman terproteksi
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, tampilkan halaman yang ingin diakses (children)
  return children;
};

export default ProtectedRoute;
