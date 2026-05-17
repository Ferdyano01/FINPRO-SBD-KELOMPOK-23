const LeaderboardService = require('../services/leaderboardService');

const LeaderboardController = {
    getLeaderboard: async (req, res) => {
        try {
            const topPlayers = await LeaderboardService.getTopPlayers();
            
            // Format data untuk Godot
            const formattedData = topPlayers.map((item, index) => ({
                rank: index + 1,
                username: item.value,
                gold: Math.floor(item.score)
            }));

            return res.status(200).json({
                success: true,
                data: formattedData
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = LeaderboardController;