const { db } = require('../config/firebaseAdmin');

/** CREATE Kost */
exports.createKost = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newRef = db.ref('kosts').push();
    await newRef.set({ name, category, price });
    return res.json({ message: 'Kost added', id: newRef.key });
  } catch (error) {
    console.error('Add kost error:', error);
    res.status(500).json({ error: error.message });
  }
};

/** READ All Kost */
exports.getAllKost = async (req, res) => {
  try {
    const snapshot = await db.ref('kosts').once('value');
    if (!snapshot.exists()) {
      return res.json([]);
    }
    const data = snapshot.val();
    const kostList = Object.keys(data).map(key => ({
      id: key,
      ...data[key],
    }));
    return res.json(kostList);
  } catch (error) {
    console.error('Fetch kost error:', error);
    res.status(500).json({ error: error.message });
  }
};

/** UPDATE Kost */
exports.updateKost = async (req, res) => {
  try {
    const kostId = req.params.id;
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.ref(`kosts/${kostId}`).update({ name, category, price });
    return res.json({ message: 'Kost updated' });
  } catch (error) {
    console.error('Update kost error:', error);
    res.status(500).json({ error: error.message });
  }
};

/** DELETE Kost */
exports.deleteKost = async (req, res) => {
  try {
    const kostId = req.params.id;
    await db.ref(`kosts/${kostId}`).remove();
    return res.json({ message: 'Kost deleted' });
  } catch (error) {
    console.error('Delete kost error:', error);
    res.status(500).json({ error: error.message });
  }
};
