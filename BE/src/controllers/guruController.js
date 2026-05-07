const pool = require('../config/db');

// 1. TAMBAH GURU (POST)
const addGuru = async (req, res) => {
  const { nama_lengkap, nip, jabatan, mata_pelajaran, foto_url } = req.body;

  const id_admin = req.admin.id;

  try {
    const query = `
      INSERT INTO guru_staf 
      (
        nama_lengkap,
        nip,
        jabatan,
        mata_pelajaran,
        foto_url,
        id_admin,
        status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      nama_lengkap,
      nip,
      jabatan,
      mata_pelajaran,
      foto_url,
      id_admin,
      'aktif',
    ]);

    res.status(201).json({
      message: 'Data guru berhasil ditambahkan',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// 2. GET SEMUA GURU
const getAllGuru = async (req, res) => {
  try {
    const data = await pool.query(`
      SELECT *
      FROM guru_staf
      ORDER BY
        CASE
          WHEN status = 'aktif' THEN 1
          ELSE 2
        END,
        nama_lengkap ASC
    `);

    res.json(data.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// 3. UPDATE GURU
const updateGuru = async (req, res) => {
  const { id } = req.params;

  // PERBAIKAN: Tangkap 'status' dari req.body
  const { nama_lengkap, nip, jabatan, mata_pelajaran, foto_url, status } = req.body;

  const id_admin = req.admin.id;

  try {
    const query = `
      UPDATE guru_staf
      SET
        nama_lengkap = $1,
        nip = $2,
        jabatan = $3,
        mata_pelajaran = $4,
        foto_url = $5,
        id_admin = $6,
        status = $7, -- PERBAIKAN: Tambahkan update status
        updated_at = CURRENT_TIMESTAMP
      WHERE id_guru = $8
      RETURNING *
    `;

    // PERBAIKAN: Tambahkan 'status' ke dalam array parameter (parameter ke-7)
    const result = await pool.query(query, [
      nama_lengkap,
      nip,
      jabatan,
      mata_pelajaran,
      foto_url,
      id_admin,
      status, // Data status dimasukkan di sini
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Guru tidak ditemukan',
      });
    }

    res.json({
      message: 'Data guru berhasil diperbarui',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// 4. NONAKTIFKAN GURU
const nonaktifkanGuru = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE guru_staf
      SET
        status = 'nonaktif',
        updated_at = CURRENT_TIMESTAMP
      WHERE id_guru = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Guru tidak ditemukan',
      });
    }

    res.json({
      message: 'Guru berhasil dinonaktifkan',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// 5. AKTIFKAN KEMBALI GURU
const aktifkanGuru = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE guru_staf
      SET
        status = 'aktif',
        updated_at = CURRENT_TIMESTAMP
      WHERE id_guru = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Guru tidak ditemukan',
      });
    }

    res.json({
      message: 'Guru berhasil diaktifkan kembali',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// 6. HAPUS GURU
const deleteGuru = async (req, res) => {
  const { id } = req.params;

  try {
    // cek guru
    const cekGuru = await pool.query(
      `
      SELECT status
      FROM guru_staf
      WHERE id_guru = $1
      `,
      [id]
    );

    if (cekGuru.rowCount === 0) {
      return res.status(404).json({
        message: 'Guru tidak ditemukan',
      });
    }

    // kalau masih aktif → tidak boleh dihapus
    if (cekGuru.rows[0].status === 'aktif') {
      return res.status(400).json({
        message: 'Guru harus dinonaktifkan terlebih dahulu',
      });
    }

    // hapus permanen
    await pool.query(
      `
      DELETE FROM guru_staf
      WHERE id_guru = $1
      `,
      [id]
    );

    res.json({
      message: 'Data guru berhasil dihapus permanen',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  addGuru,
  getAllGuru,
  updateGuru,
  nonaktifkanGuru,
  aktifkanGuru,
  deleteGuru,
};
