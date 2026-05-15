const express = require('express');
const router = express.Router();
const ResourceController = require('../controllers/resourceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tambahkan authMiddleware sebelum controller
router.post('/sync', authMiddleware, ResourceController.syncResources);

// Route untuk sinkronisasi (POST karena mengirimkan data userId/token)
router.post('/sync', ResourceController.syncResources);

// Route untuk mengambil data mentah (Snapshot)
router.get('/:userId', ResourceController.getSnapshot);

module.exports = router;