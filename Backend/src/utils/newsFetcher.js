const axios = require('axios');
require('dotenv').config();

const newsFetcher = {
    fetchGlobalNews: async (keyword = 'climate change') => {
        const apiKey = process.env.NEWS_API_KEY;
        // Contoh mengambil berita dari National Geographic atau BBC News
        const url = `https://newsapi.org/v2/everything?q=${keyword}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

        try {
            const response = await axios.get(url);
            const articles = response.data.articles;

            if (articles.length > 0) {
                // Ambil berita paling atas (terbaru)
                return {
                    title: articles[0].title,
                    content: articles[0].description || articles[0].content,
                    source: articles[0].source.name,
                    url: articles[0].url
                };
            }
            return null;
        } catch (error) {
            console.error("Gagal mengambil berita eksternal:", error.message);
            return null;
        }
    }
};

module.exports = newsFetcher;