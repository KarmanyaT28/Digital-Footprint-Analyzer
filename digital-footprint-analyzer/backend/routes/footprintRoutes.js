// backend/routes/footprintRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the Zero Trust middleware
const Footprint = require('/Users/karmanya/Desktop/PACE/Fall 2025/Introduction To Cybersecurity/Project/DigitalFootprintAnalyzer/digital-footprint-analyzer/backend/models/footprint');

// backend/models/Footprint.js


// @route   GET /api/footprint
// @desc    Get all stored footprints (Protected Route)
// @access  Private (Requires valid JWT via 'auth' middleware)
router.get('/', auth, async (req, res) => {
    try {
        const footprints = await Footprint.find().sort({ lastScanDate: -1 });
        res.json(footprints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/footprint/ingest
// @desc    Ingest new OSINT data (Protected Route)
// @access  Private
router.post('/ingest', auth, async (req, res) => {
    const { targetName, sourceDomains, emails, usernames, technicalData } = req.body;

    try {
        let footprint = await Footprint.findOne({ targetName });

        if (footprint) {
            return res.status(400).json({ msg: 'Footprint already exists for this target. Use PUT to update.' });
        }

        footprint = new Footprint({
            targetName,
            sourceDomains,
            emails,
            usernames,
            technicalData
        });

        await footprint.save();
        res.json(footprint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;