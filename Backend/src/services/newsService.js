const NewsModel = require('../models/newsModel');
const redis = require('../config/redis'); // Asumsi konfigurasi redis sudah ada

const NewsService = {
    /**
     * Mengambil berita aktif hari ini dengan sistem Caching
     */
    getTodaysNews: async () => {
        const cacheKey = `news:${new Date().toISOString().split('T')[0]}`;

        try {
            // 1. Cek di Redis dulu (Database In-Memory)
            const cachedNews = await redis.get(cacheKey);
            if (cachedNews) {
                return JSON.parse(cachedNews);
            }

            // 2. Jika tidak ada di Redis, ambil dari PostgreSQL
            const news = await NewsModel.getActiveNews();

            // 3. Simpan ke Redis selama 24 jam jika berita ditemukan
            if (news) {
                await redis.set(cacheKey, JSON.stringify(news), 'EX', 86400);
            }

            return news;
        } catch (error) {
            console.error("NewsService Error:", error);
            // Fallback: jika Redis error, tetap ambil dari DB
            return await NewsModel.getActiveNews();
        }
    }
};

module.exports = NewsService;