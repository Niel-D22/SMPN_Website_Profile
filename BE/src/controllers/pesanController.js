const pool = require('../config/db');
const nodemailer = require('nodemailer'); // Tambahkan import nodemailer di atas
const { Resend } = require('resend');

// 1. KIRIM PESAN (POST - Untuk Umum/User)
const kirimPesan = async (req, res) => {
  const { nama_pengirim, email_pengirim, isi_pesan } = req.body;
  try {
    const query = `
      INSERT INTO pesan_kontak (nama_pengirim, email_pengirim, isi_pesan) 
      VALUES ($1, $2, $3) RETURNING *`;

    const result = await pool.query(query, [nama_pengirim, email_pengirim, isi_pesan]);
    res.status(201).json({ message: 'Pesan berhasil dikirim!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. LIHAT SEMUA PESAN (GET - Khusus Admin)
const getSemuaPesan = async (req, res) => {
  try {
    // Diurutkan berdasarkan tanggal kirim terbaru
    const data = await pool.query('SELECT * FROM pesan_kontak ORDER BY tanggal_kirim DESC');
    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. HAPUS PESAN (DELETE - Khusus Admin)
const hapusPesan = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM pesan_kontak WHERE id_pesan = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pesan tidak ditemukan' });
    }

    res.json({ message: 'Pesan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. TANDAI DIBACA SAJA (PUT - Khusus Admin)
const tandaiDibaca = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE pesan_kontak SET is_read = TRUE WHERE id_pesan = $1', [id]);
    res.json({ message: 'Status berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. BALAS PESAN VIA EMAIL (POST - Khusus Admin) --- INI FITUR BARUNYA! ---

const balasPesan = async (req, res) => {
  const { id } = req.params;
  const { jawaban, email_pengirim, nama_pengirim, isi_pesan } = req.body;

  console.log('1. Menerima request balas pesan untuk:', email_pengirim);
  console.log('2. Cek ENV Resend Key:', process.env.RESEND_API_KEY ? 'Ada' : 'KOSONG!');

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Admin SMPN 3 Manado <onboarding@resend.dev>', // ← pakai ini dulu saat testing
      to: email_pengirim,
      subject: `Balasan: Pesan Anda ke SMPN 3 Manado`,
      html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
              
              <tr>
                <td style="background:#b91c1c;padding:28px 36px;">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">SMPN 3 Manado</h1>
                  <p style="margin:4px 0 0;color:#fca5a5;font-size:13px;">Balasan Pesan Resmi</p>
                </td>
              </tr>
      
              <tr>
                <td style="padding:32px 36px;">
                  <p style="margin:0 0 8px;font-size:15px;color:#111827;">Yth. <strong>${nama_pengirim}</strong>,</p>
                  <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
                    Terima kasih telah menghubungi SMPN 3 Manado.
                  </p>
      
                  <div style="margin-bottom:20px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;color:#9ca3af;text-transform:uppercase;">Pesan Anda</p>
                    <div style="background:#f9fafb;border-left:4px solid #9ca3af;border-radius:8px;padding:16px 20px;">
                      <p style="margin:0;font-size:14px;color:#6b7280;font-style:italic;">"${isi_pesan}"</p>
                    </div>
                  </div>
      
                  <div style="text-align:center;margin:16px 0;font-size:20px;color:#d1d5db;">↓</div>
      
                  <div style="margin-bottom:28px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;color:#b91c1c;text-transform:uppercase;">Tanggapan Sekolah</p>
                    <div style="background:#fef2f2;border-left:4px solid #b91c1c;border-radius:8px;padding:16px 20px;">
                      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${jawaban}</p>
                    </div>
                  </div>
      
                  <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;border:1px solid #e5e7eb;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#374151;">Informasi Kontak Sekolah</p>
                    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.8;">
                      SMPN 3 Manado<br/>Jl. Diponegoro, Manado, Sulawesi Utara<br/>Telp: (0431) 123456
                    </p>
                  </div>
                </td>
              </tr>
      
              <tr>
                <td style="background:#f9fafb;padding:20px 36px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;">
                    Email ini dikirim otomatis. Harap tidak membalas email ini langsung.
                  </p>
                </td>
              </tr>
      
            </table>
          </td></tr>
        </table>
      </body>
      </html>`,
    });

    console.log('5. EMAIL SUKSES TERKIRIM via Resend!');

    const queryUpdate = `
      UPDATE pesan_kontak 
      SET is_read = TRUE, balasan_admin = $1, tanggal_balas = CURRENT_TIMESTAMP 
      WHERE id_pesan = $2 RETURNING *`;

    await pool.query(queryUpdate, [jawaban, id]);
    console.log('6. DATABASE SUKSES DIUPDATE!');

    res.json({ message: 'Balasan berhasil dikirim dan disimpan!' });
  } catch (error) {
    // Log detail error untuk debugging
    console.error('X. ERROR DETAIL:', JSON.stringify(error, null, 2));
    res.status(500).json({
      error: 'Terjadi kesalahan saat memproses balasan.',
      detail: error.message,
    });
  }
};
// JANGAN LUPA EXPORT FUNGSI BARUNYA JUGA
module.exports = {
  kirimPesan,
  getSemuaPesan,
  hapusPesan,
  tandaiDibaca,
  balasPesan, // <--- Tambahkan ini
};
