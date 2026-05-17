require('dotenv').config();
const app = require('./app');
const db = require('./config/database'); // Import konfigurasi DB kita
const redis = require('./config/redis');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // 1. Inisialisasi koneksi ke PostgreSQL
        await db.connectDB()

        // 2. Jalankan server Express
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