const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

// Import Routes
const resourceRoutes = require('./routes/resourceRoutes');
const newsRoutes = require('./routes/newsRoutes');
const leaderboardRouter = require('./routes/leaderboardRoutes');
const workerRoutes = require('./routes/workerRoutes'); // TAMBAHKAN INI
const craftingRoutes = require('./routes/craftingRoutes'); // TAMBAHKAN INI

const app = express();

// --- Middlewares ---
app.use(helmet()); // Keamanan HTTP headers
app.use(cors());   // Mengizinkan request dari klien Godot (Web/HTML5)
app.use(express.json()); // Parsing JSON body

// --- Routes Mapping ---
app.use('/api/workers', workerRoutes);
app.use('/api/crafting', craftingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/leaderboard', leaderboardRouter); // Prefix: /api/leaderboard
app.use('/api/news', newsRoutes); // Prefix: /api/news

// --- Basic Health Check Endpoint ---
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'TODAY Game Backend is running smoothly!',
        timestamp: new Date()
    });
});

// --- Global Error Handler ---
// Menangkap error agar server tidak langsung crash
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal pada server.',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

module.exports = app;