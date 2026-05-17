const UserModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');

const AuthController = {
    register: async (req, res) => {
        try {
            // Kita hanya ambil username dan password dari body (Godot)
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ success: false, message: "Data tidak lengkap." });
            }

            // OTOMATIS: Buat format email dari username
            const email = `${username.toLowerCase()}@game.com`;

            const userRegex = /^[a-zA-Z0-9_]{3,15}$/;
            if (!userRegex.test(username)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Username minimal 3-15 karakter, tanpa spasi/simbol." 
                });
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // Simpan ke database (email otomatis terisi)
            const newUser = await UserModel.create(username, email, passwordHash);

            return res.status(201).json({
                success: true,
                message: "Registrasi berhasil!",
                user: { id: newUser.id, username: newUser.username }
            });
        } catch (error) {
            console.error("Register Error:", error);
            return res.status(500).json({ success: false, message: "Username sudah ada atau Server Error." });
        }
    },

    // src/controllers/authController.js

login: async (req, res) => {
    try {
        // Ambil username dari body (bukan email)
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username dan password wajib diisi." });
        }

        // SINKRONISASI: Format ulang username menjadi email seperti saat Register
        const email = `${username.toLowerCase()}@game.com`;

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            // Jika user tidak ada, kemungkinan username salah
            return res.status(404).json({ success: false, message: "Username tidak ditemukan." });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Kata sandi salah." });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'secret_key_game_today',
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            success: true,
            message: "Login berhasil!",
            token,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
}
};

module.exports = AuthController;