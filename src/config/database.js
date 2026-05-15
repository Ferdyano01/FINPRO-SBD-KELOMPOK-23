const { Pool } = require('pg');

// Membuat instance Pool menggunakan data dari file .env
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    max: 20, // Maksimal koneksi simultan (cocok untuk game polling)
    idleTimeoutMillis: 30000, // Tutup koneksi yang nganggur setelah 30 detik
});

// Fungsi untuk mengetes koneksi saat server baru menyala
const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('[DATABASE] ✅ Berhasil terhubung ke PostgreSQL (today_game_db)');
        client.release(); // Kembalikan koneksi ke pool setelah test berhasil
    } catch (err) {
        console.error('[DATABASE-ERROR] ❌ Gagal terhubung ke PostgreSQL:', err.message);
        console.error('Pastikan PostgreSQL berjalan dan kredensial di .env sudah benar.');
        process.exit(1); // Matikan server Express jika database mati
    }
};

// Mengekspor fungsi query agar bisa dipakai oleh file di folder models/
module.exports = {
    query: (text, params) => pool.query(text, params),
    connectDB
};