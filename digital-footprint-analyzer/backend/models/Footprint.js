// backend/models/Footprint.js
const mongoose = require('mongoose');

const TechnicalSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    openPorts: [{
        port: { type: Number, required: true },
        service: { type: String }
    }],
});

const FootprintSchema = new mongoose.Schema({
    // Identifier for the digital footprint being analyzed (e.g., a company name or domain)
    targetName: { type: String, required: true, unique: true },
    sourceDomains: [{ type: String }],
    emails: [{ type: String }],
    usernames: [{ type: String }],
    
    // Embed the Nmap/Technical results
    technicalData: [TechnicalSchema], 

    // Used to track when the data was last updated
    lastScanDate: { type: Date, default: Date.now },

    // Simple security score based on exposed data (custom logic here)
    exposureScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('Footprint', FootprintSchema);