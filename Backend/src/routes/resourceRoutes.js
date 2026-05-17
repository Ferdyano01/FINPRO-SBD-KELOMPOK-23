const express = require('express');
const router = express.Router();
const ResourceController = require('../controllers/resourceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tambahkan authMiddleware sebelum controller
router.post('/sync', authMiddleware, ResourceController.syncResources);

// Route untuk sinkronisasi (POST karena mengirimkan data userId/token)
router.post('/sync', authMiddleware, ResourceController.syncResources);

// Route untuk mengambil data mentah (Snapshot)
router.get('/:userId', authMiddleware, ResourceController.getSnapshot);

router.post('/sell', authMiddleware, ResourceController.sellResource);

module.exports = router;