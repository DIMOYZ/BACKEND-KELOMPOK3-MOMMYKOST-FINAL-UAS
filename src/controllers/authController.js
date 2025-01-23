const { db, auth } = require('../config/firebaseAdmin');

/**
 * REGISTER user
 * @param {Object} req 
 * @param {Object} res 
 */
exports.registerUser = async (req, res) => {
  try {
    const { email, password, username, profesi, gender, location, nohp } = req.body;
    if (!email || !password || !username || !profesi) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1) Buat user di Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // 2) Simpan data user tambahan di Realtime Database
    await db.ref('users/' + userRecord.uid).set({
      username,
      email,
      profesi,
      gender,
      location,
      nohp,
      role: 'user', // default role
    });

    return res.json({
      message: 'Register success',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * LOGIN user
 * 
 * @note Dalam Firebase Admin, kita tidak punya signInWithEmailAndPassword, 
 *       sehingga ini hanyalah contoh "dummy" tanpa verifikasi password!
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Disini kita hanya cek apakah email terdaftar.
    // TIDAK melakukan verifikasi password (tidak aman).
    // Ini hanya contoh minimal.

    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Ambil data user (role dsb) dari Realtime DB
    const snapshot = await db.ref('users/' + userRecord.uid).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'User data not found in DB' });
    }
    const userData = snapshot.val();

    // Return ke client
    return res.json({
      message: 'Login success (dummy, no password check).',
      uid: userRecord.uid,
      role: userData.role || 'user',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message });
  }
};
