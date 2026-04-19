import React from 'react';
import { FaLightbulb, FaBullseye, FaCheckCircle, FaChevronDown } from 'react-icons/fa';

const VisiMisiPages = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* =========================================
          HERO SECTION
      ========================================== */}
      <section className="relative w-full min-h-screen flex items-center justify-center">
        {/* Gambar Latar Belakang */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop')",
          }}></div>

        {/* Overlay Hitam Transparan */}
        <div className="absolute inset-0 bg-black/65"></div>

        {/* Konten Teks Hero */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
            Visi & Misi Sekolah
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed drop-shadow-md mb-10">
            Mengenal lebih dekat arah, tujuan, dan komitmen SMPN 3 Manado dalam membentuk generasi
            penerus bangsa yang unggul, berkarakter, dan berprestasi.
          </p>
          {/* Tombol Scroll Down */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2">
            <span className="text-white/50 text-xs font-bold tracking-widest uppercase">
              Scroll Down
            </span>
            <FaChevronDown className="text-white/80 text-3xl" />
          </div>
        </div>
      </section>

      {/* =========================================
          VISI SECTION (Teks Kiri, Gambar Kanan)
      ========================================== */}
      <section className="relative w-full bg-white pt-20 pb-32 md:pt-32 md:pb-48 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Teks Kiri */}
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#003366] mb-6">Visi</h2>
            <div className="w-16 h-1.5 bg-yellow-400 mb-6 rounded-full"></div>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed text-justify">
              "Menjadi institusi pendidikan yang unggul dalam mutu, berpijak pada iman dan taqwa,
              berkarakter luhur, berbudaya lingkungan, serta mampu bersaing di era globalisasi."
            </p>
          </div>

          {/* Ilustrasi Kanan */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end relative">
            {/* Efek Glow di belakang ikon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100 rounded-full blur-3xl"></div>

            <div className="relative bg-gradient-to-br from-blue-50 to-white border border-gray-100 shadow-2xl p-12 rounded-[3rem] transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <FaLightbulb className="text-7xl md:text-9xl text-[#003366] drop-shadow-md" />
              {/* Aksen bintang/cahaya kecil */}
              <div className="absolute top-8 right-8 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-10 left-10 w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Pembatas Melengkung (Curved Divider) persis seperti di gambar */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-[60px] md:h-[120px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.2,192.39,107.57Z"
              fill="#fef2f2" // Warna merah sangat pudar (sambungan dari section bawah)
            ></path>
          </svg>
        </div>
      </section>

      {/* =========================================
          MISI SECTION (Gambar Kiri, Teks Kanan)
      ========================================== */}
      {/* Background gradasi dari merah pudar (fef2f2) ke merah sedang (fecaca) persis gambar */}
      <section className="relative w-full bg-gradient-to-b from-red-50 via-red-100 to-red-200 pt-16 pb-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Ilustrasi Kiri */}
          <div className="flex justify-center md:justify-start relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-200 rounded-full blur-3xl"></div>

            <div className="relative bg-gradient-to-br from-white to-red-50 border border-red-100 shadow-2xl p-12 rounded-[3rem] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <FaBullseye className="text-7xl md:text-9xl text-[#b30000] drop-shadow-md" />
              {/* Aksen panah/lingkaran kecil */}
              <div className="absolute top-10 left-8 w-4 h-4 bg-[#003366] rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Teks Kanan */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#003366] mb-6">Misi</h2>
            <div className="w-16 h-1.5 bg-[#b30000] mb-8 rounded-full"></div>

            <div className="space-y-5">
              {[
                'Meningkatkan kualitas proses belajar mengajar secara inovatif dan kreatif.',
                'Menumbuhkembangkan nilai-nilai religius dan budi pekerti luhur dalam kehidupan sehari-hari.',
                'Membekali siswa dengan ilmu pengetahuan dan teknologi agar mampu bersaing di tingkat nasional maupun internasional.',
                'Mewujudkan lingkungan sekolah yang bersih, sehat, asri, dan nyaman.',
                'Mengembangkan bakat dan minat siswa melalui kegiatan ekstrakurikuler yang terprogram.',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#b30000]">
                    <FaCheckCircle size={20} />
                  </div>
                  <p className="text-gray-800 text-base md:text-lg leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisiMisiPages;
