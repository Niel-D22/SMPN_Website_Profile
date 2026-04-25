const express = require('express');
const cors = require('cors');
const path = require('path');
// Panggil rute yang sudah kita buat
const profilRoutes = require('./src/routes/profilRoutes');
const authRoutes = require('./src/routes/authRoutes');
const beritaRoutes = require('./src/routes/beritaRoutes');
const ppdbRoutes = require('./src/routes/ppdbRoutes');
const faqRoutes = require('./src/routes/faqRoutes');
const prestasiRoutes = require('./src/routes/prestasiRoutes');
const galeriRoutes = require('./src/routes/galeriRoutes');
const pesanRoutes = require('./src/routes/pesanRoutes');
const guruRoutes = require('./src/routes/guruRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const pengunjungRoutes = require('./src/routes/pengunjungRoutes');
const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Gunakan Rute
app.use('/api/pengunjung', pengunjungRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ppdb', ppdbRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/faq', faqRoutes);
app.use('/api/prestasi', prestasiRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/pesan', pesanRoutes);
app.use('/api/guru', guruRoutes);
// Rute Tes (Pintu masuk utama)
app.get('/', (req, res) => {
  res.send('Selamat datang di API SMPN 3 Manado! (Arsitektur Baru 🚀)');
});
app.use((err, req, res, next) => {
  console.error('🔴 GLOBAL ERROR:', err.message, err.stack);
  res.status(500).json({ message: err.message });
});
console.log('EMAIL:', process.env.EMAIL_USER);
console.log('PASS:', process.env.EMAIL_PASS ? 'ADA' : 'KOSONG');
// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`🌐 Server Express menyala di port ${PORT}`);
  console.log(`===========================================`);
});
