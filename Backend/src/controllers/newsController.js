const NewsService = require('../services/newsService');
const NewsModel = require('../models/newsModel');

const NewsController = {
    /**
     * Mendapatkan berita yang sedang aktif beserta efeknya
     */
    getCurrentEvent: async (req, res) => {
        try {
            const news = await NewsService.getTodaysNews();
            
            if (!news) {
                return res.status(200).json({
                    success: true,
                    message: "Kondisi global stabil. Tidak ada efek khusus.",
                    data: null
                });
            }

            return res.status(200).json({
                success: true,
                data: news
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    /**
     * Mendapatkan riwayat berita untuk halaman News Archive
     */
    getArchive: async (req, res) => {
        try {
            const history = await NewsModel.getNewsHistory(20);
            return res.status(200).json({ success: true, data: history });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = NewsController;