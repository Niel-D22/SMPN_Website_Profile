const pool = require('../config/db');

// 1. Ambil Profil (GET)
const getProfil = async (req, res) => {
  try {
    // Sesuaikan nama tabel: profil_sekolah
    const result = await pool.query('SELECT * FROM profil_sekolah LIMIT 1');

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Data profil tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// 2. Update Profil (PUT)
const updateProfil = async (req, res) => {
  // Ambil data sesuai nama kolom di gambar Supabase kamu
  const { nama_sekolah, npsn, no_telepon, email_sekolah, alamat, visi, misi, sejarah } = req.body;

  try {
    const query = `
      UPDATE profil_sekolah SET 
        nama_sekolah = $1, 
        npsn = $2, 
        no_telepon = $3, 
        email_sekolah = $4, 
        alamat = $5, 
        visi = $6, 
        misi = $7, 
        sejarah = $8
      WHERE id_profil = 1 RETURNING *`;

    const values = [nama_sekolah, npsn, no_telepon, email_sekolah, alamat, visi, misi, sejarah];
    const result = await pool.query(query, values);

    res.json({ message: 'Profil sekolah berhasil diperbarui!', data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfil, updateProfil };
