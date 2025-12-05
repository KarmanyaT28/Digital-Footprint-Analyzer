const express = require("express");
const router = express.Router();

const { runWapitiScan } = require("../services/wapitiService");
const WapitiScan = require("../models/WapitiScan");

// GET => /api/wapiti/scan?target=https://example.com
router.get("/scan", async (req, res) => {
  const target = req.query.target;

  if (!target) {
    return res.status(400).json({ error: "Target URL required → /scan?target=" });
  }

  try {
    console.log("⚡ Running Wapiti Scan on:", target);

    const result = await runWapitiScan(target);

    const saved = await WapitiScan.create({
      target,
      timestamp: Date.now(),
      file: result.file,
      vulnerabilities: result.vulnerabilities,
      summary: result.summary,
    });

    return res.json({ success: true, results: saved });

  } catch (err) {
    console.error("❌ Wapiti Scan Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
