const { db, auth } = require('../config/firebaseAdmin');

/**
 * Cek apakah request datang dari user ber-role admin
 * Syaratnya: Request membawa uid (misal di header) => BANYAK VARIASI IMPLEMENTASI
 */
module.exports = async (req, res, next) => {
  try {
    const { uid } = req.headers; // misalnya ambil uid di header
    if (!uid) {
      return res.status(401).json({ error: 'No UID provided' });
    }
    // Cek data user di DB
    const snapshot = await db.ref('users/' + uid).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userData = snapshot.val();
    if (userData.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - You are not admin' });
    }
    // Lolos
    next();
  } catch (error) {
    console.error('adminMiddleware error:', error);
    return res.status(500).json({ error: error.message });
  }
};
