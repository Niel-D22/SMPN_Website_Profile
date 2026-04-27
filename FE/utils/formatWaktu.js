// src/utils/formatWaktu.js

const WITA_OFFSET = 8 * 60 * 60 * 1000; // 8 jam dalam milidetik

// Helper untuk menambah 8 jam pada sebuah tanggal
function tambah8Jam(date) {
  if (!date) return null;
  const d = new Date(date);
  return new Date(d.getTime() + WITA_OFFSET);
}

// Format tanggal saja — untuk tgl_publikasi, tgl_upload, dll
export const formatTanggal = (dateString) => {
  if (!dateString) return 'Belum dipublikasi';
  const dateWITA = tambah8Jam(dateString);
  return dateWITA.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Format tanggal + jam WITA — untuk updated_at, tanggal_balas, dll
export const formatWaktuWITA = (dateString) => {
  if (!dateString) return '';
  const dateWITA = tambah8Jam(dateString);
  return (
    dateWITA.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' WITA'
  );
};

// Format waktu relatif — untuk "2 jam yang lalu", dll
export const hitungWaktuLalu = (tanggal) => {
  if (!tanggal) return '';
  const tanggalWITA = tambah8Jam(tanggal);
  const detikLalu = Math.floor((new Date() - tanggalWITA) / 1000);
  let interval = detikLalu / 86400;
  if (interval > 1) return Math.floor(interval) + ' hari yang lalu';
  interval = detikLalu / 3600;
  if (interval > 1) return Math.floor(interval) + ' jam yang lalu';
  interval = detikLalu / 60;
  if (interval > 1) return Math.floor(interval) + ' menit yang lalu';
  return 'Baru saja';
};

// Format tanggal pendek — untuk footer card, badge, dll
export const formatTanggalPendek = (tanggal) => {
  if (!tanggal) return '';
  const dateWITA = tambah8Jam(tanggal);
  return dateWITA.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Format tanggal lengkap — untuk tooltip
export const formatTanggalLengkap = (tanggal) => {
  if (!tanggal) return '';
  const dateWITA = tambah8Jam(tanggal);
  return dateWITA.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
