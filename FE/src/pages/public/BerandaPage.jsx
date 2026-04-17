import React from 'react';
import Hero from '../../components/Public/Beranda/Hero/Hero';
import BeritaSingkat from '../../components/Public/Beranda/BeritaSingkat/BeritaSingkat';
import KotakSaran from '../../components/Public/Beranda/Kotak Saran/KotakSaran';
import TentangKamiSection from '../../components/Public/Beranda/Tentang Kami/TentangKamiSection';
import PrestasiMarqueeSection from '../../components/Public/Beranda/PrestasiSlider/PrestasiMarqueeSection';

const BerandaPage = () => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center  min-h-[70vh]">
      <Hero />

      <TentangKamiSection />
      <PrestasiMarqueeSection />
      <BeritaSingkat />

      <KotakSaran />
    </div>
  );
};

export default BerandaPage;
