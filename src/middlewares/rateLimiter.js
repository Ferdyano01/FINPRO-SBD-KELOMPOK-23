const rateLimit = require('express-rate-limit');

// Batasi 100 request per 15 menit per IP
exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100,
    message: {
        status: 'error',
        message: 'Terlalu banyak request dari IP ini, silakan coba lagi setelah 15 menit.'
    },
    standardHeaders: true, // Return rate limit info di headers `RateLimit-*`
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});