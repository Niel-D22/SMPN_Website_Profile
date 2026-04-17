import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { faqApi } from '../../Api/faqApi'; // Sesuaikan path ini dengan lokasimu

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  // Mengambil data FAQ dari Backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        const data = await faqApi.getFaq();
        setFaqs(data || []);
      } catch (error) {
        console.error('Gagal mengambil data FAQ:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Fungsi untuk membuka/menutup accordion
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className=" py-24 px-6 sm:px-8 lg:px-12  min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* === HEADER FAQ === */}
        <div className="text-center mb-16">
          {/* Badge Label (Seperti di gambar referensi) */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#003366]"></span>
            <span className="text-[#003366] text-sm font-bold tracking-widest uppercase">FAQ</span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#003366] leading-tight mb-4 tracking-tight">
            Punya pertanyaan tentang SMPN 3 Manado? <br className="hidden md:block" />
            Cek jawabannya di sini!
          </h2>

          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Baca lebih lanjut untuk melihat serangkaian pertanyaan yang sering muncul tentang
            sekolah kami. Kamu akan lebih tahu tentang kami dan yakin untuk bergabung.
          </p>
        </div>

        {/* === LIST FAQ === */}
        <div className="space-y-4">
          {isLoading ? (
            // Skeleton Loading (Tampil saat data sedang di-fetch)
            [1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white h-16 w-full rounded-2xl border border-gray-200 animate-pulse"></div>
            ))
          ) : faqs.length === 0 ? (
            // Tampilan jika data FAQ kosong
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 font-medium">Belum ada pertanyaan yang ditambahkan.</p>
            </div>
          ) : (
            // Render Data FAQ dari Backend
            faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.id_faq || index}
                  className={`bg-white rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-2 border-[#003366] shadow-md' // Aktif: Border Biru Navy
                      : 'border-2 border-gray-100 hover:border-gray-300' // Tidak aktif: Border Abu-abu
                  }`}>
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between items-center p-5 md:px-8 focus:outline-none group">
                    {/* Teks Pertanyaan (Menggunakan Nomor Urut) */}
                    <div className="flex items-start text-left pr-4">
                      <span
                        className={`text-base md:text-lg font-bold mr-2 transition-colors ${isOpen ? 'text-[#003366]' : 'text-gray-800 group-hover:text-[#003366]'}`}>
                        {index + 1}.
                      </span>
                      <h3
                        className={`text-base md:text-lg font-bold transition-colors ${isOpen ? 'text-[#003366]' : 'text-gray-800 group-hover:text-[#003366]'}`}>
                        {faq.pertanyaan}
                      </h3>
                    </div>

                    {/* Ikon Plus (+) dan Minus (-) */}
                    <div
                      className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#b30000]' : 'text-gray-400 group-hover:text-[#b30000]'}`}>
                      {isOpen ? <FaMinus size={18} /> : <FaPlus size={18} />}
                    </div>
                  </button>

                  {/* Area Jawaban (Animasi Slide Down) */}
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="p-5 md:px-8 pt-0 text-gray-600 leading-relaxed text-sm md:text-base">
                      {/* Pemisah Garis Halus */}
                      <div className="w-full h-px bg-gray-100 mb-4"></div>
                      {faq.jawaban}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Faq;
