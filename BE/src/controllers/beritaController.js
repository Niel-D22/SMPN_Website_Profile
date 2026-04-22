const pool = require('../config/db');

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

const getBeritaAdmin = async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM berita_pengumuman ORDER BY id_berita DESC');
    res.json(data.rows);
  } catch (error) {
    console.error('Error getBeritaAdmin:', error);
    res.status(500).json({ error: error.message });
  }
};

const addBerita = async (req, res) => {
  const { judul, isi_konten, kategori, status } = req.body;
  const id_admin = req.admin ? req.admin.id : null;

  if (!judul || !isi_konten || !kategori) {
    return res.status(400).json({ message: 'Judul, isi_konten, dan kategori wajib diisi!' });
  }

  try {
    // ✅ Simpan gambar_url dengan URL lengkap
    const gambar_url = req.file ? req.file.path : null;

    const result = await pool.query(
      `INSERT INTO berita_pengumuman 
       (judul, isi_konten, kategori, status, gambar_url, id_admin) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [judul, isi_konten, kategori, status || 'active', gambar_url, id_admin]
    );

    res.status(201).json({ message: 'Berita berhasil dibuat!', data: result.rows[0] });
  } catch (error) {
    console.error('Error addBerita:', error);
    res.status(500).json({ error: error.message });
  }
};

const getBeritaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID berita tidak valid' });
    }
    const data = await pool.query('SELECT * FROM berita_pengumuman WHERE id_berita = $1', [id]);
    if (data.rows.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }
    res.json(data.rows[0]);
  } catch (error) {
    console.error('Error getBeritaById:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const { kategori, judul, isi_konten, status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID berita tidak valid' });
    }
    if (!kategori || !judul || !isi_konten) {
      return res.status(400).json({ message: 'Kategori, judul, dan isi_konten wajib diisi!' });
    }

    // ✅ Ambil gambar lama kalau tidak ada file baru
    const existing = await pool.query(
      'SELECT gambar_url FROM berita_pengumuman WHERE id_berita = $1',
      [id]
    );
    const oldGambarUrl = existing.rows[0]?.gambar_url;

    const gambar_url = req.file ? req.file.path : oldGambarUrl; // ✅ pakai gambar lama kalau tidak ada file baru

    const result = await pool.query(
      `UPDATE berita_pengumuman 
       SET kategori=$1, judul=$2, isi_konten=$3, status=$4, gambar_url=$5 
       WHERE id_berita=$6 RETURNING *`,
      [kategori, judul, isi_konten, status || 'active', gambar_url, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    res.json({ message: 'Berita berhasil diperbarui!', data: result.rows[0] });
  } catch (error) {
    console.error('Error addBerita:', JSON.stringify(error, null, 2)); // ← ganti ini
    res.status(500).json({ error: error.message });
  }
};

const deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID berita tidak valid' });
    }
    const result = await pool.query('DELETE FROM berita_pengumuman WHERE id_berita = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }
    res.json({ message: 'Berita berhasil dihapus!' });
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
  deleteBerita,
  updateBerita,
};
