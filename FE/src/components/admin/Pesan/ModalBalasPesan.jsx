import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ModalBalasPesan = ({ isOpen, onClose, pesan, onKirim, isSubmitting }) => {
  const [jawaban, setJawaban] = useState('');
  const [kirimSalinan, setKirimSalinan] = useState(true);

  // Kosongkan form setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setJawaban('');
      setKirimSalinan(true);
    }
  }, [isOpen]);

  if (!isOpen || !pesan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-900">Balas Pesan Publik</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-primary">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-gray-500 mb-1 uppercase">
              Pesan Asli dari {pesan.nama_pengirim}:
            </p>
            <p className="text-sm text-gray-700 italic">"{pesan.isi_pesan}"</p>
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold text-gray-900 mb-2 block">Tulis Jawaban</label>
            <textarea
              value={jawaban}
              onChange={(e) => setJawaban(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 p-4 rounded-xl h-32 resize-none outline-none focus:ring-2 focus:ring-primary"
              placeholder="Berikan jawaban yang ramah dan solutif..."></textarea>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <input
              type="checkbox"
              id="copy"
              checked={kirimSalinan}
              onChange={(e) => setKirimSalinan(e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
            />
            <label htmlFor="copy" className="text-sm text-gray-600 cursor-pointer">
              Kirim salinan balasan ke email pengirim
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-primary/10 transition">
              Batal
            </button>
            <button
              onClick={() => onKirim(jawaban, kirimSalinan)}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-red-800 text-white font-bold transition flex items-center justify-center gap-2 disabled:opacity-70">
              {isSubmitting ? 'Mengirim...' : 'Kirim Balasan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBalasPesan;
