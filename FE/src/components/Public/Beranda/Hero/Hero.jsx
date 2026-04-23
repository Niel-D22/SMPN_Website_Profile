import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="relative w-full">
      <div className="w-full h-[400px] md:h-[500px] overflow-hidden relative">
        <img
          src="/Images/heroBeranda.png"
          alt="Gedung SMPN 3 Manado"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 -mt-20 md:-mt-32 relative z-10">
        <div className="bg-white rounded-[30px] shadow-2xl p-4 md:p-12 flex flex-col md:flex-row items-center gap-4 md:gap-8 border border-gray-100">
          <div className="w-20 h-20 md:w-40 md:h-40 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-md transition-all duration-200">
            <FaUserCircle className="text-gray-400 w-full h-full" />
          </div>

          <div className="flex-grow text-center md:text-left">
            <h2 className="text-[#0c356a] text-lg md:text-3xl font-bold leading-tight">
              Sambutan Kepala Sekolah
            </h2>
            <h3 className="text-[#0c356a] text-base md:text-xl font-semibold mb-2 md:mb-3">
              Olga Mardiane Rarung, S.Pd., M.Pd.
            </h3>
            <p className="text-gray-600 leading-relaxed text-xs md:text-base max-w-2xl">
              Selamat datang di website resmi SMP Negeri 3 Manado. Kami berkomitmen untuk
              menciptakan lingkungan belajar yang inovatif, berkarakter, dan mencetak generasi
              unggul bagi masa depan bangsa.
            </p>
          </div>
          <div className="max-w-screen-xl mx-auto">
            <div className="w-full p-4 md:p-6 flex flex-col border-l-1 border-gray-300 mt-4 md:mt-6">
              <h4 className="text-[#0c356a] font-bold text-center mb-4 md:mb-6 text-base md:text-lg">
                Statistik Data Sekolah
              </h4>
              <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-10">
                <div className="flex flex-row md:flex-row gap-2 md:gap-10 w-full justify-center items-center">
                  <div className="text-center flex-1">
                    <p className="text-[#0c356a] text-xl md:text-3xl font-extrabold">42</p>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium">Guru & Staf</p>
                  </div>
                  <div className="h-4 w-[1px] bg-gray-300 md:h-10 md:w-[1px] md:self-center md:block block"></div>
                  <div className="text-center flex-1">
                    <p className="text-[#0c356a] text-xl md:text-3xl font-extrabold">862</p>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium">Siswa</p>
                  </div>
                  <div className="h-4 w-[1px] bg-gray-300 md:h-10 md:w-[1px] md:self-center md:block block"></div>
                  <div className="text-center flex-1">
                    <p className="text-[#0c356a] text-xl md:text-3xl font-extrabold">28</p>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium">Kelas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistik Data Sekolah Pindah di Bawah Icon & Sambutan untuk Desktop & Tablet */}

        {/* End Statistik */}
      </div>
    </section>
  );
};

export default Hero;
