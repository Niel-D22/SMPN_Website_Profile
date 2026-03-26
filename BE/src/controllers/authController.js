const nodemailer = require('nodemailer');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Username tidak ditemukan' });
    }

    const admin = result.rows[0];

    // --- TESTING AREA (Lihat di Terminal VS Code) ---
    console.log('=== CHECKING AUTH ===');
    console.log('1. Password dari Bruno:', `"${password}"`); // Pakai kutip untuk cek spasi
    console.log('2. Hash dari Database:', admin.password_hash);

    // Tes manual: Kita coba hash ulang password dari Bruno dan bandingkan
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    console.log('3. Apakah Hasilnya Cocok?:', isMatch);
    // ------------------------------------------------

    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: admin.id_admin, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login Berhasil',
      token,
      nama: admin.nama_lengkap,
    });
  } catch (err) {
    console.error('Error detail:', err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

// --- FUNGSI 1: KIRIM EMAIL RESET ---
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    if (admin.rowCount === 0) return res.status(404).json({ message: 'Email tidak ditemukan' });

    // Buat token unik & masa berlaku 1 jam
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await pool.query(
      'UPDATE admin SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
      [token, expires, email]
    );

    // Konfigurasi Email (Gunakan App Password dari Google)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`; // URL Frontend React kamu

    await transporter.sendMail({
      from: '"Admin SMPN 3 Manado" <noreply@smpn3.com>',
      to: email,
      subject: 'Reset Kata Sandi Admin',
      html: `<p>Anda meminta reset password. Klik link di bawah ini:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>Link ini berlaku selama 1 jam.</p>`,
    });

    res.json({ message: 'Link reset password sudah dikirim ke email kamu!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- FUNGSI 2: UPDATE PASSWORD BARU ---
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM admin WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
      [token]
    );

    if (result.rowCount === 0)
      return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // PERBAIKAN: Gunakan password_hash sesuai kolom yang dibaca saat login
    await pool.query(
      'UPDATE admin SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id_admin = $2',
      [hashedPassword, result.rows[0].id_admin]
    );

    res.json({ message: 'Password berhasil diperbarui! Silakan login kembali.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const id_admin = req.admin.id;
  const { username, email, oldPassword, newPassword } = req.body;

  try {
    // 1. Ambil data admin dulu untuk verifikasi password lama
    const adminData = await pool.query('SELECT password_hash FROM admin WHERE id_admin = $1', [
      id_admin,
    ]);
    const admin = adminData.rows[0];

    let query = 'UPDATE admin SET username = $1, email = $2';
    let params = [username, email];

    // 2. Jika admin ingin ganti password
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: 'Masukkan password lama untuk verifikasi' });
      }

      // Cek apakah password lama benar
      const isMatch = await bcrypt.compare(oldPassword, admin.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Password lama salah!' });
      }

      // Hash password baru
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      query += ', password_hash = $3 WHERE id_admin = $4';
      params.push(hashedPassword, id_admin);
    } else {
      query += ' WHERE id_admin = $3';
      params.push(id_admin);
    }

    await pool.query(query, params);
    res.json({ message: 'Profil dan Password berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  const id_admin = req.admin.id; // Diambil dari middleware verifyToken

  try {
    const result = await pool.query(
      'SELECT id_admin, username, email, nama_lengkap FROM admin WHERE id_admin = $1',
      [id_admin]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  getProfile,
};
