const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes');

const app = express();

// Database connection
const connectDb = async () => {
    try {
        if (mongoose.connections[0].readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB Connected');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use user routes
app.use('/api/user', userRoutes);

// Basic route for the home page
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Server is running!',
        environment: process.env.VERCEL ? 'Production (Vercel)' : 'Development'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Detect environment
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

if (isVercel) {
    // Vercel serverless function export
    console.log('Running on Vercel 🚀');
    module.exports = async (req, res) => {
        await connectDb();
        app(req, res);
    };
} else {
    // Local development server
    const PORT = process.env.PORT || 5001;
    connectDb().then(() => {
        app.listen(PORT, () => {
            console.log(`
🚀 Server is running in development mode
📡 Server URL: http://localhost:${PORT}
🔌 API endpoint: http://localhost:${PORT}/api
            `);
        });
    }).catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });
}