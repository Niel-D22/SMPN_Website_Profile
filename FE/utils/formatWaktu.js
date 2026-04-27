const parseUTC = (dateString) => new Date(dateString);
// Format tanggal saja
export const formatTanggal = (dateString) => {
  if (!dateString) return 'Belum dipublikasi';

  const date = parseUTC(dateString);
  if (!date) return '';

  return date.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Makassar',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatWaktuWITA = (dateString) => {
  if (!dateString) return '';

  // 1. Pastikan dateString diproses sebagai UTC jika dari database tanpa timezone.
  // Jika formatnya 'YYYY-MM-DD HH:mm:ss' (contoh MySQL), ubah spasinya jadi 'T'
  // dan tambahkan 'Z' agar dibaca sebagai UTC secara absolut.
  let validDateString = dateString;

  if (typeof validDateString === 'string') {
    // Format umum database "2024-05-15 14:30:00" -> "2024-05-15T14:30:00Z"
    if (validDateString.includes(' ') && !validDateString.includes('T')) {
      validDateString = validDateString.replace(' ', 'T') + 'Z';
    }
    // Jika server kamu mengirim waktu sudah dalam WIB, dan kamu ingin ubah ke WITA
    // Kamu perlu manual menambahkan offset. Tapi asumsikan data ini UTC ('Z')
  }

  const date = new Date(validDateString);

  // Cek apakah tanggal valid
  if (isNaN(date.getTime())) return '';

  return (
    date.toLocaleString('id-ID', {
      timeZone: 'Asia/Makassar',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' WITA'
  );
};
// Waktu relatif (ini tetap pakai Date normal)
export const hitungWaktuLalu = (tanggal) => {
  if (!tanggal) return '';

  const target = parseDate(tanggal);
  if (!target) return '';

  const now = new Date();
  const detikLalu = Math.floor((now - target) / 1000);

  if (detikLalu < 60) return 'Baru saja';
  if (detikLalu < 3600) return Math.floor(detikLalu / 60) + ' menit yang lalu';
  if (detikLalu < 86400) return Math.floor(detikLalu / 3600) + ' jam yang lalu';
  return Math.floor(detikLalu / 86400) + ' hari yang lalu';
};

// Format pendek
export const formatTanggalPendek = (tanggal) => {
  if (!tanggal) return '';

  const date = new Date(tanggal);

  return date.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Makassar',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Format lengkap
export const formatTanggalLengkap = (tanggal) => {
  if (!tanggal) return '';

  const date = new Date(tanggal);

  return date.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Makassar',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
