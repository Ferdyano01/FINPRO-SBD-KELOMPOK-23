const UserModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthController = {
    /**
     * Mendaftarkan pemain baru
     */
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Validasi input dasar
            if (!username || !email || !password) {
                return res.status(400).json({ success: false, message: "Data tidak lengkap." });
            }

            // Hashing password (keamanan sesuai standar industri)
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // Simpan ke database melalui model
            const newUser = await UserModel.create(username, email, passwordHash);

            return res.status(201).json({
                success: true,
                message: "Registrasi berhasil!",
                data: { id: newUser.id, username: newUser.username }
            });
        } catch (error) {
            console.error("Register Error:", error);
            return res.status(500).json({ success: false, message: "Email atau Username sudah digunakan." });
        }
    },

    /**
     * Proses Login Pemain
     */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const supabase = require('../config/db');

            // Cari user berdasarkan email
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !user) {
                return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
            }

            // Verifikasi password
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Kata sandi salah." });
            }

            // Buat Token JWT untuk sesi Godot
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
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = AuthController;