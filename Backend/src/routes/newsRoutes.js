const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint ini bisa diakses publik atau butuh login (authMiddleware)
router.get('/today', NewsController.getCurrentEvent);
router.get('/archive', authMiddleware, NewsController.getArchive);

module.exports = router;