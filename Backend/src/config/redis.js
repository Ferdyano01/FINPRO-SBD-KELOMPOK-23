const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Sistem: Redis Client Error', err));
client.on('connect', () => console.log('Sistem: Terhubung ke Redis dengan sukses.'));

// Menghubungkan ke server Redis secara asinkron
(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error('Sistem: Gagal menghubungkan ke Redis', err);
    }
})();

/**
 * Helper untuk memudahkan Service
 */
const redisHelper = {
    // Menyimpan data dengan waktu kadaluwarsa (dalam detik)
    set: async (key, value, expiry = 86400) => {
        return await client.set(key, value, {
            EX: expiry
        });
    },

    // Mengambil data
    get: async (key) => {
        return await client.get(key);
    },

    // Menghapus data (opsional, berguna jika admin update berita)
    del: async (key) => {
        return await client.del(key);
    }
};

module.exports = redisHelper;