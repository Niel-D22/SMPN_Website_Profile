const pool = require('../config/db');

// ==========================================
// 1. TAMPILKAN SEMUA JADWAL (GET - Public)
// ==========================================
const getTimeline = async (req, res) => {
  try {
    // Menampilkan jadwal diurutkan dari tanggal paling awal
    const data = await pool.query('SELECT * FROM timeline_ppdb ORDER BY tanggal_mulai ASC');
    res.json(data.rows);
  } catch (error) {
    console.error('Error getTimeline:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// ==========================================
// 2. TAMBAH JADWAL BARU (POST - Admin Only)
// ==========================================
const addTimeline = async (req, res) => {
  const { judul, tanggal_mulai, tanggal_selesai, deskripsi } = req.body;
  // Tangkap ID Admin dari token yang sedang login (lewat middleware)
  const id_admin = req.admin.id;

  try {
    const newData = await pool.query(
      `INSERT INTO timeline_ppdb 
      (judul, tanggal_mulai, tanggal_selesai, deskripsi, id_admin) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [judul, tanggal_mulai, tanggal_selesai, deskripsi, id_admin]
    );
    res.status(201).json({ message: 'Tahapan berhasil ditambahkan!', data: newData.rows[0] });
  } catch (error) {
    console.error('Error addTimeline:', error.message);
    res.status(500).json({ error: 'Gagal menambahkan tahapan' });
  }
};

// ==========================================
// 3. EDIT JADWAL (PUT - Admin Only)
// ==========================================
const updateTimeline = async (req, res) => {
  const { id } = req.params; // ID timeline dari URL
  const { judul, tanggal_mulai, tanggal_selesai, deskripsi } = req.body;
  // Catat admin siapa yang terakhir kali mengedit ini
  const id_admin = req.admin.id;

  try {
    const updated = await pool.query(
      `UPDATE timeline_ppdb 
       SET judul = $1, tanggal_mulai = $2, tanggal_selesai = $3, deskripsi = $4, id_admin = $5 
       WHERE id_timeline = $6 RETURNING *`,
      [judul, tanggal_mulai, tanggal_selesai, deskripsi, id_admin, id]
    );

    if (updated.rowCount === 0) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
    }

    res.json({ message: 'Tahapan berhasil diperbarui!', data: updated.rows[0] });
  } catch (error) {
    console.error('Error updateTimeline:', error.message);
    res.status(500).json({ error: 'Gagal memperbarui tahapan' });
  }
};

// ==========================================
// 4. HAPUS JADWAL (DELETE - Admin Only)
// ==========================================
const deleteTimeline = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await pool.query(
      'DELETE FROM timeline_ppdb WHERE id_timeline = $1 RETURNING *',
      [id]
    );

    if (deleted.rowCount === 0) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
    }

    res.json({ message: 'Tahapan berhasil dihapus!' });
  } catch (error) {
    console.error('Error deleteTimeline:', error.message);
    res.status(500).json({ error: 'Gagal menghapus tahapan' });
  }
};

// Jangan lupa di-export semuanya
module.exports = { getTimeline, addTimeline, updateTimeline, deleteTimeline };
