const nodemailer = require('nodemailer');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper function to wrap errors with toaster-style response
const toasterError = (res, message, code = 500) => {
  return res.status(code).json({
    message,
    toaster: { type: 'error', text: message },
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return toasterError(res, 'Username tidak ditemukan', 401);
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    // ------------------------------------------------

    if (!isMatch) {
      return toasterError(res, 'Password salah', 401);
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
      toaster: { type: 'success', text: 'Login Berhasil' },
    });
  } catch (err) {
    // console.error('Error detail:', err);
    return toasterError(res, 'Terjadi kesalahan server', 500);
  }
};

// --- FUNGSI 1: KIRIM EMAIL RESET ---
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    if (admin.rowCount === 0) return toasterError(res, 'Email tidak ditemukan', 404);

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

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: '"Admin SMPN 3 Manado" <noreply@smpn3.com>',
      to: email,
      subject: 'Reset Kata Sandi Admin',
      html: `<p>Anda meminta reset password. Klik link di bawah ini:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>Link ini berlaku selama 1 jam.</p>`,
    });

    res.json({
      message: 'Link reset password sudah dikirim ke email kamu!',
      toaster: { type: 'success', text: 'Link reset password sudah dikirim ke email kamu!' },
    });
  } catch (error) {
    return toasterError(res, error.message, 500);
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
      return toasterError(res, 'Token tidak valid atau sudah kadaluarsa', 400);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query(
      'UPDATE admin SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id_admin = $2',
      [hashedPassword, result.rows[0].id_admin]
    );

    res.json({
      message: 'Password berhasil diperbarui! Silakan login kembali.',
      toaster: { type: 'success', text: 'Password berhasil diperbarui! Silakan login kembali.' },
    });
  } catch (error) {
    return toasterError(res, error.message, 500);
  }
};

const updateProfile = async (req, res) => {
  // Pastikan middleware auth kamu menyimpan data di req.admin
  const id_admin = req.admin?.id;

  if (!id_admin) {
    return toasterError(res, 'Sesi tidak valid, silakan login ulang', 401);
  }

  const { username, email, nama_lengkap, oldPassword, newPassword } = req.body;

  try {
    // 1. Ambil data admin saat ini
    const adminData = await pool.query('SELECT password_hash FROM admin WHERE id_admin = $1', [
      id_admin,
    ]);
    if (adminData.rowCount === 0) return toasterError(res, 'Admin tidak ditemukan', 404);

    const admin = adminData.rows[0];

    // 2. Siapkan Query Dinamis
    let query = 'UPDATE admin SET username = $1, email = $2, nama_lengkap = $3';
    let params = [username, email, nama_lengkap];

    // 3. Logika Ganti Password (Opsional)
    if (newPassword && newPassword.trim() !== '') {
      if (!oldPassword) {
        return toasterError(res, 'Masukkan password lama untuk verifikasi', 400);
      }

      const isMatch = await bcrypt.compare(oldPassword, admin.password_hash);
      if (!isMatch) {
        return toasterError(res, 'Password lama salah!', 401);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      query += ', password_hash = $4 WHERE id_admin = $5';
      params.push(hashedPassword, id_admin);
    } else {
      query += ' WHERE id_admin = $4';
      params.push(id_admin);
    }

    await pool.query(query, params);

    res.json({
      message: 'Profil berhasil diperbarui!',
      toaster: { type: 'success', text: 'Profil berhasil diperbarui!' },
    });
  } catch (error) {
    console.error('Update Error:', error.message);
    return toasterError(res, 'Gagal memperbarui profil: ' + error.message, 500);
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
      return toasterError(res, 'Admin tidak ditemukan', 404);
    }

    res.json(result.rows[0]);
  } catch (error) {
    return toasterError(res, error.message, 500);
  }
};
module.exports = {
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  getProfile,
};
