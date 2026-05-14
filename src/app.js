const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middlewares
app.use(helmet()); // Keamanan HTTP headers
app.use(cors()); // Mengizinkan request dari klien Godot (Web)
app.use(express.json()); // Parsing JSON body

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'TODAY Game Backend is running smoothly!',
        timestamp: new Date()
    });
});

// TODO: Import dan gunakan routes di sini
// const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);

module.exports = app;