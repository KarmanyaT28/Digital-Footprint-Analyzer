const mongoose = require("mongoose");

const NiktoScanSchema = new mongoose.Schema({
    target: String,
    timestamp: { type: Date, default: Date.now },
    findings: Object,
    file: String
});

module.exports = mongoose.model("NiktoScan", NiktoScanSchema);
