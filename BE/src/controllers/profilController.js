const pool = require('../config/db');

// 1. Ambil Profil (GET)
const getProfil = async (req, res) => {
  try {
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
  const {
    nama_sekolah,
    npsn,
    akreditas,
    no_telepon,
    email_sekolah,
    alamat,
    visi,
    misi,
    sejarah,
    jumlah_siswa,
    logo_url, // <--- 1. TANGKAP LOGO DARI FRONTEND
  } = req.body;

  try {
    // 2. TAMBAHKAN logo_url = $11 KE DALAM QUERY
    const query = `
      UPDATE profil_sekolah SET 
        nama_sekolah = $1, 
        npsn = $2, 
        akreditas = $3,
        no_telepon = $4, 
        email_sekolah = $5, 
        alamat = $6, 
        visi = $7, 
        misi = $8, 
        sejarah = $9,
        jumlah_siswa = $10,
        logo_url = $11 
      WHERE id_profil = 1 RETURNING *`;

    // 3. MASUKKAN logo_url KE DALAM ARRAY VALUES
    const values = [
      nama_sekolah,
      npsn,
      akreditas,
      no_telepon,
      email_sekolah,
      alamat,
      visi,
      misi,
      sejarah,
      jumlah_siswa || 0,
      logo_url, // <--- Parameter ke-11
    ];

    const result = await pool.query(query, values);

    res.json({ message: 'Profil sekolah berhasil diperbarui!', data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfil, updateProfil };
