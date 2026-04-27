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

  if (!id_admin) {
    return res.status(403).json({ message: 'Token admin tidak valid' });
  }

  const files = req.files || [];

  const foto_url = files.map((f) => f.path);
  // ini HARUS Cloudinary URL

  const result = await pool.query(
    `INSERT INTO prestasi 
    (nama_lomba, nama_pemenang, tingkat, tahun_meraih, foto_url, id_admin)
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [nama_lomba, nama_pemenang, tingkat, tahun_meraih, JSON.stringify(foto_url), id_admin]
  );

  res.status(201).json(result.rows[0]);
};

const updatePrestasi = async (req, res) => {
  const { id } = req.params;
  const { nama_lomba, nama_pemenang, tingkat, tahun_meraih, existing_fotos } = req.body;

  const id_admin = req.admin?.id;
  if (!id_admin) {
    return res.status(403).json({ message: 'Token admin tidak valid' });
  }

  const oldFotos = existing_fotos ? JSON.parse(existing_fotos) : [];
  const newFotos = (req.files || []).map((f) => f.path);

  const finalFotos = [...oldFotos, ...newFotos];

  const result = await pool.query(
    `UPDATE prestasi 
     SET nama_lomba=$1, nama_pemenang=$2, tingkat=$3, tahun_meraih=$4, foto_url=$5, updated_at=CURRENT_TIMESTAMP
     WHERE id_prestasi=$6 RETURNING *`,
    [nama_lomba, nama_pemenang, tingkat, tahun_meraih, JSON.stringify(finalFotos), id]
  );

  res.json(result.rows[0]);
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
