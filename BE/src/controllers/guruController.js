const pool = require('../config/db');

// 1. TAMBAH GURU (POST)
const addGuru = async (req, res) => {
  const { nama_lengkap, nip, jabatan, mata_pelajaran, foto_url } = req.body;
  const id_admin = req.admin.id;

  try {
    const query = `
      INSERT INTO guru_staf (nama_lengkap, nip, jabatan, mata_pelajaran, foto_url, id_admin) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

    const result = await pool.query(query, [
      nama_lengkap,
      nip,
      jabatan,
      mata_pelajaran,
      foto_url,
      id_admin,
    ]);
    res.status(201).json({ message: 'Data guru berhasil ditambahkan', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. GET SEMUA GURU (GET - Public)
const getAllGuru = async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM guru_staf ORDER BY nama_lengkap ASC');
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. UPDATE GURU (PUT)
const updateGuru = async (req, res) => {
  const { id } = req.params;
  const { nama_lengkap, nip, jabatan, mata_pelajaran, foto_url } = req.body;
  const id_admin = req.admin.id;

  try {
    const query = `
  UPDATE guru_staf 
  SET nama_lengkap=$1, nip=$2, jabatan=$3, mata_pelajaran=$4, foto_url=$5, id_admin=$6, updated_at=CURRENT_TIMESTAMP
  WHERE id_guru=$7 RETURNING *`;
    const result = await pool.query(query, [
      nama_lengkap,
      nip,
      jabatan,
      mata_pelajaran,
      foto_url,
      id_admin,
      id,
    ]);

    if (result.rowCount === 0) return res.status(404).json({ message: 'Guru tidak ditemukan' });
    res.json({ message: 'Data guru diperbarui!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. HAPUS GURU (DELETE)
const deleteGuru = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM guru_staf WHERE id_guru = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Guru tidak ditemukan' });
    res.json({ message: 'Data guru berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addGuru, getAllGuru, updateGuru, deleteGuru };
