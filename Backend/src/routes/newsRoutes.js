const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');
const ResourceController = require('../controllers/resourceController')

// Endpoint ini bisa diakses publik atau butuh login (authMiddleware)
router.get('/archive', authMiddleware, NewsController.getArchive);
router.get('/today', authMiddleware, ResourceController.getTodayNews);

module.exports = router;