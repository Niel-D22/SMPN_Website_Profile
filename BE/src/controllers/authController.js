const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');

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

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await pool.query(
      'UPDATE admin SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
      [token, expires, email]
    );

    // Ganti URL sesuai domain deploy kamu
    // Ganti baris resetLink
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${baseUrl}/reset-password/${token}`;
    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('Reset link:', resetLink);

    await resend.emails.send({
      from: 'Admin SMPN 3 Manado <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Kata Sandi Admin',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#b91c1c;margin-bottom:8px;">Reset Kata Sandi</h2>
          <p style="color:#374151;">Anda meminta reset password untuk akun Admin SMPN 3 Manado.</p>
          <p style="color:#374151;">Klik tombol di bawah ini untuk melanjutkan:</p>
          <a href="${resetLink}" 
             style="display:inline-block;margin:16px 0;padding:12px 24px;background:#b91c1c;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
            Reset Password
          </a>
          <p style="color:#6b7280;font-size:13px;">Link ini berlaku selama <strong>1 jam</strong>.</p>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
            Jika Anda tidak meminta reset password, abaikan email ini.
          </p>
        </div>
      `,
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
