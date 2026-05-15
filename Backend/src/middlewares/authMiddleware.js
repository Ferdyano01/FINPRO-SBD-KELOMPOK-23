const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Ambil token dari header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Akses ditolak. Token tidak ditemukan." 
        });
    }

    try {
        const secret = process.env.JWT_SECRET || 'secret_key_game_today';
        const verified = jwt.verify(token, secret);
        
        // Simpan data user hasil verifikasi ke objek req
        // agar bisa dipakai oleh controller (misal: req.user.id)
        req.user = verified;
        next(); // Lanjut ke fungsi berikutnya di route
    } catch (error) {
        res.status(403).json({ 
            success: false, 
            message: "Token tidak valid atau sudah kadaluwarsa." 
        });
    }
};

module.exports = authMiddleware;