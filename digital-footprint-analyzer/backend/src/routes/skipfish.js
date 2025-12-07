const express = require("express");
const router = express.Router();
const path = require("path");
const { runSkipfishScan } = require("../services/skipfishService");

// GET → /api/skipfish/scan?target=https://example.com
router.get("/scan", async (req, res) => {
  const target = req.query.target;

  if (!target)
    return res.status(400).json({ error: "Target URL required → /scan?target=" });

  try {
    const result = await runSkipfishScan(target);

    res.json({
      success: true,
      results: {
        folder: result.folder,
        report: result.report,
        target: result.target,
      },
    });
  } catch (err) {
    console.error("Skipfish scan failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve Skipfish HTML reports under /skipfish-results
router.use(
  "/skipfish-results",
  express.static(path.join(process.cwd(), "skipfish-results"))
);

module.exports = router;
