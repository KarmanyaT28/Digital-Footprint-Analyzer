// backend/routes/authRoutes.js (Simplified for token generation)
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', (req, res) => {
    // *** In a real app, you would verify username/password against MongoDB here ***
    
    // Assume verification succeeded for demonstration
    const payload = {
        user: {
            id: 'dummyUserId123', // Used by the auth middleware
            role: 'analyzer' // For future Role-Based Access Control
        }
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 }, // Token expires in 1 hour
        (err, token) => {
            if (err) throw err;
            res.json({ token }); // Send token to client
        }
    );
});

module.exports = router;