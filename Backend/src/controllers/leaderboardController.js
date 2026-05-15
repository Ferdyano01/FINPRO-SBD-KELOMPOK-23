const LeaderboardService = require('../services/leaderboardService');

const LeaderboardController = {
    getLeaderboard: async (req, res) => {
        try {
            const topPlayers = await LeaderboardService.getTopPlayers();
            
            return res.status(200).json({
                success: true,
                data: topPlayers
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = LeaderboardController;