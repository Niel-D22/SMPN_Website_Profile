/** Origin backend untuk gambar/file statis. Kosong = same-origin (pakai proxy Vite). */
export function getApiOrigin() {
  const env = import.meta.env.VITE_API_URL;
  if (env && String(env).trim()) return String(env).replace(/\/$/, '');
  return '';
}

/** URL lengkap untuk path seperti /uploads/galeri/... */
export function mediaUrl(filePath) {
  if (!filePath) return '';
  if (/^https?:\/\//i.test(filePath)) return filePath;
  const origin = getApiOrigin();
  return origin ? `${origin}${filePath}` : filePath;
}

/** Base URL untuk axios instance (/api atau https://host/api). */
export function getApiBaseUrl() {
  const origin = getApiOrigin();
  return origin ? `${origin}/api` : '/api';
}
