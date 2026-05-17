const { client } = require('../config/redis'); 

const LeaderboardService = {
    updateScore: async (userId, username, netWorth) => {
        try {
            const key = 'global_leaderboard';
            // Panggil client langsung tanpa .client lagi
            await client.zAdd(key, {
                score: parseFloat(netWorth),
                value: username
            });
        } catch (err) {
            console.error("Redis Update Error:", err.message);
        }
    },

    getTopPlayers: async () => {
        try {
            const key = 'global_leaderboard';
            const topPlayers = await client.zRangeWithScores(key, 0, 9, {
                REV: true
            });
            return topPlayers;
        } catch (err) {
            console.error("Redis Get Error:", err.message);
            return [];
        }
    }
};

module.exports = LeaderboardService;