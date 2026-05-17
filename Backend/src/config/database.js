const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

// Mengambil kredensial dari environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("EROR: SUPABASE_URL atau SUPABASE_ANON_KEY belum dikonfigurasi di .env");
  process.exit(1);
}

/**
 * Inisialisasi Supabase Client
 * Client ini akan digunakan untuk operasi CRUD di PostgreSQL
 */
const supabase = createClient(supabaseUrl, supabaseKey);

// Log sederhana untuk memastikan konfigurasi terbaca
console.log("Sistem: Konfigurasi Supabase berhasil dimuat.");

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
    supabase,                                   // Untuk operasi CRUD SDK
    query: (text, params) => pool.query(text, params), // Untuk query SQL mentah
    connectDB                                   // Untuk test koneksi di server.js
};