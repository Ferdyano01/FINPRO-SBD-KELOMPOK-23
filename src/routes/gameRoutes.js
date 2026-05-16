const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const protect = require('../middlewares/authMiddleware');

// Semua rute game harus melalui middleware 'protect'
router.use(protect);

router.get('/sync', gameController.syncState);
router.post('/action', gameController.playerAction);

module.exports = router;