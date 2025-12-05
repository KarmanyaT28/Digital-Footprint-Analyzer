const mongoose = require("mongoose");

const WapitiScanSchema = new mongoose.Schema({
  target: { type: String, required: true },
  file: String,
  vulnerabilities: Array,
  summary: Object,
  timestamp: Number,
});

module.exports = mongoose.model("WapitiScan", WapitiScanSchema);
