// controllers/statistikController.js
const pool = require('../config/db');

const getStatistik = async (req, res) => {
  try {
    const jumlahGuru = await pool.query("SELECT COUNT(*) FROM guru_staf WHERE role = 'guru'");

    const jumlahKelas = await pool.query('SELECT COUNT(*) FROM kelas');

    const jumlahSiswa = await pool.query('SELECT COUNT(*) FROM siswa');

    res.json({
      jumlah_guru: parseInt(jumlahGuru.rows[0].count),
      jumlah_kelas: parseInt(jumlahKelas.rows[0].count),
      jumlah_siswa: parseInt(jumlahSiswa.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStatistik };
