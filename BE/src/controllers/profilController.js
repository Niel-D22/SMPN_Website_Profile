const pool = require('../config/db');
const {
  uploadKurikulumToCloudinary,
  uploadAkreditasiToCloudinary,
} = require('../config/cloudinary');

// 1. Ambil Profil (GET)
const getProfil = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        (
          SELECT g.nama_lengkap 
          FROM guru_staf g 
          WHERE LOWER(g.jabatan) = 'kepala sekolah'
          LIMIT 1
        ) AS kepala_sekolah,
        (
          SELECT g.foto_url 
          FROM guru_staf g 
          WHERE LOWER(g.jabatan) = 'kepala sekolah'
          LIMIT 1
        ) AS foto_kepsek
      FROM profil_sekolah p
      LIMIT 1
    `);

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
    logo_url,
    sambutan_kepsek,
    jumlah_guru,
    jumlah_kelas,
    deskripsi_kurikulum,
  } = req.body;

  try {
    // Ambil kurikulum_url lama kalau tidak ada file baru
    const existing = await pool.query(
      'SELECT kurikulum_url FROM profil_sekolah WHERE id_profil = 1'
    );
    const oldKurikulumUrl = existing.rows[0]?.kurikulum_url;

    // Kalau ada file baru → pakai URL Cloudinary, kalau tidak → pakai yang lama
    const kurikulum_url = req.file ? req.file.path : oldKurikulumUrl;

    const query = `
      UPDATE profil_sekolah SET 
        nama_sekolah = $1, npsn = $2, akreditas = $3,
        no_telepon = $4, email_sekolah = $5, alamat = $6,
        visi = $7, misi = $8, sejarah = $9,
        jumlah_siswa = $10, logo_url = $11, sambutan_kepsek = $12,
        jumlah_guru = $13, jumlah_kelas = $14,
        kurikulum_url = $15,
        deskripsi_kurikulum = $16,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_profil = 1 RETURNING *`;

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
      logo_url,
      sambutan_kepsek,
      jumlah_guru || 0,
      jumlah_kelas || 0,
      kurikulum_url || null,
      deskripsi_kurikulum || null,
    ];

    const result = await pool.query(query, values);
    res.json({ message: 'Profil sekolah berhasil diperbarui!', data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Tambah di profilController.js
const uploadKurikulum = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File wajib diupload' });

    const { deskripsi_kurikulum } = req.body;

    // Upload manual pakai SDK langsung — bukan multer-storage-cloudinary
    const result = await uploadKurikulumToCloudinary(req.file.buffer, req.file.originalname);

    const kurikulum_url = result.secure_url;

    const dbResult = await pool.query(
      `UPDATE profil_sekolah 
       SET kurikulum_url = $1, deskripsi_kurikulum = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id_profil = 1 RETURNING *`,
      [kurikulum_url, deskripsi_kurikulum || null]
    );

    res.json({ message: 'Kurikulum berhasil diupload!', data: dbResult.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const uploadAkreditasi = async (req, res) => {
  try {
    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({
        message: 'File wajib diupload',
      });
    }

    const { deskripsi_akreditasi } = req.body;

    const result = await uploadAkreditasiToCloudinary(req.file.buffer, req.file.originalname);

    const dbResult = await pool.query(
      `UPDATE profil_sekolah 
       SET sertifikat_akreditasi_url = $1, 
           deskripsi_akreditasi = $2, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id_profil = 1 RETURNING *`,
      [result.secure_url, deskripsi_akreditasi || null]
    );

    res.json({
      message: 'Sertifikat akreditasi berhasil diupload!',
      data: dbResult.rows[0],
    });
  } catch (error) {
    console.error('ERROR AKREDITASI:', error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { getProfil, updateProfil, uploadKurikulum, uploadAkreditasi };
