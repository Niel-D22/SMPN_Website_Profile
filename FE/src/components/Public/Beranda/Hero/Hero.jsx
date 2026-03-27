import React from 'react';

const Hero = () => {
  return (
    <section className="relative w-full">
      <div className="w-full h-[400px] md:h-[500px] overflow-hidden relative">
        <img
          src="/Images/HeroSMP3.png"
          alt="Gedung SMPN 3 Manado"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 -mt-24 md:-mt-32 relative z-10">
        <div className="bg-white rounded-[30px] shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
            <img
              src="/images/kepala-sekolah.jpg"
              alt="Kepala Sekolah"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-grow text-center md:text-left">
            <h2 className="text-[#0c356a] text-2xl md:text-3xl font-bold leading-tight">
              Sambutan Kepala Sekolah
            </h2>
            <h3 className="text-[#0c356a] text-xl font-semibold mb-3">nama kepalasekolah</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-2xl">
              Selamat datang di website resmi SMP Negeri 3 Manado. Kami berkomitmen untuk
              menciptakan lingkungan belajar yang inovatif, berkarakter, dan mencetak generasi
              unggul bagi masa depan bangsa.
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-10">
            <h4 className="text-[#0c356a] font-bold text-center mb-6 text-lg">
              Statistik Data Sekolah
            </h4>
            <div className="flex justify-center gap-8 md:gap-10">
              <div className="text-center">
                <p className="text-[#0c356a] text-3xl font-extrabold">42</p>
                <p className="text-xs text-gray-500 font-medium">Guru & Staf</p>
              </div>
              <div className="h-10 w-[1px] bg-gray-300 self-center hidden md:block"></div>
              <div className="text-center">
                <p className="text-[#0c356a] text-3xl font-extrabold">862</p>
                <p className="text-xs text-gray-500 font-medium">Siswa</p>
              </div>
              <div className="h-10 w-[1px] bg-gray-300 self-center hidden md:block"></div>
              <div className="text-center">
                <p className="text-[#0c356a] text-3xl font-extrabold">28</p>
                <p className="text-xs text-gray-500 font-medium">Kelas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
