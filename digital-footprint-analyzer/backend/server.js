// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;




// Middleware
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Allow the app to parse JSON body requests

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Root route (for testing)
app.get('/', (req, res) => {
    res.send('Analyzer Backend is Running');
});

// Import and use routes (to be created in the next steps)
const authRoutes = require('./routes/authRoutes');
const footprintRoutes = require('./routes/footprintRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/footprint', footprintRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});