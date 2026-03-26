const pool = require('../config/db');

// 1. KIRIM PESAN (POST - Untuk Umum/User)
const kirimPesan = async (req, res) => {
  const { nama_pengirim, email_pengirim, isi_pesan } = req.body;
  try {
    const query = `
      INSERT INTO pesan_kontak (nama_pengirim, email_pengirim, isi_pesan) 
      VALUES ($1, $2, $3) RETURNING *`;

    const result = await pool.query(query, [nama_pengirim, email_pengirim, isi_pesan]);
    res.status(201).json({ message: 'Pesan berhasil dikirim!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. LIHAT SEMUA PESAN (GET - Khusus Admin)
const getSemuaPesan = async (req, res) => {
  try {
    // Diurutkan berdasarkan tanggal kirim terbaru
    const data = await pool.query('SELECT * FROM pesan_kontak ORDER BY tanggal_kirim DESC');
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. HAPUS PESAN (DELETE - Khusus Admin)
const hapusPesan = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM pesan_kontak WHERE id_pesan = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pesan tidak ditemukan' });
    }

    res.json({ message: 'Pesan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const tandaiDibaca = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE pesan_kontak SET is_read = TRUE WHERE id_pesan = $1', [id]);
    res.json({ message: 'Status berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { kirimPesan, getSemuaPesan, hapusPesan, tandaiDibaca };
