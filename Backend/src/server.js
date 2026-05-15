require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Nanti kita akan inisialisasi koneksi DB dan Redis di sini sebelum server jalan
        // await db.connect();
        // await redis.connect();

        app.listen(PORT, () => {
            console.log(`[SERVER] 🚀 Berjalan di http://localhost:${PORT}`);
            console.log(`[ENV] 🌍 Mode: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('[SERVER-ERROR] ❌ Gagal memulai server:', error);
        process.exit(1);
    }
};

startServer();