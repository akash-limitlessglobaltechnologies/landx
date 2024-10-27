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

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the API',
        endpoints: {
            root: '/',
            api: '/api',
            users: '/api/user'
        }
    });
});

// API route
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API is running!',
        environment: process.env.VERCEL ? 'Production (Vercel)' : 'Development'
    });
});

// Use user routes
app.use('/api/user', userRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`,
        availableEndpoints: {
            root: '/',
            api: '/api',
            users: '/api/user'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

// Detect environment
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

if (isVercel) {
    // Vercel serverless function export
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
🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode
📡 Server URL: http://localhost:${PORT}
📍 Available endpoints:
   - Root: http://localhost:${PORT}/
   - API: http://localhost:${PORT}/api
   - Users: http://localhost:${PORT}/api/user
            `);
        });
    }).catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });
}