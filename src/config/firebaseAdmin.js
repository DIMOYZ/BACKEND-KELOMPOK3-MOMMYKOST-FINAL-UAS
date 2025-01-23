const admin = require('firebase-admin');
const serviceAccount = require('../../firebase-service-account.json');

// Inisialisasi Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<NAMA-PROJECT>.firebaseio.com', 
  // Ganti <NAMA-PROJECT> sesuai project Anda
});

const db = admin.database();
const auth = admin.auth();

module.exports = { db, auth };
