const express = require('express');
const router = express.Router();
const WorkerController = require('../controllers/workerController');
const authMiddleware = require('../middlewares/authMiddleware'); // Pastikan user login

// Godot memanggil: Global.base_url + "/workers/hire"
// Karena di app.js sudah ada prefix "/api/workers", maka di sini cukup "/hire"
router.post('/hire', authMiddleware, WorkerController.hireWorker);

module.exports = router;