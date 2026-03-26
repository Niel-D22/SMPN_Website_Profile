const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ message: 'Akses ditolak, token tidak ada!' });
  }

  try {
    // Verifikasi token pakai Secret Key yang ada di .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Simpan data admin ke request
    next(); // Lanjut ke fungsi berikutnya (Controller)
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid atau sudah kadaluarsa!' });
  }
};

module.exports = verifyToken;
