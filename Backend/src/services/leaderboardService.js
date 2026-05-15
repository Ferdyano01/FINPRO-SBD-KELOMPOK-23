const redis = require('../config/redis');
const UserModel = require('../models/user.model.js');

const LeaderboardService = {
    /**
     * Memperbarui skor pemain di Leaderboard
     */
    updateScore: async (userId, username, netWorth) => {
        const key = 'global_leaderboard';
        // Simpan ke Redis: member adalah username, score adalah netWorth
        // ZADD otomatis mengurutkan dari yang terkecil ke terbesar
        // Setelah kalkulasi selesai
        const totalNetWorth = updatedResources.reduce((acc, res) => acc + parseFloat(res.amount), 0);
        await LeaderboardService.updateScore(userId, username, totalNetWorth);

        await redis.client.zAdd(key, {
            score: parseFloat(netWorth),
            value: username
        });
    },

    /**
     * Mengambil Top 10 Pemain
     */
    getTopPlayers: async () => {
        const key = 'global_leaderboard';
        // Ambil urutan dari terbesar ke terkecil (Rank 1-10)
        const topPlayers = await redis.client.zRangeWithScores(key, 0, 9, {
            REV: true
        });
        
        return topPlayers;
    }
};

module.exports = LeaderboardService;