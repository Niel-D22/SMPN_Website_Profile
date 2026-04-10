import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaTrophy, FaUser, FaCalendarAlt, FaImages } from 'react-icons/fa';
import { mediaUrl } from '../../../config/apiBase';

const badgeForTingkat = (tingkat) => {
  const t = (tingkat || '').toLowerCase();
  if (t.includes('nasional')) return 'bg-red-100 text-red-800 border-red-200/80';
  if (t.includes('provinsi')) return 'bg-blue-100 text-blue-800 border-blue-200/80';
  if (t.includes('kabupaten') || t.includes('kota'))
    return 'bg-amber-100 text-amber-900 border-amber-200/80';
  if (t.includes('antar')) return 'bg-violet-100 text-violet-800 border-violet-200/80';
  return 'bg-emerald-100 text-emerald-800 border-emerald-200/80';
};

const PrestasiItem = ({ item, onEdit, onDelete }) => {
  // Parsing foto agar bisa menerima format Array atau String yang dipisah koma (jika dari DB)
  let photos = [];
  if (item.foto_url) {
    if (Array.isArray(item.foto_url)) {
      photos = item.foto_url;
    } else if (typeof item.foto_url === 'string') {
      try {
        photos = JSON.parse(item.foto_url); // Jika disave sebagai JSON string
      } catch (e) {
        photos = item.foto_url.split(',').map((s) => s.trim()); // Jika disave pakai koma
      }
    }
  }

  const firstPhoto = photos.length > 0 ? mediaUrl(photos[0]) : null;
  const tahun = item.tahun_meraih ?? '—';
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    setImgBroken(!firstPhoto);
  }, [firstPhoto]);

  const showPhoto = firstPhoto && !imgBroken;

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-red-100 transition-all duration-300 group">
      <div className="relative h-36 bg-gradient-to-br from-gray-100 to-red-50/40 overflow-hidden">
        {showPhoto ? (
          <>
            <img
              src={firstPhoto}
              alt=""
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              onError={() => setImgBroken(true)}
            />
            {/* --- INDIKATOR MULTI FOTO --- */}
            {photos.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <FaImages size={12} />+{photos.length - 1} Foto
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/35">
            <FaTrophy className="drop-shadow-sm" size={44} />
          </div>
        )}

        {/* Badge Tingkat & Tahun */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-sm ${badgeForTingkat(item.tingkat)}`}>
            {item.tingkat || '—'}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/90 text-gray-700 border border-gray-200/80 flex items-center gap-1 shadow-sm">
            <FaCalendarAlt size={10} className="text-primary" />
            {tahun}
          </span>
        </div>

        {/* Tombol Aksi */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-xl bg-white/95 text-gray-500 hover:text-blue-600 hover:bg-blue-50 shadow-md border border-gray-100 transition"
            title="Edit">
            <FaEdit size={15} />
          </button>
          <button
            onClick={() => onDelete(item.id_prestasi)}
            className="p-2 rounded-xl bg-white/95 text-gray-500 hover:text-red-600 hover:bg-red-50 shadow-md border border-gray-100 transition"
            title="Hapus">
            <FaTrash size={15} />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3
          className="text-base font-bold text-gray-900 leading-snug line-clamp-2"
          title={item.nama_lomba}>
          {item.nama_lomba}
        </h3>
        <p className="text-sm text-gray-600 flex items-start gap-2">
          <FaUser className="text-primary shrink-0 mt-0.5" size={14} />
          <span className="line-clamp-2 font-medium">{item.nama_pemenang}</span>
        </p>
      </div>
    </article>
  );
};

export default PrestasiItem;
