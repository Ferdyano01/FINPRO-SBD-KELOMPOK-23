const { createClient } = require('redis');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test' || typeof process.env.JEST_WORKER_ID !== 'undefined';

const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
        tls: true, // WAJIB untuk Upstash (rediss://)
        rejectUnauthorized: false,
        keepAlive: 5000,
        reconnectStrategy: (retries) => {
            if (retries > 10) return new Error("Redis ganti ke mode offline");
            return Math.min(retries * 500, 5000);
        }
    }
});

if (!isTest) {
    client.on('error', (err) => console.error('Sistem: Redis Client Error', err));
    client.on('connect', () => console.log('Sistem: Terhubung ke Redis dengan sukses.'));

    // Menghubungkan ke server Redis secara asinkron
    (async () => {
        try {
            if (!client.isOpen) {
                await client.connect();
            }
        } catch (err) {
            console.error('Sistem: Gagal menghubungkan ke Redis', err);
        }
    })();
} else {
    // In test mode, do not attempt to connect or attach real listeners.
}

/**
 * Helper untuk memudahkan Service
 */
const redisHelper = {
    set: async (key, value, expiry = 86400) => {
        const ttl = parseInt(expiry) || 86400; 
        return await client.set(key, value, { EX: ttl });
    },
    get: async (key) => {
        return await client.get(key);
    },
    del: async (key) => {
        return await client.del(key);
    }
};

// EKSPOR: Sertakan client agar LeaderboardService bisa akses .zAdd()
module.exports = { client, redisHelper };