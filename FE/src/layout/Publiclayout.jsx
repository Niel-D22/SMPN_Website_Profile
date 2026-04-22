import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Partial/Footer';
import Header from './Partial/Header/Header';

const Publiclayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div>
      <Header />
      <main className="min-h-[80vh] w-full mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Publiclayout;
