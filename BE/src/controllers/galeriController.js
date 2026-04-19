const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Path uploads ada di BE/uploads/galeri (bukan di dalam src/)
// __dirname = BE/src/controllers, jadi naik 2 level ke BE/
const hapusFileLama = async (id) => {
  try {
    const result = await pool.query('SELECT file_url FROM galeri WHERE id_galeri = $1', [id]);
    if (result.rows[0]?.file_url) {
      // file_url = "/uploads/galeri/galeri-xxx.jpg"
      // Path disk = BE/uploads/galeri/galeri-xxx.jpg
      const oldPath = path.join(__dirname, '../../', result.rows[0].file_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
  } catch (err) {
    console.error('Gagal hapus file lama:', err.message);
  }
};

// GET semua foto (Publik)
// GET — tambah kategori di SELECT
const getGaleri = async (req, res) => {
  try {
    // Filter by kategori jika ada query param: /galeri?kategori=fasilitas
    const { kategori } = req.query;
    let query =
      'SELECT id_galeri, judul_foto, deskripsi, file_url, kategori, tgl_upload FROM galeri';
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

  if (!req.file) {
    return res.status(400).json({ message: 'File wajib diupload' });
  }

  const file_url = `/uploads/galeri/${req.file.filename}`;

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
    let query;
    let params;

    // ✅ kalau upload file baru
    if (req.file) {
      const file_url = `/uploads/galeri/${req.file.filename}`;

      await hapusFileLama(id);

      query = `
        UPDATE galeri 
        SET judul_foto=$1, deskripsi=$2, file_url=$3, kategori=$4 
        WHERE id_galeri=$5 RETURNING *
      `;
      params = [judul_foto, deskripsi, file_url, kategori, id];
    }
    // ✅ kalau tidak upload file baru
    else {
      query = `
        UPDATE galeri 
        SET judul_foto=$1, deskripsi=$2, kategori=$3 
        WHERE id_galeri=$4 RETURNING *
      `;
      params = [judul_foto, deskripsi, kategori, id];
    }

    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Berhasil update', data: result.rows[0] });
  } catch (error) {
    console.error('Error updateGaleri:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE hapus foto (Admin)
const deleteGaleri = async (req, res) => {
  const { id } = req.params;
  try {
    await hapusFileLama(id);
    const result = await pool.query('DELETE FROM galeri WHERE id_galeri = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Foto tidak ditemukan' });
    res.json({ message: 'Foto berhasil dihapus dari galeri' });
  } catch (error) {
    console.error('Error deleteGaleri:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addGaleri, getGaleri, updateGaleri, deleteGaleri };
