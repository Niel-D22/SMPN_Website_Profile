const pool = require('../config/db');

// Catat 1 kunjungan (dipanggil tiap ada yang buka website)
const recordVisit = async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO pengunjung (tanggal, jumlah)
      VALUES (CURRENT_DATE, 1)
      ON CONFLICT (tanggal)
      DO UPDATE SET jumlah = pengunjung.jumlah + 1
    `);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ambil data 7 hari terakhir
const getStats7Hari = async (req, res) => {
  try {
    const data = await pool.query(`
      SELECT 
        TO_CHAR(tanggal, 'DD/MM') as name,
        jumlah as pengunjung
      FROM pengunjung
      WHERE tanggal >= CURRENT_DATE - INTERVAL '6 days'
      ORDER BY tanggal ASC
    `);
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ambil data bulan ini
const getStatsBulanIni = async (req, res) => {
  try {
    const data = await pool.query(`
      SELECT 
        TO_CHAR(tanggal, 'DD/MM') as name,
        jumlah as pengunjung
      FROM pengunjung
      WHERE DATE_TRUNC('month', tanggal) = DATE_TRUNC('month', CURRENT_DATE)
      ORDER BY tanggal ASC
    `);
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { recordVisit, getStats7Hari, getStatsBulanIni };
