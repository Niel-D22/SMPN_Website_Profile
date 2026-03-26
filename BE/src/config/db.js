const { Pool } = require('pg');
require('dotenv').config(); // Mengarahkan ke file .env di luar
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

pool.connect((err) => {
  if (err) {
    console.error('❌ Gagal koneksi ke database Supabase!', err.stack);
  } else {
    console.log('✅ Berhasil terhubung ke database Supabase! 🚀');
  }
});

module.exports = pool;