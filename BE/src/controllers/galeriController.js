const pool = require('../config/db');

// 1. TAMBAH FOTO (POST)
const addGaleri = async (req, res) => {
  const { judul_foto, deskripsi, file_url } = req.body;
  const id_admin = req.admin.id;

  try {
    const query = `
      INSERT INTO galeri (judul_foto, deskripsi, file_url, id_admin) 
      VALUES ($1, $2, $3, $4) RETURNING *`;

    const result = await pool.query(query, [judul_foto, deskripsi, file_url, id_admin]);
    res.status(201).json({ message: 'Foto berhasil ditambahkan ke galeri!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. AMBIL SEMUA FOTO (GET - Public)
const getGaleri = async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM galeri ORDER BY tgl_upload DESC');
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. UPDATE FOTO (PUT)
const updateGaleri = async (req, res) => {
  const { id } = req.params;
  const { judul_foto, deskripsi, file_url } = req.body;

  try {
    const query = `
      UPDATE galeri 
      SET judul_foto = $1, deskripsi = $2, file_url = $3 
      WHERE id_galeri = $4 RETURNING *`;

    const result = await pool.query(query, [judul_foto, deskripsi, file_url, id]);

    if (result.rowCount === 0) return res.status(404).json({ message: 'Foto tidak ditemukan' });
    res.json({ message: 'Data galeri diperbarui!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. HAPUS FOTO (DELETE)
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
