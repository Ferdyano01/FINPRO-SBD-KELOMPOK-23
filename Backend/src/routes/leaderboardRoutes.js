const express = require('express');
const router = express.Router();
const LeaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, LeaderboardController.getLeaderboard);

module.exports = router;