import React, { useState, useEffect } from 'react';
import { prestasiApi } from '../../../../Api/prestasiApi';

const BACKEND_URL = import.meta.env.VITE_MEDIA_URL;

const normalizeImg = (img) => {
  if (!img) return null;
  if (/^https?:\/\//.test(img)) return img;
  if (img.startsWith('/')) return `${BACKEND_URL}${img}`;
  return `${BACKEND_URL}/uploads/prestasi/${img}`;
};

const parseFotoUrl = (fotoStr) => {
  if (!fotoStr) return [];
  try {
    const parsed = JSON.parse(fotoStr);
    if (Array.isArray(parsed)) return parsed;
    return [parsed];
  } catch {
    return fotoStr.split(',').filter(Boolean);
  }
};

const flattenPrestasiToCards = (prestasiList) => {
  const cards = [];
  prestasiList.forEach((prestasi) => {
    const fotos = parseFotoUrl(prestasi.foto_url);
    if (fotos.length === 0) {
      cards.push({
        key: `${prestasi.id_prestasi}-0`,
        judul: prestasi.nama_lomba || 'Prestasi',
        pemenang: prestasi.nama_pemenang || '',
        tingkat: prestasi.tingkat || '',
        tahun: prestasi.tahun_meraih || '',
        img: null,
      });
    } else {
      fotos.forEach((foto, i) => {
        cards.push({
          key: `${prestasi.id_prestasi}-${i}`,
          judul: prestasi.nama_lomba || 'Prestasi',
          pemenang: prestasi.nama_pemenang || '',
          tingkat: prestasi.tingkat || '',
          tahun: prestasi.tahun_meraih || '',
          img: normalizeImg(foto),
        });
      });
    }
  });
  return cards;
};

/* ─── MAIN ─── */
const PrestasiMarqueeSection = () => {
  const [allCards, setAllCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      try {
        const data = await prestasiApi.getPrestasi();
        if (active && Array.isArray(data)) {
          setAllCards(flattenPrestasiToCards(data));
        }
      } catch (err) {
        console.error('Gagal mengambil data prestasi:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const half = Math.ceil(allCards.length / 2);
  const row1 = allCards.slice(0, half);
  const row2 = allCards.slice(half);

  return (
    <section
      className="relative py-20 overflow-hidden w-full"
      style={{ background: 'radial-gradient(circle at center, #cc0000 0%, #4a0000 100%)' }}>
      <style>{`
        @keyframes scroll-left  { 0% { transform: translateX(0);    } 100% { transform: translateX(-50%); } }
        @keyframes scroll-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0);    } }
        .animate-scroll-left  { animation: scroll-left  35s linear infinite; }
        .animate-scroll-right { animation: scroll-right 35s linear infinite; }
        .marquee-container:hover .animate-scroll-left,
        .marquee-container:hover .animate-scroll-right { animation-play-state: paused; }

        /* Overlay info — tersembunyi, muncul saat hover */
        .pcard-overlay {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .pcard-wrap:hover .pcard-overlay {
          opacity: 1;
          transform: translateY(0);
        }
        /* Gradient gelap — tipis saat normal, tebal saat hover */
        .pcard-grad {
          background: linear-gradient(to top, rgba(0,0,0,0.08) 0%, transparent 100%);
          transition: background 0.35s ease;
        }
        .pcard-wrap:hover .pcard-grad {
          background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 55%, transparent 100%);
        }
        /* Scale gambar saat hover */
        .pcard-img {
          transition: transform 0.5s ease;
        }
        .pcard-wrap:hover .pcard-img {
          transform: scale(1.08);
        }
      `}</style>

      {/* HEADER */}
      <div
        className="max-w-4xl mx-auto text-center px-6 mb-12 relative z-10"
        data-aos="zoom-in"
        data-aos-delay="300">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Prestasi Siswa SMPN 3 Manado
        </h2>
        <p className="text-red-100 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
          Setiap tahun, SMP Negeri 3 Manado mencetak prestasi yang membanggakan di tingkat regional
          hingga nasional. Inilah wajah-wajah inspiratif yang berhasil membuktikan bahwa hasil yang
          hebat bermula dari kegigihan.
        </p>
        <a
          href="/prestasi"
          className="inline-block bg-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          style={{ color: '#7a0000' }}>
          Lihat Semua Prestasi
        </a>
      </div>

      {/* MARQUEE */}
      <div className="marquee-container flex flex-col gap-6 relative z-0 mt-10 w-full overflow-hidden">
        {isLoading ? (
          <>
            <div className="flex gap-4 pl-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shrink-0 bg-red-900/40 animate-pulse"
                />
              ))}
            </div>
            <div className="flex gap-4 pl-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shrink-0 bg-red-900/40 animate-pulse"
                />
              ))}
            </div>
          </>
        ) : allCards.length === 0 ? (
          <p className="text-center text-red-200 text-sm py-10">Belum ada data prestasi.</p>
        ) : (
          <>
            <div className="flex w-max animate-scroll-left gap-4 pl-6">
              {[...row1, ...row1].map((card, i) => (
                <MarqueeCard key={`r1-${i}`} card={card} />
              ))}
            </div>
            {row2.length > 0 && (
              <div className="flex w-max animate-scroll-right gap-4 pl-6">
                {[...row2, ...row2].map((card, i) => (
                  <MarqueeCard key={`r2-${i}`} card={card} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

/* ─── CARD: foto saja, hover → info muncul ─── */
const MarqueeCard = ({ card }) => {
  const fallback =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop';

  return (
    <div className="pcard-wrap relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden cursor-pointer shrink-0 shadow-2xl border border-white/10">
      {/* Gambar — satu-satunya yang tampil saat tidak di-hover */}
      <img
        src={card.img || fallback}
        alt={card.judul}
        className="pcard-img w-full h-full object-cover"
        onError={(e) => {
          e.target.src = fallback;
        }}
      />

      {/* Gradient gelap — tipis normal, tebal saat hover */}
      <div className="pcard-grad absolute inset-0" />

      {/* Info — hanya muncul saat hover */}
      <div className="pcard-overlay absolute bottom-0 left-0 w-full p-5">
        <p
          className="text-white font-extrabold leading-tight line-clamp-2 mb-1"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>
          {card.judul}
        </p>
        {card.pemenang && (
          <p className="text-white/80 text-xs font-medium line-clamp-1">{card.pemenang}</p>
        )}
        {(card.tingkat || card.tahun) && (
          <p className="text-white/60 text-xs mt-0.5">
            {[card.tingkat, card.tahun].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrestasiMarqueeSection;
