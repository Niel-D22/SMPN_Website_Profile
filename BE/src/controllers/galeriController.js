const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper: hapus file lama dari disk (file_url = /uploads/galeri/namafile.ext → BE/uploads/...)
const hapusFileLama = async (id) => {
  const result = await pool.query('SELECT file_url FROM galeri WHERE id_galeri = $1', [id]);
  const fileUrl = result.rows[0]?.file_url;
  if (!fileUrl) return;
  const relative = fileUrl.replace(/^\/+/, '');
  const oldPath = path.join(__dirname, '..', '..', relative);
  if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
};

// GET semua foto (Publik)
const getGaleri = async (req, res) => {
  try {
    const data = await pool.query(
      'SELECT id_galeri, judul_foto, deskripsi, file_url, tgl_upload FROM galeri ORDER BY tgl_upload DESC'
    );
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST tambah foto (Admin)
const addGaleri = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File gambar wajib diunggah' });

  const { judul_foto, deskripsi } = req.body;
  const id_admin = req.admin?.id || req.user?.id;
  const file_url = `/uploads/galeri/${req.file.filename}`;

  if (!judul_foto || !deskripsi) {
    // Hapus file yang sudah terupload jika validasi gagal
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'Judul dan deskripsi wajib diisi' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO galeri (judul_foto, deskripsi, file_url, id_admin) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [judul_foto, deskripsi, file_url, id_admin]
    );
    res.status(201).json({ message: 'Foto berhasil ditambahkan ke galeri!', data: result.rows[0] });
  } catch (error) {
    // Hapus file jika query DB gagal
    fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

// PUT update foto (Admin)
const updateGaleri = async (req, res) => {
  const { id } = req.params;
  const { judul_foto, deskripsi } = req.body;

  if (!judul_foto || !deskripsi) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'Judul dan deskripsi wajib diisi' });
  }

  try {
    let query, params;

    if (req.file) {
      // Ada file baru: hapus file lama dari disk
      await hapusFileLama(id);
      const file_url = `/uploads/galeri/${req.file.filename}`;
      query = `UPDATE galeri SET judul_foto=$1, deskripsi=$2, file_url=$3 WHERE id_galeri=$4 RETURNING *`;
      params = [judul_foto, deskripsi, file_url, id];
    } else {
      // Tidak ada file baru: hanya update teks
      query = `UPDATE galeri SET judul_foto=$1, deskripsi=$2 WHERE id_galeri=$3 RETURNING *`;
      params = [judul_foto, deskripsi, id];
    }

    const result = await pool.query(query, params);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Foto tidak ditemukan' });

    res.json({ message: 'Data galeri berhasil diperbarui!', data: result.rows[0] });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

// DELETE hapus foto (Admin)
const deleteGaleri = async (req, res) => {
  const { id } = req.params;
  try {
    await hapusFileLama(id); // Hapus file dari disk lebih dulu
    const result = await pool.query('DELETE FROM galeri WHERE id_galeri = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Foto tidak ditemukan' });
    res.json({ message: 'Foto berhasil dihapus dari galeri' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addGaleri, getGaleri, updateGaleri, deleteGaleri };
