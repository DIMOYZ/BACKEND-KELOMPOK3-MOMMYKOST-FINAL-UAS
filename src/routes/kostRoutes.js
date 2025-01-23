const express = require('express');
const router = express.Router();

const {
  createKost,
  getAllKost,
  updateKost,
  deleteKost
} = require('../controllers/kostController');

// POST /kost
router.post('/', createKost);

// GET /kost
router.get('/', getAllKost);

// PUT /kost/:id
router.put('/:id', updateKost);

// DELETE /kost/:id
router.delete('/:id', deleteKost);

module.exports = router;
