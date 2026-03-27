import React from 'react';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Jika SUDAH punya token tapi maksa buka halaman Login,
    // lempar dia balik ke Dashboard Admin
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Jika BELUM punya token, biarkan dia lihat form Login
  return children;
};

export default GuestRoute;
