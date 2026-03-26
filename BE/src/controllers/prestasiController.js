const pool = require('../config/db');

// 1. TAMBAH PRESTASI (POST)
const addPrestasi = async (req, res) => {
  const { nama_lomba, nama_pemenang, tingkat, tahun_meraih, foto_url } = req.body;
  const id_admin = req.admin.id; // Diambil dari verifyToken

  try {
    const query = `
      INSERT INTO prestasi (nama_lomba, nama_pemenang, tingkat, tahun_meraih, foto_url, id_admin) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

    const values = [nama_lomba, nama_pemenang, tingkat, tahun_meraih, foto_url, id_admin];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Prestasi berhasil dicatat!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. AMBIL SEMUA PRESTASI (GET - Public)
const getPrestasi = async (req, res) => {
  try {
    // Urutkan berdasarkan tahun terbaru
    const data = await pool.query('SELECT * FROM prestasi ORDER BY tahun_meraih DESC');
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. UPDATE PRESTASI (PUT)
const updatePrestasi = async (req, res) => {
  const { id } = req.params;
  const { nama_lomba, nama_pemenang, tingkat, tahun_meraih, foto_url } = req.body;
  const id_admin = req.admin.id;

  try {
    const query = `
      UPDATE prestasi 
      SET nama_lomba=$1, nama_pemenang=$2, tingkat=$3, tahun_meraih=$4, foto_url=$5, id_admin=$6 
      WHERE id_prestasi=$7 RETURNING *`;

    const result = await pool.query(query, [
      nama_lomba,
      nama_pemenang,
      tingkat,
      tahun_meraih,
      foto_url,
      id_admin,
      id,
    ]);

    if (result.rowCount === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json({ message: 'Data prestasi diperbarui!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. HAPUS PRESTASI (DELETE)
const deletePrestasi = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM prestasi WHERE id_prestasi = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json({ message: 'Prestasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addPrestasi, getPrestasi, updatePrestasi, deletePrestasi };
