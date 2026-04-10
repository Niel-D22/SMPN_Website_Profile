import React from 'react';
import FAQItem from './FAQItem';

// Data Sampel berdasarkan atribut tabel: id_faq, pertanyaan, kategori
const sampleFaqData = [
  {
    id: 1,
    pertanyaan: 'Bagaimana cara mendaftar siswa baru secara online?',
    kategori: 'Pendaftaran',
  },
  {
    id: 2,
    pertanyaan: 'Apa saja dokumen persyaratan untuk PPDB tahun ini?',
    kategori: 'Pendaftaran',
  },
  { id: 3, pertanyaan: 'Kapan jadwal libur semester genap dimulai?', kategori: 'Akademik' },
  {
    id: 4,
    pertanyaan: 'Bagaimana sistem penilaian rapor kurikulum merdeka?',
    kategori: 'Kurikulum',
  },
  {
    id: 5,
    pertanyaan: 'Apakah sekolah menyediakan fasilitas bus antar-jemput?',
    kategori: 'Fasilitas',
  },
];

const FAQList = () => {
  return (
    <div className="space-y-4">
      {sampleFaqData.map((faq) => (
        <FAQItem key={faq.id} faq={faq} />
      ))}
    </div>
  );
};

export default FAQList;
