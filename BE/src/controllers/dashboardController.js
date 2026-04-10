// src/controllers/dashboardController.js
const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Siswa (Opsional: Jika kamu sudah tambah kolom jumlah_siswa di profil_sekolah)
    let totalSiswa = 0;
    try {
      const profilQuery = await pool.query('SELECT jumlah_siswa FROM profil_sekolah LIMIT 1');
      if (profilQuery.rows.length > 0) {
        totalSiswa = profilQuery.rows[0].jumlah_siswa || 0;
      }
    } catch (err) {
      console.warn('Kolom jumlah_siswa mungkin belum ada di tabel profil_sekolah.');
    }

    // 2. Total Tenaga Pendidik & Staf
    const guruQuery = await pool.query('SELECT COUNT(*) FROM guru_staf');
    const totalGuru = parseInt(guruQuery.rows[0].count);

    // 3. Total Prestasi Sekolah
    const prestasiQuery = await pool.query('SELECT COUNT(*) FROM prestasi');
    const totalPrestasi = parseInt(prestasiQuery.rows[0].count);

    // 4. Total Pesan Masuk (Yang belum dibaca)
    // Asumsi tabel pesan_kontak punya kolom is_read (boolean)
    let pesanBaru = 0;
    try {
      const pesanQuery = await pool.query(
        'SELECT COUNT(*) FROM pesan_kontak WHERE is_read = false'
      );
      pesanBaru = parseInt(pesanQuery.rows[0].count);
    } catch (err) {
      // Fallback jika tidak ada kolom is_read, hitung semua pesan
      const semuaPesanQuery = await pool.query('SELECT COUNT(*) FROM pesan_kontak');
      pesanBaru = parseInt(semuaPesanQuery.rows[0].count);
    }

    // Mengirim Response JSON ke Frontend
    res.json({
      success: true,
      data: {
        total_siswa: totalSiswa,
        total_guru: totalGuru,
        total_prestasi: totalPrestasi,
        pesan_baru: pesanBaru,
      },
    });
  } catch (error) {
    console.error('Error saat mengambil statistik dashboard:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data dashboard' });
  }
};

module.exports = { getDashboardStats };
