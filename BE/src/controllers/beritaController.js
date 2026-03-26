const pool = require('../config/db');

// A. UNTUK PUBLIK (Hanya yang Active)
const getBeritaPublic = async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM berita_pengumuman WHERE status = 'active' ORDER BY id_berita DESC"
    );
    res.json(data.rows);
  } catch (error) {
    // Cari error, log biar kelihatan jelas di backend
    console.error('Error di getBeritaPublic:', error);
    res.status(500).json({ error: error.message });
  }
};

// B. UNTUK ADMIN (Semua berita muncul: Active & Inactive)
const getBeritaAdmin = async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM berita_pengumuman ORDER BY id_berita DESC');
    res.json(data.rows);
  } catch (error) {
    console.error('Error di getBeritaAdmin:', error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Post berita
const addBerita = async (req, res) => {
  const { judul, isi_konten, kategori, status } = req.body;

  // Pastikan middleware verifyToken sudah mengisi req.admin
  const id_admin = req.admin ? req.admin.id : null;

  // Tambah validasi simple untuk cari error input
  if (!judul || !isi_konten || !kategori) {
    return res.status(400).json({ message: 'Judul, isi_konten, dan kategori wajib diisi!' });
  }

  try {
    const query = `
      INSERT INTO berita_pengumuman (judul, isi_konten, kategori, status, id_admin) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const values = [judul, isi_konten, kategori, status || 'active', id_admin];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Berita berhasil dibuat!', data: result.rows[0] });
  } catch (error) {
    console.error('Error di addBerita:', error);
    res.status(500).json({ error: error.message });
  }
};

// 3. Get detail berita
const getBeritaById = async (req, res) => {
  try {
    const { id } = req.params;
    // Cari error: Cek id valid ga?
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID berita tidak valid' });
    }

    const data = await pool.query('SELECT * FROM berita_pengumuman WHERE id_berita = $1', [id]);

    if (data.rows.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    res.json(data.rows[0]);
  } catch (error) {
    console.error('Error di getBeritaById:', error);
    res.status(500).json({ error: error.message });
  }
};

// 4. Delete berita
const deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;
    // Cari error: Cek id valid ga?
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID berita tidak valid' });
    }

    const result = await pool.query('DELETE FROM berita_pengumuman WHERE id_berita = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    res.json({ message: 'Berita berhasil dihapus!' });
  } catch (error) {
    console.error('Error di deleteBerita:', error);
    res.status(500).json({ error: error.message });
  }
};

// 5. Update Berita
const updateBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const { kategori, judul, isi_konten, status } = req.body; // tambahkan status

    // Cari error: cek field wajib
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID berita tidak valid' });
    }
    if (!kategori || !judul || !isi_konten) {
      return res.status(400).json({ message: 'Kategori, judul, dan isi_konten wajib diisi!' });
    }

    const result = await pool.query(
      'UPDATE berita_pengumuman SET kategori=$1, judul=$2, isi_konten=$3, status=$4 WHERE id_berita=$5 RETURNING *',
      [kategori, judul, isi_konten, status || 'active', id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }

    res.json({ message: 'Berita berhasil diperbarui!', data: result.rows[0] });
  } catch (error) {
    console.error('Error di updateBerita:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBeritaPublic,
  getBeritaAdmin,
  addBerita,
  getBeritaById,
  deleteBerita,
  updateBerita,
};
