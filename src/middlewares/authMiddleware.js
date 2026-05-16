const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;
    
    // Cek apakah ada token di header Authorization (format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Not authorized, no token provided' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Simpan data user (seperti user_id) ke dalam request
        next(); // Lanjut ke controller
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Not authorized, token failed or expired' });
    }
};

module.exports = protect;