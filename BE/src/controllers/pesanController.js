const pool = require('../config/db');
const nodemailer = require('nodemailer'); // Tambahkan import nodemailer di atas

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

  // Log untuk memastikan data masuk dengan benar
  console.log('1. Menerima request balas pesan untuk:', email_pengirim);
  console.log('2. Cek ENV User:', process.env.EMAIL_USER);
  console.log('3. Cek ENV Pass:', process.env.EMAIL_PASS ? 'Ada Password' : 'KOSONG!');

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // false untuk port 587 (STARTTLS)
      family: 4, // ← paksa IPv4, tidak pakai IPv6
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ← bypass SSL certificate check
      },
    });

    console.log('4. Transporter berhasil dibuat, bersiap kirim email...');

    // Desain Email yang lebih rapi
    const mailOptions = {
      from: `"Admin SMPN 3 Manado" <${process.env.EMAIL_USER}>`,
      to: email_pengirim,
      subject: `Balasan: Pesan Anda ke SMPN 3 Manado`,
      html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
              
              <!-- HEADER MERAH -->
              <tr>
                <td style="background:#b91c1c;padding:28px 36px;">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">
                    SMPN 3 Manado
                  </h1>
                  <p style="margin:4px 0 0;color:#fca5a5;font-size:13px;">
                    Balasan Pesan Resmi
                  </p>
                </td>
              </tr>
      
              <!-- BODY -->
              <tr>
                <td style="padding:32px 36px;">
                  <p style="margin:0 0 8px;font-size:15px;color:#111827;">
                    Yth. <strong>${nama_pengirim}</strong>,
                  </p>
                  <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
                    Terima kasih telah menghubungi SMPN 3 Manado. Kami telah menerima pesan Anda dan berikut adalah tanggapan dari pihak sekolah.
                  </p>
      
                  <!-- PESAN ASLI USER -->
                  <div style="margin-bottom:20px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;color:#9ca3af;letter-spacing:1px;text-transform:uppercase;">
                      Pesan Anda
                    </p>
                    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-left:4px solid #9ca3af;border-radius:8px;padding:16px 20px;">
                      <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7;font-style:italic;">
                        "${isi_pesan}"
                      </p>
                    </div>
                  </div>
      
                  <!-- PANAH CONNECTOR -->
                  <div style="text-align:center;margin:16px 0;font-size:20px;color:#d1d5db;">&#8595;</div>
      
                  <!-- BALASAN ADMIN -->
                  <div style="margin-bottom:28px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;color:#b91c1c;letter-spacing:1px;text-transform:uppercase;">
                      Tanggapan Sekolah
                    </p>
                    <div style="background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #b91c1c;border-radius:8px;padding:16px 20px;">
                      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">
                        ${jawaban}
                      </p>
                    </div>
                  </div>
      
                  <!-- INFO KONTAK -->
                  <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;border:1px solid #e5e7eb;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#374151;">Informasi Kontak Sekolah</p>
                    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.8;">
                      SMPN 3 Manado<br/>
                      Jl. Diponegoro, Manado, Sulawesi Utara<br/>
                      Telp: (0431) 123456
                    </p>
                  </div>
                </td>
              </tr>
      
              <!-- FOOTER -->
              <tr>
                <td style="background:#f9fafb;padding:20px 36px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                    Email ini dikirim secara otomatis oleh sistem SMPN 3 Manado. Harap tidak membalas email ini langsung.
                    Jika ada pertanyaan lebih lanjut, silakan kunjungi website kami atau hubungi sekolah langsung.
                  </p>
                </td>
              </tr>
      
            </table>
          </td></tr>
        </table>
      </body>
      </html>
      `,
    };

    // Eksekusi kirim email via Nodemailer
    await transporter.sendMail(mailOptions);
    console.log('5. EMAIL SUKSES TERKIRIM KE GOOGLE!');

    // --- PERBAIKAN DI SINI ---
    // Update database: Tandai dibaca DAN simpan isi jawaban ke database
    const queryUpdate = `
      UPDATE pesan_kontak 
      SET is_read = TRUE, 
          balasan_admin = $1, 
          tanggal_balas = CURRENT_TIMESTAMP 
      WHERE id_pesan = $2 
      RETURNING *`;

    await pool.query(queryUpdate, [jawaban, id]);
    console.log('6. DATABASE SUKSES DIUPDATE DENGAN JAWABAN!');

    res.json({ message: 'Balasan berhasil dikirim ke email pengirim dan disimpan!' });
  } catch (error) {
    console.error('X. GAGAL MENGIRIM EMAIL / UPDATE DB:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses balasan pesan.' });
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
