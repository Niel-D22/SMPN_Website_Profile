import React, { useLayoutEffect, useRef } from 'react';

const ModalKonfirmasi = ({
  isOpen,
  onClose,
  onConfirm,
  judul,
  pesan,
  teksBatal = 'Batal',
  teksKonfirmasi = 'Ya, Lanjutkan',
}) => {
  const modalRef = useRef(null);

  // Pakai useLayoutEffect & requestAnimationFrame supaya selalu cepat ngikut viewport (tanpa delay)
  useLayoutEffect(() => {
    if (!isOpen || !modalRef.current) return;

    let afId;

    const updatePosition = () => {
      const scrollY = window.scrollY;
      modalRef.current.style.top = `${scrollY + window.innerHeight / 2}px`;
      modalRef.current.style.left = `${window.innerWidth / 2}px`;
      modalRef.current.style.transform = 'translate(-50%, -50%)';
      modalRef.current.style.position = 'absolute';
    };

    // Handler supaya selalu langsung update saat scroll/resize
    const handle = () => {
      // pakai RAF supaya respon lebih cepat dari event browser biasa
      afId && cancelAnimationFrame(afId);
      afId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);

    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
      afId && cancelAnimationFrame(afId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-full min-h-screen bg-black/30 backdrop-blur-[2px] flex flex-col items-center justify-start md:justify-center px-2 transition-opacity">
      {/* Overlay Klik close jika klik luar modal */}
      <div
        className="absolute inset-0 z-0"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Tutup Modal"
        role="presentation"></div>

      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-4 xs:p-6
        mt-20 mb-4 md:m-0
        transition-all duration-200
        scale-100 opacity-100
        border border-gray-100"
        style={{}}>
        {/* Header Modal */}
        <h3 className="text-lg xs:text-xl md:text-xl font-bold text-gray-800 mb-2 text-center">
          {judul}
        </h3>

        {/* Isi Pesan */}
        <p className="text-gray-600 mb-6 text-sm xs:text-base text-center">{pesan}</p>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-2 xs:gap-3 sm:flex-row justify-center sm:justify-end pt-2">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-white bg-red-700 hover:bg-red-800 font-semibold transition shadow-md text-sm">
            {teksKonfirmasi}
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold transition text-sm">
            {teksBatal}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalKonfirmasi;
