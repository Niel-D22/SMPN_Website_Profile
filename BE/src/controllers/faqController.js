const pool = require('../config/db');

// 1. TAMPILKAN SEMUA FAQ (GET)
const getFaq = async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM faq ORDER BY id_faq DESC');
    res.json(data.rows);
  } catch (error) {
    console.error('Error getFaq:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// 2. TAMBAH FAQ BARU (POST)
// 1. TAMBAH FAQ BARU (Tanpa Status)
const addFaq = async (req, res) => {
  const { kategori, pertanyaan, jawaban } = req.body;
  const id_admin = req.admin.id; // Diambil dari token verifyToken

  try {
    const newData = await pool.query(
      `INSERT INTO faq (kategori, pertanyaan, jawaban, id_admin) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
      [kategori, pertanyaan, jawaban, id_admin]
    );
    res.status(201).json({ message: 'FAQ berhasil ditambahkan!', data: newData.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. EDIT FAQ (Tanpa Status)
const updateFaq = async (req, res) => {
  const { id } = req.params;
  const { kategori, pertanyaan, jawaban } = req.body;
  const id_admin = req.admin.id;

  try {
    const updated = await pool.query(
      `UPDATE faq 
         SET kategori = $1, pertanyaan = $2, jawaban = $3, id_admin = $4 
         WHERE id_faq = $5 RETURNING *`,
      [kategori, pertanyaan, jawaban, id_admin, id]
    );

    if (updated.rowCount === 0) {
      return res.status(404).json({ message: 'FAQ tidak ditemukan' });
    }

    res.json({ message: 'FAQ berhasil diperbarui!', data: updated.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. HAPUS FAQ (DELETE)
const deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await pool.query('DELETE FROM faq WHERE id_faq = $1 RETURNING *', [id]);

    if (deleted.rowCount === 0) {
      return res.status(404).json({ message: 'FAQ tidak ditemukan' });
    }

    res.json({ message: 'FAQ berhasil dihapus!' });
  } catch (error) {
    console.error('Error deleteFaq:', error.message);
    res.status(500).json({ error: 'Gagal menghapus FAQ' });
  }
};

module.exports = { getFaq, addFaq, updateFaq, deleteFaq };
