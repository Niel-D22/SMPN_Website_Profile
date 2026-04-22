const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper: Ubah string foto dari DB jadi Array
const parseFotoUrl = (fotoStr) => {
  if (!fotoStr) return [];
  try {
    return JSON.parse(fotoStr);
  } catch {
    return fotoStr.split(',').filter(Boolean);
  }
};

// Helper: Hapus file fisik dari server
const hapusFileFisik = (fotoArray) => {
  fotoArray.forEach((foto) => {
    if (foto && foto.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../', foto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });
};

// GET semua prestasi (Publik)
const getPrestasi = async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM prestasi ORDER BY tahun_meraih DESC');
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST tambah prestasi — 1 Data, Banyak Foto
const addPrestasi = async (req, res) => {
  const { nama_lomba, nama_pemenang, tingkat, tahun_meraih } = req.body;
  const id_admin = req.admin?.id;

  if (id_admin == null) return res.status(403).json({ message: 'Token admin tidak valid' });
  if (!nama_lomba || !nama_pemenang || !tingkat || !tahun_meraih) {
    if (req.files?.length) req.files.forEach((f) => fs.existsSync(f.path) && fs.unlinkSync(f.path));
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    const files = req.files || [];
    let foto_url_simpan = null;

    if (files.length > 0) {
      // Gabungkan semua nama file jadi 1 Array, lalu ubah ke string JSON
      const filePaths = files.map((f) => f.path);
      foto_url_simpan = JSON.stringify(filePaths);
    }

    // INSERT HANYA 1 KALI (TIDAK ADA LOOPING)
    const result = await pool.query(
      `INSERT INTO prestasi (nama_lomba, nama_pemenang, tingkat, tahun_meraih, foto_url, id_admin)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nama_lomba, nama_pemenang, tingkat, tahun_meraih, foto_url_simpan, id_admin]
    );

    res.status(201).json({ message: 'Prestasi berhasil dicatat!', data: result.rows[0] });
  } catch (error) {
    if (req.files?.length) req.files.forEach((f) => fs.existsSync(f.path) && fs.unlinkSync(f.path));
    console.error('Error addPrestasi:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT update prestasi (Multi Foto)
const updatePrestasi = async (req, res) => {
  const { id } = req.params;
  const { nama_lomba, nama_pemenang, tingkat, tahun_meraih, existing_fotos } = req.body;
  const id_admin = req.admin?.id;

  if (id_admin == null) {
    if (req.files?.length) req.files.forEach((f) => fs.unlinkSync(f.path));
    return res.status(403).json({ message: 'Token admin tidak valid' });
  }

  try {
    // 1. Ambil foto-foto lama yang masih dipertahankan admin (dari frontend)
    let fotoLamaDipertahankan = [];
    if (existing_fotos) {
      fotoLamaDipertahankan = JSON.parse(existing_fotos);
    }

    // 2. Ambil foto-foto baru yang baru saja diupload
    const fileBaru = req.files || [];
    const pathFileBaru = fileBaru.map((f) => f.path);

    // 3. Gabungkan foto lama dan foto baru
    const finalFotos = [...fotoLamaDipertahankan, ...pathFileBaru];
    const foto_url_simpan = finalFotos.length > 0 ? JSON.stringify(finalFotos) : null;

    // 4. Hapus foto lama di server yang DIBUANG oleh admin
    const resultDb = await pool.query('SELECT foto_url FROM prestasi WHERE id_prestasi = $1', [id]);
    const fotoDbLama = parseFotoUrl(resultDb.rows[0]?.foto_url);

    const fotoDibuang = fotoDbLama.filter((url) => !fotoLamaDipertahankan.includes(url));
    hapusFileFisik(fotoDibuang); // Eksekusi hapus file dari server

    // 5. Lakukan UPDATE database HANYA 1 KALI
    const result = await pool.query(
      `UPDATE prestasi SET nama_lomba=$1, nama_pemenang=$2, tingkat=$3, tahun_meraih=$4, foto_url=$5, id_admin=$6 WHERE id_prestasi=$7 RETURNING *`,
      [nama_lomba, nama_pemenang, tingkat, tahun_meraih, foto_url_simpan, id_admin, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.json({ message: 'Data prestasi diperbarui!', data: result.rows[0] });
  } catch (error) {
    if (req.files?.length) req.files.forEach((f) => fs.unlinkSync(f.path));
    console.error('Error updatePrestasi:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE hapus prestasi (dan semua fotonya)
const deletePrestasi = async (req, res) => {
  const { id } = req.params;
  try {
    // Cari dulu URL fotonya untuk dihapus file fisiknya
    const resultDb = await pool.query('SELECT foto_url FROM prestasi WHERE id_prestasi = $1', [id]);
    if (resultDb.rowCount === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });

    const fotoDb = parseFotoUrl(resultDb.rows[0].foto_url);
    hapusFileFisik(fotoDb); // Hapus semua file fisiknya

    // Baru hapus datanya dari DB
    await pool.query('DELETE FROM prestasi WHERE id_prestasi = $1', [id]);

    res.json({ message: 'Prestasi dan semua fotonya berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addPrestasi, getPrestasi, updatePrestasi, deletePrestasi };
