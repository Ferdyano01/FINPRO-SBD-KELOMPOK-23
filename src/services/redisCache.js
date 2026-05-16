// Nanti kita akan meng-import client Redis di sini
// const redisClient = require('../config/redis');

exports.getCache = async (key) => {
    // TODO (Pilar 3): Return data dari Redis
    // return await redisClient.get(key);
    return null; // Mock return
};

exports.setCache = async (key, value, expInSeconds = 86400) => {
    // TODO (Pilar 3): Set data ke Redis dengan Expiration Time (default 24 jam)
    // await redisClient.setEx(key, expInSeconds, JSON.stringify(value));
    return true; // Mock return
};