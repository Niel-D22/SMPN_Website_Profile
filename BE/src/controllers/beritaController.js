const pool = require('../config/db');

// A. PUBLIC (hanya status active)
const getBeritaPublic = async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM berita_pengumuman WHERE status = 'active' ORDER BY id_berita DESC"
    );
    res.json(data.rows);
  } catch (error) {
    console.error('Error getBeritaPublic:', error);
    res.status(500).json({ error: error.message });
  }
};

// B. ADMIN (semua data)
const getBeritaAdmin = async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM berita_pengumuman ORDER BY id_berita DESC');
    res.json(data.rows);
  } catch (error) {
    console.error('Error getBeritaAdmin:', error);
    res.status(500).json({ error: error.message });
  }
};

// C. TAMBAH BERITA
const addBerita = async (req, res) => {
  try {
    const { judul, isi_konten, kategori, status } = req.body;

    if (!judul || !isi_konten || !kategori) {
      return res.status(400).json({
        message: 'Judul, isi_konten, dan kategori wajib diisi!',
      });
    }

    // ambil file
    const gambar_url = req.file ? `/uploads/berita/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO berita_pengumuman 
       (judul, isi_konten, kategori, status, gambar_url) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [judul, isi_konten, kategori, status || 'active', gambar_url]
    );

    res.status(201).json({
      message: 'Berita berhasil ditambahkan',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error addBerita:', error);
    res.status(500).json({ error: error.message });
  }
};

// D. DETAIL BERITA
const getBeritaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID tidak valid' });
    }

    const result = await pool.query('SELECT * FROM berita_pengumuman WHERE id_berita = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getBeritaById:', error);
    res.status(500).json({ error: error.message });
  }
};

// E. UPDATE BERITA
const updateBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi_konten, kategori, status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID tidak valid' });
    }

    if (!judul || !isi_konten || !kategori) {
      return res.status(400).json({
        message: 'Judul, isi_konten, dan kategori wajib diisi!',
      });
    }

    // ambil file baru kalau ada
    let gambar_url = req.file ? `/uploads/berita/${req.file.filename}` : req.body.gambar_url;

    const result = await pool.query(
      `UPDATE berita_pengumuman 
       SET judul=$1, isi_konten=$2, kategori=$3, status=$4, gambar_url=$5 
       WHERE id_berita=$6 RETURNING *`,
      [judul, isi_konten, kategori, status || 'active', gambar_url, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    res.json({
      message: 'Berita berhasil diupdate',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updateBerita:', error);
    res.status(500).json({ error: error.message });
  }
};

// F. DELETE
const deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID tidak valid' });
    }

    const result = await pool.query('DELETE FROM berita_pengumuman WHERE id_berita = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    res.json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    console.error('Error deleteBerita:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBeritaPublic,
  getBeritaAdmin,
  addBerita,
  getBeritaById,
  updateBerita,
  deleteBerita,
};
