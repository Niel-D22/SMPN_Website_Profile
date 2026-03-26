import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Partial/Footer';
import Header from './Partial/Header/Header';

const Publiclayout = () => (
  <div>
    <Header />
    <main className="min-h-[80vh] w-full mx-auto ">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Publiclayout;
