const pool = require('../config/db');

const getTimeline = async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM timeline_ppdb ORDER BY tanggal_mulai ASC');
    res.json(data.rows);
  } catch (error) {
    console.error('Error getTimeline:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

const addTimeline = async (req, res) => {
  const { judul, tanggal_mulai, tanggal_selesai, deskripsi, status } = req.body;
  const id_admin = req.admin?.id;

  console.log('ADD TIMELINE - req.body:', req.body);
  console.log('ADD TIMELINE - id_admin:', id_admin);

  if (!judul || !tanggal_mulai || !tanggal_selesai) {
    return res.status(400).json({
      error: 'Judul, tanggal mulai, dan tanggal selesai wajib diisi.',
    });
  }

  try {
    const newData = await pool.query(
      `INSERT INTO timeline_ppdb 
       (judul, tanggal_mulai, tanggal_selesai, deskripsi, status, id_admin) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [judul, tanggal_mulai, tanggal_selesai, deskripsi || '', status || 'akan_datang', id_admin]
    );

    res.status(201).json({
      message: 'Tahapan berhasil ditambahkan!',
      data: newData.rows[0],
    });
  } catch (error) {
    console.error('Error addTimeline:', error.message);
    res.status(500).json({
      error: 'Gagal menambahkan tahapan',
      detail: error.message,
    });
  }
};

const updateTimeline = async (req, res) => {
  const id = req.params.id || req.params.id_timeline;
  const { judul, tanggal_mulai, tanggal_selesai, deskripsi, status } = req.body;
  const id_admin = req.admin?.id;

  console.log('UPDATE TIMELINE - id:', id);
  console.log('UPDATE TIMELINE - req.body:', req.body);

  if (!id) {
    return res.status(400).json({ error: 'ID timeline tidak ditemukan di params.' });
  }

  if (!judul || !tanggal_mulai || !tanggal_selesai) {
    return res.status(400).json({
      error: 'Judul, tanggal mulai, dan tanggal selesai wajib diisi.',
    });
  }

  try {
    const updated = await pool.query(
      `UPDATE timeline_ppdb 
       SET 
         judul           = $1, 
         tanggal_mulai   = $2, 
         tanggal_selesai = $3, 
         deskripsi       = $4, 
         status          = $5, 
         id_admin        = $6,
         updated_at      = CURRENT_TIMESTAMP
       WHERE id_timeline = $7 
       RETURNING *`,
      [
        judul,
        tanggal_mulai,
        tanggal_selesai,
        deskripsi || '',
        status || 'akan_datang',
        id_admin,
        id,
      ]
    );

    if (updated.rowCount === 0) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
    }

    res.json({
      message: 'Tahapan berhasil diperbarui!',
      data: updated.rows[0],
    });
  } catch (error) {
    console.error('Error updateTimeline:', error.message);
    res.status(500).json({
      error: 'Gagal memperbarui tahapan',
      detail: error.message,
    });
  }
};

const deleteTimeline = async (req, res) => {
  const id = req.params.id || req.params.id_timeline;

  console.log('DELETE TIMELINE - id:', id);

  if (!id) {
    return res.status(400).json({ error: 'ID timeline tidak ditemukan di params.' });
  }

  try {
    const deleted = await pool.query(
      'DELETE FROM timeline_ppdb WHERE id_timeline = $1 RETURNING *',
      [id]
    );

    if (deleted.rowCount === 0) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
    }

    res.json({ message: 'Tahapan berhasil dihapus!' });
  } catch (error) {
    console.error('Error deleteTimeline:', error.message);
    res.status(500).json({
      error: 'Gagal menghapus tahapan',
      detail: error.message,
    });
  }
};

module.exports = { getTimeline, addTimeline, updateTimeline, deleteTimeline };
