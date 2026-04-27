const pool = require('../config/db');

const getGaleri = async (req, res) => {
  try {
    const { kategori } = req.query;
    let query =
      'SELECT id_galeri, judul_foto, deskripsi, file_url, kategori, tgl_upload, updated_at FROM galeri';
    const params = [];
    if (kategori && kategori !== 'semua') {
      query += ' WHERE kategori = $1';
      params.push(kategori);
    }
    query += ' ORDER BY tgl_upload DESC';
    const data = await pool.query(query, params);
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addGaleri = async (req, res) => {
  const { judul_foto, deskripsi, kategori = 'umum' } = req.body;
  const id_admin = req.admin.id;
  if (!req.file) return res.status(400).json({ message: 'File wajib diupload' });

  const file_url = req.file.path; // ← URL Cloudinary
  try {
    const result = await pool.query(
      `INSERT INTO galeri (judul_foto, deskripsi, file_url, kategori, id_admin)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [judul_foto, deskripsi, file_url, kategori, id_admin]
    );
    res.status(201).json({ message: 'Berhasil tambah', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGaleri = async (req, res) => {
  const { id } = req.params;
  const { judul_foto, deskripsi, kategori = 'umum' } = req.body;
  try {
    let query, params;
    if (req.file) {
      const file_url = req.file.path; // ← URL Cloudinary
      query = `UPDATE galeri SET judul_foto=$1, deskripsi=$2, file_url=$3, kategori=$4, updated_at=CURRENT_TIMESTAMP WHERE id_galeri=$5 RETURNING *`;
      params = [judul_foto, deskripsi, file_url, kategori, id];
    } else {
      query = `UPDATE galeri SET judul_foto=$1, deskripsi=$2, kategori=$3, updated_at=CURRENT_TIMESTAMP WHERE id_galeri=$4 RETURNING *`;
      params = [judul_foto, deskripsi, kategori, id];
    }
    const result = await pool.query(query, params);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json({ message: 'Berhasil update', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGaleri = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM galeri WHERE id_galeri = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Foto tidak ditemukan' });
    res.json({ message: 'Foto berhasil dihapus dari galeri' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addGaleri, getGaleri, updateGaleri, deleteGaleri };
