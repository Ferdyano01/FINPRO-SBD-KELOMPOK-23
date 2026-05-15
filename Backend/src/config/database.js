const { createClient } = require('@supabase/supabase-js');
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

module.exports = supabase;