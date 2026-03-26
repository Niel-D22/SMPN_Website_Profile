import React from 'react';
import Hero from '../../components/Public/Beranda/Hero/Hero';
import BeritaSingkat from '../../components/Public/Beranda/BeritaSingkat/BeritaSingkat';
import JadwalPPDB from '../../components/Public/Beranda/JadwalPPDB/JadwalPPDB';
import FAQ from '../../components/Public/Beranda/FAQ/Faq';
import KotakSaran from '../../components/Public/Beranda/Kotak Saran/KotakSaran';

const BerandaPage = () => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center  min-h-[70vh]">
      <Hero />
      <BeritaSingkat />
      <JadwalPPDB />
      <FAQ />
      <KotakSaran />
    </div>
  );
};

export default BerandaPage;
