// Importing express module
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const http = require('http'); // This might not be necessary if you're not using it
const userRoutes = require('./Routes/userRoutes');

// Create an instance of express
const app = express();

// Database connection
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDb();

// Middleware
app.use(express.json()); // Add this to parse JSON requests
app.use(cors()); // Optional: use if you need to allow CORS

// Use user routes
app.use('/user', userRoutes);

// Define the port
const PORT = process.env.PORT || 5001;

// Basic route for the home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
